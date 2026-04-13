import API from "./api";

export const configureSharing = (data) =>
  API.post("/share/configure", data);

export const toggleSharing = () =>
  API.post("/share/toggle");