import { ConnectButton } from '@rainbow-me/rainbowkit';

import styled from 'styled-components';

const ButtonContainer = styled.div`
width: 100%;
position: static;
padding: 20px;
display: flex;
justify-content: flex-end; // Pushes the button to the right
`

export default function ConnectButtonRainbowKit() {
    return (
        <ButtonContainer>
            <ConnectButton />
        </ButtonContainer>
    )
}
