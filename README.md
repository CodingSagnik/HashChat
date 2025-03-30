# HashChat 🚀

HashChat is a decentralized chat application (DApp) built on the Ethereum blockchain. It allows users to securely communicate with each other using blockchain technology, ensuring privacy, transparency, and immutability.

---

## 🚀 Getting Started with HashChat

Visit the application at:  
👉 [https://mechhashchat.netlify.app/](https://mechhashchat.netlify.app/)

---

## 🔧 Prerequisites

Before you begin, ensure you have the following:

*   **A modern web browser** 🌐 (Chrome, Firefox, or Edge recommended)
*   **MetaMask wallet extension** 🔒 installed and set up.
*   **Holesky testnet ETH** 💰 for covering transaction gas fees on the test network.

---

## 📚 Detailed Setup Guide

Follow these steps to get set up with HashChat:

### 1. Install MetaMask 🦊

*   Go to the official MetaMask website: [MetaMask Download](https://metamask.io/download/)
*   Click **"Install MetaMask for Chrome"** (or select your browser).
*   Follow the browser extension installation prompts.
*   Once installed, create a **new wallet** or **import an existing one** using your seed phrase.
*   **⚠️ IMPORTANT:** Store your seed phrase in a very secure location and **never** share it with anyone. 🔑

### 2. Configure Holesky Testnet ⛓️

*   Open the MetaMask extension in your browser.
*   Click the network dropdown menu at the top (it usually defaults to "Ethereum Mainnet").
*   Select **"Add Network"**.
*   Enter the following details for the Holesky Testnet:
    ```plaintext
    Network Name: Holesky Test Network
    RPC URL: https://ethereum-holesky.publicnode.com
    Chain ID: 17000
    Currency Symbol: ETH
    Block Explorer URL: https://holesky.etherscan.io
    ```
*   Click **"Save"**.
*   Ensure **Holesky Testnet** is selected as your active network in MetaMask. 🔄

### 3. Get Holesky Test ETH (Faucet) 💧

*   You need test ETH to pay for transactions (like sending messages) on the Holesky network.
*   Visit a Holesky Faucet website (you may need to search for currently active ones, e.g., search "Holesky faucet"). *Common faucets require mining or social media verification.*
*   Copy your MetaMask wallet address 📋 (Click on your account name in MetaMask to copy).
*   Paste your address into the faucet website's input field.
*   Follow the faucet's instructions (e.g., "Mine & Request Tokens", "Send Me ETH").
*   Wait for the transaction to process. The test ETH will appear in your MetaMask wallet shortly. ⏳

---

## 💻 Using HashChat

Once prerequisites and setup are complete:

### a. Connect Wallet

1.  Navigate to the HashChat application: [https://mechhashchat.netlify.app/](https://mechhashchat.netlify.app/)
2.  Click the **"Connect Wallet"** button, typically located in the top right corner.
3.  MetaMask will pop up asking for connection permission. Review the request and click **"Connect"** or **"Approve"**.

### b. Set Up Profile (One-Time)

1.  After connecting, click on your account icon or profile section.
2.  Enter your desired **username**.
3.  Click **"Submit"** or "Save Profile".
4.  MetaMask will prompt you to approve a transaction to save your profile on the blockchain. **Confirm** the transaction. (This requires a small amount of Holesky ETH for gas).

### c. Start Chatting

1.  To initiate a chat, navigate to the **"All Users"** tab or similar section listing registered users.
2.  Find the user you want to chat with and click the **"Add Friend"** or "Start Chat" button next to their name.
3.  MetaMask will prompt you to approve a transaction to create the chat relationship on the blockchain. **Confirm** the transaction.
4.  Once the transaction is confirmed, you can select the friend from your chat list and start sending messages. 💬

### d. Message Security

1.  When you send your first message (or periodically), MetaMask may ask for permission to **encrypt/decrypt messages**. This uses your public key for secure end-to-end communication.
2.  **Approve** the signature or encryption request. This does *not* send a transaction but allows the app to use your keys securely for messaging.
3.  Messages are encrypted using public key cryptography, ensuring only you and the recipient can read them. 🔐

---

## 📝 Important Notes

*   **Keep Test ETH:** Always maintain a small balance of Holesky ETH in your wallet to cover gas fees for sending messages and other interactions.
*   **Blockchain Transactions:** Every message sent is recorded as a transaction on the Holesky blockchain.
*   **Transaction Confirmation:** Wait for a transaction to be confirmed on the blockchain before sending the next message, especially during high network congestion.
*   **Security:**
    *   **NEVER** share your MetaMask private keys or seed phrase.
    *   Always double-check you are on the correct website URL (`https://mechhashchat.netlify.app/`) to prevent phishing attacks. 🔍

---

## 🛠️ Troubleshooting

*   **Messages Not Sending:**
    *   Check your Holesky ETH balance in MetaMask. You might need more test ETH from a faucet.
    *   Check the Holesky network status on Etherscan; the network might be slow or congested.
    *   Ensure MetaMask is connected and set to the **Holesky Test Network**.
*   **Connection Issues:**
    *   Make sure MetaMask is unlocked and connected to the site. Try disconnecting and reconnecting via the HashChat interface.
    *   Confirm MetaMask is set to the **Holesky Test Network**.
*   **Interface Issues (Broken Layout, Messages Not Updating):**
    *   Try a hard refresh (Ctrl+Shift+R or Cmd+Shift+R).
    *   Clear your browser's cache and cookies for the site.

---

## ⛽ Gas Fees

*   All actions on HashChat that interact with the blockchain (setting profile, adding friends, sending messages) require a transaction fee, known as **gas**.
*   Gas fees are paid in **Holesky ETH**.
*   Holesky ETH is for testing purposes only and has **no real monetary value**.
*   The amount of gas required depends on the complexity of the action and network congestion. ⛽

---

## 🔒 Privacy & Security

*   **Blockchain Storage:** Messages and user interactions are stored immutably and transparently on the Holesky blockchain ledger.
*   **Encryption:** Communications are end-to-end encrypted using public key cryptography. Only the sender and the intended recipient (with their respective private keys) can decrypt and read the messages.
*   **User Control:** Your private key, which is essential for signing transactions and decrypting messages, **never leaves your MetaMask wallet**. The application only requests signatures or decryption permissions when needed.
