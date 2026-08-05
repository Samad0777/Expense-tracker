import api from "./axios";

export const registerService = async (username, email, password) => {
  try {
    const response = await api.post("/auth/register", {
      username,
      email,
      password,
    });
    console.log(response.data)
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const loginService = async (email, password) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  } catch (err) {
    throw err;
  }
};
