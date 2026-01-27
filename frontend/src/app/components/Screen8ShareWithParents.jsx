import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import { Share2, Mail, MessageCircle, Check } from "lucide-react";

export function Screen8ShareWithParents({ onContinue }) {
  const [email, setEmail] = useState("");
  const [isShared, setIsShared] = useState(false);
  const [selectedInsights, setSelectedInsights] = useState([
    "spending",
    "goals"
  ]);

  const insights = [
    { id: "spending", label: "Monthly spending patterns", icon: "📊" },
    { id: "goals", label: "Savings goals progress", icon: "🎯" },
    { id: "reflection", label: "Personal reflections", icon: "💭" },
    { id: "emotions", label: "Emotion tags & insights", icon: "💡" },
  ];

  const toggleInsight = (id) => {
    setSelectedInsights(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const handleShare = () => {
    setIsShared(true);
    setTimeout(() => setIsShared(false), 3000);
  };

  return (
    <div className="flex flex-col min-h-[600px] px-12 py-16">
      <div className="flex-1 max-w-2xl mx-auto w-full space-y-10">
        <div className="inline-flex items-center gap-2 text-purple-600 mb-4">
          <Share2 size={24} />
          <span className="text-sm uppercase tracking-wider font-medium">Sharing</span>
        </div>

        <div>
          <h1 className="text-4xl mb-3">Share with parents</h1>
          <p className="text-lg text-gray-600">
            Keep your parents in the loop. Share your financial awareness journey with them.
          </p>
        </div>

        <div className="space-y-8">
          {/* What to Share */}
          <div className="space-y-4">
            <label className="text-base font-medium">What to share</label>
            <div className="space-y-3">
              {insights.map((insight) => (
                <button
                  key={insight.id}
                  onClick={() => toggleInsight(insight.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                    selectedInsights.includes(insight.id)
                      ? 'bg-purple-50 border-purple-300'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{insight.icon}</span>
                    <span className="text-base">{insight.label}</span>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    selectedInsights.includes(insight.id)
                      ? 'bg-purple-600 border-purple-600'
                      : 'border-gray-300'
                  }`}>
                    {selectedInsights.includes(insight.id) && (
                      <Check size={16} className="text-white" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Email Input */}
          <div className="space-y-3">
            <label className="text-base font-medium">Parent's email</label>
            <div className="flex gap-3">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="parent@email.com"
                className="flex-1 border-2 border-gray-200 focus:border-purple-500 h-14 text-lg px-4"
              />
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="p-4 bg-purple-50 border-l-4 border-purple-400 rounded-lg">
            <p className="text-sm text-purple-900 leading-relaxed">
              <span className="font-semibold">Privacy first:</span> Your parents will only see what you choose to share. 
              You can update or stop sharing anytime.
            </p>
          </div>

          {/* Share Methods */}
          <div className="space-y-3">
            <label className="text-base font-medium">Share via</label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={handleShare}
                className="bg-purple-600 text-white hover:bg-purple-700 h-14 text-lg flex items-center gap-2"
                disabled={!email || selectedInsights.length === 0}
              >
                <Mail size={20} />
                Email report
              </Button>
              <Button
                onClick={handleShare}
                variant="outline"
                className="border-2 border-purple-200 hover:bg-purple-50 h-14 text-lg flex items-center gap-2"
                disabled={selectedInsights.length === 0}
              >
                <MessageCircle size={20} />
                Copy link
              </Button>
            </div>
          </div>

          {isShared && (
            <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg text-center">
              <p className="text-green-800 font-medium">✓ Shared successfully with your parents!</p>
            </div>
          )}
        </div>

        <div className="pt-6">
          <Button 
            onClick={onContinue}
            className="w-full bg-purple-600 text-white hover:bg-purple-700 h-14 text-lg"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
