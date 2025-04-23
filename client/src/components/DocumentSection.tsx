import FileUploader from "@/components/FileUploader";
import FileList from "@/components/FileList";
import { UploadedFile } from "@/pages/DocumentAnalyzer";

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
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-secondary mb-4">Documents</h2>
        
        <FileUploader onFileUpload={onFileUpload} />
        
        <FileList 
          files={uploadedFiles} 
          onRemove={onFileRemove} 
        />
      </div>
    </div>
  );
}
