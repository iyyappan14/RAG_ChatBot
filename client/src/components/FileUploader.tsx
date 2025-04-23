import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { UploadedFile } from "@/pages/DocumentAnalyzer";
import { formatFileSize } from "@/lib/utils";

interface FileUploaderProps {
  onFileUpload: (files: UploadedFile[]) => void;
}

export default function FileUploader({ onFileUpload }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (fileList) {
      processFiles(fileList);
    }
  };
  
  const handleClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const dt = e.dataTransfer;
    const fileList = dt.files;
    
    if (fileList) {
      processFiles(fileList);
    }
  };
  
  const processFiles = (fileList: FileList) => {
    // Create an array to store file reading promises
    const filePromises = Array.from(fileList).map(file => {
      return new Promise<UploadedFile>((resolve) => {
        // Create a unique ID for the file
        const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        
        // Create file reader
        const reader = new FileReader();
        
        // Set up onload callback
        reader.onload = (e) => {
          let content = '';
          
          if (e.target && e.target.result) {
            // Handle different file types
            if (typeof e.target.result === 'string') {
              content = e.target.result;
            } else {
              // For binary data, convert to string
              const bytes = new Uint8Array(e.target.result);
              let binary = '';
              for (let i = 0; i < bytes.byteLength; i++) {
                binary += String.fromCharCode(bytes[i]);
              }
              content = binary;
            }
          }
          
          resolve({
            id,
            name: file.name,
            size: file.size,
            type: file.type,
            content
          });
        };
        
        // Set up error handling
        reader.onerror = () => {
          console.error('Error reading file:', file.name);
          
          resolve({
            id,
            name: file.name,
            size: file.size,
            type: file.type,
            content: `Error reading file: ${file.name}`
          });
        };
        
        // Read the file according to its type
        if (file.type.includes('image/')) {
          // For images, read as data URL
          reader.readAsDataURL(file);
        } else if (file.type.includes('pdf') || 
                  file.type.includes('doc') || 
                  file.name.endsWith('.txt')) {
          // For text-like documents
          reader.readAsText(file);
        } else {
          // Default to text for unknown types
          reader.readAsText(file);
        }
      });
    });
    
    // Process all files and update state
    Promise.all(filePromises)
      .then(files => {
        // Send uploaded files to parent component
        onFileUpload(files);
        
        // Reset the input to allow uploading the same file again
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      })
      .catch(error => {
        console.error('Error processing files:', error);
      });
  };
  
  return (
    <div className="mb-6">
      <div 
        className={`upload-zone rounded-lg p-6 cursor-pointer border-2 border-dashed 
          ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-200'} 
          hover:border-primary hover:bg-primary/5 transition-colors duration-150`}
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <UploadCloud className="h-7 w-7 text-primary" />
          </div>
          <p className="text-gray-600 mb-1">Drag files here or</p>
          <button className="text-primary font-medium hover:text-primary/80 focus:outline-none">
            Browse files
          </button>
          <p className="text-gray-500 text-xs mt-2">PDF, Word, or Image files</p>
          <input 
            type="file" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple 
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" 
          />
        </div>
      </div>
    </div>
  );
}
