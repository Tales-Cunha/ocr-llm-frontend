import React from 'react';

interface FileInputProps {
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  file: File | null;
}

const FileInput: React.FC<FileInputProps> = ({ handleFileChange, file }) => (
  <div className="form-control">
    <label htmlFor="file-upload" className="label">
      <span className="label-text">Selecione um arquivo</span>
    </label>
    <input
      id="file-upload"
      name="file-upload"
      type="file"
      accept="image/*,application/pdf"
      onChange={handleFileChange}
      className="file-input file-input-bordered w-full"
    />
    {file && (
      <div className="mt-2 text-sm text-gray-700">
        <p><strong>Arquivo Selecionado:</strong> {file.name}</p>
        <p><strong>Tamanho:</strong> {(file.size / 1024 / 1024).toFixed(2)} MB</p>
      </div>
    )}
  </div>
);

export default FileInput;