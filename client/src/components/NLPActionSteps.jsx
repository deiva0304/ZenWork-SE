import { useState } from 'react';

const NLPActionSteps = ({ analysis, onCompleteAction }) => {
    const [completedActions, setCompletedActions] = useState([]);

    if (!analysis?.actionableSteps?.length) return null;

    const handleCompleteAction = (action) => {
        onCompleteAction(action);
        setCompletedActions(prev => [...prev, action]);
    };

    return (
        <div className="mt-6 bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4 flex items-center">
                <span className="mr-2">✨</span> Your Personalized NLP Action Plan
            </h3>
            
            <div className="space-y-3">
                {analysis.actionableSteps.map((action, i) => (
                    <div key={i} className="flex items-start p-3 hover:bg-gray-50 rounded border border-gray-100">
                        <span className="text-2xl mr-3">{getActionIcon(action)}</span>
                        <div className="flex-1">
                            <h4 className="font-medium">{getActionTitle(action)}</h4>
                            <p className="text-sm text-gray-600">{action}</p>
                            <div className="flex items-center mt-2">
                                <span className="text-xs px-2 py-1 bg-gray-100 rounded">Daily Practice</span>
                                {completedActions.includes(action) ? (
                                    <span className="ml-auto text-xs bg-green-100 text-green-800 px-3 py-1 rounded">
                                        Done ✓
                                    </span>
                                ) : (
                                    <button 
                                        onClick={() => handleCompleteAction(action)}
                                        className="ml-auto text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded hover:bg-blue-200"
                                    >
                                        Mark as Done
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="mt-4 flex justify-end">
                <div className="text-xs text-gray-500">
                    Tip: Focus on one action at a time for best results
                </div>
            </div>
        </div>
    );
};

// Helper functions
function getActionIcon(action) {
    if (action.includes('language') || action.includes('reframe')) return '🔄';
    if (action.includes('journal') || action.includes('record')) return '📝';
    if (action.includes('meeting') || action.includes('talk')) return '🗣️';
    if (action.includes('breath') || action.includes('mindful')) return '🧘';
    return '✨';
}

function getActionTitle(action) {
    if (action.includes('language')) return "Language Reframing";
    if (action.includes('journal')) return "Positive Journaling";
    if (action.includes('meeting')) return "Communication Practice";
    if (action.includes('breath')) return "Mindfulness Technique";
    return "NLP Practice";
}

export default NLPActionSteps;