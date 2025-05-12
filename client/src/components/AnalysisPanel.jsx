// components/AnalysisPanel.js
import React from 'react';

const AnalysisPanel = ({ analysis }) => {
  if (!analysis) return null;

  // Sentiment color mapping
  const sentimentColor = {
    'Positive 😊': 'bg-green-100 text-green-800',
    'Negative 😞': 'bg-red-100 text-red-800',
    'Neutral 😐': 'bg-gray-100 text-gray-800'
  };

  // NLP tag color mapping
  const tagColors = {
    'stress': 'bg-purple-100 text-purple-800',
    'anxiety': 'bg-pink-100 text-pink-800',
    'motivation': 'bg-blue-100 text-blue-800',
    'time-management': 'bg-yellow-100 text-yellow-800',
    'work-life': 'bg-indigo-100 text-indigo-800',
    'sleep': 'bg-teal-100 text-teal-800',
    'focus': 'bg-amber-100 text-amber-800'
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <h3 className="font-semibold text-lg mb-3 text-[#2a4192]">Message Analysis</h3>
      
      <div className="mb-3">
        <h4 className="font-medium mb-1">Sentiment</h4>
        <div className={`px-3 py-1 rounded-full inline-flex items-center ${
          sentimentColor[analysis.sentiment.label] || 'bg-gray-100'
        }`}>
          <span className="mr-2">{analysis.sentiment.label}</span>
          <span className="text-xs opacity-75">
            ({analysis.sentiment.score.toFixed(2)})
          </span>
        </div>
      </div>
      
      {analysis.nlpTags.length > 0 && (
        <div>
          <h4 className="font-medium mb-1">Detected Topics</h4>
          <div className="flex flex-wrap gap-2">
            {analysis.nlpTags.map((tag, index) => (
              <span 
                key={index}
                className={`px-3 py-1 rounded-full text-sm ${
                  tagColors[tag] || 'bg-gray-100 text-gray-800'
                }`}
              >
                {tag.split('-').join(' ')}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisPanel;