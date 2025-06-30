import React, { useState, useCallback } from 'react';
import { UploadCloud, FileText, FileVideo, FileImage, XCircle } from 'lucide-react';

export default function FileUpload({ files, setFiles, submit }) {
  // const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [fileCount, setFC] = useState(0);
  const [fileError, setFileError] = useState(null);

  // Function to handle file input change
  const handleFileChange = useCallback((event) => {
    const newSelectedFiles = Array.from(event.target.files);
    if (newSelectedFiles.length === 0) return;
    setFileError(null)
    if (newSelectedFiles.length > 10) {
      setFileError('Files cannot be more than 10')
      console.error('Files cannot be more than 10')
    }
    console.log(newSelectedFiles)
    submit(true) && console.log('submit button enabled');
    const updatedFiles = [...files, ...newSelectedFiles].slice(0, 10).filter(x => {
      const sizeLT15 = x.size <= 1024 * 1024 * 15
      if (!sizeLT15) {
        submit(false);
        setFileError('File size should be less than 15 MB')
        console.error('File size should be less than 15 MB')
      }
      return sizeLT15
    }
    );
    setFiles(updatedFiles);
    setFC(updatedFiles.length)

    // Generate previews for the newly selected files
    const newFilePreviews = [];
    newSelectedFiles.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          newFilePreviews.push(e.target.result);
          // Only update state once all new previews are generated
          if (newFilePreviews.length === newSelectedFiles.length) {
            setPreviews(prevPreviews => [...prevPreviews, ...newFilePreviews]);
          }
        };
        reader.readAsDataURL(file);
      } else if (file.type.startsWith('video/')) {
        newFilePreviews.push('video'); // Placeholder for video
        if (newFilePreviews.length === newSelectedFiles.length) {
          setPreviews(prevPreviews => [...prevPreviews, ...newFilePreviews]);
        }
      } else {
        newFilePreviews.push('document'); // Placeholder for other document types
        if (newFilePreviews.length === newSelectedFiles.length) {
          setPreviews(prevPreviews => [...prevPreviews, ...newFilePreviews]);
        }
      }
    });
  }, [files]);

  // Function to remove a file by its index
  const removeFile = useCallback((indexToRemove) => {
    setFiles(currentFiles => currentFiles.filter((_, index) => index !== indexToRemove));
    setFC(files.length)
    setPreviews(currentPreviews => currentPreviews.filter((_, index) => index !== indexToRemove));
  }, []);

  // Function to open the file input dialog
  const openFileBrowser = useCallback(() => {
    document.getElementById('file-input').click();
  }, []);

  // Function to get the appropriate icon based on file type
  const getFileIcon = useCallback((fileType, previewUrl) => {
    if (fileType.startsWith('image/')) {
      return <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '0.375rem' }} />;
    } else if (fileType.startsWith('video/')) {
      return <FileVideo style={{ width: '3rem', height: '3rem', color: '#9ca3af' }} />;
    } else {
      return <FileText style={{ width: '3rem', height: '3rem', color: '#9ca3af' }} />;
    }
  }, []);


  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ backgroundColor: '#ffffff', borderRadius: '0.5rem', width: '100%' }}>
        {/* File Upload Section */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div
            style={{
              border: `2px ${!isDragOver ? 'rgb(225, 229, 233)' : '#d1d5db'} solid`,
              // borderRadius: '0.5rem',
              padding: '1.5rem',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'border-color 0.2s ease-in-out',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column',
              borderRadius: '5px',
              backgroundColor: 'rgb(248, 249, 250)'
            }}
            onClick={openFileBrowser}
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragOver(true); }}
            onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragOver(false); }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsDragOver(false);
              handleFileChange({ target: { files: e.dataTransfer.files } });
            }}
          >
            <input
              id="file-input"
              type="file"
              multiple
              accept="image/*,video/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/plain"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <UploadCloud style={{ display: 'block', margin: '0', width: '4rem', height: '4rem', color: '#9ca3af', marginBottom: '0.5rem' }} />
            <p style={{ color: '#4b5563', fontWeight: '500' }}>Drag & Drop or <span style={{ color: '#2563eb', fontWeight: '600' }}>Browse Files</span></p>
            {fileError && <p style={{ color: 'red', marginBottom: 0 }}>
              {fileError}
            </p>}
            <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: 0 }}>(Max 15MB per file)</p>

          </div>

          {files.length > 0 && (
            <div style={{
              marginTop: '1.5rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '1rem',
              gridTemplateRows: '1fr min-content'
            }}>
              {files.map((file, index) => (
                <div key={file.name + index} style={{ position: 'relative', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '0.75rem', display: 'flex', alignItems: 'center', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                  <div style={{ flexShrink: '0', width: '4rem', height: '4rem', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6', borderRadius: '0.375rem', overflow: 'hidden' }}>
                    {getFileIcon(file.type, previews[index])}
                  </div>
                  <div style={{ marginLeft: '1rem', flexGrow: '1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1f2937', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</p>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>{Math.round(file.size / 1024)} KB</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    style={{
                      position: 'absolute',
                      top: '0.25rem',
                      right: '0.25rem',
                      color: '#9ca3af',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '0',
                      transition: 'color 0.2s ease-in-out'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                    aria-label={`Remove ${file.name}`}
                  >
                    <XCircle style={{ width: '1.25rem', height: '1.25rem' }} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

