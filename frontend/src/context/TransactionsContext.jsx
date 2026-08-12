import { createContext, useEffect, useState } from "react";
import {
  fetchTransactionsService,
  dashboardSumaaryService,
} from "../services/transactions.service";

export const TransactionsContext = createContext();

const TransactionsContextProvider = ({ children }) => {
  const [dashboardSummary, setDashboardSummary] = useState([]);
  const [allTransaction, setAllTransaction] = useState([]);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const fetchTransactionsHandler = async () => {
    try {
      const response = await fetchTransactionsService();
      setAllTransaction(response.data.transactions);
      return response.data.transactions;
    } catch (err) {
      throw err;
    }
  };
  const dashboardSummaryHandler = async () => {
    try {
      const response = await dashboardSumaaryService();
      setDashboardSummary(response.data);
      return response;
    } catch (err) {
      throw err;
    }finally{
      setDashboardLoading(false);
    }
  };

  return (
    <TransactionsContext.Provider
      value={{
        fetchTransactionsHandler,
        allTransaction,
        dashboardSummaryHandler,
        dashboardSummary,
        dashboardLoading
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};

export default TransactionsContextProvider;
