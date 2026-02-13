import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { Send, Loader2, BookOpen, Type, ExternalLink } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { clsx } from 'clsx';

const Query = () => {
    const [question, setQuestion] = useState('');
    const [activeQuery, setActiveQuery] = useState(false);
    const [answer, setAnswer] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingMsg, setLoadingMsg] = useState('Thinking...');
    const [hasDocs, setHasDocs] = useState(true);
    const answerRef = useRef(null);

    useEffect(() => {
        // Check if we have docs, otherwise disable input
        api.get('/api/documents').then((res) => {
            if (!res.documents || res.documents.length === 0) {
                setHasDocs(false);
                toast('Upload some documents first!', { icon: '📂' });
            }
        }).catch(() => { });
    }, []);

    useEffect(() => {

        let timer;
        if (loading) {
            setLoadingMsg('Thinking...');
            timer = setTimeout(() => {
                setLoadingMsg('Still working on it...');
            }, 5000);
        }
        return () => clearTimeout(timer);
    }, [loading]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!question.trim()) return;

        setLoading(true);
        setAnswer(null);
        setActiveQuery(true);

        try {
            const res = await api.post('/api/query', {
                question,
                top_k: 3 // As requested
            });
            setAnswer(res);
            // Determine if we should scroll
            setTimeout(() => {
                answerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.error || 'Failed to get answer');
        } finally {
            setLoading(false);
        }
    };

    const SimilarityBar = ({ score }) => {
        // Score is 0-1 usually
        const percentage = Math.round(score * 100);
        // Color based on confidence
        let colorClass = "bg-red-500";
        if (percentage > 70) colorClass = "bg-green-500";
        else if (percentage > 40) colorClass = "bg-yellow-500";

        return (
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                <div className={clsx("h-1.5 rounded-full", colorClass)} style={{ width: `${percentage}%` }} />
            </div>
        );
    };

    return (
        <div className="max-w-3xl mx-auto py-8">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-gray-900">Ask your Knowledge Base</h1>
                <p className="text-gray-500 mt-2">Get precise answers based only on your uploaded documents.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 sticky top-24 z-10 transition-shadow hover:shadow-lg">
                <form onSubmit={handleSubmit} className="relative">
                    <textarea
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        disabled={!hasDocs || loading}
                        placeholder={hasDocs ? "e.g., What are the key findings in the report?" : "Please upload documents first."}
                        className="w-full min-h-[120px] p-4 pr-32 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-800 placeholder-gray-400 text-lg"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit(e);
                            }
                        }}
                    />
                    <div className="absolute bottom-4 right-4 flex items-center gap-2">
                        {!hasDocs && (
                            <span className="text-xs text-red-500 font-medium bg-red-50 px-2 py-1 rounded">No Docs</span>
                        )}
                        <button
                            type="submit"
                            disabled={!question.trim() || !hasDocs || loading}
                            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                            {loading ? 'Asking...' : 'Ask'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="mt-10 space-y-8" ref={answerRef}>
                {loading && (
                    <div className="text-center py-12 animate-pulse">
                        <div className="inline-block p-4 bg-blue-50 rounded-full mb-4">
                            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                        </div>
                        <p className="text-lg font-medium text-gray-900">{loadingMsg}</p>
                        <p className="text-sm text-gray-500">Searching through vector embeddings...</p>
                    </div>
                )}

                {answer && !loading && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Answer Card */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-8">
                            <div className="px-6 py-4 bg-blue-50 border-b border-blue-100 flex items-center gap-2">
                                <Type className="w-5 h-5 text-blue-600" />
                                <h3 className="font-semibold text-blue-900">AI Answer</h3>
                            </div>
                            <div className="p-8 prose prose-blue max-w-none text-gray-800 leading-relaxed whitespace-pre-wrap">
                                {answer.answer}
                            </div>
                        </div>

                        {/* Sources */}
                        {answer.sources && answer.sources.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-gray-500" />
                                    Sources Used
                                </h3>
                                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                    {answer.sources.map((source, idx) => (
                                        <div key={idx} className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all text-sm flex flex-col h-full">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-semibold truncate max-w-[150px]" title={source.filename}>
                                                    {source.filename}
                                                </span>
                                                <span className="text-xs font-mono text-gray-400">
                                                    Sim: {source.similarity_score.toFixed(2)}
                                                </span>
                                            </div>

                                            <div className="flex-1 bg-gray-50 p-3 rounded text-gray-600 italic text-xs mb-3 overflow-y-auto max-h-32 border border-gray-100">
                                                "{source.chunk_text}..."
                                            </div>

                                            <div className="mt-auto">
                                                <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
                                                    <span>Relevance Match</span>
                                                    <span>{Math.round(source.similarity_score * 100)}%</span>
                                                </div>
                                                <SimilarityBar score={source.similarity_score} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Query;
