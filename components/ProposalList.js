import React, { useEffect, useState } from 'react';
import { Container, Button, Table, TableBody, TableCell, TableHead, TableRow, RadioGroup, FormControlLabel, Box, Radio, Modal } from "@mui/material";
import proposalVoterContract from '../web3/ProposalVoterContract';
import { contractAddress } from '../web3/ProposalVoterContract';
import { usePrepareContractWrite, useContractWrite } from 'wagmi'

import styled from 'styled-components';
import ProposalVoterABI from '../abi/ProposalVoterABI.json';

const StyledVoteButton = styled(Button)`
    margin: 10px 5px;
`;

const style = {
    position: 'absolute',
    top: '25%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function ProposalList() {
    const [proposals, setProposals] = useState([]);
    const [showModal, setShowModal] = React.useState(false);
    const [vote, setVote] = React.useState(0);
    const [proposalId, setProposalId] = useState(null);

    const { config } = usePrepareContractWrite({
        address: contractAddress,
        abi: ProposalVoterABI.abi,
        functionName: 'vote',
        args: [proposalId, vote],
        enabled: showModal
    })
    const { write } = useContractWrite(config)

    async function fetchProposals() {
        try {
            // Read the proposals
            const data = await proposalVoterContract.readProposals();

            const mappedProposals = data.map(item => ({
                title: item.title,
                description: item.description,
                yes: item.yesVotes.toString(),
                no: item.noVotes.toString()
            }));

            setProposals(mappedProposals);
        } catch (error) {
            console.error('Error fetching proposals:', error);
        }
    }

    useEffect(() => {
        fetchProposals()
    }, [proposalVoterContract]);


    useEffect(() => {
        if (proposalVoterContract) {
            const handleNewProposal = (event) => {
                fetchProposals();
            };

            const handleVoteCast = (event) => {
                fetchProposals();
            };

            proposalVoterContract.on('ProposalCreated', handleNewProposal).then(() => console.log("subbed prop"));


            proposalVoterContract.on('VoteCast', handleVoteCast).then(() => console.log("subbed vote"));

            // Unsubscribe from the events and clean up
            return async () => {
                await proposalVoterContract.off('ProposalCreated', handleNewProposal).then(() => console.log("unsubbed prop"));;
                await proposalVoterContract.off('VoteCast', handleVoteCast).then(() => console.log("unsubbed vote"));;
            };
        }
        // Add contract and activity to the dependencies array.
    }, [proposalVoterContract]);



    const handleButtonClick = (vote, proposalId) => {
        setShowModal(true);
        setProposalId(proposalId);
        setVote(vote);
    };



    const handleConfirm = () => {
        setShowModal(false);
        if (write) {
            write();
        }
    };


    return (
        <Container>

            <Modal open={showModal} onClose={() => setShowModal(false)}>
                <Box sx={style}>
                    <h3>Proposal ID: {proposalId}</h3>
                    <h3>Vote: {vote ? 'Yes' : 'No'}</h3>
                    <Button variant="contained" onClick={handleConfirm}>Confirm</Button>

                </Box>
            </Modal>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Proposal ID</TableCell>
                        <TableCell>Title</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Yes</TableCell>
                        <TableCell>No</TableCell>
                        <TableCell>Vote</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {proposals.map((proposal, index) => (
                        <TableRow key={index}>
                            <TableCell>{index}</TableCell>
                            <TableCell>{proposal.title}</TableCell>
                            <TableCell>{proposal.description}</TableCell>
                            <TableCell>{proposal.yes}</TableCell>
                            <TableCell>{proposal.no}</TableCell>
                            <TableCell>
                                <StyledVoteButton
                                    variant="contained"
                                    onClick={() => handleButtonClick(true, index)}>Yes
                                </StyledVoteButton>
                                <StyledVoteButton
                                    variant="contained"
                                    onClick={() => handleButtonClick(false, index)}> No
                                </StyledVoteButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Container>
    )
}
