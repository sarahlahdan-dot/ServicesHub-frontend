/**
 * MessageBubble — renders one Message document.
 *
 * Covers both booking chat (message.message) and direct messages (message.content).
 * The parent resolves which field to use and passes it as `content`.
 *
 * Props:
 *   senderName    – display name for the sender ("You", provider name, etc.)
 *   content       – the message text
 *   isCurrentUser – boolean, controls outgoing vs incoming bubble styling
 */
function MessageBubble({ senderName, content, isCurrentUser }) {
  return (
    <article className={isCurrentUser ? 'message-bubble outgoing' : 'message-bubble incoming'}>
      <strong>{senderName}</strong>
      <p>{content}</p>
    </article>
  );
}

export default MessageBubble;
