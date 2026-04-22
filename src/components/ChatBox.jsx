import React from 'react'

function ChatBox({ name, messages, currentUserId, text, setText, onSend, onClose }) {
  return (
    <>
    
        <h1>{name}</h1>
        <button onClick={onClose}>X</button>
      

      
        {messages.length === 0 && <p>messages not found !</p>}

        {messages.map((message, index) => (
          <p
            key={index}
            className={message.senderId === currentUserId ? 'sent' : 'received'}
          >
            {message.text}
          </p>
        ))}
      

      
        <input
          type="text"
          placeholder="Type message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={onSend}>send meesage</button>
     
    </>
  );
}



export default ChatBox
