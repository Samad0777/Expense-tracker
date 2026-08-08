import React from "react";
import Card from "../components/Ui/Card";
import { TrendingUp,TrendingDown, Wallet } from "lucide-react";

const Dashboard = () => {
  return (
    <main className="p-4 bg-background h-screen">
      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Total Balance" amount="4,346.52" icon={Wallet} iconColor={"text-text-first"} iconBg={"bg-bg-first"}/>
        <Card title="Total Income" amount="6,700" icon={TrendingUp}  iconColor={"text-text-second"} iconBg={"bg-bg-second"}/>
        <Card title="Total Expenses" amount="2,353.48" icon={TrendingDown} iconColor={"text-text-third"} iconBg={"bg-bg-third"}/>
      </div>
    </main>
  );
};

export default Dashboard;
