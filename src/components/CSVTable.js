import { useState, useMemo } from 'react';
import BarChart from './BarChart';

export default function CSVTable({ file }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [showChart, setShowChart] = useState(false);
  const itemsPerPage = 100;

  const filteredData = useMemo(() => {
    return file.data.filter((row) =>
      Object.values(row).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [file.data, searchTerm]);

  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;

    return [...filteredData].sort((a, b) => {
      if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
      if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortColumn, sortDirection]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage]);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleColumnSelect = (column) => {
    setSelectedColumn(column);
    setShowChart(true);
  };

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">{file.filename}</h2>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2 border rounded"
      />
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              {file.columns.map((column) => (
                <th
                  key={column}
                  className="px-4 py-2 border cursor-pointer"
                  onClick={() => handleSort(column)}
                >
                  {column}
                  {sortColumn === column && (
                    <span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleColumnSelect(column);
                    }}
                    className="ml-2 bg-blue-500 text-white px-2 py-1 rounded text-xs"
                  >
                    Chart
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, index) => (
              <tr key={index}>
                {file.columns.map((column) => (
                  <td key={column} className="px-4 py-2 border">
                    {row[column]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
      {showChart && selectedColumn && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Bar Chart: {selectedColumn}</h3>
          <BarChart data={file.data} column={selectedColumn} />
          <button
            onClick={() => setShowChart(false)}
            className="mt-2 bg-red-500 text-white px-4 py-2 rounded"
          >
            Close Chart
          </button>
        </div>
      )}
    </div>
  );
}