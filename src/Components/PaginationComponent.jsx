import { GrNext, GrPrevious } from "react-icons/gr";

/* eslint-disable react/prop-types */
const PaginationComponent = ({ totalPages, currentPage, setCurrentPage }) => {

  const renderPaginationItems = () => {
    const items = [];
    const startPage = Math.max(currentPage - 2, 1);
    const endPage = Math.min(currentPage + 2, totalPages);
      console.log(".........",totalPages)

    // Add the first page and ellipsis if needed
    if (startPage > 1) {
      items.push(
        <li key={1} className="inline-block mx-1">
          <button
            onClick={() => setCurrentPage(1)}
            className={`px-4 py-2 rounded-lg ${
              currentPage === 1
                ? "bg-taskBlack text-white"
                : "bg-gray-200 text-black "
            }`}
          >
            1
          </button>
        </li>
      );
      if (startPage > 2) {
        items.push(
          <li key="start-ellipsis" className="inline-block mx-1">
            <span className="px-4 py-2">...</span>
          </li>
        );
      }
    }

    // Render the middle range of pages
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <li key={i} className="inline-block mx-1">
          <button
            onClick={() => setCurrentPage(i)}
            className={`px-4 py-2 rounded-full ${
              currentPage === i
                ? "bg-white  p-2"
                : "text-black"
            }`}
          >
            {i}
          </button>
        </li>
      );
    }

    // Add the last page and ellipsis if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(
          <li key="end-ellipsis" className="inline-block mx-1">
            <span className="px-4 py-2">...</span>
          </li>
        );
      }
      items.push(
        <li key={totalPages} className="inline-block mx-1">
          <button
            onClick={() => setCurrentPage(totalPages)}
            className={`px-4 py-2 rounded-lg ${
              currentPage === totalPages
                ? "bg-taskBlack text-white"
                : " text-black hover:bg-white"
            }`}
          >
            {totalPages}
          </button>
        </li>
      );
    }
    return items;
  };

  return (
    <nav aria-label="Pagination">
      <ul className="flex items-center justify-center list-none p-0">
        <li className="inline-block mx-1">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className={`px-4 py-2 rounded-lg inline-flex items-center gap-2 ${
              currentPage === 1
                ? " text-gray-500 cursor-not-allowed"
                : "text-black hover:bg-slate-300/50"
            }`}
            disabled={currentPage === 1}
          >
            <GrPrevious /> Previous
          </button>
        </li>
        {renderPaginationItems()}
        <li className="inline-block mx-1">
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            className={`px-4 py-2 rounded-lg inline-flex items-center gap-2 ${
              // currentPage === totalPages
               totalPages === 0
                ? " text-gray-500 cursor-not-allowed"
                : "text-black hover:bg-slate-300/50"
            }`}
            // disabled={currentPage === totalPages}
            disabled = {totalPages === 0} 
          >
            Next <GrNext />
          </button>
        </li>
      </ul>
    </nav>
  );
};
export default PaginationComponent;