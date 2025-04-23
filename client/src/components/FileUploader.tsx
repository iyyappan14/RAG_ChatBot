import { useRef, useState } from "react";
import { Upload } from "lucide-react";
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
    const files: UploadedFile[] = Array.from(fileList).map((file) => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type
    }));
    
    onFileUpload(files);
    
    // Reset the input value to allow uploading the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <div className="mb-6">
      <div 
        className={`upload-zone rounded-lg p-6 cursor-pointer ${isDragging ? 'drag-over' : ''}`}
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <i className="ri-upload-cloud-2-line text-3xl text-primary mb-2"></i>
          <p className="text-gray-600 mb-1">Drag files here or</p>
          <button className="text-primary font-medium hover:text-primary/80 focus:outline-none">
            Browse files
          </button>
          <p className="text-gray-500 text-sm mt-2">PDF, Word, or Image files</p>
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
