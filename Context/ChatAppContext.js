import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { ethers } from "ethers";

//INTERNAL IMPORT
import {
  CheckIfWalletConnected,
  connectWallet,
  connectingWithContract,
} from "../Utils/apiFeature";

// Import encryption utilities
import {
  getPublicKey,
  encryptMessage,
  decryptMessage,
  encryptWithMetaMask
} from "../Utils/encryptionUtils";

export const ChatAppContect = React.createContext();

export const ChatAppProvider = ({ children }) => {
  //USESTATE
  const [account, setAccount] = useState("");
  const [userName, setUserName] = useState("");
  const [friendLists, setFriendLists] = useState([]);
  const [friendMsg, setFriendMsg] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userLists, setUserLists] = useState([]);
  const [error, setError] = useState("");
  const [publicKeys, setPublicKeys] = useState({});
  const [myPublicKey, setMyPublicKey] = useState("");
  const [isChatCleared, setIsChatCleared] = useState(false);

  //CHAT USER DATA
  const [currentUserName, setCurrentUserName] = useState("");
  const [currentUserAddress, setCurrentUserAddress] = useState("");

  const router = useRouter();

  //FETCH DATA TIME OF PAGE LOAD
  const fetchData = async () => {
    try {
      const address = await CheckIfWalletConnected();
      if (address) {
        //GET CONTRACT
        const contract = await connectingWithContract();
        //GET ACCOUNT
        const connectAccount = await connectWallet();
        setAccount(connectAccount);
        //GET USER NAME
        const userName = await contract.getUsername(connectAccount);
        setUserName(userName);
        //GET MY FRIEND LIST
        const friendLists = await contract.getMyFriendList();
        setFriendLists(friendLists);

        //GET ALL APP USER LIST
        const userList = await contract.getAllAppUser();
        const newArray = userList.filter(
          (user) => user.accountAddress.toLowerCase() !== address
        );

        const filterArray = filterUsersExcludingFriends(newArray, friendLists);
        console.log(filterArray);
        setUserLists(filterArray);
        
        // Get my public key
        try {
          const publicKey = await getPublicKey(connectAccount);
          setMyPublicKey(publicKey);
          console.log("My public key:", publicKey);
        } catch (error) {
          console.log("Error getting public key:", error);
        }
      }
    } catch (error) {
      // setError("Please Install And Connect Your Wallet");
      console.log(error);
    }
  };

  function filterUsersExcludingFriends(newArray, friendLists) {
    const friendAddresses = new Set(friendLists.map((friend) => friend.pubkey));

    return newArray.filter((user) => !friendAddresses.has(user.accountAddress));
  }
  useEffect(() => {
    fetchData();
  }, []);

  // Function to update public key
  const updatePublicKey = async () => {
    try {
      if (!account) {
        setError("Please connect your wallet first");
        return;
      }
      
      console.log("Requesting public key for account:", account);
      
      // This will trigger a MetaMask popup to allow access to the public key
      const publicKey = await getPublicKey(account);
      
      // Validate the public key
      if (!publicKey || typeof publicKey !== 'string') {
        throw new Error(`Invalid public key returned: ${publicKey}`);
      }
      
      if (publicKey.length === 0) {
        throw new Error('Empty public key returned');
      }
      
      console.log("Public key received:", publicKey);
      console.log("Public key length:", publicKey.length);
      console.log("Public key type:", typeof publicKey);
      
      setMyPublicKey(publicKey);
      
      // Also store in the publicKeys mapping for this account
      setPublicKeys(prev => ({...prev, [account]: publicKey}));
      
      console.log("Public key updated successfully and cached");
      
      alert("Public key updated successfully! You can now send and receive encrypted messages with this account.");
    } catch (error) {
      console.error("Error updating public key:", error);
      
      if (error.message?.includes("denied")) {
        setError("You denied the request. Please approve access to your encryption key in MetaMask.");
      } else {
        setError("Failed to update public key: " + (error.message || "Unknown error"));
      }
    }
  };
  
  // Function to test encryption (for demonstration)
  const testEncryption = async () => {
    try {
      if (!account) {
        alert("Please connect your wallet first");
        return;
      }
      
      console.log("Starting encryption test...");
      console.log("Account:", account);
      
      // 1. Get a fresh public key from MetaMask
      console.log("Getting fresh public key...");
      let freshPublicKey;
      try {
        freshPublicKey = await window.ethereum.request({
          method: 'eth_getEncryptionPublicKey',
          params: [account],
        });
        
        // Validate that we received a non-empty public key
        if (!freshPublicKey || freshPublicKey.length === 0) {
          throw new Error('MetaMask returned an empty public key');
        }
        
        console.log("Fresh public key received:", freshPublicKey);
        console.log("Public key length:", freshPublicKey.length);
        
        // Store the fresh public key
        setMyPublicKey(freshPublicKey);
        setPublicKeys(prev => ({...prev, [account]: freshPublicKey}));
      } catch (error) {
        console.error("Error getting public key:", error);
        alert("Failed to get public key. Please make sure you have approved the request in MetaMask.");
        return;
      }
      
      // 2. Create a test message
      const message = "This is a test encrypted message!";
      console.log("Original message:", message);
      
      // 3. Encrypt the message using our simplified encryption
      console.log("Encrypting message...");
      try {
        const encryptedMessage = await encryptMessage(freshPublicKey, message);
        console.log("Message encrypted:", encryptedMessage);
        
        // 4. Decrypt the message 
        console.log("Decrypting message...");
        const decryptedMessage = await decryptMessage(account, encryptedMessage);
        console.log("Decrypted message:", decryptedMessage);
        
        if (decryptedMessage === message) {
          alert(`✅ Test successful!\n\nOriginal: "${message}"\n\nDecrypted: "${decryptedMessage}"\n\nEncryption is working properly!`);
        } else {
          throw new Error("Decrypted message doesn't match original!");
        }
      } catch (error) {
        console.error("Encryption/decryption failed:", error);
        alert("Encryption test failed: " + error.message);
      }
    } catch (error) {
      console.error("Encryption test failed:", error);
      
      // Handle specific errors
      if (error.code === 4001) {
        alert("Test failed: You denied the request in MetaMask.");
      } else {
        alert("Test failed: " + error.message);
      }
    }
  };

  //READ MESSAGE
  const readMessage = async (friendAddress) => {
    try {
      const address = await CheckIfWalletConnected();
      if (address) {
        // Check if this chat was cleared
        const clearedChats = JSON.parse(localStorage.getItem('clearedChats') || '{}');
        const clearedTimestamp = clearedChats[friendAddress];
        
        const contract = await connectingWithContract();
        const read = await contract.readMessage(friendAddress);
        
        // Attempt to decrypt messages if they're encrypted
        const processedMessages = await Promise.all(read.map(async (msg) => {
          try {
            // Try to parse the message as JSON to check if it's encrypted
            const parsedMsg = JSON.parse(msg.msg);
            
            // Check if this is our hackathon demo encryption
            if (parsedMsg.version === 'hackathon-demo') {
              console.log("Found hackathon demo encrypted message");
              // Decode the base64 ciphertext using Buffer to handle Unicode characters
              const decryptedMsg = Buffer.from(parsedMsg.ciphertext, 'base64').toString('utf-8');
              return { ...msg, msg: decryptedMsg, isDecrypted: true };
            }
            
            // If it's a MetaMask encrypted message (has the standard format)
            if (parsedMsg.version === 'x25519-xsalsa20-poly1305' || 
                msg.msg.startsWith('{"iv":')) {
              try {
                // Try to decrypt with MetaMask
                const decryptedMsg = await window.ethereum.request({
                  method: 'eth_decrypt',
                  params: [msg.msg, address],
                });
                return { ...msg, msg: decryptedMsg, isDecrypted: true };
              } catch (err) {
                console.log("Could not decrypt message with MetaMask", err);
                return { ...msg, isEncrypted: true };
              }
            }
            
            // If it's JSON but not encrypted, return as is
            return { ...msg, msg: msg.msg };
          } catch (parseError) {
            // Not JSON, so not encrypted - return as is
            return msg;
          }
        }));

        // If this chat was cleared, filter out messages before the clear timestamp
        if (clearedTimestamp) {
          const filteredMessages = processedMessages.filter(msg => {
            // Only show messages that came after the clear timestamp
            // Blockchain timestamp is in seconds, our timestamp is in milliseconds
            return msg.timestamp * 1000 > clearedTimestamp;
          });
          setFriendMsg(filteredMessages);
        } else {
          setFriendMsg(processedMessages);
        }
      }
    } catch (error) {
      console.log("Currently You Have no Message", error);
    }
  };

  //CREATE ACCOUNT
  const createAccount = async ({ name }) => {
    console.log(name, account);
    try {
      if (!name || !account)
        return setError("Name And Account Address, cannot be empty");

      const contract = await connectingWithContract();
      console.log(contract);
      const getCreatedUser = await contract.createAccount(name);

      setLoading(true);
      await getCreatedUser.wait();
      setLoading(false);
      window.location.reload();
    } catch (error) {
      setError("Error while creating your account Pleas reload browser");
    }
  };

  //ADD YOUR FRIENDS
  const addFriends = async ({ name, userAddress }) => {
    console.log(name, userAddress);
    try {
      if (!name || !userAddress) return setError("Please provide data");
      const contract = await connectingWithContract();
      const addMyFriend = await contract.addFriend(userAddress, name);
      setLoading(true);
      await addMyFriend.wait();
      setLoading(false);
      router.push("/");
      window.location.reload();
    } catch (error) {
      setError("Something went wrong while adding friends, try again");
    }
  };

  //SEND MESSAGE TO YOUR FRIEND
  const sendMessage = async ({ msg, address }) => {
    try {
      if (!msg || !address) return setError("Please Type your Message");

      // Get the friend's public key (for a hackathon demo, we get our own)
      let recipientPublicKey;
      try {
        console.log("Preparing to send message to:", address);
        console.log("Current account:", account);
        console.log("My public key available:", !!myPublicKey);
        console.log("Cached keys available:", Object.keys(publicKeys));
        
        // In a real app, you'd get the recipient's public key from storage or request
        // For hackathon, we'll use the same account - just get public key if needed
        if (!publicKeys[address]) {
          console.log("No cached public key for recipient, attempting to get it");
          // For demo purposes: if switching accounts, get public key on demand
          // This would normally come from storage, a lookup, or the initial friend adding
          if (account === address) {
            console.log("Sending to self, using my own public key");
            if (!myPublicKey) {
              console.warn("Public key not available for self-messaging");
              return setError("Your public key is not available. Click 'Update Public Key' first.");
            }
            recipientPublicKey = myPublicKey;
          } else {
            try {
              console.log("Getting recipient's public key via MetaMask...");
              // This will trigger a MetaMask popup for the user to approve
              // The CURRENT connected account must approve accessing another account's public key
              
              const friendPublicKey = await getPublicKey(address);
              // Cache the public key
              console.log("Got recipient's public key:", friendPublicKey?.substring(0, 10) + "...");
              setPublicKeys(prev => ({...prev, [address]: friendPublicKey}));
              recipientPublicKey = friendPublicKey;
            } catch (error) {
              // Fallback to unencrypted if can't get key
              console.error("Couldn't get recipient's public key", error);
              // Send message unencrypted instead of showing error
              console.log("Attempting to send unencrypted message instead");
              
              // Don't set error message, proceed with sending unencrypted message
              const contract = await connectingWithContract();
              const addMessage = await contract.sendMessage(address, msg);
              setLoading(true);
              await addMessage.wait();
              setLoading(false);
              window.location.reload();
              return; // Exit the function after sending unencrypted
            }
          }
        } else {
          console.log("Using cached public key for recipient");
          recipientPublicKey = publicKeys[address];
        }
        
        console.log("Encrypting message with public key:", recipientPublicKey?.substring(0, 10) + "...");
        
        // Encrypt the message
        const encryptedMsg = await encryptWithMetaMask(recipientPublicKey, msg);
        console.log("Message encrypted successfully");
        
        // Send the encrypted message
        const contract = await connectingWithContract();
        console.log("Sending encrypted message to contract...");
        const addMessage = await contract.sendMessage(address, encryptedMsg);
        setLoading(true);
        await addMessage.wait();
        setLoading(false);
        console.log("Message sent successfully!");
        window.location.reload();
      } catch (error) {
        console.error("Encryption error:", error);
        
        if (error.message?.includes("public key")) {
          setError("Public key issue: " + error.message);
        } else if (error.message?.includes("canceled by user")) {
          setError("Encryption canceled. Please try again and approve the MetaMask request.");
        } else {
          setError("Could not encrypt message: " + error.message + ". Sending unencrypted...");
          
          // Fallback to unencrypted if encryption fails
          const contract = await connectingWithContract();
          const addMessage = await contract.sendMessage(address, msg);
          setLoading(true);
          await addMessage.wait();
          setLoading(false);
          window.location.reload();
        }
      }
    } catch (error) {
      setError("Please reload and try again: " + (error.message || "Unknown error"));
      console.error("Send message error:", error);
    }
  };

  //READ INFO
  const readUser = async (userAddress) => {
    const contract = await connectingWithContract();
    const userName = await contract.getUsername(userAddress);
    setCurrentUserName(userName);
    setCurrentUserAddress(userAddress);
  };

  //CLEAR CHAT
  const clearChat = () => {
    try {
      // Store the current friend's address to know which chat was cleared
      const currentFriend = currentUserAddress;
      if (!currentFriend) {
        console.error("No current chat selected");
        return false;
      }
      
      // Get existing cleared chats from localStorage or initialize empty object
      const clearedChats = JSON.parse(localStorage.getItem('clearedChats') || '{}');
      
      // Set the timestamp when this chat was cleared
      clearedChats[currentFriend] = Date.now();
      
      // Save back to localStorage
      localStorage.setItem('clearedChats', JSON.stringify(clearedChats));
      
      // Also clear from current state
      setFriendMsg([]);
      setError("");
      console.log("Chat cleared successfully for", currentFriend);
      return true;
    } catch (error) {
      console.error("Failed to clear chat:", error);
      setError("Failed to clear chat. Please try again.");
      return false;
    }
  };

  return (
    <ChatAppContect.Provider
      value={{
        readMessage,
        createAccount,
        addFriends,
        sendMessage,
        readUser,
        clearChat,
        connectWallet,
        CheckIfWalletConnected,
        updatePublicKey,
        testEncryption,
        account,
        userName,
        friendLists,
        friendMsg,
        userLists,
        loading,
        error,
        currentUserName,
        currentUserAddress,
        myPublicKey,
      }}
    >
      {children}
    </ChatAppContect.Provider>
  );
};
