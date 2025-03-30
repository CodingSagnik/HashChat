import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import EmojiPicker from "emoji-picker-react";

//INTERNAL IMPORT
import Style from "./Chat.module.css";
import images from "../../../assets";
import { converTime } from "../../../Utils/apiFeature";
import { Loader } from "../../index";

const Chat = ({
  functionName,
  readMessage,
  friendMsg,
  account,
  userName,
  loading,
  currentUserName,
  currentUserAddress,
  readUser,
}) => {
  //USE STATE
  const [message, setMessage] = useState("");
  const [chatData, setChatData] = useState({
    name: "",
    address: "",
  });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState("");
  const [isFileAttached, setIsFileAttached] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fileError, setFileError] = useState("");
  const fileInputRef = useRef(null);
  const messageInputRef = useRef(null);

  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;
    setChatData(router.query);
  }, [router.isReady]);

  useEffect(() => {
    if (chatData.address) {
      readMessage(chatData.address);
      readUser(chatData.address);
    }
  }, [chatData.address]);

  const handleEmojiClick = (emojiObject) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log("File selected:", file.name, "Size:", (file.size / 1024).toFixed(2), "KB", "Type:", file.type);
    
    // Clear any previous errors
    setFileError("");

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      console.warn("File size is too large. Maximum size is 5MB.");
      setFileError("File size is too large. Maximum size is 5MB.");
      return;
    }

    // Check for supported file types
    const supportedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const supportedDocTypes = [
      'application/pdf', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'text/plain'
    ];
    
    if (!supportedImageTypes.includes(file.type) && !supportedDocTypes.includes(file.type)) {
      console.warn("File type may not be supported:", file.type);
      // We'll still allow it, but warn the user without using alert
      setFileError("This file type may not be supported, but we'll try to send it.");
    }

    setSelectedFile(file);
    
    // Create a preview for image files
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview('');
    }
    
    setIsFileAttached(true);
  };

  const handleSendMessage = async () => {
    console.log("handleSendMessage called");
    console.log("Message:", message);
    console.log("File attached:", isFileAttached);
    console.log("Selected file:", selectedFile?.name);
    console.log("Router query address:", router.query.address);
    
    if ((!message.trim() && !selectedFile) || !router.query.address) {
      console.log("No content to send or no address");
      return;
    }
    
    // Prevent multiple submissions
    if (isLoading || loading) {
      console.log("Already loading, preventing multiple submissions");
      return;
    }
    
    try {
      if (selectedFile) {
        // Set loading state
        setIsLoading(true);
        console.log("Setting loading state for file");
        
        // Add user feedback message
        console.log(`Preparing to send file: ${selectedFile.name} (${(selectedFile.size / 1024).toFixed(2)} KB)`);
        
        // Use a Promise to handle the asynchronous FileReader
        const readFileAsDataURL = (file) => {
          console.log("Starting to read file as data URL");
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (event) => {
              console.log(`File successfully read, size: ${event.target.result.length} chars`);
              resolve(event.target.result);
            };
            
            reader.onerror = (error) => {
              console.error('FileReader error:', error);
              reject(error);
            };
            
            reader.onprogress = (event) => {
              if (event.lengthComputable) {
                const percentLoaded = Math.round((event.loaded / event.total) * 100);
                console.log(`Loading file: ${percentLoaded}%`);
              }
            };
            
            console.log("Calling readAsDataURL on file");
            reader.readAsDataURL(file);
          });
        };
        
        try {
          console.log("Awaiting file to be read");
          // Wait for the file to be read
          const base64File = await readFileAsDataURL(selectedFile);
          console.log("File read completed, creating file message");
          
          // Create file message object
          const fileMessage = JSON.stringify({
            type: 'file',
            fileName: selectedFile.name,
            fileType: selectedFile.type,
            fileData: base64File,
            fileSize: selectedFile.size
          });
          
          console.log('Sending file to server:', selectedFile.name, 'Size:', (selectedFile.size / 1024).toFixed(2), 'KB', 'Type:', selectedFile.type);
          console.log('Message string length:', fileMessage.length);
          
          // Log the function we're calling
          console.log('Calling functionName with file message');
          console.dir(functionName);
          
          // Send the file message
          await functionName({
            msg: fileMessage,
            address: router.query.address,
          });
          
          console.log('File sent successfully');
          
          // Reset file state
          setSelectedFile(null);
          setFilePreview('');
          setIsFileAttached(false);
          
        } catch (fileError) {
          console.error('Error reading or sending file:', fileError);
          alert('Failed to send file. Please try again.' + (fileError.message ? ` Error: ${fileError.message}` : ''));
        } finally {
          setIsLoading(false);
        }
      } else if (message.trim()) {
        // Send text message
        setIsLoading(true);
        console.log('Sending text message');
        await functionName({
          msg: message,
          address: router.query.address,
        });
        console.log('Text message sent successfully');
        setMessage("");
        setIsLoading(false);
        
        // Keep focus on the input field
        if (messageInputRef.current) {
          messageInputRef.current.focus();
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setIsLoading(false);
      alert('Error sending message: ' + error.message);
    }
  };

  const cancelFileAttachment = () => {
    setSelectedFile(null);
    setFilePreview('');
    setIsFileAttached(false);
  };

  // Helper function to render message content based on type
  const renderMessageContent = (messageObj) => {
    try {
      // Check if the message is a JSON object containing file data
      const parsedMsg = JSON.parse(messageObj.msg);
      
      if (parsedMsg.type === 'file') {
        // Handle file message
        const { fileName, fileType, fileData } = parsedMsg;
        
        if (fileType.startsWith('image/')) {
          // Render image
          return (
            <div className={Style.image_attachment}>
              <img src={fileData} alt={fileName} />
              <p>{fileName}</p>
            </div>
          );
        } else {
          // Render file download link
          return (
            <div className={Style.file_attachment}>
              <div className={Style.file_icon}>📄</div>
              <div className={Style.file_info}>
                <p>{fileName}</p>
                <a 
                  href={fileData} 
                  download={fileName}
                  className={Style.download_link}
                >
                  Download
                </a>
              </div>
            </div>
          );
        }
      } else {
        // Not a file, just display the message
        return messageObj.msg;
      }
    } catch (error) {
      // Not JSON, just a regular message
      return messageObj.msg;
    }
  };

  return (
    <div className={Style.Chat}>
      {/* TOP BAR (Similar to WhatsApp) */}
      {chatData.name && chatData.address && (
        <div className={Style.Chat_topbar}>
          <Image src={images.accountName} alt="profile" width={50} height={50} />
          <div className={Style.Chat_topbar_info}>
            <h4>{chatData.name}</h4>
            <p>{chatData.address}</p>
          </div>
          <div className={Style.Chat_topbar_encryption}>
            <span title="End-to-end encrypted">🔒</span>
          </div>
        </div>
      )}

      {/* MESSAGE AREA */}
      <div className={Style.Chat_messages}>
        {friendMsg.length === 0 ? (
          <div className={Style.no_messages}>
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          friendMsg.map((el, i) => {
            // If message sender is the friend, show on the left; else on the right
            const isFriend = el.sender === chatData.address;
            
            // Check if the message is encrypted or was decrypted
            const isEncrypted = el.isEncrypted;
            const wasDecrypted = el.isDecrypted;
            
            return (
              <div
                key={i + 1}
                className={isFriend ? Style.Chat_box_left : Style.Chat_box_right}
              >
                <div className={Style.Chat_box_title}>
                  <Image
                    src={images.accountName}
                    alt="avatar"
                    width={35}
                    height={35}
                  />
                  <span>
                    {isFriend ? chatData.name : userName}
                  </span>
                  {wasDecrypted && (
                    <span className={Style.decryption_icon} title="Successfully decrypted">
                      🔓
                    </span>
                  )}
                  {isEncrypted && (
                    <span className={Style.encryption_icon} title="Could not decrypt this message">
                      🔐
                    </span>
                  )}
                </div>
                <p>
                  {isEncrypted ? (
                    <span className={Style.encrypted_msg}>
                      <em>Encrypted message (could not decrypt)</em>
                    </span>
                  ) : (
                    renderMessageContent(el)
                  )}
                </p>
              </div>
            );
          })
        )}
      </div>

      {/* FILE PREVIEW */}
      {isFileAttached && (
        <div className={Style.file_preview}>
          <div className={Style.file_preview_content}>
            {filePreview ? (
              <img src={filePreview} alt="Preview" className={Style.image_preview} />
            ) : (
              <div className={Style.generic_file_preview}>
                <span>📄</span>
                <p>{selectedFile?.name}</p>
              </div>
            )}
            <div className={Style.file_preview_actions}>
              <button 
                className={Style.cancel_file_btn}
                onClick={cancelFileAttachment}
                title="Cancel"
              >
                ✕
              </button>
              <button 
                className={Style.send_file_btn}
                onClick={handleSendMessage}
                disabled={loading || isLoading}
                title="Send file"
              >
                Send File
              </button>
            </div>
          </div>
          {fileError && (
            <div className={Style.file_error}>
              <p>{fileError}</p>
            </div>
          )}
        </div>
      )}

      {/* MESSAGE INPUT */}
      {currentUserName && currentUserAddress ? (
        <div className={Style.Chat_box_send}>
          <div className={Style.Chat_box_send_img}>
            <div className={Style.emoji_container}>
              <div 
                className={Style.emoji_icon} 
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <Image src={images.smile} alt="smile" width={30} height={30} />
              </div>
              {showEmojiPicker && (
                <div className={Style.emoji_picker_container}>
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
              )}
            </div>
            
            <form 
              className={Style.message_form}
              onSubmit={(e) => {
                e.preventDefault();
                if (message.trim() && !isLoading && !loading) {
                  console.log("Form submitted, sending message");
                  handleSendMessage();
                }
              }}
            >
              <input
                type="text"
                placeholder="Type your message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isFileAttached}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !isLoading && !loading && message.trim()) {
                    console.log("Enter key pressed, sending message");
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                ref={messageInputRef}
              />
              <button type="submit" style={{ display: 'none' }}>Submit</button>
            </form>
            
            <div className={Style.file_input_container}>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <div onClick={handleFileClick}>
                <Image src={images.file} alt="file" width={30} height={30} />
              </div>
            </div>

            {loading || isLoading ? (
              <Loader />
            ) : (
              <button 
                className={Style.send_button}
                onClick={handleSendMessage}
                title="Send message"
              >
                <Image
                  src={images.send}
                  alt="send"
                  width={30}
                  height={30}
                />
              </button>
            )}
          </div>
          <div className={Style.encryption_note}>
            <span title="End-to-end encrypted">🔒</span> 
            {currentUserAddress === account ? (
              <span>Messaging yourself? Make sure you've updated your public key!</span>
            ) : (
              <span>End-to-end encrypted</span>
            )}
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Chat;
