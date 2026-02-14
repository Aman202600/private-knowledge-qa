import React, { useState, useEffect } from 'react';
import axios from '../services/api';
const API = import.meta.env.VITE_API_URL;
import { RefreshCw, CheckCircle, XCircle, Clock, Database, Radio } from 'lucide-react';
import { clsx } from 'clsx';
import { toast } from 'react-hot-toast';

const StatusRow = ({ label, status, icon: Icon, detail }) => (
    <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
        <div className="flex items-center gap-3">
            <div className={clsx("p-2 rounded-md", status === 'healthy' || status === 'connected' ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600")}>
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <p className="font-medium text-gray-900">{label}</p>
                <p className="text-xs text-gray-500">{detail || (status === 'healthy' ? 'Operational' : 'Issue Detected')}</p>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <span className={clsx("inline-block w-2.5 h-2.5 rounded-full", status === 'healthy' || status === 'connected' ? "bg-green-500" : "bg-red-500 animate-pulse")} />
            <span className="text-sm font-medium capitalize text-gray-700">{status}</span>
        </div>
    </div>
);

const Status = () => {
    const [health, setHealth] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const checkHealth = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await axios.get(`${API}/api/health`); // Using axios interceptor handled in api.js
            setHealth(data);
            toast.success('System status updated');
        } catch (err) {
            setError('Backend Unreachable');
            setHealth(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkHealth();
        // Poll every 30s
        const interval = setInterval(checkHealth, 30000);
        return () => clearInterval(interval);
    }, []);

    const formatUptime = (seconds) => {
        if (!seconds) return '0s';
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        return `${hrs}h ${mins}m ${secs}s`;
    };

    return (
        <div className="max-w-2xl mx-auto py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">System Status</h1>
                    <p className="text-gray-500 text-sm mt-1">Real-time health monitoring</p>
                </div>
                <button
                    onClick={checkHealth}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                    <RefreshCw className={clsx("w-4 h-4", loading && "animate-spin")} />
                    Refresh
                </button>
            </div>

            <div className="space-y-4">
                {error ? (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-3">
                        <XCircle className="w-5 h-5 flex-shrink-0" />
                        <p className="text-sm font-medium">Could not connect to backend server. Ensure it is reachable.</p>
                    </div>
                ) : !health ? (
                    <div className="text-center py-12 text-gray-400">Loading status...</div>
                ) : (
                    <>
                        <StatusRow
                            label="Overall System"
                            status={health.status}
                            icon={CheckCircle}
                            detail="API Gateway"
                        />
                        <StatusRow
                            label="Database"
                            status={health.database}
                            icon={Database}
                            detail="MongoDB"
                        />
                        <StatusRow
                            label="LLM Connection"
                            status={health.llm_connection} // 'connected' or 'disconnected'
                            icon={Radio}
                            detail={health.llm_provider}
                        />

                        <div className="grid grid-cols-2 gap-4 mt-6">
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Uptime</p>
                                <div className="flex items-center justify-center gap-2 text-xl font-mono font-medium text-gray-900">
                                    <Clock className="w-5 h-5 text-blue-500" />
                                    {formatUptime(health.uptime_seconds)}
                                </div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Last Check</p>
                                <p className="text-sm text-gray-600 mt-1">
                                    {new Date().toLocaleTimeString()}
                                </p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Status;
