import MessageBubble from './MessageBubble.jsx';

export default function ChatArea({ messages, bottomRef }) {
  return (
    <div
      className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gray-900"
      style={{ background: "#111827" }}
    >
      {messages.map((msg) => (
        <MessageBubble key={msg.id} msg={msg} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}