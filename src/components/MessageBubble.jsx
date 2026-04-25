
import React from 'react';
function MessageBubble({ senderName, content, isCurrentUser }) {
  return (
    <article className={isCurrentUser ? 'message-bubble outgoing' : 'message-bubble incoming'}>
      <strong>{senderName}</strong>
      <p>{content}</p>
    </article>
  );
}

export default MessageBubble;
