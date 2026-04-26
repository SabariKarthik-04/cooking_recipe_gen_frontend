// Config constants
export const APP_NAME = "food_recomendations";
export const BASE_URL = "http://localhost:8000"; // ← change to your ADK server

// Generate a unique session ID
export const generateSessionId = () => {
  return crypto.randomUUID();
};