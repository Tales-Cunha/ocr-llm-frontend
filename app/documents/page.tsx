'use client';

import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/utils/axios';
import Link from 'next/link';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

interface Document {
  id: string;
  filename: string;
  extractedText: string;
  status: string;
  createdAt: string;
}

const DocumentsPage = () => {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else {
      fetchDocuments();
    }
  }, [user, router]);

  const fetchDocuments = async () => {
    try {
      const response = await api.get('/documents');
      setDocuments(response.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Erro ao buscar documentos');
      } else {
        setError('Erro desconhecido ao buscar documentos');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (id: string, filename: string) => {
    try {
      const response = await api.get(`/documents/${id}/download-full`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'text/plain' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${filename}-full.txt`); // Nome correto do arquivo
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      toast.success('Download do documento completo iniciado!');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || 'Erro ao baixar documento completo');
      } else {
        toast.error('Erro desconhecido ao baixar documento completo');
      }
    }
  };

  return (
    <div className="min-h-screen bg-base-200 py-8">
      <div className="container mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center text-primary">Meus Documentos</h1>
        {loading ? (
          <div className="flex justify-center">
            <button className="btn btn-ghost loading">Carregando...</button>
          </div>
        ) : error ? (
          <div className="alert alert-error">{error}</div>
        ) : documents.length === 0 ? (
          <p className="text-center">Nenhum documento encontrado.</p>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="table w-full bg-base-100">
              <thead>
                <tr>
                  <th>Arquivo</th>
                  <th>Data de Upload</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id}>
                    <td>{doc.filename}</td>
                    <td>{new Date(doc.createdAt).toLocaleString()}</td>
                    <td>{doc.status}</td>
                    <td>
                      <button
                        onClick={() => handleDownload(doc.id, doc.filename)}
                        className="btn btn-sm btn-primary mr-2"
                      >
                        Baixar
                      </button>
                      <Link
                        href={`/documents/interact?id=${doc.id}`}
                        className="btn btn-sm btn-secondary mr-2"
                      >
                        Interagir
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentsPage;