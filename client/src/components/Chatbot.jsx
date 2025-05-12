import { useState, useContext, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContent } from '../context/AppContext';

const Chatbot = () => {
  const [message, setMessage] = useState('');
  const { user, userData, backendUrl } = useContext(AppContent);
  const [chatHistory, setChatHistory] = useState([
    {
      
      type: 'bot',
      text: "Hello! I'm your ZenWork Wellness Companion. How are you feeling today?"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chatHistoryRef = useRef(null);
  const bottomRef = useRef(null);

  // Fetch conversation history when component mounts
  useEffect(() => {
    const fetchConversationHistory = async () => {
      try {
        console.log("Fetching chat history...");
        setIsLoading(true);
        
        const response = await axios.get(`${backendUrl}/api/chatbot/history`, {
          withCredentials: true
        });
        
        console.log("Chat history response:", response.data);
        
        if (response.data.success && response.data.messages && response.data.messages.length > 0) {
          // Convert the conversation history format to match our UI format
          const formattedHistory = [];
          
          // Add all messages from history
          response.data.messages.forEach(item => {
            formattedHistory.push({ type: 'user', text: item.userMessage });
            formattedHistory.push({ type: 'bot', text: item.botResponse });
          });
          
          // If we have history, use it; otherwise keep the default greeting
          if (formattedHistory.length > 0) {
            setChatHistory(formattedHistory);
          }
        } else {
          console.log("No chat history found or empty history returned");
        }
      } catch (error) {
        console.error("Failed to fetch conversation history:", error);
        toast.error("Failed to load chat history");
      } finally {
        setIsLoading(false);
      }
    };

    // Call the function immediately when component mounts
    fetchConversationHistory();
    
  }, [backendUrl]);

  // Scroll to bottom whenever chat history updates
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const newChatHistory = [...chatHistory, { 
      type: 'user', 
      text: message 
    }];
    
    setChatHistory(newChatHistory);
    setIsLoading(true);
    const userMessage = message;
    setMessage(''); // Clear input field immediately for better UX

    try {
      console.log("Sending message to API:", userMessage);
      
      // Send POST request with the user message
      const response = await axios.post(
        `${backendUrl}/api/chatbot/chat`, 
        { 
          message: userMessage,
          userId: userData?._id // Send user ID if available
        },
        { withCredentials: true }
      );
      
      console.log("Chatbot API response:", response.data);
      
      if (response.data.success) {
        setChatHistory(prevHistory => [
          ...prevHistory, 
          { type: 'bot', text: response.data.message }
        ]);
      } else {
        throw new Error('Chatbot response failed');
      }
    } catch (error) {
      console.error("Chatbot API Error:", error);
      toast.error("Unable to process message. Please try again.");
      setChatHistory(prevHistory => [
        ...prevHistory, 
        { 
          type: 'bot', 
          text: "I'm having trouble responding right now. Would you like to try again?" 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Format timestamp
  const formatTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="border-2 border-[#2a4192] rounded-xl overflow-hidden shadow-md flex flex-col h-[650px] w-full">
      {/* Chat header */}
      <div className="bg-[#2a4192] text-white p-4 flex items-center">
        <div className="w-4 h-4 rounded-full bg-green-400 mr-3"></div>
        <span className="font-medium text-lg">ZenWork Wellness Companion</span>
      </div>
      
      {/* Chat messages area */}
      <div 
        ref={chatHistoryRef}
        className="flex-grow overflow-y-auto p-6 bg-gray-50"
      >
        {chatHistory.map((chat, index) => (
          <div 
            key={index} 
            className={`mb-5 flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-4 rounded-lg relative ${
                chat.type === 'user' 
                  ? 'bg-[#2a4192] text-white rounded-tr-none' 
                  : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
              }`}
            >
              <div className="mb-1 text-base whitespace-pre-wrap">
                {chat.text.split('\n').map((paragraph, index) => {
                  // Handle bullet points with asterisks
                  if (paragraph.trim().startsWith('* ')) {
                    return (
                      <p key={index} className={`ml-4 ${index > 0 ? 'mt-2' : ''}`}>
                        <span className="inline-block w-2 h-2 rounded-full bg-gray-400 mr-2"></span>
                        {paragraph.substring(2).split('**').map((text, i) => {
                          return i % 2 === 0 ? text : <strong key={i}>{text}</strong>;
                        })}
                      </p>
                    );
                  }
                  
                  return (
                    <p key={index} className={index > 0 ? 'mt-2' : ''}>
                      {paragraph.split('**').map((text, i) => {
                        return i % 2 === 0 ? text : <strong key={i}>{text}</strong>;
                      })}
                    </p>
                  );
                })}
              </div>
              <div 
                className={`text-xs ${chat.type === 'user' ? 'text-blue-100' : 'text-gray-500'} text-right mt-2`}
              >
                {formatTime()}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start mb-5">
            <div className="bg-white border border-gray-200 text-gray-500 p-4 rounded-lg rounded-tl-none max-w-[80%]">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} /> {/* Empty div for scrolling to bottom */}
      </div>
      
      {/* Input area */}
      <div className="bg-white p-4 flex border-t border-gray-200">
        <input 
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#2a4192] text-base"
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button 
          onClick={handleSendMessage}
          disabled={isLoading || !message.trim()}
          className={`bg-[#2a4192] text-white px-6 py-3 rounded-r-lg transition-colors text-base font-medium ${
            isLoading || !message.trim() ? 'opacity-70 cursor-not-allowed' : 'hover:bg-opacity-90'
          }`}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;