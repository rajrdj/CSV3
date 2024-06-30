export default function CSVList({ files, onSelect, onDelete }) {
  return (
    <div>
      <h2 className="mb-4 text-yellow-400">Uploaded CSV Files</h2>
      {files.length === 0 ? (
        <p>No CSV files uploaded yet.</p>
      ) : (
        <ul className="space-y-2">
          {files.map((file) => (
            <li key={file._id} className="flex justify-between items-center p-2 bg-white rounded-lg shadow">
              <button
                onClick={() => onSelect(file._id)}
                className="text-yellow-600 hover:underline focus:outline-none space-x-5"
              >
                {file.filename}
              </button>
              <button
                onClick={() => onDelete(file._id)}
                className="btn-danger bg-indigo-800"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}