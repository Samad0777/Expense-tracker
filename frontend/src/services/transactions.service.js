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

export const createTransactionService = async (
  title,
  amount,
  type,
  category,
  date,
  description
) => {
  try {
    const response = await api.post("/transactions", {
      title,
      amount,
      type,
      category,
      date,
      description,
    });
    return response.data;
  } catch (err) {
    throw err;
  }
};
