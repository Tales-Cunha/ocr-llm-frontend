// app/documents/interact/page.tsx
'use client';

import { useState, useContext, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthContext } from '../../context/AuthContext';
import api from '@/utils/axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

interface Message {
  question: string;
  answer: string;
}

interface Interaction {
  id: string;
  question: string;
  answer: string;
  createdAt: string;
}

interface CustomDocument {
  id: string;
  filename: string;
  ocrText: string;
  llmInteractions: Interaction[];
  status: string;
  createdAt: string;
}

const DocumentInteractPage = () => {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const searchParams = useSearchParams();
  const documentId = searchParams.get('id');

  const [customDocument, setCustomDocument] = useState<CustomDocument | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (documentId) {
      fetchDocument();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, router, documentId]);

  const fetchDocument = async () => {
    try {
      const response = await api.get(`/documents/${documentId}`);
      setCustomDocument(response.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || 'Erro ao carregar documento');
      } else {
        toast.error('Erro desconhecido ao carregar documento');
      }
    }
  };

  const handleSend = async () => {
    if (!query || !documentId) return;

    setLoading(true);

    try {
      const response = await api.post(`/documents/${documentId}/query`, { question: query });
      const { question, answer } = response.data;
      setMessages((prevMessages) => [...prevMessages, { question, answer }]);
      setQuery('');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || 'Erro ao obter resposta');
      } else {
        toast.error('Erro desconhecido ao obter resposta');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadOriginal = useCallback(async () => {
    if (!documentId || !customDocument) return;

    setDownloadLoading(true);

    try {
      const response = await api.get(`/documents/${documentId}/download-full`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'text/plain' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${customDocument.filename}.txt`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      toast.success('Download do TXT iniciado!');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || 'Erro ao baixar TXT');
      } else {
        toast.error('Erro desconhecido ao baixar TXT');
      }
    } finally {
      setDownloadLoading(false);
    }
  }, [documentId, customDocument]);

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen bg-base-200 py-8">
        <div className="container mx-auto space-y-8">
          <h1 className="text-3xl font-bold text-center text-primary">Interagir com o Documento</h1>
          {customDocument ? (
            <div className="bg-base-100 p-6 rounded shadow space-y-6">
              {/* Seção de Download */}
              <div className="flex space-x-4">
                <button
                  onClick={handleDownloadOriginal}
                  className={`btn btn-secondary ${downloadLoading ? 'loading' : ''}`}
                  disabled={downloadLoading}
                >
                  Baixar conversa em TXT
                </button>
              </div>

              {/* Texto Extraído */}
              <div>
                <h2 className="text-xl font-semibold mb-2">Texto Extraído:</h2>
                <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded h-60 overflow-y-auto">
                  {customDocument.ocrText}
                </pre>
              </div>

              {/* Campo de Pergunta e Botão Enviar */}
              <div className="flex space-x-4">
                <input
                  type="text"
                  placeholder="Digite sua pergunta"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="input input-bordered w-full"
                />
                <button
                  onClick={handleSend}
                  className={`btn btn-primary ${loading ? 'loading' : ''}`}
                  disabled={loading}
                >
                  {loading ? 'Enviando...' : 'Enviar'}
                </button>
              </div>

              {/* Mensagens de Interação */}
              <div className="space-y-4">
                {messages.map((msg, index) => (
                  <div key={index} className="space-y-2">
                    <div className="chat chat-start">
                      <div className="chat-bubble chat-bubble-primary">
                        <strong>Pergunta:</strong> {msg.question}
                      </div>
                    </div>
                    <div className="chat chat-end">
                      <div className="chat-bubble chat-bubble-secondary">
                        <strong>Resposta:</strong> {msg.answer}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <button className="btn btn-ghost loading">Carregando documento...</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DocumentInteractPage;