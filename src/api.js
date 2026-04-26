import { APP_NAME, BASE_URL } from './config.js';

// API functions
export async function createSession(userId, sessionId) {
  const res = await fetch(
    `${BASE_URL}/apps/${APP_NAME}/users/${userId}/sessions/${sessionId}`,
    {
      method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     state: { __session_metadata__: { displayName: "hello" } },
    //   }),
    }
  );
  if (!res.ok && res.status !== 409) throw new Error("Session init failed");
}

export async function runSSE(text, userId, onChunk, sessionId, imageFile = null) {
  let newMessageParts = [
    {
      text: text
    }
  ];

  // Add image to parts if provided
  if (imageFile) {
    const base64Image = await fileToBase64(imageFile);
    newMessageParts.push({
      inline_data: {
        mime_type: imageFile.type,
        data: base64Image
      }
    });
  }

  const body = JSON.stringify({
    appName: APP_NAME,
    userId: userId,
    newMessage: {
      role: "user",
      parts: newMessageParts
    },
    sessionId: sessionId,
    stateDelta: null,
    streaming: false,
  });

  const res = await fetch(`${BASE_URL}/run_sse`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let buf = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    const lines = buf.split("\n");
    buf = lines.pop();
    for (const line of lines) {
      if (!line.startsWith("data:")) continue;
      const raw = line.slice(5).trim();
      if (!raw || raw === "[DONE]") continue;
      try {
        const ev = JSON.parse(raw);
        for (const p of ev?.content?.parts ?? []) {
          if (p.text) onChunk(p.text);
        }
      } catch { /* ignore */ }
    }
  }
}

// Helper function to convert File to Base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result.split(',')[1]; // Remove data:image/...;base64, prefix
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}