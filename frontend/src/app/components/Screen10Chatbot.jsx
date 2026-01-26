import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState, useRef, useEffect } from "react";
import { Send, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";

export function Screen10Chatbot({ onContinue }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "assistant",
      content: "Hi! I'm here to help you make confident spending decisions. Ask me anything about your budget, spending patterns, or future expenses.",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);

  const quickActions = [
    { label: "Can I afford this?", icon: AlertCircle },
    { label: "End-of-month outlook", icon: TrendingUp },
    { label: "Impact on my goal", icon: CheckCircle },
    { label: "Stress spending pattern", icon: AlertCircle },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (text) => {
    const messageText = text || inputValue;
    if (!messageText.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      type: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInputValue("");

    // Simulate assistant response based on message
    setTimeout(() => {
      const assistantResponse = generateResponse(messageText);
      setMessages((prev) => [...prev, assistantResponse]);
    }, 800);
  };

  const generateResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();

    // Example responses for demonstration
    if (lowerMessage.includes("afford") || lowerMessage.includes("buy") || lowerMessage.includes("spend")) {
      return {
        id: messages.length + 2,
        type: "assistant",
        content: "Let me check your current situation. Based on your spending this month:\n\n• You've spent ₹6,850 out of ₹10,000 budget\n• You have ₹3,150 remaining for the next 12 days\n• Average daily spending: ₹380\n\nIf this purchase is under ₹1,000, you're in a comfortable zone. Anything above ₹1,500 may put you at risk of exceeding your monthly goal by the end of the month.\n\nWould you like to see how this affects your savings goal?",
        timestamp: new Date(),
        metadata: {
          prediction: 68,
          impact: "moderate",
        },
      };
    }

    if (lowerMessage.includes("end") && lowerMessage.includes("month")) {
      return {
        id: messages.length + 2,
        type: "assistant",
        content: "Looking at your current pace:\n\n📊 **End-of-month projection**\n• Expected total spending: ₹8,900\n• Budget remaining: ₹1,100 buffer\n• Confidence level: 85%\n\n✅ You're on track! Your current spending rate suggests you'll stay within budget with a healthy cushion.\n\n💡 **Insight**: Your food spending tends to spike during exam weeks. You have mid-terms in 5 days, so consider setting aside ₹800 for that period.",
        timestamp: new Date(),
        metadata: {
          prediction: 85,
          impact: "positive",
        },
      };
    }

    if (lowerMessage.includes("goal") || lowerMessage.includes("savings")) {
      return {
        id: messages.length + 2,
        type: "assistant",
        content: "Let's review your goal impact:\n\n🎯 **Current goal**: Save ₹15,000 for summer trip\n• Progress: ₹8,400 / ₹15,000 (56%)\n• Monthly target: ₹2,000\n• This month's savings: ₹1,150 so far\n\n⚠️ **Impact analysis**: You're ₹850 behind this month's target. To stay on track:\n\n1. Reduce discretionary spending by ₹25-30/day\n2. Skip 2-3 cafe visits this week\n3. Use college canteen instead of food delivery\n\nThese small adjustments can get you back on track without major lifestyle changes.",
        timestamp: new Date(),
        metadata: {
          prediction: 56,
          impact: "goal-related",
        },
      };
    }

    if (lowerMessage.includes("stress") || lowerMessage.includes("pattern") || lowerMessage.includes("emotion")) {
      return {
        id: messages.length + 2,
        type: "assistant",
        content: "I've noticed some patterns in your spending:\n\n🔍 **Stress spending analysis**\n• During exam weeks: +45% food spending\n• Stress-tagged purchases: ₹2,100 this month\n• Most common: Late-night food orders (₹300-500)\n\n🧘 **Context matters**: You have mid-terms coming up next week. Historically, you spend an extra ₹600-800 during these periods.\n\n💪 **Suggestion**: Set aside ₹700 now as a \"stress buffer\". This lets you handle exam stress without guilt or budget anxiety. It's planned, not impulsive.\n\nRemember: Being aware of patterns isn't about judgment—it's about understanding yourself better.",
        timestamp: new Date(),
        metadata: {
          prediction: 45,
          impact: "behavioral",
        },
      };
    }

    // Default response
    return {
      id: messages.length + 2,
      type: "assistant",
      content: "I can help you with:\n\n• **Spending decisions** - \"Can I afford this ₹500 purchase?\"\n• **Future projections** - \"How will I end the month?\"\n• **Goal tracking** - \"Am I on track for my savings goal?\"\n• **Pattern insights** - \"When do I overspend?\"\n\nWhat would you like to know?",
      timestamp: new Date(),
    };
  };

  const handleQuickAction = (action) => {
    handleSendMessage(action);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[700px] px-0 py-0">
      <div className="flex flex-col h-full max-w-5xl mx-auto w-full">
        {/* Header */}
        <div className="px-12 py-8 border-b-2 border-gray-100">
          <div className="inline-flex items-center gap-2 text-indigo-600 mb-3">
            <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
            <span className="text-sm uppercase tracking-wider font-medium">Financial Companion</span>
          </div>
          <h1 className="text-4xl mb-2">Ask before you spend</h1>
          <p className="text-lg text-gray-600">
            Get clear insights based on your patterns, not generic advice.
          </p>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-12 py-8 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-6 py-4 ${
                  message.type === "user"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-50 text-gray-900 border-2 border-gray-100"
                }`}
              >
                {message.type === "assistant" && message.metadata?.impact && (
                  <div className="mb-3 pb-3 border-b border-gray-200">
                    <div className="flex items-center gap-2 text-sm">
                      {message.metadata.impact === "positive" && (
                        <div className="flex items-center gap-2 text-green-700">
                          <CheckCircle size={16} />
                          <span className="font-medium">Looking good</span>
                        </div>
                      )}
                      {message.metadata.impact === "moderate" && (
                        <div className="flex items-center gap-2 text-amber-700">
                          <AlertCircle size={16} />
                          <span className="font-medium">Moderate risk</span>
                        </div>
                      )}
                      {message.metadata.impact === "goal-related" && (
                        <div className="flex items-center gap-2 text-blue-700">
                          <TrendingUp size={16} />
                          <span className="font-medium">Goal update</span>
                        </div>
                      )}
                      {message.metadata.impact === "behavioral" && (
                        <div className="flex items-center gap-2 text-purple-700">
                          <AlertCircle size={16} />
                          <span className="font-medium">Pattern insight</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <p className="text-base leading-relaxed whitespace-pre-line">{message.content}</p>
                <p
                  className={`text-xs mt-2 ${
                    message.type === "user" ? "text-indigo-200" : "text-gray-500"
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div className="px-12 py-4 border-t-2 border-gray-100">
          <div className="flex flex-wrap gap-2 mb-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(action.label)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 border-2 border-indigo-200 hover:bg-indigo-100 transition-colors text-sm font-medium"
              >
                <action.icon size={14} />
                {action.label}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about your spending..."
                className="border-2 border-gray-200 focus:border-indigo-500 h-14 text-base px-4 rounded-xl"
              />
            </div>
            <Button
              onClick={() => handleSendMessage()}
              className="bg-indigo-600 text-white hover:bg-indigo-700 h-14 px-6 rounded-xl"
              disabled={!inputValue.trim()}
            >
              <Send size={18} />
            </Button>
          </div>

          {/* Helper text */}
          <p className="text-xs text-gray-500 mt-3 text-center">
            Insights are based on your spending patterns and calendar events. Remember, you make the final decision.
          </p>
        </div>
      </div>
    </div>
  );
}
