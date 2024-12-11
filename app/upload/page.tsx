// app/upload/page.tsx
'use client';

import { useState, useContext, useEffect, useCallback, useMemo } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '@/utils/axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import FileInput from '@/components/FileInput';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaCheckCircle } from 'react-icons/fa'; // Importação do ícone de checkmark
import axios from 'axios';

const MESSAGES = {
  uploadSuccess: 'Documento uploadado com sucesso!',
  uploadCompleted: 'Documento processado e concluído com sucesso!',
  uploadPending: 'Documento está sendo processado. Verifique mais tarde.',
  noFileSelected: 'Nenhum arquivo selecionado.',
  invalidFileType: 'Tipo de arquivo inválido. Apenas JPEG, PNG e PDF são permitidos.',
  fileTooLarge: 'O arquivo selecionado excede o tamanho máximo de 5MB.',
  uploadError: 'Erro ao fazer upload do documento',
  fetchStatusError: 'Erro ao verificar o status do documento',
};

const UploadPage = () => {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadedDocumentId, setUploadedDocumentId] = useState<string | null>(null); // Estado para armazenar o ID do documento
  const [verifyingStatus, setVerifyingStatus] = useState(false); // Estado para verificar o status do documento
  const [uploadCompleted, setUploadCompleted] = useState(false); // Novo estado para indicar upload concluído

  // Limitações
  const MAX_FILE_SIZE = useMemo(() => 5 * 1024 * 1024, []); // 5MB
  const allowedTypes = useMemo(() => ['image/jpeg', 'image/png', 'application/pdf'], []);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files ? e.target.files[0] : null;

      // Limite de tamanho
      if (selectedFile && selectedFile.size > MAX_FILE_SIZE) {
        setError(MESSAGES.fileTooLarge);
        setFile(null);
        return;
      }

      // Verificação de tipo
      if (selectedFile && !allowedTypes.includes(selectedFile.type)) {
        setError(MESSAGES.invalidFileType);
        setFile(null);
        return;
      }

      setFile(selectedFile);
      setMessage(null);
      setError(null);
      setProgress(0);
      setUploadCompleted(false); // Resetar indicador de upload concluído
    },
    [MAX_FILE_SIZE, allowedTypes]
  );

  // Função para verificar o status do documento
  const verifyDocumentStatus = useCallback(async (documentId: string) => {
    setVerifyingStatus(true);
    try {
      const response = await api.get(`/documents/${documentId}`);
      const docStatus = response.data.status;

      if (docStatus === 'COMPLETED') {
        setMessage(MESSAGES.uploadCompleted);
        setUploadCompleted(true); // Atualizar indicador de upload concluído
      } else {
        setMessage(MESSAGES.uploadPending);
        setUploadCompleted(false);
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(MESSAGES.fetchStatusError);
      } else {
        setError('Erro desconhecido ao verificar o status do documento');
      }
    } finally {
      setVerifyingStatus(false);
    }
  }, []);

  const handleUpload = useCallback(async () => {
    if (!file) {
      setError(MESSAGES.noFileSelected);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    setMessage(null);
    setError(null);
    setUploadCompleted(false); // Resetar indicador de upload concluído

    try {
      const response = await api.post('/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          setProgress(percentCompleted);
        },
      });

      if (response.status === 200) {
        setUploadedDocumentId(response.data.id); // Armazenar o ID do documento
        // Resetar o input de arquivo
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        // Verificar o status do documento
        await verifyDocumentStatus(response.data.id);
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || MESSAGES.uploadError);
      } else {
        setError('Erro desconhecido ao fazer upload do documento');
      }
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }, [file, verifyDocumentStatus]);

  const handleInteract = () => {
    if (uploadedDocumentId) {
      router.push(`/documents/interact?id=${uploadedDocumentId}`);
    }
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
    }
    if (error) {
      toast.error(error);
    }
  }, [message, error]);

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
        <div className="w-full max-w-md p-6 bg-base-100 rounded shadow space-y-6">
          <h2 className="text-2xl font-bold text-center text-primary">Upload de Documento</h2>

          {/* Component de Input */}
          <FileInput handleFileChange={handleFileChange} file={file} />

          {/* Progresso de Upload */}
          {uploading && (
            <div className="flex items-center space-x-2">
              <progress
                className="progress progress-primary w-full"
                value={progress}
                max="100"
              ></progress>
              <span>{progress}%</span>
            </div>
          )}

          {/* Indicador Visual de Sucesso */}
          {uploadCompleted && (
            <div className="flex items-center text-green-500">
              <FaCheckCircle className="mr-2" size={20} />
              <span>Upload concluído com sucesso!</span>
            </div>
          )}

          {/* Botão de Upload */}
          <button
            onClick={handleUpload}
            className={`btn btn-primary w-full ${uploading ? 'loading' : ''}`}
            disabled={uploading || !file}
          >
            {uploading ? 'Carregando...' : 'Upload'}
          </button>

          {/* Botão para Interagir */}
          {uploadedDocumentId && uploadCompleted && (
            <button
              onClick={handleInteract}
              className="btn btn-secondary w-full"
            >
              Interagir com o Documento
            </button>
          )}

          {/* Informações sobre o status do upload */}
          {verifyingStatus && (
            <div className="flex items-center space-x-2">
              <div className="spinner-border animate-spin inline-block w-4 h-4 border-2 border-blue-500 rounded-full" role="status">
                <span className="visually-hidden">Carregando...</span>
              </div>
              <span>Verificando status do documento...</span>
            </div>
          )}

          {/* Links adicionais */}
          <div className="text-center">
            <Link href="/documents" className="text-primary hover:underline">
              Ver meus documentos
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadPage;