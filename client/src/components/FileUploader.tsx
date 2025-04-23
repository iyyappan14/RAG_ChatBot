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
  
  const processFiles = async (fileList: FileList) => {
    const filePromises = Array.from(fileList).map(async (file) => {
      // Create a unique ID for the file
      const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      
      // Read the file content
      let content = '';
      
      try {
        if (file.type.includes('image/')) {
          // For images, we'll just note it's an image
          content = '[This is an image file that needs OCR processing on the server]';
        } else {
          // For text documents, read as text
          content = await file.text();
        }
      } catch (error) {
        console.error('Error reading file:', error);
        content = 'Error reading file content';
      }
      
      return {
        id,
        name: file.name,
        size: file.size,
        type: file.type,
        content
      };
    });
    
    // Wait for all file processing to complete
    const files = await Promise.all(filePromises);
    
    // Send the processed files back
    onFileUpload(files);
    
    // Reset the input value to allow uploading the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
