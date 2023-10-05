import { ethers } from 'ethers';
import ProposalVoterABI from '../abi/ProposalVoterABI.json'; // Make sure to provide the correct path to your ABI file

export const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
const rpcUrl = process.env.NEXT_PUBLIC_RPC_KEY
const provider = new ethers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${rpcUrl}`);
const proposalVoterContract = new ethers.Contract(contractAddress, ProposalVoterABI.abi, provider);

export default proposalVoterContract;