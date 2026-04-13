import API from "./api";

export const askAI = (query) =>
  API.post("/chatbot", { query });