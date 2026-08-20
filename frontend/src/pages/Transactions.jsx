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
import Pagination from "../components/Ui/Pagination";
import { useForm } from "react-hook-form";

const Transactions = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
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
  const [type, setType] = useState("all");
  const [category, setCategory] = useState("all");
  const [filterTransaction, setFilterTransaction] = useState(null);
  const [allTransactions, setallTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;
  const {
    createTransactionHandler,
    deleteTransactionHandler,
    editTransactionHandler,
    fetchPaginatedTransactionsHandler,
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
      await fetchPaginatedTransaction(currentPage);
      setSelectedTransactionId(null);
      setShowAddTransaction(false);
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
      const fetchResponse = await fetchPaginatedTransaction(currentPage);
      if (currentPage > fetchResponse.data.totalPages) {
        await fetchPaginatedTransaction(fetchResponse.data.totalPages);
      }
      return response;
    } catch (err) {
      console.log(err.message);
    }
  };

  //editing transaction

  const isEditing = Boolean(selectedTransactionId);

  useEffect(() => {
    if (!selectedTransactionId) return;

    const transaction = allTransactions.find(
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
  }, [selectedTransactionId, allTransactions, reset]);

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

  //filter function
  const transactionFilter = () => {
    const filtered = allTransactions.filter((item) => {
      const typeMatches = type === "all" || item.type === type;

      const categoryMatches = category === "all" || item.category === category;

      return typeMatches && categoryMatches;
    });
    setFilterTransaction(filtered);
    setShowFilter(false);
  };
  const transactionsToRender = filterTransaction ?? allTransactions;

  //pagination functionality
  const fetchPaginatedTransaction = async (pageNum) => {
    try {
      const response = await fetchPaginatedTransactionsHandler(pageNum, limit);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
      setallTransactions(response.data.transactions);
      return response;
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleNext = () => {
  setCurrentPage((prev) => prev + 1);
};

const handlePrevious = () => {
  setCurrentPage((prev) => prev - 1);
};

  useEffect(() => {
    fetchPaginatedTransaction(currentPage);
  }, [currentPage]);

  return (
    <main className="md:p-4 bg-background h-screen">
      <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
        <h2 className="text-text-secondary mt-4 mb-4">
          {transactionsToRender.length} transactions found
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
                <input
                  onChange={(e) => setType(e.target.value)}
                  checked={type === "all"}
                  type="radio"
                  name="type"
                  id="all"
                  value="all"
                />
                All
              </label>
              <label>
                <input
                  onChange={(e) => setType(e.target.value)}
                  checked={type === "Income"}
                  type="radio"
                  name="type"
                  id="income"
                  value="Income"
                />
                Income
              </label>
              <label>
                <input
                  onChange={(e) => setType(e.target.value)}
                  checked={type === "Expense"}
                  type="radio"
                  name="type"
                  id="expense"
                  value="Expense"
                />
                Expense
              </label>
            </div>
            <h2 className="text-text-primary">Category</h2>
            <div className="flex">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="py-4 border-none outline-none cursor-pointer"
              >
                <option value="all">All categories</option>
                <option value="Food">🍔Food & Dining</option>
                <option value="Shopping">🛍️Shopping</option>
                <option value="Transport">🚗Transport</option>
                <option value="Bills">💡Bills</option>
                <option value="Health">💊Health</option>
                <option value="Salary">💻Salary</option>
                <option value="Entertainment">🎬Entertainment</option>
                <option value="Other">📦Other</option>
              </select>
            </div>
            <div className="flex items-center py-4 justify-between">
              <button
                onClick={() => (
                  setCategory("all"),
                  setType("all"),
                  setFilterTransaction(null)
                )}
                className="bg-surface px-4 py-2 rounded-2xl cursor-pointer"
              >
                Clear
              </button>
              <button
                onClick={transactionFilter}
                className="bg-primary text-white px-4 py-2 rounded-2xl cursor-pointer"
              >
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
        {transactionsToRender.length === 0 ? (
          <ul className="hidden md:flex items-center justify-center h-58">
            <li className="text-2xl text-text-secondary">
              No Transactions Found
            </li>
          </ul>
        ) : (
          transactionsToRender.map((item) => {
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
                  {new Date(item.date).toLocaleDateString()}
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
          })
        )}

        {/* mobile */}
        {transactionsToRender.length === 0 ? (
          <ul className="flex md:hidden items-center justify-center h-58">
            <li className="text-2xl text-text-secondary">
              No Transactions Found
            </li>
          </ul>
        ) : (
          transactionsToRender.map((item) => {
            return (
              <ul
                key={item._id}
                className="flex md:hidden justify-between py-4 border-b border-b-gray-100"
              >
                <div className="">
                  <li className="flex items-centers gap-4">
                    <div>{categoryLabels[item.category]}</div>
                    <div className="truncate text-text-primary">
                      {item.title}
                    </div>
                  </li>
                  <li className="py-1 w-28 text-center text-text-secondary text-sm">
                    {item.category}
                  </li>
                  <li className="py-1 w-28 text-center text-text-secondary text-xs">
                    {new Date(item.date).toLocaleDateString()}
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
          })
        )}
      </div>

      {/* page numbers  */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        handlePrevious={handlePrevious}
        handleNext={handleNext}
        loading={loading}
        
      />

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
              <button type="button" onClick={closeTransactionModal}>
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
                disabled={loading || (isEditing && !isDirty)}
                type="submit"
                className={
                  loading || (isEditing && !isDirty)
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
