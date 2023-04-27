type PaginationProps = {
    dataPerPage: number;
    totalData: number;
    paginate: (pageNumber: number) => void;
    currentPage: number;
  };
  
  export default function Pagination({ dataPerPage, totalData, paginate, currentPage }: PaginationProps) {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalData / dataPerPage); i++) {
      pageNumbers.push(i);
    }
  
    const slicedPageNumbers = [];
    let prevPage = 0;
    for (let i = 0; i < pageNumbers.length; i++) {
      if (i === 0 || i === pageNumbers.length - 1 || i === currentPage - 1 || i === currentPage - 2 || i === currentPage || i === currentPage + 1) {
        if (prevPage !== 0 && prevPage !== pageNumbers[i] - 1) {
          slicedPageNumbers.push(-1);
        }
        slicedPageNumbers.push(pageNumbers[i]);
        prevPage = pageNumbers[i];
      }
    }
  
    return (
      <div className="container w-full flex justify-center py-2">
        <ul className="flex gap-1">
          {currentPage > 1 && (
            <li>
              <button
                className="px-4 py-2 font-bold text-gray-500 bg-gray-300 rounded-md hover:bg-blue-400 hover:text-white"
                onClick={() => paginate(currentPage - 1)}
              >
                Prev
              </button>
            </li>
          )}
          {slicedPageNumbers.map((number) =>
            number === -1 ? (
              <li key={number}>
                <span className="px-4 py-2 font-bold text-gray-500">...</span>
              </li>
            ) : (
              <li key={number}>
                <button
                  className={`h-10 px-5 ${
                    number === currentPage
                      ? "text-white bg-gray-600 border border-r-0 rounded-md border-gray-600"
                      : "px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-blue-400 hover:text-white"
                  }`}
                  onClick={() => paginate(number)}
                >
                  {number}
                </button>
              </li>
            )
          )}
          {currentPage < pageNumbers.length && (
            <li>
              <button
                className="px-4 py-2 font-bold text-gray-500 bg-gray-300 rounded-md hover:bg-blue-400 hover:text-white"
                onClick={() => paginate(currentPage + 1)}
              >
                Next
              </button>
            </li>
          )}
        </ul>
      </div>
    );
  };
  