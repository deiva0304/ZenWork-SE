import React from "react";
import Navbar from "../components/Navbar";
import Chatbot from "../components/Chatbot";

const ChatbotPage = () => {
  return (
    <div className='flex flex-col min-h-screen bg-[url("/bg_img.png")] bg-cover bg-center'>
  <Navbar />
  <div className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-8 pt-32 pb-12">
    <div className="bg-white rounded-xl shadow-lg p-8 w-full">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#2a4192] mb-4">
          ZenWork AI Wellness Companion
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Your personal stress management and emotional support assistant
        </p>
      </div>
      
      {/* Benefits Box - Now positioned above the chat */}
      <div className="bg-[#f9d4d2] bg-opacity-10 p-6 rounded-xl mb-8">
  <h2 className="text-xl font-semibold text-[#2a4192] mb-4">
    Neuro-Linguistic Workplace Support
  </h2>
  <div className="grid md:grid-cols-2 gap-4">
    <ul className="space-y-3 text-gray-700">
      <li className="flex items-start">
        <span className="text-[#2a4192] mr-2">•</span>
        <span><strong>Language Reframing:</strong> Transform "problems" to "challenges" in communication</span>
      </li>
      <li className="flex items-start">
        <span className="text-[#2a4192] mr-2">•</span>
        <span><strong>Anchoring Calm:</strong> Create instant stress-relief triggers for meetings</span>
      </li>
      <li className="flex items-start">
        <span className="text-[#2a4192] mr-2">•</span>
        <span><strong>Meta-Model Clarity:</strong> Cut through vague workplace language</span>
      </li>
      <li className="flex items-start">
        <span className="text-[#2a4192] mr-2">•</span>
        <span><strong>Representational Systems:</strong> Adapt communication to colleagues' learning styles</span>
      </li>
    </ul>
    <ul className="space-y-3 text-gray-700">
      <li className="flex items-start">
        <span className="text-[#2a4192] mr-2">•</span>
        <span><strong>Perceptual Positions:</strong> Resolve conflicts by seeing multiple perspectives</span>
      </li>
      <li className="flex items-start">
        <span className="text-[#2a4192] mr-2">•</span>
        <span><strong>Future Pacing:</strong> Mentally rehearse successful outcomes</span>
      </li>
      <li className="flex items-start">
        <span className="text-[#2a4192] mr-2">•</span>
        <span><strong>Submodality Shifts:</strong> Change how you mentally represent stressful events</span>
      </li>
      <li className="flex items-start">
        <span className="text-[#2a4192] mr-2">•</span>
        <span><strong>Presupposition Language:</strong> Influence conversations with careful phrasing</span>
      </li>
    </ul>
  </div>
</div>
      
      {/* Chatbot Component - Full width below benefits */}
      <div className="w-full">
        <Chatbot />
      </div>
    </div>
  </div>
</div>
  );
};

export default ChatbotPage;