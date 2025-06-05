# teachers-platform
A modern platform for teachers, tutors, and experts. Find, connect, and collaborate worldwide. Web3-ready.

## Wallet Connection Demo

This repository now includes a minimal example demonstrating how to connect
browsers to various wallets and test simple payment flows. The demo is located
in `wallet_demo/index.html`.

Supported wallets include:
- **MetaMask** – via the browser extension.
- **WalletConnect** – for mobile wallets compatible with the WalletConnect protocol.
- **Hedera HashPack** – using HashConnect.
The page now exposes separate buttons for Ethereum-based wallets and Hedera HashPack.

Libraries are loaded from public CDNs. Clicking **Connect Ethereum Wallet** opens
a modal allowing users to select MetaMask or WalletConnect. A dedicated button is
also provided for connecting to Hedera HashPack. Upon successful connection the
address is printed to the console and shown in an alert.

To test locally, simply open the HTML file in a modern browser. You may need to
configure an Infura project ID inside the script if you want to interact with
Ethereum mainnet.

A very small Payment Request API demo is included as well as a button that links
to PayPal. These are purely illustrative and do not process real payments.
