import { Button, TextField, Container } from "@mui/material";
import { useState } from "react";
import ProposalVoterABI from '../abi/ProposalVoterABI.json';
import { contractAddress } from '../web3/ProposalVoterContract'
import { useDebounce } from 'use-debounce';
import { usePrepareContractWrite, useContractWrite } from 'wagmi'

import styled from 'styled-components';

const StyledContainer = styled(Container)`
  width: 50%;
  margin: auto;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledButton = styled(Button)`
  background-color: #007bff;
  color: white;
  &:hover {
    background-color: #0056b3;
  }
`;

const StyledTextField = styled(TextField)`
  margin-bottom: 15px;
  width: 100%;
`;


export default function ProposalForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // As the usePrepareContractWrite hook performs an RPC request to obtain the gas estimate on mount
  // and on every change to args, we don't want to spam the RPC and become rate-limited.
  const [debouncedTitle] = useDebounce(title, 750)
  const [debouncedDescription] = useDebounce(description, 750)

  const { config } = usePrepareContractWrite({
    address: contractAddress,
    abi: ProposalVoterABI.abi,
    functionName: 'createProposal',
    args: [debouncedTitle, debouncedDescription],
    enabled: debouncedTitle !== "" && debouncedDescription !== "",
  })

  const { write } = useContractWrite(config)

  return (
    <StyledContainer>
      <form onSubmit={(e) => {
        e.preventDefault()
        write?.()
      }}>
        <StyledTextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <StyledTextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <StyledButton disabled={!write} type="submit">Submit Proposal</StyledButton>
      </form>
    </StyledContainer>
  )
}