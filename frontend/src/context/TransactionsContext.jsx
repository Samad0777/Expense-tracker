import { createContext, useEffect, useState } from "react";
import {
  fetchTransactionsService,
  dashboardSumaaryService,
  createTransactionService,
  deleteTransactionService,
  editTransactionService,
  fetchPaginatedTransactionsService,
} from "../services/transactions.service";

export const TransactionsContext = createContext();

const TransactionsContextProvider = ({ children }) => {
  const [dashboardSummary, setDashboardSummary] = useState([]);
  const [allTransaction, setAllTransaction] = useState([]);
  const [totalTransaction, setTotalTransaction] = useState([]);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  //fetching data
  const fetchTransactionsHandler = async () => {
    setLoading(true);
    try {
      const response = await fetchTransactionsService();
      setAllTransaction(response.data.transactions);
      setTotalTransaction(response.data.totalTransactions);
      return response.data.transactions;
    } catch (err) {
      throw err;
      
    }finally{
      setLoading(false);
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
    } finally {
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
    } finally {
      setLoading(false);
    }
  };

  //edit transaction
  const editTransactionHandler = async (
    id,
    title,
    amount,
    type,
    category,
    date,
    description,
  ) => {
    setLoading(true);
    try {
      const response = await editTransactionService(
        id,
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
    } finally {
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

  //pagination Handler
  const fetchPaginatedTransactionsHandler = async (pageNum, limit) => {
    setLoading(true);
    try {
      const response = await fetchPaginatedTransactionsService(pageNum, limit);
      return response;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <TransactionsContext.Provider
      value={{
        fetchTransactionsHandler,
        createTransactionHandler,
        deleteTransactionHandler,
        editTransactionHandler,
        fetchPaginatedTransactionsHandler,
        allTransaction,
        totalTransaction,
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
