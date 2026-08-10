import React from "react";
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

const Analytics = () => {
  const data = [
    { month: "Mar", income: 0, expenses: 0, savings: 50 },
    { month: "Apr", income: 0, expenses: 0, savings: 10 },
    { month: "May", income: 100, expenses: 50, savings: 100 },
    { month: "Jun", income: 5500, expenses: 2700, savings: 120 },
    { month: "Jul", income: 6700, expenses: 2750, savings: 700 },
    { month: "Aug", income: 6700, expenses: 2400, savings: 400 },
  ];

  const pieData = [
    { category: "Food & Dining", amount: 1200 },
    { category: "Shopping", amount: 800 },
    { category: "Bills", amount: 600 },
    { category: "Transport", amount: 400 },
    { category: "Entertainment", amount: 300 },
  ];

  const COLORS = ["#7e22ff", "#24C55F", "#F87419", "#6366F1", "#06b6d4"];

  return (
    <main className="md:p-4 p-4 bg-background h-screen">
      <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
        <h2 className="text-text-secondary">Financial analytics & insights</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        <Card
          title="Avg Monthly Income"
          amount="4,346.52"
          amountColor="text-success"
        />
        <Card
          title="Avg Monthly Expenses"
          amount="1,318.33"
          amountColor="text-text-third"
        />
        <Card
          title="Avg Monthly Savings"
          amount="1,821.67"
          amountColor="text-primary"
        />
        <Card
          title="Savings Rate"
          amount="58.0%"
          amountColor="text-text-fourth"
        />
      </div>

      {/* Bar graph  */}
      <div className="bg-surface min-h-96 rounded-2xl shadow-2xl mt-10 mb-10 py-6 px-4">
        <h2 className="text-xl font-semibold mt-4 mb-4">Income vs Expenses</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart width={700} height={300} data={data}>
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
          <LineChart width={700} height={300} data={data}>
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
                data={pieData}
                dataKey="amount"
                nameKey="category"
                innerRadius={70}
                outerRadius={110}
                >
                {pieData.map((entry, index) => (
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
            {pieData.map((item, index) => (
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

                <p>₹{item.amount}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Analytics;
