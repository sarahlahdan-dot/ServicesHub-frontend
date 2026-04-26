function ChatWindow({
  counterpartyName,
  messages,
  currentUserId,
  onClose,
  onSend,
  inputValue,
  onInputChange,
}) {
  const initial = counterpartyName ? counterpartyName[0].toUpperCase() : "?";

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <div className="chat-header-info">
          <div className="chat-avatar">{initial}</div>
          <div>
            <div className="chat-name">{counterpartyName || "Chat"}</div>
            <div className="chat-status">Booking chat</div>
          </div>
        </div>
        <button className="chat-close" onClick={onClose}>
          ×
        </button>
      </div>

      <div className="chat-messages">
        {messages.length === 0 && (
          <p
            style={{
              color: "var(--muted)",
              fontSize: "13px",
              textAlign: "center",
              marginTop: "20px",
            }}
          >
            No messages yet. Say hello!
          </p>
        )}
        {messages.map((msg, i) => {
          const isSent =
            String(msg.senderId) === String(currentUserId) ||
            String(msg.senderId?._id) === String(currentUserId);
          return (
            <div
              key={i}
              className={`chat-bubble ${isSent ? "sent" : "received"}`}
            >
              {msg.content || msg.message}
              <span className="bubble-time">
                {msg.createdAt
                  ? new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : ""}
              </span>
            </div>
          );
        })}
      </div>

      <div className="chat-input-row">
        <input
          type="text"
          placeholder="Type a message…"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSend();
          }}
        />
        <button onClick={onSend}>➤</button>
      </div>
    </div>
  );
}

export default ChatWindow;
