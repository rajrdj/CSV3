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
      <h2 className="mb-4">{file.filename}</h2>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              {file.columns.map((column) => (
                <th
                  key={column}
                  onClick={() => handleSort(column)}
                  className="cursor-pointer"
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
                    className="btn-secondary ml-2"
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
                  <td key={column}>{row[column]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-between bg-orange-500 items-center">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="btn-secondary"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="btn-secondary"
        >
          Next
        </button>
      </div>
      {showChart && selectedColumn && (
        <div className="mt-8">
          <h3 className="mb-4">Bar Chart: {selectedColumn}</h3>
          <BarChart data={file.data} column={selectedColumn} />
          <button
            onClick={() => setShowChart(false)}
            className="btn-danger mt-4"
          >
            Close Chart
          </button>
        </div>
      )}
    </div>
  );
}