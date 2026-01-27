import { X } from "lucide-react";
import { useState } from "react";

export function ChatPopup({ messages, onClose, color = "indigo" }) {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) return null;

  const colorClasses = {
    indigo: "bg-indigo-50 border-indigo-200",
    amber: "bg-amber-50 border-amber-200",
    teal: "bg-teal-50 border-teal-200",
  };

  const iconColorClasses = {
    indigo: "text-indigo-600",
    amber: "text-amber-600",
    teal: "text-teal-600",
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 animate-slide-up">
      <div className={`max-w-md rounded-3xl border-2 ${colorClasses[color]} shadow-2xl overflow-hidden`}>
        <div className="bg-white/80 backdrop-blur-sm p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full ${colorClasses[color]} flex items-center justify-center`}>
                <span className={`text-xl ${iconColorClasses[color]}`}>💡</span>
              </div>
              <span className="font-medium text-gray-800">Insight</span>
            </div>
            <button 
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="space-y-3">
            {messages.map((message, index) => (
              <div 
                key={index}
                className={`p-4 rounded-2xl ${colorClasses[color]} text-gray-800 leading-relaxed`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {message}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
