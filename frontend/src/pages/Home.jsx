import React from 'react';
import { Link } from 'react-router-dom';
import { UploadCloud, Search, ShieldCheck } from 'lucide-react';

const Card = ({ icon: Icon, title, description, to, buttonText }) => (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col items-start gap-4 h-full">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Icon className="w-6 h-6" />
        </div>
        <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">{description}</p>
        </div>
        <div className="mt-auto w-full">
            <Link
                to={to}
                className="block w-full py-2.5 px-4 bg-gray-900 hover:bg-gray-800 text-white text-center rounded-lg font-medium transition-colors text-sm"
            >
                {buttonText}
            </Link>
        </div>
    </div>
);

const Home = () => {
    return (
        <div className="max-w-4xl mx-auto py-12">
            <div className="text-center mb-16 space-y-4">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
                    Private Knowledge <span className="text-blue-600">Q&A</span>
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Securely upload your text documents and ask questions using strict context-based AI retrieval. No hallucinations, just facts from your file.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                <Card
                    icon={UploadCloud}
                    title="Upload Documents"
                    description="Upload your .txt files securely. Files are chunked, embedded, and stored locally for instant retrieval."
                    to="/upload"
                    buttonText="Start Uploading"
                />
                <Card
                    icon={Search}
                    title="Ask Questions"
                    description="Query your knowledge base with natural language. Get precise answers with source citations and similarity scores."
                    to="/query"
                    buttonText="Start Querying"
                />
            </div>

            <div className="mt-16 text-center border-t border-gray-100 pt-8">
                <div className="inline-flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Production Ready & Secure Architecture</span>
                </div>
            </div>
        </div>
    );
};

export default Home;
