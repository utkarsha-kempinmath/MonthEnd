import { Button } from "./ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { ChartBar } from "lucide-react";
import { ChatPopup } from "./ChatPopup.jsx";

export function Screen5ExpectedVsActual({ onContinue }) {
  const data = [
    { category: "Food", Expected: 3000, Actual: 4200, color: "#f59e0b" },
    { category: "Transport", Expected: 1000, Actual: 950, color: "#3b82f6" },
    { category: "Academics", Expected: 2000, Actual: 1800, color: "#8b5cf6" },
    { category: "Personal", Expected: 2000, Actual: 2100, color: "#ec4899" },
    { category: "Misc", Expected: 2000, Actual: 1850, color: "#6366f1" },
  ];

  return (
    <div className="flex flex-col min-h-[600px] px-12 py-16">
      <div className="flex-1 space-y-8">
        <div className="inline-flex items-center gap-2 text-amber-600 mb-4">
          <ChartBar size={24} />
          <span className="text-sm uppercase tracking-wider font-medium">Analysis</span>
        </div>

        <h1 className="text-4xl">This month so far</h1>
        
        <div className="space-y-8">
          {/* Bar Chart */}
          <div className="bg-gradient-to-br from-gray-50 to-slate-50 p-8 rounded-xl">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis 
                  dataKey="category" 
                  tick={{ fontSize: 14 }}
                  stroke="#000"
                />
                <YAxis 
                  tick={{ fontSize: 14 }}
                  stroke="#000"
                  tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  formatter={(value) => `₹${value}`}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e5e5' }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '14px', paddingTop: '20px' }}
                />
                <Bar dataKey="Expected" fill="#94a3b8" radius={[8, 8, 0, 0]} />
                <Bar dataKey="Actual" fill="#0f172a" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Detailed Breakdown */}
          <div className="space-y-3">
            {data.map((item) => {
              const difference = item.Actual - item.Expected;
              const isOver = difference > 0;
              
              return (
                <div key={item.category} className="flex justify-between items-center p-4 bg-white border-2 border-gray-100 rounded-lg hover:border-gray-200 transition-colors">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-medium text-lg">{item.category}</span>
                  </div>
                  <div className="flex items-center gap-8 text-base">
                    <span className="text-gray-500">Expected ₹{item.Expected.toLocaleString()}</span>
                    <span className="font-semibold">Actual ₹{item.Actual.toLocaleString()}</span>
                    {difference !== 0 && (
                      <span className={`text-sm font-medium ${isOver ? 'text-red-600' : 'text-green-600'}`}>
                        {isOver ? '+' : ''}₹{difference.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-6">
          <Button 
            onClick={onContinue}
            className="w-full max-w-md mx-auto block bg-amber-600 text-white hover:bg-amber-700 h-14 text-lg"
          >
            Continue →
          </Button>
        </div>
      </div>

      <ChatPopup 
        messages={[
          "Food spending exceeded expectation by ₹1,200. Most overspending occurred on stress-tagged days."
        ]}
        color="amber"
      />
    </div>
  );
}
