import React, { useEffect, useState } from "react";
import Card from "../components/Ui/Card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import { Plus, ChartNoAxesCombined } from "lucide-react";
import useTransaction from "../hook/useTransactions";
import AnalyticsSkeleton from "../components/Ui/skeletons/AnalyticsSkeleton";
import ErrorState from "../components/Ui/ErrorState";
import Button from "../components/Ui/Button";
import { Link } from "react-router-dom";

const Analytics = () => {
  const {
    getMonthlyAnalyticsHandler,
    monthlyAnalytics,
    getCategoryBreakdownAnalyticsHandler,
    categoryBreakdownData,
    loading,
  } = useTransaction();
  const [analyticsError, setanalyticsError] = useState(null);

  const fetchAnalytics = async () => {
    try {
      await Promise.all([
        getMonthlyAnalyticsHandler(),
        getCategoryBreakdownAnalyticsHandler(),
      ]);

      setanalyticsError(null);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Something went wrong. Please try again.";

      setanalyticsError(message);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const totalIncome = monthlyAnalytics.reduce((acc, crr) => {
    return acc + crr.income;
  }, 0);

  const totalExpense = monthlyAnalytics.reduce((acc, crr) => {
    return acc + crr.expenses;
  }, 0);

  const totalSavings = monthlyAnalytics.reduce((acc, crr) => {
    return acc + crr.savings;
  }, 0);

  const monthlyIncomeAverage =
    monthlyAnalytics.length > 0
      ? Math.round(totalIncome / monthlyAnalytics.length)
      : 0;
  const monthlyExpenseAverage =
    monthlyAnalytics.length > 0
      ? Math.round(totalExpense / monthlyAnalytics.length)
      : 0;
  const monthlySavingsAverage =
    monthlyAnalytics.length > 0
      ? Math.round(totalSavings / monthlyAnalytics.length)
      : 0;
  const savings = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? (savings / totalIncome) * 100 : null;
  const fixed = savingsRate !== null ? savingsRate.toFixed(2) : null;

  const COLORS = [
    "#7e22ff",
    "#24C55F",
    "#F87419",
    "#6366F1",
    "#06b6d4",
    "#E11D48",
    "#EAB308",
    "#EC4899",
  ];

  if (loading) {
    return <AnalyticsSkeleton />;
  }

  if (analyticsError) {
    return (
      <ErrorState
        message={analyticsError}
        onRetry={() => {
          getMonthlyAnalyticsHandler();
          getCategoryBreakdownAnalyticsHandler();
        }}
      />
    );
  }

  if (monthlyAnalytics.length === 0) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center text-center max-w-md">
          <div className="mb-4 p-4 rounded-full bg-primary/10">
            <ChartNoAxesCombined size={32} className="text-primary" />
          </div>

          <h2 className="text-xl font-semibold text-text-primary mb-2">
            No analytics yet
          </h2>

          <p className="text-text-secondary mb-6">
            Add your first transaction to start seeing your spending insights
            and analytics.
          </p>

          <Link to="/transactions">
            <Button className="flex items-center gap-2 bg-primary text-white px-4 py-3 rounded-2xl cursor-pointer active:scale-95 hover:bg-primary-hover transition-all duration-200">
              <Plus size={20} />
              Add Transaction
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="md:p-4 p-4 bg-background h-screen">
      <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
        <h2 className="text-text-secondary">Financial analytics & insights</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        <Card
          title="Avg Monthly Income"
          amount={monthlyIncomeAverage}
          amountColor="text-success"
        />
        <Card
          title="Avg Monthly Expenses"
          amount={monthlyExpenseAverage}
          amountColor="text-text-third"
        />
        <Card
          title="Avg Monthly Savings"
          amount={monthlySavingsAverage}
          amountColor="text-primary"
        />
        <Card
          title="Savings Rate"
          amount={fixed !== null ? `${fixed}%` : "N/A"}
          amountColor="text-text-fourth"
        />
      </div>

      {/* Bar graph  */}
      <div className="bg-surface min-h-96 rounded-2xl shadow-2xl mt-10 mb-10 py-6 px-4">
        <h2 className="text-xl font-semibold mt-4 mb-4">Income vs Expenses</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart width={700} height={300} data={monthlyAnalytics}>
            <XAxis dataKey="month" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Bar
              radius={[8, 8, 0, 0]}
              fill="var(--color-success)"
              dataKey="income"
            />
            <Bar
              radius={[8, 8, 0, 0]}
              fill="var(--color-primary)"
              dataKey="expenses"
            />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex items-center justify-center gap-4">
          <p className="px-2 py-2 bg-success"></p>
          <p>Income</p>
          <p className="px-2 py-2 bg-primary"></p>
          <p>Expenses</p>
        </div>
      </div>

      {/* line chart  */}

      <div className="bg-surface min-h-96 rounded-2xl shadow-2xl mt-10 mb-10 py-6 px-4">
        <h2 className="text-xl font-semibold mt-4 mb-4">Savings Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart width={700} height={300} data={monthlyAnalytics}>
            <XAxis dataKey="month" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Line
              strokeWidth={3}
              type="monotone"
              stroke="var(--color-primary)"
              dataKey="savings"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Doughnut chart  */}
      <div className="bg-surface min-h-96 rounded-2xl shadow-2xl mt-10 mb-10 py-6 px-4">
        <h2 className="text-xl font-semibold mt-4 mb-4">Expense Breakdown</h2>
        <div className="flex items-center justify-center flex-col md:flex-row md:px-10">
          <div className="w-full md:w-1/2">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart width={700} height={300}>
                <Pie
                  data={categoryBreakdownData}
                  dataKey="total"
                  nameKey="category"
                  innerRadius={70}
                  outerRadius={110}
                >
                  {categoryBreakdownData.map((entry, index) => (
                    <Cell
                      key={entry.category}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-col gap-3">
            {categoryBreakdownData.map((item, index) => (
              <div
                key={item.category}
                className="flex items-center justify-between gap-8"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />

                  <p>{item.category}</p>
                </div>

                <p>₹{item.total}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Analytics;
