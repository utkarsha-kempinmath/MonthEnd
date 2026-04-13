import API from "./api";

export const savePlan = (data) => API.post("/planning", data);

export const getPlan = () => API.get("/planning");