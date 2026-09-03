import React, { useState } from 'react';
import { UploadCloud, FileText } from 'lucide-react';
import FlipBookViewer from './components/FlipBookViewer';
import './index.css';

function App() {
  const [pdfFile, setPdfFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
    }
  };

  return (
    <div className="app-container">
      {!pdfFile ? (
        <>
          <div className="header">
            <h1>Antigravity Reader</h1>
            <p>Experience your PDFs like real books with premium 3D page flipping.</p>
          </div>

          <label
            className={`upload-section ${isDragging ? 'drag-active' : ''}`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          >
            <UploadCloud className="upload-icon" />
            <span className="upload-label">Click to upload or drag & drop</span>
            <span className="upload-subtext">PDF documents only</span>
            <input 
              type="file" 
              className="file-input" 
              accept=".pdf,application/pdf"
              onChange={onFileChange}
            />
          </label>
        </>
      ) : (
        <FlipBookViewer 
          file={pdfFile} 
          onClose={() => setPdfFile(null)} 
        />
      )}
    </div>
  );
}

export default App;
