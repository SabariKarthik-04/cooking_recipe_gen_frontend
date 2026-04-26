import { useState, useRef, useEffect, useCallback } from "react";
import { generateSessionId } from './config.js';
import { createSession, runSSE } from './api.js';
import Header from './components/Header.jsx';
import ChatArea from './components/ChatArea.jsx';
import IngredientInput from './components/IngredientInput.jsx';
import UserNamePopup from './components/UserNamePopup.jsx';

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [userName, setUserName] = useState(null);
  const [sessionId] = useState(generateSessionId());
  const [inputVal, setInputVal] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "agent",
      text: "Welcome! 👨‍🍳 Ask me anything — I'm here to help!",
      streaming: false,
    },
  ]);
  const [status, setStatus] = useState("idle"); // idle | connecting | streaming | error
  const [sessionReady, setSessionReady] = useState(false);
  const bottomRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => {
    if (userName) {
      createSession(userName, sessionId)
        .then(() => setSessionReady(true))
        .catch(() => setStatus("error"));
    }
  }, [userName, sessionId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = useCallback(async (message, imageFile = null) => {
    if ((!message.trim() && !imageFile) || status === "streaming" || !sessionReady) return;

    const userMsg = {
      id: Date.now() + "-u",
      role: "user",
      text: message.trim(),
      streaming: false,
      image: imageFile ? URL.createObjectURL(imageFile) : null,
    };
    const agentId = Date.now() + "-a";
    const agentMsg = { id: agentId, role: "agent", text: "", streaming: true };

    setMessages((prev) => [...prev, userMsg, agentMsg]);
    setStatus("connecting");
    abortRef.current = new AbortController();

    try {
      const response = await runSSE(
        message.trim(),
        userName,
        sessionId,
        imageFile
      );

      setMessages((prev) =>
        prev.map((m) =>
          m.id === agentId
            ? { ...m, text: response || "⚠️ No reply received.", streaming: false }
            : m
        )
      );
    } catch (err) {
      if (err.name !== "AbortError") {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === agentId
              ? { ...m, text: m.text || "⚠️ Something went wrong. Please try again.", streaming: false }
              : m
          )
        );
        setStatus("error");
        setTimeout(() => setStatus("idle"), 3000);
        return;
      }
    }

    setStatus("idle");
    setSelectedImage(null);
  }, [status, sessionReady, userName, sessionId]);

  const handleStop = () => {
    abortRef.current?.abort();
    setMessages((prev) => prev.map((m) => m.streaming ? { ...m, streaming: false } : m));
    setStatus("idle");
  };

  if (!userName) {
    return <UserNamePopup onSubmit={setUserName} />;
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Lato:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #6b7280; border-radius: 9px; }
      `}</style>

      <div
        className="w-full h-screen flex items-center justify-center bg-gray-900"
        style={{
          background: "radial-gradient(ellipse at 30% 20%, #1f2937 0%, #111827 40%, #0f172a 100%)",
          fontFamily: "'Lato', sans-serif",
        }}
      >
        {/* Decorative blobs */}
        <div style={{
          position: "fixed", top: -80, right: -80, width: 320, height: 320,
          borderRadius: "50%", background: "rgba(251,191,36,0.08)", pointerEvents: "none"
        }} />
        <div style={{
          position: "fixed", bottom: -60, left: -60, width: 240, height: 240,
          borderRadius: "50%", background: "rgba(234,88,12,0.06)", pointerEvents: "none"
        }} />

        <div
          className="w-full h-screen flex flex-col overflow-hidden bg-gray-800 border border-gray-700"
          style={{
            boxShadow: "0 24px 80px rgba(0,0,0,0.5), 0 4px 16px rgba(0,0,0,0.3)",
          }}
        >
          <Header status={status} />
          <ChatArea messages={messages} bottomRef={bottomRef} />
          <IngredientInput
            inputVal={inputVal}
            setInputVal={setInputVal}
            isGenerating={status === "streaming"}
            onSendMessage={handleSendMessage}
            onStop={handleStop}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
          />
        </div>
      </div>
    </>
  );
}