import { UploadedFile } from "@/pages/DocumentAnalyzer";
import { formatFileSize, getFileTypeIcon } from "@/lib/utils";
import { Trash2 } from "lucide-react";

interface FileListProps {
  files: UploadedFile[];
  onRemove: (fileId: string) => void;
}

export default function FileList({ files, onRemove }: FileListProps) {
  return (
    <div>
      <h3 className="text-sm font-medium text-gray-700 mb-3">Uploaded Files</h3>
      
      {files.length > 0 ? (
        <div className="space-y-3">
          {files.map((file) => {
            const { icon, bgColor, iconColor } = getFileTypeIcon(file.name);
            
            return (
              <div 
                key={file.id} 
                className="bg-gray-50 rounded-md p-3 flex items-center justify-between group"
              >
                <div className="flex items-center">
                  <div className={`w-9 h-9 rounded-md ${bgColor} flex items-center justify-center mr-3`}>
                    <i className={`${icon} ${iconColor} text-xl`}></i>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button 
                  className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onRemove(file.id)}
                  aria-label="Remove file"
                >
                  <i className="ri-delete-bin-line"></i>
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">No files uploaded yet</p>
        </div>
      )}
    </div>
  );
}
