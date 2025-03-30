import React, { useState, useContext } from "react";
import Image from "next/image";

//INTERNAL IMPORT
import Style from "./Friend.module.css";
import images from "../../assets";
import Card from "./Card/Card";
import Chat from "./Chat/Chat";
import { ChatAppContect } from "../../Context/ChatAppContext";

const Friend = () => {
  // const array = [1, 2, 34, 5, 6];/

  const {
    sendMessage,
    account,
    friendLists,
    readMessage,
    userName,
    loading,
    friendMsg,
    currentUserName,
    currentUserAddress,
    readUser,
    updatePublicKey,
    testEncryption,
    myPublicKey,
  } = useContext(ChatAppContect);

  return (
    <div className={Style.Friend}>
      <div className={Style.Friend_box}>
        <div className={Style.Friend_box_left}>
          {friendLists.map((el, i) => (
            <Card
              key={i + 1}
              el={el}
              i={i}
              readMessage={readMessage}
              readUser={readUser}
            />
          ))}
        </div>
        <div className={Style.Friend_box_right}>
          <Chat
            functionName={sendMessage}
            readMessage={readMessage}
            friendMsg={friendMsg}
            account={account}
            userName={userName}
            loading={loading}
            currentUserName={currentUserName}
            currentUserAddress={currentUserAddress}
            readUser={readUser}
          />
        </div>
      </div>
      <div className={Style.encryption_status}>
        <h3>Encryption Status</h3>
        <div className={Style.encryption_info}>
          <p><strong>Current Account:</strong> {account ? `${account.substring(0,6)}...${account.substring(account.length-4)}` : "Not connected"}</p>
          <p><strong>Public Key:</strong> {myPublicKey ? `${myPublicKey.substring(0,10)}...` : <span style={{color: 'red'}}>Not available - click Update!</span>}</p>
        </div>
        <div className={Style.encryption_actions}>
          <button 
            className={Style.encryption_button}
            onClick={() => updatePublicKey()}
          >
            Update Public Key
          </button>
          <button 
            className={Style.encryption_button}
            onClick={() => testEncryption()}
          >
            Test Encryption
          </button>
        </div>
      </div>
    </div>
  );
};

export default Friend;
