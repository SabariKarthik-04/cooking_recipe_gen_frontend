import { APP_NAME, BASE_URL } from './config.js';

// API functions
export async function createSession(userId, sessionId) {
  const res = await fetch(`${BASE_URL}/session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: userId,
      sessionid: sessionId
    }),
  });

  if (!res.ok) throw new Error("Session init failed");

  return await res.json();
}

export async function runSSE(text, userId, sessionId, imageFile = null) {
  const parts = [];

  // ✅ Add text part
  if (text && text.trim()) {
    parts.push({
      text: text.trim(),
    });
  }

  // ✅ Add image part
  if (imageFile) {
    const base64Image = await fileToBase64(imageFile);

    parts.push({
      inline_data: {
        mime_type: imageFile.type, // e.g. image/png
        data: base64Image,
      },
    });
  }

  const res = await fetch(`${BASE_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: userId,
      sessionid: sessionId,
      parts: parts, // ✅ IMPORTANT CHANGE
    }),
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const data = await res.json();
  return data.response;
}

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