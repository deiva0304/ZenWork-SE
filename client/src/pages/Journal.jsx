import { useState, useContext, useEffect } from 'react';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import WorkplaceInsights from '../components/WorkplaceInsights';
import NLPAnalysis from '../components/NLPAnalysis';
import NLPActionSteps from '../components/NLPActionSteps';
import Navbar from '../components/Navbar';

const Journal = () => {
    const [entry, setEntry] = useState('');
    const [analysis, setAnalysis] = useState(null);
    const [entries, setEntries] = useState([]);
    const [insights, setInsights] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);
    const [activeEntry, setActiveEntry] = useState(null);
    const [isCreatingNew, setIsCreatingNew] = useState(false);
    const { user, backendUrl } = useContext(AppContent);

    const fetchEntries = async () => {
        console.log('Starting fetch...');
        setIsFetching(true);
        try {
            const { data } = await axios.get(`${backendUrl}/api/journal/entries`, {
                withCredentials: true
            });
            console.log('Fetch response:', data);
            
            if (data.success) {
                setEntries(data.entries);
                setInsights(data.insights);
            } else {
                toast.error(data.message || 'Failed to fetch entries');
            }
        } catch (error) {
            console.error('Full fetch error:', error);
            toast.error(error.response?.data?.message || 'Failed to fetch entries');
        } finally {
            setIsFetching(false);
            setInitialLoad(false);
        }
    };

    useEffect(() => {
        console.log('Initial load - User:', user, 'Backend URL:', backendUrl);
        
        // Fetch entries immediately when component mounts
        const loadData = async () => {
            if (!backendUrl) {
                console.error('Backend URL is not available');
                return;
            }

            try {
                await fetchEntries();
            } catch (err) {
                console.error('Initial load error:', err);
            }
        };

        loadData();
    }, [backendUrl]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!entry.trim()) {
            toast.error('Journal entry cannot be empty');
            return;
        }
        
        setIsLoading(true);
        
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/journal/analyze`, 
                { entry },
                { withCredentials: true }
            );
            
            if (data.success) {
                setAnalysis(data.journalEntry.analysis);
                setEntries(prev => [data.journalEntry, ...prev]);
                setEntry('');
                setActiveEntry(data.journalEntry);
                setIsCreatingNew(false);
                await fetchEntries(); // Refresh insights
                toast.success('Journal entry analyzed with Neuro-linguistic programming (NLP) insights');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Analysis failed');
            console.error('Submit error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCompleteAction = async (action) => {
        try {
            await axios.post(
                `${backendUrl}/api/journal/track-action`,
                { action, completed: true },
                { withCredentials: true }
            );
            toast.success(`Action "${action}" marked as completed!`);
            await fetchEntries(); // Refresh data
        } catch (error) {
            toast.error('Failed to track action');
            console.error('Action tracking error:', error);
        }
    };

    const handleViewEntry = (entry) => {
        setActiveEntry(entry);
        setIsCreatingNew(false);
        setAnalysis(entry.analysis);
    };

    const handleNewEntry = () => {
        setActiveEntry(null);
        setIsCreatingNew(true);
        setEntry('');
        setAnalysis(null);
    };

    const closeActiveView = () => {
        setActiveEntry(null);
        setIsCreatingNew(false);
        setAnalysis(null);
    };

    return (
        <div className='flex flex-col min-h-screen bg-[url("/bg_img.png")] bg-cover bg-center'>
            <Navbar />
            
            <div className="flex-1 px-6 lg:px-12 py-20 mx-auto w-full max-w-6xl">
                <div className="text-center mb-8 mt-10">
    <h1 className="text-3xl font-bold text-[#2a4192] mb-2">
        Workplace Wellness Journal
    </h1>
    <p className="text-gray-600">
        Reflect on your workday using Neuro-linguistic programming (NLP) principles to improve communication and mindset
    </p>
</div>
                
                {/* Insights Dashboard - Always visible */}
                {insights && <WorkplaceInsights insights={insights} />}
                
                {/* Create New Entry Button */}
                <div className="mt-8 mb-6 flex justify-end">
                    <button 
                        onClick={handleNewEntry}
                        className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Create New Reflection
                    </button>
                </div>
                
                {/* Active Entry View or Create New Entry Form */}
                {(activeEntry || isCreatingNew) && (
                    <div className="bg-white p-6 rounded-lg shadow mb-6 relative">
                        {/* Close Button */}
                        <button 
                            onClick={closeActiveView}
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        
                        {/* View Existing Entry */}
                        {activeEntry && !isCreatingNew && (
                            <div>
                                <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                                    <h3 className="text-lg font-medium text-gray-900">Reflection from {new Date(activeEntry.createdAt).toLocaleDateString()}</h3>
                                    <div className="flex space-x-2">
                                        {activeEntry.tags?.map(tag => (
                                            <span key={tag} className="px-2 py-1 rounded-full text-xs bg-gray-100">
                                                {tag}
                                            </span>
                                        ))}
                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                            activeEntry.sentimentScore >= 7 ? 'bg-green-100 text-green-800' :
                                            activeEntry.sentimentScore <= 4 ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            Mood: {activeEntry.sentimentScore}/10
                                        </span>
                                    </div>
                                </div>
                                <div className="border-b pb-4 mb-4">
                                    <p className="whitespace-pre-line">{activeEntry.entry}</p>
                                </div>
                                
                                {/* Analysis for the active entry */}
                                {activeEntry.analysis && (
                                    <>
                                        <NLPAnalysis analysis={activeEntry.analysis} />
                                        <NLPActionSteps 
                                            analysis={activeEntry.analysis} 
                                            onCompleteAction={handleCompleteAction}
                                        />
                                    </>
                                )}
                            </div>
                        )}
                        
                        {/* Create New Entry Form */}
                        {isCreatingNew && (
                            <div>
                                <h3 className="text-lg font-medium mb-4">Create New Reflection</h3>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Workday Reflection
                                        </label>
                                        <p className="text-xs text-gray-500 mb-2">
                                            Consider: Communication patterns, achievements, challenges, relationships
                                        </p>
                                        <textarea
                                            rows={6}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            value={entry}
                                            onChange={(e) => setEntry(e.target.value)}
                                            placeholder="E.g., 'Today in a meeting I felt... My colleague said... I noticed I was using language like...'"
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                    >
                                        {isLoading ? 'Analyzing with Neuro-linguistic programming (NLP)...' : 'Submit Reflection'}
                                    </button>
                                </form>
                                
                                {/* Analysis Result for New Entry */}
                                {analysis && (
                                    <>
                                        <div className="mt-6 border-t pt-6">
                                            <NLPAnalysis analysis={analysis} />
                                            <NLPActionSteps 
                                                analysis={analysis} 
                                                onCompleteAction={handleCompleteAction}
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                )}
                
                {/* Entries Grid */}
                <div className="mt-6">
                    <h3 className="text-lg font-medium mb-4">Your Reflection History</h3>
                    
                    {initialLoad ? (
                        <div className="text-center py-12 bg-white rounded-lg shadow">
                            <div className="animate-pulse">
                                <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto mb-3"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                            </div>
                            <p className="mt-4 text-gray-500">Loading your journal entries...</p>
                        </div>
                    ) : isFetching ? (
                        <div className="text-center py-4">Refreshing entries...</div>
                    ) : entries.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {entries.map((item) => (
                                <div 
                                    key={item._id} 
                                    onClick={() => handleViewEntry(item)}
                                    className={`bg-white p-4 rounded-lg shadow cursor-pointer transform hover:scale-[1.02] transition-transform ${
                                        activeEntry?._id === item._id ? 'ring-2 ring-indigo-500' : ''
                                    }`}
                                >
                                    <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
                                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                            item.sentimentScore >= 7 ? 'bg-green-100 text-green-800' :
                                            item.sentimentScore <= 4 ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            Mood: {item.sentimentScore}/10
                                        </span>
                                    </div>
                                    <p className="line-clamp-3 text-sm text-gray-700">{item.entry}</p>
                                    <div className="mt-2 flex flex-wrap gap-1">
                                        {item.tags?.slice(0, 3).map(tag => (
                                            <span key={tag} className="px-2 py-0.5 rounded-full text-xs bg-gray-100">
                                                {tag}
                                            </span>
                                        ))}
                                        {item.tags?.length > 3 && (
                                            <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100">
                                                +{item.tags.length - 3}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white p-8 rounded-lg shadow text-center">
                            <p className="text-gray-500 mb-4">No reflections yet. Start by adding your first workday reflection.</p>
                            <button 
                                onClick={handleNewEntry}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                            >
                                Create Your First Reflection
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Journal;