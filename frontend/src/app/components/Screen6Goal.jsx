import { Button } from "./ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Area, AreaChart } from "recharts";
import { Target } from "lucide-react";
import { ChatPopup } from "./ChatPopup.jsx";
import { useState } from "react";

export function Screen6Goal({ onContinue }) {
  const target = 60000;
  const saved = 18000;
  const progressPercent = (saved / target) * 100;

  // Monthly savings progress over 6 months
  const progressData = [
    { month: "Jul", amount: 0 },
    { month: "Aug", amount: 3000 },
    { month: "Sep", amount: 6500 },
    { month: "Oct", amount: 10000 },
    { month: "Nov", amount: 14000 },
    { month: "Dec", amount: 18000 },
  ];

  return (
    <div className="flex flex-col min-h-[600px] px-12 py-16">
      <div className="flex-1 space-y-8">
        <div className="inline-flex items-center gap-2 text-teal-600 mb-4">
          <Target size={24} />
          <span className="text-sm uppercase tracking-wider font-medium">Goal Tracking</span>
        </div>

        <div>
          <h1 className="text-4xl mb-1">Goal: New Laptop</h1>
        </div>
        
        <div className="grid grid-cols-2 gap-8">
          {/* Left Column - Details */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg">
                <span className="text-gray-700">Target</span>
                <span className="text-xl font-semibold">₹{target.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                <span className="text-gray-700">Timeline</span>
                <span className="text-xl font-semibold">12 months</span>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                <span className="text-gray-700">Progress</span>
                <span className="text-xl font-semibold">₹{saved.toLocaleString()} saved</span>
              </div>
            </div>

            <div className="space-y-3 mt-8">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Progress</span>
                <span>{progressPercent.toFixed(0)}% complete</span>
              </div>
              <div className="relative h-6 w-full overflow-hidden rounded-full bg-gray-200">
                <div 
                  className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all shadow-sm"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Chart */}
          <div className="flex flex-col justify-center">
            <p className="text-base text-gray-600 mb-6">Savings over time</p>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={progressData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                  stroke="#666"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  stroke="#666"
                  tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  formatter={(value) => [`₹${value}`, 'Saved']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e5e5' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#14b8a6" 
                  strokeWidth={3}
                  fill="url(#colorAmount)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="pt-6">
          <Button 
            onClick={onContinue}
            className="w-full max-w-md mx-auto block bg-teal-600 text-white hover:bg-teal-700 h-14 text-lg"
          >
            Continue →
          </Button>
        </div>
      </div>

      <ChatPopup 
        messages={[
          "At your current pace, this goal completes in 14 months.",
          "You can save ₹1,200 extra by maintaining expected food expenses."
        ]}
        color="teal"
      />
    </div>
  );
}
