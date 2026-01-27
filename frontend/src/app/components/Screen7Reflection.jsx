import { Button } from "./ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { Lightbulb } from "lucide-react";

export function Screen7Reflection({ onContinue }) {
  // Daily spending variability throughout the month
  const spendingData = [
    { day: 1, amount: 150 },
    { day: 3, amount: 200 },
    { day: 5, amount: 180 },
    { day: 7, amount: 320 },
    { day: 9, amount: 250 },
    { day: 11, amount: 420 },
    { day: 13, amount: 380 },
    { day: 15, amount: 280 },
    { day: 17, amount: 190 },
    { day: 19, amount: 210 },
    { day: 21, amount: 450 },
    { day: 23, amount: 380 },
    { day: 25, amount: 240 },
    { day: 27, amount: 200 },
    { day: 29, amount: 220 },
  ];

  return (
    <div className="flex flex-col min-h-[600px] px-12 py-16">
      <div className="flex-1 space-y-8">
        <div className="inline-flex items-center gap-2 text-rose-600 mb-4">
          <Lightbulb size={24} />
          <span className="text-sm uppercase tracking-wider font-medium">Reflection</span>
        </div>

        <h1 className="text-4xl">Monthly reflection</h1>
        
        <div className="space-y-8">
          {/* Chart */}
          <div className="bg-gradient-to-br from-rose-50 to-pink-50 p-8 rounded-xl">
            <p className="text-base text-gray-700 mb-6">Spending variability this month</p>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={spendingData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#fecdd3" />
                <XAxis 
                  dataKey="day" 
                  tick={{ fontSize: 12 }}
                  stroke="#666"
                  label={{ value: 'Day of month', position: 'insideBottom', offset: -5, fontSize: 12 }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  stroke="#666"
                  tickFormatter={(value) => `₹${value}`}
                />
                <Tooltip 
                  formatter={(value) => [`₹${value}`, 'Spent']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #fecdd3' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#e11d48" 
                  strokeWidth={3}
                  dot={{ fill: '#e11d48', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Insights */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Key patterns</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-white border-2 border-indigo-100 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                <p className="text-lg leading-relaxed">Spending spikes during exam weeks</p>
              </div>
              <div className="flex items-start gap-4 p-4 bg-white border-2 border-purple-100 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0"></div>
                <p className="text-lg leading-relaxed">Food expenses rise on social days</p>
              </div>
              <div className="flex items-start gap-4 p-4 bg-white border-2 border-emerald-100 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></div>
                <p className="text-lg leading-relaxed">Savings improve when routine is stable</p>
              </div>
            </div>

            <div className="pt-6 text-center">
              <p className="text-2xl italic text-gray-500">
                Patterns don't judge. They inform.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6">
          <Button 
            onClick={onContinue}
            className="w-full max-w-md mx-auto block bg-rose-600 text-white hover:bg-rose-700 h-14 text-lg"
          >
            Start over
          </Button>
        </div>
      </div>
    </div>
  );
}
