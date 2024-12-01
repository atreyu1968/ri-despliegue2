import React, { useRef } from 'react';
import { Upload, Image as ImageIcon, FileText, X } from 'lucide-react';
import type { Action } from '../../../types/action';

interface AttachmentsProps {
  data: Partial<Action>;
  onChange: (data: Partial<Action>) => void;
}

const Attachments: React.FC<AttachmentsProps> = ({ data, onChange }) => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({ imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({
          documentUrl: reader.result as string,
          documentName: file.name,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Imagen
        </label>
        <div className="flex items-center space-x-4">
          {data.imageUrl ? (
            <div className="relative">
              <img
                src={data.imageUrl}
                alt="Vista previa"
                className="w-32 h-32 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => onChange({ imageUrl: undefined })}
                className="absolute -top-2 -right-2 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => imageInputRef.current?.click()}
              className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50"
            >
              <ImageIcon className="w-8 h-8 text-gray-400" />
              <span className="text-sm text-gray-500 mt-2">Subir imagen</span>
            </div>
          )}
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Documento
        </label>
        <div className="flex items-center space-x-4">
          {data.documentUrl ? (
            <div className="relative flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
              <div>
                <div className="text-sm font-medium">{data.documentName}</div>
                <div className="text-xs text-gray-500">Documento adjunto</div>
              </div>
              <button
                type="button"
                onClick={() => onChange({ documentUrl: undefined, documentName: undefined })}
                className="p-1 text-red-600 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => documentInputRef.current?.click()}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50"
            >
              <Upload className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-700">Subir documento</span>
            </div>
          )}
          <input
            ref={documentInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleDocumentChange}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
};

export default Attachments;