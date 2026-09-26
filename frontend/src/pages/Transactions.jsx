import {
  Plus,
  Search,
  FunnelPlus,
  FunnelX,
  SquarePen,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import Modal from "../components/Ui/Modal";
import useTransactions from "../hook/useTransactions";
import Pagination from "../components/Ui/Pagination";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import "react-loading-skeleton/dist/skeleton.css";
import TransactionsListSkeleton from "../components/Ui/skeletons/TransactionsListSkeleton";
import ErrorState from "../components/Ui/ErrorState";
import Button from "../components/Ui/Button";
import FormInput from "../components/Ui/FormInput";

const Transactions = () => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isDirty },
    watch,
  } = useForm({
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      type: "Expense",
    },
  });
  const selectedType = watch("type");
  const title = watch("title", "");

  const handleTypeChange = (event) => {
    const nextType = event.target.value;
    setValue("type", nextType, { shouldDirty: true });
    setValue("category", nextType === "Expense" ? "Food" : "Salary", {
      shouldDirty: true,
    });
  };

  const [showFilter, setShowFilter] = useState(false);
  const [appliedType, setAppliedType] = useState("");
  const [appliedCategory, setAppliedCategory] = useState("");
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [transactionDelete, setTransactionDelete] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);
  const [type, setType] = useState("all");
  const [category, setCategory] = useState("all");
  const [editTransaction, setEditTransaction] = useState([]);
  const [search, setSearch] = useState("");
  const [searchedValue, setSearchedValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [transactionError, settransactionError] = useState("");
  const limit = 10;
  const {
    getTransactionsHandler,
    allTransaction,
    createTransactionHandler,
    deleteTransactionHandler,
    editTransactionHandler,
    totalTransactions,
    transactionsLoading,
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
    "Rent & Housing": "🏡",
    Other: "📦",
  };

  const expenseCategories = [
    {
      value: "Food",
      category: "🍔Food & Dining",
    },
    {
      value: "Shopping",
      category: "🛍️Shopping",
    },
    {
      value: "Transport",
      category: "🚗Transport",
    },
    {
      value: "Bills",
      category: "💡Bills",
    },
    {
      value: "Health",
      category: "💊Health",
    },
    {
      value: "Rent & Housing",
      category: "🏡Rent & Housing",
    },
    {
      value: "Entertainment",
      category: "🎬Entertainment",
    },
    {
      value: "Other",
      category: "📦Other",
    },
  ];

  const incomeCategories = [
    {
      value: "Salary",
      category: "💻Salary",
    },
    {
      value: "Other",
      category: "📦Other",
    },
  ];

  const titleSuggestions = {
    Expense: [
      "Grocery",
      "Rent",
      "Transport",
      "Shopping",
      "Electricity",
      "Pani Puri",
      "Movie",
      "Gym",
      "Medical",
      "Emi",
      "sop",
    ],
    Income: [
      "Salary",
      "Freelance",
      "Bonus",
      "Interest",
      "Borrowed Money",
      "Gift",
      "Investment",
    ],
  };
  const matchingTitleSuggestions = (
    titleSuggestions[selectedType] || []
  ).filter(
    (suggestion) =>
      title.trim() &&
      suggestion.toLowerCase().startsWith(title.trim().toLowerCase()) &&
      suggestion.toLowerCase() !== title.trim().toLowerCase(),
  );

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
        toast.success("Updated successfully.");
      } else {
        response = await createTransactionHandler(
          data.title,
          data.amount,
          data.type,
          data.category,
          data.date,
          data.description,
        );
        toast.success("Created successfully.");
      }

      reset();
      getTransactions(
        currentPage,
        limit,
        searchedValue,
        appliedType,
        appliedCategory,
      );
      setSelectedTransactionId(null);
      setShowAddTransaction(false);
      return response;
    } catch (err) {
      const message = "something went wrong. please try again.";
      toast.error(err.response?.data?.message ?? message);
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
      toast.success("Deleted successfully.");
      const fetchResponse = await getTransactions(
        currentPage,
        limit,
        searchedValue,
        appliedType,
        appliedCategory,
      );
      if (fetchResponse.data.totalPages === 0) {
        return;
      }
      if (currentPage > fetchResponse.data.totalPages) {
        await getTransactions(
          fetchResponse.data.totalPages,
          limit,
          searchedValue,
          appliedType,
          appliedCategory,
        );
      }
      return response;
    } catch (err) {
      const message = "something went wrong. please try again.";
      toast.error(err.response?.data?.message ?? message);
    }
  };

  //editing transaction

  const isEditing = Boolean(selectedTransactionId);

  useEffect(() => {
    if (!selectedTransactionId) return;

    const transaction = editTransaction.find(
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
  }, [selectedTransactionId, editTransaction, reset]);

  const openAddTransaction = () => {
    setSelectedTransactionId(null);

    reset({
      title: "",
      amount: "",
      type: selectedType,
      category: selectedType === "Expense" ? "Food" : "Salary",
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

  //fetching data and search filter
  const getTransactions = async (page, limit, search, type, category) => {
    try {
      const response = await getTransactionsHandler(
        page,
        limit,
        search,
        type,
        category,
      );
      settransactionError(null);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
      setEditTransaction(response.data.transactions);
      return response;
    } catch (err) {
      const message = "Something went wrong!";
      settransactionError(err.response?.data.message || message);
    }
  };

  const handleNext = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handlePrevious = () => {
    setCurrentPage((prev) => prev - 1);
  };

  // filtering

  const filteredTransaction = async () => {
    const types = type === "all" ? "" : type;
    const categories = category === "all" ? "" : category;
    setAppliedCategory(categories);
    setAppliedType(types);
    setShowFilter(false);
  };

  useEffect(() => {
    getTransactions(
      currentPage,
      limit,
      searchedValue,
      appliedType,
      appliedCategory,
    );
  }, [currentPage, searchedValue, appliedType, appliedCategory]);

  //search functionality using debouncing
  useEffect(() => {
    const response = setTimeout(() => {
      setSearchedValue(search.trim());
    }, 300);
    return () => {
      clearTimeout(response);
    };
  }, [search]);

  return (
    <main className="md:p-4 bg-background h-screen">
      <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
        <h2 className="text-text-secondary mt-4 mb-4">
          {totalTransactions} transactions found
        </h2>
        <Button
          onClick={openAddTransaction}
          className="flex items-center gap-2 bg-primary text-white px-4 py-3 rounded-2xl cursor-pointer active:scale-95 hover:bg-primary-hover transition-all duration-200"
        >
          <Plus size={20} />
          Add Transaction
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="relative flex items-center gap-4 bg-surface py-4 px-4 mt-4 mb-4 rounded-2xl">
        {/* Search */}
        <div className="flex flex-1 items-center border px-4 rounded-xl bg-background">
          <Search size={20} className="text-text-secondary" />
          <input
            className="bg-background w-full px-2 py-2 outline-none"
            name="search"
            type="text"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
          />
        </div>
        {/* Filter Button */}
        <div>
          <Button
            onClick={() => setShowFilter(!showFilter)}
            variant="normal"
            className="flex items-center gap-2 cursor-pointer bg-background px-4 py-4 rounded-xl"
          >
            {showFilter ? (
              <div className="flex gap-2">
                <FunnelX size={20} /> <p>Filter</p>
              </div>
            ) : (
              <div className="flex gap-2">
                <FunnelPlus size={20} /> <p>Filter</p>
              </div>
            )}
          </Button>
        </div>
        {showFilter && (
          <div
            onClick={() => setShowFilter(false)}
            className="absolute right-4 top-full z-50 mt-2"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="p-4 rounded-2xl border bg-background shadow-lg"
            >
              <h2 className="text-text-primary"> Types </h2>
              <div className="flex gap-4 text-text-secondary py-4">
                <label className="cursor-pointer">
                  <input
                    onChange={(e) => setType(e.target.value)}
                    checked={type === "all"}
                    type="radio"
                    name="type"
                    id="all"
                    value="all"
                  />
                  <span className="ml-1">All</span>
                </label>
                <label className="cursor-pointer">
                  <input
                    onChange={(e) => setType(e.target.value)}
                    checked={type === "Income"}
                    type="radio"
                    name="type"
                    id="income"
                    value="Income"
                  />
                  <span className="ml-1">Income</span>
                </label>
                <label className="cursor-pointer">
                  <input
                    onChange={(e) => setType(e.target.value)}
                    checked={type === "Expense"}
                    type="radio"
                    name="type"
                    id="expense"
                    value="Expense"
                  />
                  <span className="ml-1">Expense</span>
                </label>
              </div>
              <h2 className="text-text-primary"> Category </h2>
              <div className="flex">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="py-4 border-none outline-none cursor-pointer bg-background"
                >
                  <option value="all">All categories</option>
                  <option value="Food">🍔 Food & Dining</option>
                  <option value="Shopping">🛍️ Shopping</option>
                  <option value="Transport">🚗 Transport</option>
                  <option value="Bills">💡 Bills</option>
                  <option value="Health">💊 Health</option>
                  <option value="Rent & Housing">🏡 Rent & Housing</option>
                  <option value="Salary">💻 Salary</option>
                  <option value="Entertainment">🎬 Entertainment</option>
                  <option value="Other">📦 Other</option>
                </select>
              </div>
              <div className="flex items-center py-4 justify-between gap-4">
                <Button
                  variant="normal"
                  onClick={() => {
                    setCategory("all");
                    setType("all");
                  }}
                  className="bg-surface px-4 py-2 rounded-2xl cursor-pointer"
                >
                  Clear
                </Button>
                <Button
                  onClick={filteredTransaction}
                  className="bg-primary text-white px-4 py-2 rounded-2xl cursor-pointer"
                >
                  Apply
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Transaction lists */}
      <div className="bg-surface py-4 px-4 rounded-2xl">
        {/* Header */}
        <div className="hidden md:flex justify-between items-center text-text-secondary">
          <p className="flex gap-2 items-center cursor-pointer hover:text-text-primary">
            Transaction
          </p>

          <p>Category</p>

          <p className="flex gap-2 items-center cursor-pointer hover:text-text-primary">
            Date
          </p>

          <p className="flex gap-2 items-center cursor-pointer hover:text-text-primary">
            Amount
          </p>

          <p className="hidden sm:block">Action</p>
        </div>

        {/* Loading */}
        {transactionsLoading ? (
          <TransactionsListSkeleton />
        ) : /* Error */
        transactionError ? (
          <ErrorState
            message={transactionError}
            onRetry={() =>
              getTransactions(
                currentPage,
                limit,
                searchedValue,
                appliedType,
                appliedCategory,
              )
            }
          />
        ) : /* Empty */
        allTransaction.length === 0 ? (
          <ul className="flex items-center justify-center h-58">
            <li className="text-2xl text-text-secondary">
              No Transactions Found
            </li>
          </ul>
        ) : (
          /* Success */
          <>
            {/* Desktop */}
            <div className="hidden md:block">
              {allTransaction.map((item) => (
                <ul
                  key={item._id}
                  className="flex items-center justify-between py-4 border-b border-b-gray-100"
                >
                  <li className="flex items-center gap-1 w-34 min-w-0">
                    <div>{categoryLabels[item.category]}</div>
                    <div className="truncate text-text-primary">
                      {item.title}
                    </div>
                  </li>

                  <li className="w-28 text-center">{item.category}</li>

                  <li className="w-28 text-center">
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
                      ? `-₹${item.amount}`
                      : `+₹${item.amount}`}
                  </li>

                  <li className="hidden sm:flex items-center gap-2">
                    <SquarePen
                      onClick={() => {
                        setShowAddTransaction(true);
                        setSelectedTransactionId(item._id);
                      }}
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
              ))}
            </div>

            {/* Mobile */}
            <div className="md:hidden">
              {allTransaction.map((item) => (
                <ul
                  key={item._id}
                  className="flex justify-between py-4 border-b border-b-gray-100"
                >
                  <div>
                    <li className="flex items-center gap-2 w-40 min-w-0">
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
                        ? `-₹${item.amount}`
                        : `+₹${item.amount}`}
                    </li>

                    <li className="flex items-center gap-8">
                      <SquarePen
                        onClick={() => {
                          setShowAddTransaction(true);
                          setSelectedTransactionId(item._id);
                        }}
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
              ))}
            </div>
          </>
        )}
      </div>
      {/* page numbers  */}
      {!transactionError && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          handlePrevious={handlePrevious}
          handleNext={handleNext}
          loading={transactionsLoading}
        />
      )}
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
              <Button
                variant="normal"
                type="button"
                onClick={closeTransactionModal}
              >
                <X
                  className="text-text-secondary hover:text-text-primary cursor-pointer"
                  size={25}
                />
              </Button>
            </div>
            <div className="flex bg-background rounded-md px-1 py-1">
              <label
                className={`${selectedType === "Expense" ? " bg-danger text-white w-[50%] px-4 py-2 rounded-md text-center cursor-pointer font-semibold" : " bg-background w-[50%] px-4 py-2 rounded-md text-center cursor-pointer font-semibold"}`}
              >
                <input
                  hidden
                  type="radio"
                  value="Expense"
                  {...register("type", { onChange: handleTypeChange })}
                />
                Expense
              </label>
              <label
                className={`${selectedType === "Income" ? " bg-success text-white w-[50%] px-4 py-2 rounded-md text-center cursor-pointer font-semibold" : " bg-background w-[50%] px-4 py-2 rounded-md text-center cursor-pointer font-semibold"}`}
              >
                <input
                  hidden
                  type="radio"
                  value="Income"
                  {...register("type", { onChange: handleTypeChange })}
                />
                Income
              </label>
            </div>
            {errors.type && (
              <p className="text-danger">{errors.type.message}</p>
            )}
            <div className="relative flex flex-col gap-1">
              <label className="text-text-secondary text-xl">Title</label>
              <input
                className="px-2 py-2 rounded-md border"
                type="text"
                placeholder={selectedType === "Expense" ? " Grocery" : "Salary"}
                {...register("title", {
                  required: "Title is required",
                  maxLength: {
                    value: 30,
                    message: "Title cannot exceed 30 characters",
                  },
                })}
              />
              {matchingTitleSuggestions.length > 0 && (
                <ul className="absolute z-10 top-full left-0 right-0 mt-1 rounded-md border bg-background shadow-md">
                  {matchingTitleSuggestions.map((suggestion) => (
                    <li key={suggestion}>
                      <button
                        type="button"
                        className="w-full px-3 py-2 text-left hover:bg-surface"
                        onClick={() =>
                          setValue("title", suggestion, {
                            shouldDirty: true,
                            shouldValidate: true,
                          })
                        }
                      >
                        {suggestion}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {errors.title && (
                <p className="text-danger">{errors.title.message}</p>
              )}
            </div>
            <FormInput
              labelClassName="text-text-secondary text-xl"
              label="Amount (₹)"
              type="number"
              name="amount"
              placeholder="₹ 0.00"
              register={register}
              rules={{
                required: "Amount is required",
                min: {
                  value: 1,
                  message: "Amount must be greater than 0",
                },
              }}
              error={errors.amount}
            />

            {/* category  */}
            <h2 className="text-text-secondary text-xl">Category</h2>
            <div className="py-1 border rounded-md outline-none cursor-pointer">
              <select
                className="py-2 px-2 w-[95%] outline-none cursor-pointer"
                {...register("category", {
                  required: "Category is required",
                })}
              >
                {selectedType === "Expense"
                  ? expenseCategories.map((item, ind) => {
                      return (
                        <option key={ind} value={item.value}>
                          {item.category}
                        </option>
                      );
                    })
                  : incomeCategories.map((item, ind) => {
                      return (
                        <option key={ind} value={item.value}>
                          {item.category}
                        </option>
                      );
                    })}
              </select>{" "}
            </div>
            {errors.category && (
              <p className="text-danger">{errors.category.message}</p>
            )}
            {/* Date  */}
            <h2 className="text-text-secondary text-xl">Date</h2>
            <div className="flex border rounded-md px-4 py-2">
              <input
                className="w-full outline-0"
                type="date"
                min="2000-01-01"
                max={new Date().toISOString().split("T")[0]}
                {...register("date")}
              />
            </div>
            {/* Note */}
            <label className="text-text-secondary text-xl">
              Note (optional)
            </label>
            <textarea
              className="px-2 py-2 rounded-md border"
              placeholder="---"
              {...register("description", {
                maxLength: {
                  value: 300,
                  message: "Note cannot exceed 300 characters",
                },
              })}
            ></textarea>
            {errors.description && (
              <p className="text-danger">{errors.description.message}</p>
            )}
            {/* buttons  */}
            <div className="flex items-center gap-2 justify-between mt-4 mb-4 ">
              <Button
                variant="normal"
                type="button"
                onClick={closeTransactionModal}
                className="px-8 py-2 w-full"
              >
                Cancel
              </Button>
              <Button
                disabled={loading || (isEditing && !isDirty)}
                type="submit"
                className="px-8 py-2 w-full"
              >
                {loading
                  ? isEditing
                    ? "Updating..."
                    : "Adding..."
                  : isEditing
                    ? "Update"
                    : "Add"}
              </Button>
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
              <Button
                variant="normal"
                onClick={() => (
                  setSelectedTransactionId(null),
                  setTransactionDelete(false)
                )}
              >
                Cancel
              </Button>
              <Button
                disabled={loading}
                onClick={() => deleteTransaction(selectedTransactionId)}
                variant="danger"
              >
                {loading ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </main>
  );
};

export default Transactions;
