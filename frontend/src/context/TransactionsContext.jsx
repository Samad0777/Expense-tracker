import { createContext, useEffect, useState } from "react";
import {
  dashboardSumaaryService,
  createTransactionService,
  deleteTransactionService,
  editTransactionService,
  getTransactionsService,
  getMonthlyAnalyticsService,
  getCategoryBreakdownAnalyticsService,
} from "../services/transactions.service";

export const TransactionsContext = createContext();

const TransactionsContextProvider = ({ children }) => {
  const [dashboardSummary, setDashboardSummary] = useState([]);
  const [totalTransactions, setTotalTransactions] = useState([]);
  const [allTransaction, setallTransaction] = useState([]);
  const [monthlyAnalytics, setMonthlyAnalytics] = useState([]);
  const [categoryBreakdownData, setCategoryBreakdownData] = useState([]);
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

  //monthly analytics
  const getMonthlyAnalyticsHandler = async () => {
    try {
      const response = await getMonthlyAnalyticsService();
      setMonthlyAnalytics(response.data);
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  // getCategory Breakdown Analytics
  const getCategoryBreakdownAnalyticsHandler = async()=>{
    try{
      const response = await getCategoryBreakdownAnalyticsService();
      setCategoryBreakdownData(response.data);
      return response.data;
    }catch(err){
      throw err;
    }
  } 

  return (
    <TransactionsContext.Provider
      value={{
        getTransactionsHandler,
        createTransactionHandler,
        deleteTransactionHandler,
        editTransactionHandler,
        dashboardSummaryHandler,
        getMonthlyAnalyticsHandler,
        getCategoryBreakdownAnalyticsHandler,
        categoryBreakdownData,
        monthlyAnalytics,
        totalTransactions,
        allTransaction,
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
