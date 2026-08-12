import api from "./axios";

export const fetchTransactionsService = async () => {
  try {
    const response = await api.get("/transactions/");
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const dashboardSumaaryService = async () => {
  try {
    const response = await api.get("/transactions/summary");
    return response.data;
  } catch (err) {
    throw err;
  }
};
