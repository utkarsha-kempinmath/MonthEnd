import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { ChartPie } from "lucide-react";

export function Screen3ExpectedSpending({ onContinue }) {
  const [categories, setCategories] = useState([
    { name: "Food", amount: 3000, color: "#f59e0b" },
    { name: "Transport", amount: 1000, color: "#3b82f6" },
    { name: "Academics", amount: 2000, color: "#8b5cf6" },
    { name: "Personal and Health Care", amount: 2000, color: "#ec4899" },
    { name: "Other", amount: 2000, color: "#6366f1" },
  ]);

  const total = categories.reduce((sum, cat) => sum + cat.amount, 0);

  const updateAmount = (index, value) => {
    const newCategories = [...categories];
    newCategories[index].amount = parseInt(value) || 0;
    setCategories(newCategories);
  };

  const chartData = categories.map(cat => ({
    name: cat.name,
    value: cat.amount,
    color: cat.color
  }));

  return (
    <div className="flex flex-col min-h-[600px] px-12 py-16">
      <div className="flex-1 space-y-8">
        <div className="inline-flex items-center gap-2 text-violet-600 mb-4">
          <ChartPie size={24} />
          <span className="text-sm uppercase tracking-wider font-medium">Planning</span>
        </div>

        <div>
          <h1 className="text-4xl mb-3">How do you expect to spend this month?</h1>
          <p className="text-lg text-gray-600">
            This is not a strict budget. It's a reference to reflect against.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-12">
          {/* Left Column - Categories */}
          <div className="space-y-6">
            {categories.map((cat, index) => (
              <div key={cat.name} className="flex items-center gap-4">
                <div 
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-lg w-32">{cat.name}</span>
                <Input
                  type="text"
                  value={`₹ ${cat.amount}`}
                  onChange={(e) => updateAmount(index, e.target.value.replace('₹ ', '').replace(',', ''))}
                  className="flex-1 text-right border-2 border-gray-200 focus:border-violet-500 h-12"
                />
              </div>
            ))}
            
            <div className="pt-4 border-t-2 border-gray-200 flex justify-between items-center">
              <span className="text-lg font-semibold">Total</span>
              <span className="text-2xl font-semibold">₹ {total.toLocaleString()}</span>
            </div>
          </div>

          {/* Right Column - Chart */}
          <div className="flex flex-col justify-center">
            <p className="text-base text-gray-600 mb-6">Expected distribution</p>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${value}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="pt-6">
          <Button 
            onClick={onContinue}
            className="w-full max-w-md mx-auto block bg-violet-600 text-white hover:bg-violet-700 h-14 text-lg"
          >
            Save expectations →
          </Button>
        </div>
      </div>
    </div>
  );
}
