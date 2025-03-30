# HashChat

HashChat is a decentralized chat application (DApp) built on the Ethereum blockchain. It allows users to securely communicate with each other using blockchain technology, ensuring privacy, transparency, and immutability.

## 🚀 Getting Started with HashChat

Visit the application at: https://mechhashchat.netlify.app/

### Prerequisites
- A modern web browser (Chrome, Firefox, or Edge recommended)
- MetaMask wallet extension
- Holesky testnet ETH for transactions

### Detailed Setup Guide

1. **Install MetaMask**
   - Visit [MetaMask](https://metamask.io/download/)
   - Click "Install MetaMask for Chrome" (or your preferred browser)
   - Follow the installation prompts
   - Create a new wallet or import an existing one
   - Store your seed phrase securely

2. **Configure Holesky Testnet**
   - Open MetaMask
   - Click the network dropdown (usually shows "Ethereum Mainnet")
   - Select "Add Network"
   - Add Holesky Testnet with these details:
     ```
     Network Name: Holesky Test Network
     RPC URL: https://ethereum-holesky.publicnode.com
     Chain ID: 17000
     Currency Symbol: ETH
     Block Explorer: https://holesky.etherscan.io
     ```

3. **Get Test ETH**
   - Visit [Holesky Faucet](https://holesky-faucet.pk910.de/)
   - Copy your MetaMask wallet address
   - Paste your address in the faucet website
   - Click "Mine & Request Tokens"
   - Wait for the test ETH to arrive in your wallet

4. **Using HashChat**
   
   a. **Connect Wallet**
      - Visit https://mechhashchat.netlify.app/
      - Click "Connect Wallet" button
      - Approve the MetaMask connection request
   
   b. **Set Up Profile**
      - Click on your account icon again
      - Enter your username
      - Click "Submit"
      - Approve the MetaMask transaction (one-time setup)
   
   c. **Start Chatting**
      - Create a new chat by going to the "All Users" tab, and clicking on your friend's "Add Friend button"
      - Approve the transaction and wait for the transaction confirmation
      - Start sending messages
   
   d. **Message Security**
      - MetaMask will ask for encryption permissions
      - Approve the encryption request to enable secure messaging
      - Messages are encrypted end-to-end using public key cryptography

5. **Important Notes**
   - Keep some Holesky ETH in your wallet for transactions
   - Each message sends a transaction on the blockchain
   - Wait for transaction confirmations before sending consecutive messages
   - Never share your MetaMask private keys or seed phrase
   - Ensure you're on the correct website URL

6. **Troubleshooting**
   - If messages aren't sending, check your Holesky ETH balance
   - For connection issues, ensure MetaMask is on Holesky network
   - Clear browser cache if the interface appears broken
   - Refresh the page, if the messages are appearing on side of the wrong receipent.
   - Refresh the page if messages aren't updating

### Gas Fees
- All transactions on HashChat use Holesky testnet ETH
- Testnet ETH has no real monetary value
- Each message transaction requires a small amount of gas
- Gas fees are paid in Holesky ETH

### Privacy & Security
- Messages are stored on the blockchain
- All communications are encrypted
- Only the sender and recipient can read messages
- Your private key never leaves your device
