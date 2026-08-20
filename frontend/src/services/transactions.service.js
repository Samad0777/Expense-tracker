import api from "./axios";

//dashboard summary
export const dashboardSumaaryService = async () => {
  try {
    const response = await api.get("/transactions/summary");
    return response.data;
  } catch (err) {
    throw err;
  }
};

//creating transaction
export const createTransactionService = async (
  title,
  amount,
  type,
  category,
  date,
  description,
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

//delete transaction
export const deleteTransactionService = async (id) => {
  try {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
  } catch (err) {
    throw err;
  }
};

//edit transaction
export const editTransactionService = async (
  id,
  title,
  amount,
  type,
  category,
  date,
  description,
) => {
  try {
    const response = await api.patch(`/transactions/${id}`, {
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

//fetching data
export const getTransactionsService = async (
  page,
  limit,
  search,
  type,
  category,
) => {
  try {
    const response = await api.get("/transactions", {
      params: { page, limit, search, type, category },
    });
    return response.data;
  } catch (err) {
    throw err;
  }
};
