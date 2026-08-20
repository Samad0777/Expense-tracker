import { createContext, useEffect, useState } from "react";
import {
  dashboardSumaaryService,
  createTransactionService,
  deleteTransactionService,
  editTransactionService,
  getTransactionsService,
} from "../services/transactions.service";

export const TransactionsContext = createContext();

const TransactionsContextProvider = ({ children }) => {
  const [dashboardSummary, setDashboardSummary] = useState([]);
  const [totalTransactions, setTotalTransactions] = useState([]);
  const [allTransaction, setallTransaction] = useState([]);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  //fetching data
  const getTransactionsHandler = async (
    page,
    limit,
    search,
    type,
    category,
  ) => {
    setLoading(true);
    try {
      const response = await getTransactionsService(
        page,
        limit,
        search,
        type,
        category,
      );
      setTotalTransactions(response.data.totalTransactions);
      setallTransaction(response.data.transactions);
      return response;
    } catch (err) {
      throw err;
    } finally {
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

  return (
    <TransactionsContext.Provider
      value={{
        getTransactionsHandler,
        createTransactionHandler,
        deleteTransactionHandler,
        editTransactionHandler,
        totalTransactions,
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
