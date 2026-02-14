import React, { useState, useEffect, useRef } from 'react';
import axios from '../services/api';
import { Upload as UploadIcon, FileText, Trash2, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { clsx } from 'clsx';

const API = import.meta.env.VITE_API_URL || "";

const Upload = () => {
    const [documents, setDocuments] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [loadingDocs, setLoadingDocs] = useState(true);
    const [progress, setProgress] = useState(0);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            const res = await axios.get(`${API}/api/documents`);
            setDocuments(res.documents || []);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load documents');
        } finally {
            setLoadingDocs(false);
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            validateAndUpload(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            validateAndUpload(e.target.files[0]);
        }
    };

    const validateAndUpload = async (file) => {
        // 1. Validate Type (TXT + PDF)
        const allowedTypes = ['text/plain', 'application/pdf'];
        const allowedExtensions = ['.txt', '.pdf'];

        const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));

        if (
            !allowedTypes.includes(file.type) &&
            !allowedExtensions.includes(fileExtension)
        ) {
            toast.error('Only .txt and .pdf files are supported');
            return;
        }
        // 2. Validate Size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('File size must be under 5MB');
            return;
        }

        // 3. Upload
        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        setProgress(0);

        try {
            const res = await axios.post(`${API}/api/documents/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setProgress(percentCompleted);
                },
            });

            toast.success(`Uploaded ${res.filename} successfully`);
            fetchDocuments(); // Refresh list
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.error || 'Upload failed';
            toast.error(msg);
        } finally {
            setUploading(false);
            setProgress(0);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this document?')) return;

        try {
            await axios.delete(`${API}/api/documents/${id}`);
            toast.success('Document deleted');
            setDocuments(documents.filter((doc) => doc.id !== id));
        } catch (err) {
            console.error(err);
            toast.error('Failed to delete document');
        }
    };

    // Format bytes
    const formatBytes = (bytes, decimals = 2) => {
        if (!+bytes) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    };

    return (
        <div className="max-w-3xl mx-auto py-8 space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Document Management</h1>
                <p className="text-gray-500">Upload documents to your knowledge base.</p>
            </div>

            {/* Upload Zone */}
            <div
                className={clsx(
                    "border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center transition-colors cursor-pointer bg-gray-50",
                    dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400",
                    uploading && "opacity-50 pointer-events-none"
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".txt,.pdf"
                    onChange={handleChange}
                />

                {uploading ? (
                    <div className="w-full max-w-xs space-y-4">
                        <Loader2 className="w-10 h-10 text-blue-500 animate-spin mx-auto" />
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs font-medium text-gray-600">
                                <span>Uploading...</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="p-4 bg-white rounded-full shadow-sm mb-4">
                            <UploadIcon className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">Click to upload or drag and drop</h3>
                        <p className="text-sm text-gray-500 mt-1">.txt and .pdf files only (max 5MB)</p>
                    </>
                )}
            </div>

            {/* Document List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <h3 className="font-medium text-gray-900">Your Documents</h3>
                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">
                        {documents.length} Files
                    </span>
                </div>

                {loadingDocs ? (
                    <div className="p-8 text-center text-gray-400">Loading documents...</div>
                ) : documents.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
                            <FileText className="w-6 h-6 text-gray-400" />
                        </div>
                        <h3 className="text-base font-medium text-gray-900">No documents yet</h3>
                        <p className="text-sm text-gray-500 mt-1">Upload a file to get started</p>
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-100">
                        {documents.map((doc) => (
                            <li key={doc.id} className="px-6 py-4 hover:bg-gray-50 transition-colors flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900 truncate max-w-xs sm:max-w-md" title={doc.filename}>
                                            {doc.filename}
                                        </h4>
                                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                            <span>{new Date(doc.uploaded_at).toLocaleDateString()}</span>
                                            <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                            <span>{doc.chunk_count} Chunks</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(doc.id)}
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                                    title="Delete Document"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Upload;
