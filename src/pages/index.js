import { useState, useEffect } from 'react';
import FileUpload from '../components/FileUpload';
import CSVList from '../components/CSVList';
import CSVTable from '../components/CSVTable';


export default function Home() {
  const [csvFiles, setCsvFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCSVFiles();
  }, []);

  const fetchCSVFiles = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/csv');
      const data = await response.json();
      if (data.success) {
        setCsvFiles(data.data);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to fetch CSV files');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/csv/${id}`);
      const data = await response.json();
      if (data.success) {
        setSelectedFile(data.data);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to fetch CSV file');
    } finally {
      setLoading(false);
    }
  };

  const handleFileDelete = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/csv/delete/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        fetchCSVFiles();
        if (selectedFile && selectedFile._id === id) {
          setSelectedFile(null);
        }
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to delete CSV file');
    } finally {
      setLoading(false);
    }
  };

 
 return (
  <div className="container py-8">
    <h1 className="mb-8 text-yellow-400">CSV File Upload and Viewer</h1>
    <div className="card mb-8">
      <FileUpload onUploadSuccess={fetchCSVFiles} />
    </div>
    {error && <p className="error-message mb-4">{error}</p>}
    {loading ? (
      <p>Loading...</p>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="card">
            <CSVList
              files={csvFiles}
              onSelect={handleFileSelect}
              onDelete={handleFileDelete}
            />
          </div>
        </div>
        <div className="md:col-span-2">
          {selectedFile && (
            <div className="card">
              <CSVTable file={selectedFile} />
            </div>
          )}
        </div>
      </div>
    )}
  </div>
);
}