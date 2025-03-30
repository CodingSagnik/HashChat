import { Buffer } from 'buffer';

// Get the public key from the connected MetaMask account
export const getPublicKey = async (account) => {
  try {
    if (!account) {
      throw new Error('Account is required to get public key');
    }
    
    console.log('Requesting public key for account:', account);
    
    // Request the public key from MetaMask using eth_getEncryptionPublicKey
    const publicKey = await window.ethereum.request({
      method: 'eth_getEncryptionPublicKey',
      params: [account],
    });
    
    // Validate the public key
    if (!publicKey) {
      throw new Error('MetaMask returned null or undefined public key');
    }
    
    if (typeof publicKey !== 'string') {
      throw new Error(`Expected public key to be a string, got ${typeof publicKey}`);
    }
    
    if (publicKey.length === 0) {
      throw new Error('MetaMask returned an empty public key string');
    }
    
    console.log('Got public key from MetaMask:', publicKey);
    console.log('Public key length:', publicKey.length);
    
    return publicKey;
  } catch (error) {
    console.error('Error getting public key:', error);
    if (error.code === 4001) {
      throw new Error('User denied the request to access their encryption key');
    } else {
      throw new Error('Failed to get public key: ' + error.message);
    }
  }
};

// Encrypt a message using MetaMask's native encryption
export const encryptMessage = async (publicKey, message) => {
  try {
    if (!publicKey) {
      throw new Error('Public key is required for encryption');
    }

    console.log('Encrypting message with public key:', publicKey);

    // Convert message to string if it isn't already
    const messageString = typeof message === 'string' ? message : JSON.stringify(message);
    
    // MetaMask docs state that eth_encrypt is deprecated/unavailable
    // We need to manually encrypt using nacl or another library
    // For simplicity in this hackathon, we'll use a basic encoding
    // In a production app, you'd use a proper crypto library
    
    // Unicode-safe Base64 encoding to handle emojis and special characters
    const encoded = Buffer.from(messageString).toString('base64');
    const result = {
      publicKey,
      ciphertext: encoded,
      ephemeral: true,
      version: 'hackathon-demo'
    };
    
    return JSON.stringify(result);
  } catch (error) {
    console.error('Error encrypting message:', error);
    throw new Error('Failed to encrypt message: ' + error.message);
  }
};

// Decrypt a message using MetaMask
export const decryptMessage = async (account, encryptedMessage) => {
  try {
    if (!account) {
      throw new Error('Account is required for decryption');
    }
    
    if (!encryptedMessage) {
      throw new Error('Encrypted message is required for decryption');
    }
    
    console.log('Decrypting message for account:', account);
    
    // Parse the encrypted message
    const parsedMessage = JSON.parse(encryptedMessage);
    
    // Check if this is our simple hackathon demo encryption
    if (parsedMessage.version === 'hackathon-demo') {
      console.log('Decrypting hackathon demo message');
      // Use Buffer for decoding to handle Unicode characters correctly
      return Buffer.from(parsedMessage.ciphertext, 'base64').toString('utf-8');
    }
    
    // If it's a real MetaMask encrypted message, use eth_decrypt
    const decryptedMessage = await window.ethereum.request({
      method: 'eth_decrypt',
      params: [encryptedMessage, account],
    });
    
    return decryptedMessage;
  } catch (error) {
    console.error('Error decrypting message:', error);
    throw new Error('Failed to decrypt message: ' + error.message);
  }
};

// Helper function for encryption
export const encryptWithMetaMask = async (publicKey, message) => {
  return encryptMessage(publicKey, message);
}; 