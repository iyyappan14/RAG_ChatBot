import { UploadedFile } from "@/pages/DocumentAnalyzer";
import { formatFileSize, getFileTypeIcon } from "@/lib/utils";
import { Trash2, FileText, FileImage, File } from "lucide-react";

interface FileListProps {
  files: UploadedFile[];
  onRemove: (fileId: string) => void;
}

export default function FileList({ files, onRemove }: FileListProps) {
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    
    if (['pdf'].includes(extension)) {
      return <File className="h-5 w-5 text-primary" />;
    } else if (['doc', 'docx'].includes(extension)) {
      return <FileText className="h-5 w-5 text-blue-600" />;
    } else if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'].includes(extension)) {
      return <FileImage className="h-5 w-5 text-green-600" />;
    }
    
    return <FileText className="h-5 w-5 text-gray-600" />;
  };
  
  return (
    <div>
      <h3 className="text-sm font-medium text-secondary mb-3 flex items-center">
        <span className="bg-secondary/10 text-secondary text-xs px-2 py-0.5 rounded mr-2">
          {files.length}
        </span>
        Uploaded Files
      </h3>
      
      {files.length > 0 ? (
        <div className="space-y-2">
          {files.map((file) => {
            const { bgColor } = getFileTypeIcon(file.name);
            
            return (
              <div 
                key={file.id} 
                className="bg-gray-50 border border-gray-100 rounded-md p-3 flex items-center justify-between group hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center">
                  <div className={`w-9 h-9 rounded-full ${bgColor} flex items-center justify-center mr-3`}>
                    {getFileIcon(file.name)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button 
                  className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                  onClick={() => onRemove(file.id)}
                  aria-label="Remove file"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-4 p-4 text-center border border-dashed border-gray-200 rounded-md">
          <p className="text-sm text-gray-500">No files uploaded yet</p>
        </div>
      )}
    </div>
  );
}
