'use client';

import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/utils/axios';
import Link from 'next/link';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Alert from '@/components/Alert';

interface LlmInteraction {
  id: string;
  documentId: string;
  question: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
}

interface Document {
  id: string;
  userId: string;
  filename: string;
  fileData: Uint8Array;
  ocrText: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  llmInteractions: LlmInteraction[];
}

const DocumentsPage = () => {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedDocId, setExpandedDocId] = useState<string | null>(null);

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

  const toggleExpand = (id: string) => {
    setExpandedDocId(expandedDocId === id ? null : id);
  };

  return (
    <div className="container mx-auto p-4">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4">Meus Documentos</h1>
      {loading ? (
        <div className="flex justify-center">
          <button className="btn btn-ghost loading">Carregando...</button>
        </div>
      ) : error ? (
        <Alert message={error} type="error" />
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
                <React.Fragment key={doc.id}>
                  <tr>
                    <td>{doc.filename}</td>
                    <td>{new Date(doc.createdAt).toLocaleString()}</td>
                    <td>{doc.status}</td>
                    <td className="flex space-x-2">
                      <button
                        onClick={() => toggleExpand(doc.id)}
                        className="btn btn-sm btn-info"
                      >
                        {expandedDocId === doc.id ? 'Recolher' : 'Expandir'}
                      </button>
                      <button
                        onClick={() => handleDownload(doc.id, doc.filename)}
                        className="btn btn-sm btn-primary"
                      >
                        Baixar
                      </button>
                      <Link
                        href={`/documents/interact?id=${doc.id}`}
                        className="btn btn-sm btn-secondary"
                      >
                        Interagir
                      </Link>
                    </td>
                  </tr>
                  {expandedDocId === doc.id && (
                    <tr>
                      <td colSpan={4}>
                        <div className="p-4 bg-gray-100 rounded">
                          <h3 className="text-xl font-semibold">Texto Extraído:</h3>
                          <pre className="whitespace-pre-wrap bg-white p-2 rounded mt-2">
                            {doc.ocrText}
                          </pre>
                          <h3 className="text-xl font-semibold mt-4">Interações LLM:</h3>
                          {doc.llmInteractions.length === 0 ? (
                            <p className="mt-2">Nenhuma interação encontrada.</p>
                          ) : (
                            <div className="mt-2 space-y-4">
                              {doc.llmInteractions.map((interaction) => (
                                <div key={interaction.id} className="border rounded p-2 bg-white">
                                  <p>
                                    <strong>Pergunta:</strong> {interaction.question}
                                  </p>
                                  <p className="mt-1">
                                    <strong>Resposta:</strong> {interaction.answer}
                                  </p>
                                  <p className="text-sm text-gray-500 mt-1">
                                    Respondido em: {new Date(interaction.createdAt).toLocaleString()}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DocumentsPage;