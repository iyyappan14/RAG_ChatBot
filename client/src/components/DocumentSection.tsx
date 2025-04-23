import FileUploader from "@/components/FileUploader";
import FileList from "@/components/FileList";
import { UploadedFile } from "@/pages/DocumentAnalyzer";
import { FileIcon } from "lucide-react";

interface DocumentSectionProps {
  uploadedFiles: UploadedFile[];
  onFileUpload: (files: UploadedFile[]) => void;
  onFileRemove: (fileId: string) => void;
}

export default function DocumentSection({ 
  uploadedFiles, 
  onFileUpload, 
  onFileRemove 
}: DocumentSectionProps) {
  return (
    <div className="lg:w-1/3 mb-6 lg:mb-0">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-secondary text-white p-4 flex items-center">
          <FileIcon className="w-5 h-5 mr-2" />
          <h2 className="text-lg font-medium">Documents</h2>
        </div>
        
        <div className="p-5">
          <FileUploader onFileUpload={onFileUpload} />
          
          <FileList 
            files={uploadedFiles} 
            onRemove={onFileRemove} 
          />
        </div>
      </div>
    </div>
  );
}
