import api from "./axios";

export const registerService = async (username, email, password) => {
  try {
    const response = await api.post("/auth/register", {
      username,
      email,
      password,
    });
    console.log(response.data);
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

export const getMeService = async () => {
  try {
    const response = await api.get("/auth/me");
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const logoutService = async () =>{
  try{
    const response = await api.post("/auth/logout");
    return response.data;
  }catch(err){
    throw err;
  }
}