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
import { useForm } from "react-hook-form";

const Transactions = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = useForm({
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
    },
  });

  const [showFilter, setShowFilter] = useState(false);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [transactionDelete, setTransactionDelete] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);
  const {
    fetchTransactionsHandler,
    createTransactionHandler,
    allTransaction,
    deleteTransactionHandler,
    editTransactionHandler,
    loading,
  } = useTransactions();

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

  //creating transaction
  const onSubmit = async (data) => {
    try {
      let response;

      if (isEditing) {
        response = await editTransactionHandler(
          selectedTransactionId,
          data.title,
          data.amount,
          data.type,
          data.category,
          data.date,
          data.description,
        );
      } else {
        response = await createTransactionHandler(
          data.title,
          data.amount,
          data.type,
          data.category,
          data.date,
          data.description,
        );
      }

      reset();
      setSelectedTransactionId(null);
      setShowAddTransaction(false);

      await fetchTransactionsHandler();

      return response;
    } catch (err) {
      console.log(err.message);
    }
  };

  const confirmDeleteTransaction = (id) => {
    setTransactionDelete(true);
    setSelectedTransactionId(id);
  };

  //delete transaction
  const deleteTransaction = async (id) => {
    try {
      const response = await deleteTransactionHandler(id);
      setTransactionDelete(false);
      setSelectedTransactionId(null);
      await fetchTransactionsHandler();
      return response;
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    //fetching data
    const fetchTransactions = async () => {
      await fetchTransactionsHandler();
    };

    fetchTransactions();
  }, []);

  //editing transaction

  const isEditing = Boolean(selectedTransactionId);

  useEffect(() => {
    if (!selectedTransactionId) return;

    const transaction = allTransaction.find(
      (item) => item._id === selectedTransactionId,
    );

    if (transaction) {
      reset({
        title: transaction.title,
        amount: transaction.amount,
        type: transaction.type,
        category: transaction.category,
        date: new Date(transaction.date).toISOString().split("T")[0],
        description: transaction.description,
      });
    }
  }, [selectedTransactionId, allTransaction, reset]);

  const openAddTransaction = () => {
    setSelectedTransactionId(null);
    reset({
      title: "",
      amount: "",
      type: "",
      category: "Food",
      date: new Date().toISOString().split("T")[0],
      description: "",
    });
    setShowAddTransaction(true);
  };

  //closing add and edit transaction modal
  const closeTransactionModal = () => {
  setShowAddTransaction(false);
  setSelectedTransactionId(null);
  reset();
};

  return (
    <main className="md:p-4 bg-background h-screen">
      <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
        <h2 className="text-text-secondary mt-4 mb-4">
          {allTransaction.length} transactions found
        </h2>
        <button
          onClick={openAddTransaction}
          className="flex items-center gap-2 bg-primary text-white px-4 py-3 rounded-2xl cursor-pointer active:scale-95 hover:bg-primary-hover transition-all duration-200"
        >
          <Plus size={20} />
          Add Transaction
        </button>
      </div>

      {/* search and filter  */}
      <div className="relative flex items-center gap-4 bg-surface py-4 px-4 mt-4 mb-4 rounded-2xl">
        <div className="flex flex-1 items-center border px-4 rounded-xl bg-background">
          <Search size={20} className="text-text-secondary" />
          <input
            className="bg-background w-full px-2 py-2 outline-none"
            name="search"
            type="text"
            placeholder="Search..."
          />
        </div>
        <div>
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center gap-2 cursor-pointer bg-background px-4 py-4 rounded-xl"
          >
            <Funnel size={20} />
            <p>Filter</p>
          </button>
        </div>
        {showFilter && (
          <div className="absolute md:right-10 md:top-20 right-10 top-20 p-4 rounded-2xl border bg-background">
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
        <div className="hidden md:flex justify-between items-center text-text-secondary">
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

        {/* desktop */}
        {allTransaction.map((item) => {
          return (
            <ul
              key={item._id}
              className="hidden md:flex items-center justify-between py-4 border-b border-b-gray-100"
            >
              <li className="flex items-center gap-1 w-34 min-w-0">
                <div>{categoryLabels[item.category]}</div>
                <div className="truncate text-text-primary">{item.title}</div>
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
                  onClick={() => (
                    setShowAddTransaction(true),
                    setSelectedTransactionId(item._id)
                  )}
                  className="cursor-pointer text-text-first"
                  size={20}
                />
                <Trash2
                  onClick={() => confirmDeleteTransaction(item._id)}
                  className="cursor-pointer text-danger"
                  size={20}
                />
              </li>
            </ul>
          );
        })}

        {/* mobile */}

        {allTransaction.map((item) => {
          return (
            <ul
              key={item._id}
              className="flex md:hidden justify-between py-4 border-b border-b-gray-100"
            >
              <div className="">
                <li className="flex items-centers gap-4">
                  <div>{categoryLabels[item.category]}</div>
                  <div className="truncate text-text-primary">{item.title}</div>
                </li>
                <li className="py-1 w-28 text-center text-text-secondary text-sm">
                  {item.category}
                </li>
                <li className="py-1 w-28 text-center text-text-secondary text-xs">
                  {new Date(item.createdAt).toLocaleDateString()}
                </li>
              </div>

              <div className="flex flex-col items-center justify-between">
                <li
                  className={
                    item.type === "Income"
                      ? "w-28 text-center text-success font-bold"
                      : "w-28 text-center text-danger font-bold"
                  }
                >
                  {item.type === "Expense"
                    ? "-₹" + item.amount
                    : "+₹" + item.amount}
                </li>
                <li className="flex items-center gap-8">
                  <SquarePen
                    onClick={() => (
                      setShowAddTransaction(true),
                      setSelectedTransactionId(item._id)
                    )}
                    className="cursor-pointer text-text-first"
                    size={20}
                  />
                  <Trash2
                    onClick={() => confirmDeleteTransaction(item._id)}
                    className="cursor-pointer text-danger"
                    size={20}
                  />
                </li>
              </div>
            </ul>
          );
        })}
      </div>

      {/* modal section  */}
      {showAddTransaction && (
        <Modal>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-text-primary text-2xl">
                {isEditing ? "Edit Transaction" : "Add Transaction"}
              </h2>
              <button
                type="button"
                onClick={closeTransactionModal}
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
                <input
                  type="radio"
                  name="type"
                  value="Income"
                  {...register("type", {
                    required: "Please select transaction type",
                  })}
                />
                Income
              </label>
              <label>
                <input
                  type="radio"
                  name="type"
                  value="Expense"
                  {...register("type", {
                    required: "Please select transaction type",
                  })}
                />
                Expense
              </label>
            </div>
            {errors.type && (
              <p className="text-danger">{errors.type.message}</p>
            )}
            <h2 className="text-text-primary text-xl">Title</h2>
            <input
              type="text"
              className="px-2 py-2 rounded-md border"
              placeholder="e.g. Grocery"
              {...register("title", {
                required: "Title is required",
                maxLength: {
                  value: 30,
                  message: "Title cannot exceed 30 characters",
                },
              })}
            />{" "}
            {errors.title && (
              <p className="text-danger">{errors.title.message}</p>
            )}
            <h2 className="text-text-primary text-xl">Amount</h2>
            <input
              type="number"
              className="px-2 py-2 rounded-md border"
              placeholder="₹ 0.00"
              {...register("amount", {
                required: "Amount is required",
                min: {
                  value: 1,
                  message: "Amount must be greater than 0",
                },
              })}
            />{" "}
            {errors.amount && (
              <p className="text-danger">{errors.amount.message}</p>
            )}
            {/* category  */}
            <h2 className="text-text-primary text-xl">Category</h2>
            <select
              className="py-4 border-none outline-none cursor-pointer"
              {...register("category", {
                required: "Category is required",
              })}
            >
              <option value="Food">🍔Food & Dining</option>
              <option value="Shopping">🛍️Shopping</option>
              <option value="Transport">🚗Transport</option>
              <option value="Bills">💡Bills</option>
              <option value="Health">💊Health</option>
              <option value="Salary">💻Salary</option>
              <option value="Entertainment">🎬Entertainment</option>
              <option value="Other">📦Other</option>
            </select>{" "}
            {errors.category && (
              <p className="text-danger">{errors.category.message}</p>
            )}
            {/* Date  */}
            <h2 className="text-text-primary text-xl">Date</h2>
            <input type="date" {...register("date")} />
            {/* Note */}
            <h2 className="text-text-secondary text-xl">Note (optional)</h2>
            <input
              type="text"
              className="px-2 py-2 rounded-md border"
              placeholder="---"
              {...register("description", {
                maxLength: {
                  value: 300,
                  message: "Note cannot exceed 300 characters",
                },
              })}
            />{" "}
            {errors.description && (
              <p className="text-danger">{errors.description.message}</p>
            )}
            {/* buttons  */}
            <div className="flex items-center gap-2 justify-between mt-4 mb-4">
              <button
                type="button"
                onClick={closeTransactionModal}
                className="bg-background active:scale-95 rounded-md px-8 py-2 cursor-pointer transition-all duration-200"
              >
                Cancel
              </button>
              <button
                disabled={loading}
                type="submit"
                className={
                  loading
                    ? "bg-purple-500 text-white rounded-md px-8 py-2 cursor-not-allowed transition-all duration-200"
                    : "bg-primary hover:bg-primary-hover active:scale-95 text-white rounded-md px-8 py-2 cursor-pointer transition-all duration-200"
                }
              >
                {loading
                  ? isEditing
                    ? "Updating..."
                    : "Adding..."
                  : isEditing
                    ? "Update"
                    : "Add"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {transactionDelete && (
        <Modal>
          <div className="px-2 py-4">
            <h2 className="border-b mb-4 pb-4 text-xl text-text-primary font-bold">
              Delete Confirmation
            </h2>
            <p className="text-lg text-text-primary py-6 px-2">
              Are you sure you want to delete?
            </p>
            <div className="flex items-center justify-between">
              <button
                onClick={() => (
                  setSelectedTransactionId(null),
                  setTransactionDelete(false)
                )}
                className="bg-background active:scale-95 rounded-md px-4 py-2 cursor-pointer transition-all duration-200"
              >
                Cancel
              </button>
              <button
                disabled={loading}
                onClick={() => deleteTransaction(selectedTransactionId)}
                className={`${
                  loading
                    ? "bg-red-400 text-white rounded-md px-4 py-2 cursor-not-allowed transition-all duration-200"
                    : "bg-danger hover:bg-danger-hover active:scale-95 text-white rounded-md px-4 py-2 cursor-pointer transition-all duration-200"
                }`}
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </main>
  );
};

export default Transactions;
