import { createContext, useEffect, useState } from "react";
import {
  fetchTransactionsService,
  dashboardSumaaryService,
  createTransactionService,
  deleteTransactionService,
} from "../services/transactions.service";

export const TransactionsContext = createContext();

const TransactionsContextProvider = ({ children }) => {
  const [dashboardSummary, setDashboardSummary] = useState([]);
  const [allTransaction, setAllTransaction] = useState([]);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  //fetching data
  const fetchTransactionsHandler = async () => {
    try {
      const response = await fetchTransactionsService();
      setAllTransaction(response.data.transactions);
      return response.data.transactions;
    } catch (err) {
      throw err;
    }
  };

  //creating transaction
  const createTransactionHandler = async (
    title,
    amount,
    type,
    category,
    date,
    description,
  ) => {
    setLoading(true);
    try {
      const response = await createTransactionService(
        title,
        amount,
        type,
        category,
        date,
        description,
      );
      return response;
    } catch (err) {
      throw err;
    }finally{
      setLoading(false);
    }
  };

  //delete transaction
  const deleteTransactionHandler = async (id) => {
    setLoading(true);
    try {
      const response = await deleteTransactionService(id);
      return response;
    } catch (err) {
      throw err;
    }finally{
      setLoading(false);
    }
  };

  //dashboard summary
  const dashboardSummaryHandler = async () => {
    try {
      const response = await dashboardSumaaryService();
      setDashboardSummary(response.data);
      return response;
    } catch (err) {
      throw err;
    } finally {
      setDashboardLoading(false);
    }
  };

  return (
    <TransactionsContext.Provider
      value={{
        fetchTransactionsHandler,
        createTransactionHandler,
        deleteTransactionHandler,
        allTransaction,
        dashboardSummaryHandler,
        dashboardSummary,
        dashboardLoading,
        loading,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};

export default TransactionsContextProvider;
