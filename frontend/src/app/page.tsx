'use client';

import { useState } from 'react';

interface DiffPart {
    value: string;
    added?: boolean;
    removed?: boolean;
}

export default function Home() {
    const [textA, setTextA] = useState('');
    const [textB, setTextB] = useState('');
    const [diffResult, setDiffResult] = useState<DiffPart[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCompare = async () => {
        setLoading(true);
        setError(null);
        setDiffResult(null);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
            const response = await fetch(`${apiUrl}/diff`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text1: textA,
                    text2: textB,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setDiffResult(data.diff);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to compare texts');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Diff 2 Texts
                </h1>

                <p className="text-center text-gray-400 mb-8">
                    Compare two texts and highlight their differences
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Text A */}
                    <div className="flex flex-col">
                        <label htmlFor="textA" className="text-sm font-medium text-gray-300 mb-2">
                            Text A (Original)
                        </label>
                        <textarea
                            id="textA"
                            value={textA}
                            onChange={(e) => setTextA(e.target.value)}
                            placeholder="Enter the original text here..."
                            className="flex-1 min-h-[250px] p-4 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        />
                    </div>

                    {/* Text B */}
                    <div className="flex flex-col">
                        <label htmlFor="textB" className="text-sm font-medium text-gray-300 mb-2">
                            Text B (Modified)
                        </label>
                        <textarea
                            id="textB"
                            value={textB}
                            onChange={(e) => setTextB(e.target.value)}
                            placeholder="Enter the modified text here..."
                            className="flex-1 min-h-[250px] p-4 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                        />
                    </div>
                </div>

                {/* Compare Button */}
                <div className="flex justify-center mb-8">
                    <button
                        onClick={handleCompare}
                        disabled={loading}
                        className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                        {loading ? 'Comparing...' : 'Compare'}
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-300">
                        <p className="font-medium">Error:</p>
                        <p>{error}</p>
                    </div>
                )}

                {/* Diff Result */}
                {diffResult && (
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-200">Diff Result</h2>
                        <div className="p-4 bg-gray-900 rounded-lg font-mono text-sm leading-relaxed whitespace-pre-wrap break-words">
                            {diffResult.map((part, index) => {
                                let className = 'text-gray-300';
                                if (part.added) {
                                    className = 'bg-green-900/50 text-green-300';
                                } else if (part.removed) {
                                    className = 'bg-red-900/50 text-red-300 line-through';
                                }
                                return (
                                    <span key={index} className={className}>
                                        {part.value}
                                    </span>
                                );
                            })}
                        </div>

                        {/* Legend */}
                        <div className="mt-4 flex gap-6 text-sm text-gray-400">
                            <div className="flex items-center gap-2">
                                <span className="w-4 h-4 bg-green-900/50 rounded"></span>
                                <span>Added</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-4 h-4 bg-red-900/50 rounded"></span>
                                <span>Removed</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-4 h-4 bg-gray-700 rounded"></span>
                                <span>Unchanged</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
