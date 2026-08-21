import React, { useEffect, useState } from "react";
import Card from "../components/Ui/Card";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import useTransactions from "../hook/useTransactions";

const Dashboard = () => {
  const { dashboardSummary, dashboardSummaryHandler, dashboardLoading } =
    useTransactions();

  useEffect(() => {
    const fetchSummary = async () => {
      await dashboardSummaryHandler();
    };
    fetchSummary();
  }, []);

  const netBalance = dashboardSummary.balance ?? 0;
  const totalIncome = dashboardSummary.totalIncome ?? 0;
  const totalExpense = dashboardSummary.totalExpense ?? 0;

  if (dashboardLoading){
    return (
      <main className="h-screen flex items-center justify-center">
        <h2 className="text-2xl">Fetching dashboard data...</h2>
      </main>
    )
  }
    return (
      <main className="p-4 bg-background h-full">
        <div className="grid gap-4 md:grid-cols-2">
          <Card
            title="Net Balance"
            amount={netBalance}
            icon={Wallet}
            iconColor={"text-text-first"}
            iconBg={"bg-bg-first"}
          />
          <Card
            title="Total Income"
            amount={totalIncome}
            icon={TrendingUp}
            iconColor={"text-text-second"}
            iconBg={"bg-bg-second"}
          />
          <Card
            title="Total Expenses"
            amount={totalExpense}
            icon={TrendingDown}
            iconColor={"text-text-third"}
            iconBg={"bg-bg-third"}
          />
        </div>
      </main>
    );
};

export default Dashboard;
