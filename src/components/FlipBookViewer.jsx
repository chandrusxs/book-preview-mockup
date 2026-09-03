import React, { useState, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import HTMLFlipBook from 'react-pageflip';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set up the PDF.js worker from unpkg to avoid Vite bundling issues
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PageContent = React.forwardRef(({ pageNumber, width, ...props }, ref) => {
  return (
    <div className={`demoPage ${pageNumber % 2 === 0 ? '-left' : '-right'}`} ref={ref}>
      <Page 
        pageNumber={pageNumber} 
        width={width} 
        renderTextLayer={false} 
        renderAnnotationLayer={false}
        className="pdf-page-wrapper"
        devicePixelRatio={window.devicePixelRatio || 1}
      />
      <div className={pageNumber % 2 === 0 ? 'page-curve-overlay-left' : 'page-curve-overlay-right'}></div>
      <span className={pageNumber % 2 === 0 ? 'page-number-left' : 'page-number-right'}>
        {pageNumber}
      </span>
    </div>
  );
});

export default function FlipBookViewer({ file, onClose }) {
  const [numPages, setNumPages] = useState(null);
  const [page, setPage] = useState(0); 
  const bookRef = useRef();

  const [dimensions, setDimensions] = useState({ width: 400, height: 550 });

  React.useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      // 40px for padding/margins. If screen is smaller than 850px (2 pages * 400 + padding)
      if (screenWidth < 850) {
        const newWidth = Math.max(300, (screenWidth - 60) / 2);
        setDimensions({
          width: newWidth,
          height: newWidth * 1.375, // maintain 400:550 aspect ratio
        });
      } else {
        setDimensions({ width: 400, height: 550 });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const nextButtonClick = () => {
    if (bookRef.current) {
      bookRef.current.pageFlip().turnToNextPage();
    }
  };

  const prevButtonClick = () => {
    if (bookRef.current) {
      bookRef.current.pageFlip().turnToPrevPage();
    }
  };

  const onPage = (e) => {
    setPage(e.data);
  };

  return (
    <div className="viewer-container">
      <div className="viewer-header">
        <button onClick={onClose} className="close-btn">
          <X size={20} /> Close Book
        </button>
      </div>

      <Document 
        file={file} 
        onLoadSuccess={onDocumentLoadSuccess}
        loading={
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading document...</p>
          </div>
        }
        error={
          <div className="error-message">
            <X size={24} /> Failed to load PDF. Please try a different file.
          </div>
        }
      >
        {numPages && (
          <div className="book-wrapper">
            <HTMLFlipBook
              width={dimensions.width}
              height={dimensions.height}
              size="fixed"
              minWidth={300}
              maxWidth={500}
              minHeight={400}
              maxHeight={700}
              maxShadowOpacity={0.5}
              showCover={true}
              mobileScrollSupport={true}
              usePortrait={false}
              drawShadow={false}
              onFlip={onPage}
              ref={bookRef}
              className="flip-book"
            >
              {Array.from(new Array(numPages), (el, index) => (
                <PageContent key={`page_${index + 1}`} pageNumber={index + 1} width={dimensions.width} />
              ))}
            </HTMLFlipBook>
          </div>
        )}
      </Document>

      {numPages && (
        <div className="book-controls" style={{ marginTop: '2rem' }}>
          <button 
            className="control-btn" 
            onClick={prevButtonClick}
            disabled={page === 0}
          >
            <ChevronLeft size={28} />
          </button>
          
          <div className="page-info">
            {page + 1} / {numPages}
          </div>
          
          <button 
            className="control-btn" 
            onClick={nextButtonClick}
            disabled={page >= numPages - 1}
          >
            <ChevronRight size={28} />
          </button>
        </div>
      )}
    </div>
  );
}
