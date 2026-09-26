import { useEffect, useState } from "react";
import Card from "../components/Ui/Card";
import { TrendingUp, TrendingDown, Wallet, Plus } from "lucide-react";
import useTransactions from "../hook/useTransactions";
import "react-loading-skeleton/dist/skeleton.css";
import ErrorState from "../components/Ui/ErrorState";
import DashboardSkeleton from "../components/Ui/skeletons/DashboardSkeleton";
import { Link } from "react-router-dom";
import Button from "../components/Ui/Button";

const Dashboard = () => {
  const { dashboardSummary, dashboardSummaryHandler, dashboardLoading } =
    useTransactions();

  const [dashboardError, setdashboardError] = useState(null);

  const fetchSummary = async () => {
    try {
      await dashboardSummaryHandler();
      setdashboardError(null);
    } catch (err) {
      let message = "something went wrong. please try again.";
      message = err.response?.data?.message || message;
      setdashboardError(message);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const netBalance = dashboardSummary.balance ?? 0;
  const totalIncome = dashboardSummary.totalIncome ?? 0;
  const totalExpense = dashboardSummary.totalExpense ?? 0;


  if (dashboardLoading) {
    return <DashboardSkeleton />;
  }


  if (dashboardError) {
    return <ErrorState message={dashboardError} onRetry={fetchSummary} />;
  }


  if (netBalance === 0 && totalIncome === 0 && totalExpense === 0) {
    return (
      <div className="mt-8 flex flex-col items-center justify-center text-center px-4 py-12">
        <div className="mb-4 p-4 rounded-full bg-primary/10">
          <Wallet size={32} className="text-primary" />
        </div>

        <h2 className="text-xl font-semibold text-text-primary mb-2">
          Welcome to Spendly 👋
        </h2>

        <p className="text-text-secondary max-w-md mb-6">
          Start by adding your first transaction to keep track of your income
          and expenses.
        </p>

        <Link to="/transactions">
          <Button className="flex items-center gap-2 bg-primary text-white px-4 py-3 rounded-2xl cursor-pointer active:scale-95 hover:bg-primary-hover transition-all duration-200">
            <Plus size={20} />
            Add Your First Transaction
          </Button>
        </Link>
      </div>
    );
  }


  return (
    <main className="p-4 bg-background h-full">
      <div className="grid gap-4 md:grid-cols-2">
        <Card
          title="Net Balance"
          amount={netBalance}
          icon={Wallet}
          iconColor="text-text-first"
          iconBg="bg-bg-first"
        />

        <Card
          title="Total Income"
          amount={totalIncome}
          icon={TrendingUp}
          iconColor="text-text-second"
          iconBg="bg-bg-second"
        />

        <Card
          title="Total Expenses"
          amount={totalExpense}
          icon={TrendingDown}
          iconColor="text-text-third"
          iconBg="bg-bg-third"
        />
      </div>
    </main>
  );
};
export default Dashboard;
