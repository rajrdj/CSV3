export default function CSVList({ files, onSelect, onDelete }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Uploaded CSV Files</h2>
      {files.length === 0 ? (
        <p>No CSV files uploaded yet.</p>
      ) : (
        <ul className="space-y-2">
          {files.map((file) => (
            <li key={file._id} className="flex justify-between items-center">
              <button
                onClick={() => onSelect(file._id)}
                className="text-blue-500 hover:underline focus:outline-none"
              >
                {file.filename}
              </button>
              <button
                onClick={() => onDelete(file._id)}
                className="bg-red-500 text-white px-2 py-1 rounded text-xs"
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