import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import {
  arbitrum,
  goerli,
  mainnet,
  optimism,
  polygon,
  base,
  zora,
  sepolia
} from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import ProposalForm from "../components/ProposalForm";
import ProposalList from "../components/ProposalList";
import ConnectButtonRainbowKit from "../components/ConnectButtonRainbowKit"

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    zora,
    sepolia,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [goerli,] : []),
  ],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'RainbowKit App',
  projectId: '22f893e001ecb3efb7287d97ddb92257',
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

function MyApp({ Component, pageProps }) {

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} showRecentTransactions={true} >
        <ConnectButtonRainbowKit />
        <ProposalList />
        <ProposalForm />
      </RainbowKitProvider>
    </WagmiConfig >
  );
};

export default MyApp;
