import {
  Plus,
  Search,
  Funnel,
  ChevronsUpDown,
  SquarePen,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import Modal from "../components/Ui/Modal";
import useTransactions from "../hook/useTransactions";

const Transactions = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const { fetchTransactionsHandler, allTransaction } = useTransactions();

  const categoryLabels = {
    Food: "🍔",
    Shopping: "🛍️",
    Transport: "🚗",
    Bills: "💡",
    Health: "💊",
    Salary: "💻",
    Entertainment: "🎬",
    Other: "📦",
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      await fetchTransactionsHandler();
    };
    fetchTransactions();
  }, []);

  return (
    <main className="md:p-4 bg-background h-screen">
      <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
        <h2 className="text-text-secondary">
          {allTransaction.length} transactions found
        </h2>
        <button
          onClick={() => setShowAddTransaction(!showAddTransaction)}
          className="flex items-center gap-2 bg-primary text-white px-4 py-3 rounded-2xl cursor-pointer active:scale-95 hover:bg-primary-hover transition-all duration-200"
        >
          <Plus size={20} />
          Add Transaction
        </button>
      </div>

      {/* search and filter  */}
      <div className="flex items-center gap-4 bg-surface py-4 px-4 mt-4 mb-4 rounded-2xl">
        <div className="flex flex-1 items-center border px-4 rounded-xl bg-background">
          <Search size={20} className="text-text-secondary" />
          <input
            className="bg-background w-full px-2 py-2 outline-none"
            name="search"
            type="text"
            placeholder="Search..."
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center gap-2 cursor-pointer bg-background px-4 py-4 rounded-xl"
          >
            <Funnel size={20} />
            <p>Filter</p>
          </button>
        </div>
        {showFilter && (
          <div className="absolute right-10 top-55 p-4 rounded-2xl border bg-background">
            <h2 className="text-text-primary">Types</h2>
            <div className="flex gap-4 text-text-secondary py-4">
              <label>
                <input type="radio" name="type" id="all" value="all" />
                All
              </label>
              <label>
                <input type="radio" name="type" id="income" value="income" />
                Income
              </label>
              <label>
                <input type="radio" name="type" id="expense" value="expense" />
                Expense
              </label>
            </div>
            <h2 className="text-text-primary">Category</h2>
            <div className="flex">
              <select className="py-4 border-none outline-none cursor-pointer">
                <option value="all">All categories</option>
                <option value="food">🍔Food & Dining</option>
                <option value="shopping">🛍️Shopping</option>
                <option value="transport">🚗Transport</option>
                <option value="bills">💡Bills</option>
                <option value="health">💊Health</option>
                <option value="salary">💻Salary</option>
                <option value="entertainment">🎬Entertainment</option>
                <option value="other">📦Other</option>
              </select>
            </div>
            <div className="flex items-center py-4 justify-between">
              <button className="bg-surface px-4 py-2 rounded-2xl cursor-pointer">
                Clear
              </button>
              <button className="bg-primary text-white px-4 py-2 rounded-2xl cursor-pointer">
                Apply
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Transaction lists */}
      <div className="bg-surface py-4 px-4 rounded-2xl">
        <div className="flex justify-between items-center text-text-secondary">
          <p className="flex gap-2 items-center cursor-pointer hover:text-text-primary">
            Transaction{" "}
            <ChevronsUpDown className="hidden md:block" size={20} />{" "}
          </p>
          <p>Category</p>
          <p className="flex gap-2 items-center cursor-pointer hover:text-text-primary">
            Date <ChevronsUpDown className="hidden md:block" size={20} />{" "}
          </p>
          <p className="flex gap-2 items-center cursor-pointer hover:text-text-primary">
            Amount <ChevronsUpDown className="hidden md:block" size={20} />{" "}
          </p>
          <p className="hidden sm:block">Action</p>
        </div>

        {allTransaction.map((item) => {
          return (
            <ul
              key={item._id}
              className="flex  items-center justify-between py-4 border-b border-b-gray-100"
            >
              <li className="w-28">
                {categoryLabels[item.category]} {item.title}
              </li>
              <li className=" w-28 text-center">{item.category}</li>
              <li className=" w-28 text-center">
                {new Date(item.createdAt).toLocaleDateString()}
              </li>
              <li
                className={
                  item.type === "Income"
                    ? "w-28 text-center text-success"
                    : "w-28 text-center text-danger"
                }
              >
                {item.type === "Expense"
                  ? "-₹" + item.amount
                  : "+₹" + item.amount}
              </li>
              <li className="hidden sm:flex items-center gap-2">
                <SquarePen
                  className="cursor-pointer text-text-first"
                  size={20}
                />
                <Trash2 className="cursor-pointer text-danger" size={20} />
              </li>
            </ul>
          );
        })}
      </div>

      {/* modal section  */}
      {showAddTransaction && (
        <Modal>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-text-primary text-2xl">Add Transaction</h2>
              <button
                onClick={() => setShowAddTransaction(!showAddTransaction)}
              >
                <X
                  className="text-text-secondary hover:text-text-primary cursor-pointer"
                  size={20}
                />
              </button>
            </div>
            <h2 className="text-text-primary text-xl">Type</h2>
            <div className="flex gap-8">
              <label>
                <input type="radio" name="type" value="income" />
                Income
              </label>
              <label>
                <input type="radio" name="type" value="expense" />
                Expense
              </label>
            </div>
            <h2 className="text-text-primary text-xl">Title</h2>
            <input
              type="text"
              className="px-2 py-2 rounded-md border"
              placeholder="e.g. Grocery"
            />
            <h2 className="text-text-primary text-xl">Amount</h2>
            <input
              type="number"
              className="px-2 py-2 rounded-md border"
              placeholder="₹ 0.00"
            />
            <h2 className="text-text-primary text-xl">Category</h2>
            <select className="py-4 border-none outline-none cursor-pointer">
              <option value="food">🍔Food & Dining</option>
              <option value="shopping">🛍️Shopping</option>
              <option value="transport">🚗Transport</option>
              <option value="bills">💡Bills</option>
              <option value="health">💊Health</option>
              <option value="entertainment">🎬Entertainment</option>
              <option value="other">📦Other</option>
            </select>
            <h2 className="text-text-primary text-xl">Date</h2>
            <input type="date" />
            <h2 className="text-text-secondary text-xl">Note (optional)</h2>
            <input
              type="text"
              className="px-2 py-2 rounded-md border"
              placeholder="---"
            />
            <div className="flex items-center justify-between">
              <button className="bg-background active:scale-95 rounded-md px-4 py-2 cursor-pointer transition-all duration-200">
                Cancel
              </button>
              <button className="bg-primary hover:bg-primary-hover active:scale-95 text-white rounded-md px-4 py-2 cursor-pointer transition-all duration-200">
                Add
              </button>
            </div>
          </div>
        </Modal>
      )}
    </main>
  );
};

export default Transactions;
