import axios from "./axiosInstance";

export const getCategories = async () => {
  const res = await axios.get("/categories");
  return res.data;
};

export const createCategory = async (name, color) => {
  const res = await axios.post("/categories", { name, color });
  return res.data;
};