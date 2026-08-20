const Pagination = ({
  currentPage,
  totalPages,
  handlePrevious,
  handleNext,
  loading,
}) => {
  return (
    <div className="flex items-center justify-center gap-2 bg-surface p-4">
      <button
        disabled={currentPage === 1 || loading}
        onClick={handlePrevious}
        className="px-3 py-2 rounded-md bg-background disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        Previous
      </button>

      <p className="bg-primary px-2 py-1 rounded-md text-white">
        {currentPage}
      </p>
      <p>/</p>
      <p className="bg-white px-2 py-1 rounded-md">{totalPages}</p>

      <button
        disabled={totalPages === currentPage || loading}
        onClick={handleNext}
        className="px-3 py-2 rounded-md bg-background disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
