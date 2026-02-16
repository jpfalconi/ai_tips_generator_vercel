import React, { useEffect, useState } from 'react';
import { X, Clock, Loader2, Trash2 } from 'lucide-react';
import { ContentData } from '../types';

interface TipHistoryItem {
    id: number;
    title: string;
    content: ContentData;
    created_at: string;
}

interface HistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (data: ContentData) => void;
}

export default function HistoryModal({ isOpen, onClose, onSelect }: HistoryModalProps) {
    const [tips, setTips] = useState<TipHistoryItem[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchHistory();
        }
    }, [isOpen]);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/tips');
            if (res.ok) {
                const data = await res.json();
                setTips(data.tips);
            }
        } catch (error) {
            console.error('Error fetching history:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">

                <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <Clock className="text-falconi-primary" /> Histórico de Dicas
                    </h2>
                    <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full transition">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                            <Loader2 size={30} className="animate-spin mb-2 text-falconi-primary" />
                            <p>Carregando histórico...</p>
                        </div>
                    ) : tips.length === 0 ? (
                        <div className="text-center py-10 text-gray-400">
                            <Clock size={48} className="mx-auto mb-4 opacity-20" />
                            <p>Nenhuma dica salva ainda.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {tips.map((tip) => (
                                <div
                                    key={tip.id}
                                    onClick={() => { onSelect(tip.content); onClose(); }}
                                    className="group bg-white border border-gray-200 p-4 rounded-lg hover:border-falconi-primary hover:shadow-md cursor-pointer transition-all flex justify-between items-center"
                                >
                                    <div>
                                        <h3 className="font-bold text-gray-800 group-hover:text-falconi-primary transition-colors">
                                            {tip.title || 'Sem título'}
                                        </h3>
                                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                            {formatDate(tip.created_at)}
                                        </p>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1 bg-falconi-primary text-white text-xs rounded-full font-bold">
                                        Carregar
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-4 border-t bg-gray-50 text-xs text-center text-gray-500">
                    Dicas são salvas automaticamente ao gerar com IA ou manualmente.
                </div>
            </div>
        </div>
    );
}
