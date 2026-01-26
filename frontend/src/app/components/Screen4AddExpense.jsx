import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useState } from "react";
import { Plus, Calendar } from "lucide-react";

export function Screen4AddExpense({ onContinue }) {
  const [amount, setAmount] = useState("250");
  const [startDate, setDate] = useState("")
  const [category, setCategory] = useState("food");
  const [note, setNote] = useState("Coffee with friends");
  const [selectedEmotions, setSelectedEmotions] = useState(["Social"]);

  // Previous entries data - matching with the analysis data
  const previousEntries = [
    // December 2024
    { id: 1, date: "2024-12-28", amount: 850, category: "food", note: "Dinner at new restaurant", emotions: ["Social", "Impulse"] },
    { id: 2, date: "2024-12-27", amount: 450, category: "food", note: "Late night snacks during study", emotions: ["Stress"] },
    { id: 3, date: "2024-12-25", amount: 1200, category: "personal", note: "Christmas shopping", emotions: ["Social"] },
    { id: 4, date: "2024-12-24", amount: 300, category: "transport", note: "Uber home", emotions: ["Calm"] },
    { id: 5, date: "2024-12-20", amount: 600, category: "academics", note: "Assignment printing", emotions: ["Stress"] },
    { id: 6, date: "2024-12-18", amount: 750, category: "food", note: "Group project lunch", emotions: ["Social", "Stress"] },
    { id: 7, date: "2024-12-15", amount: 400, category: "misc", note: "Movie ticket", emotions: ["Calm"] },
    { id: 8, date: "2024-12-12", amount: 950, category: "food", note: "Birthday celebration", emotions: ["Social"] },
    { id: 9, date: "2024-12-10", amount: 250, category: "transport", note: "Auto fare", emotions: ["Calm"] },
    { id: 10, date: "2024-12-08", amount: 1500, category: "academics", note: "Course textbooks", emotions: ["Stress"] },

    // November 2024
    { id: 11, date: "2024-11-28", amount: 550, category: "food", note: "Pizza night with friends", emotions: ["Social"] },
    { id: 12, date: "2024-11-25", amount: 800, category: "food", note: "Stress eating during exams", emotions: ["Stress", "Impulse"] },
    { id: 13, date: "2024-11-22", amount: 400, category: "transport", note: "Bus pass renewal", emotions: ["Calm"] },
    { id: 14, date: "2024-11-20", amount: 350, category: "food", note: "Coffee and donuts", emotions: ["Stress"] },
    { id: 15, date: "2024-11-15", amount: 1200, category: "personal", note: "New headphones", emotions: ["Impulse"] },
    { id: 16, date: "2024-11-10", amount: 600, category: "academics", note: "Lab materials", emotions: ["Calm"] },
    { id: 17, date: "2024-11-05", amount: 450, category: "misc", note: "Gym membership", emotions: ["Calm"] },
  ];

  const emotions = [
    { label: "Calm", color: "bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200" },
    { label: "Stress", color: "bg-red-100 text-red-700 border-red-300 hover:bg-red-200" },
    { label: "Social", color: "bg-purple-100 text-purple-700 border-purple-300 hover:bg-purple-200" },
    { label: "Impulse", color: "bg-orange-100 text-orange-700 border-orange-300 hover:bg-orange-200" },
  ];

  const categoryIcons = {
    food: "🍔",
    transport: "🚗",
    academics: "📚",
    personal: "💼",
    misc: "📦",
  };

  const categoryColors = {
    food: "bg-amber-50 border-amber-200",
    transport: "bg-blue-50 border-blue-200",
    academics: "bg-purple-50 border-purple-200",
    personal: "bg-pink-50 border-pink-200",
    misc: "bg-gray-50 border-gray-200",
  };

  const toggleEmotion = (emotion) => {
    setSelectedEmotions(prev =>
      prev.includes(emotion)
        ? prev.filter(e => e !== emotion)
        : [...prev, emotion]
    );
  };

  // Group entries by month
  const groupedEntries = previousEntries.reduce((acc, entry) => {
    const date = new Date(entry.date);
    const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(entry);
    return acc;
  }, {});

  return (
    <div className="flex flex-col px-12 py-16">
      <div className="flex-1 max-w-2xl mx-auto w-full space-y-10">
        <div className="inline-flex items-center gap-2 text-blue-600 mb-4">
          <Plus size={24} />
          <span className="text-sm uppercase tracking-wider font-medium">Expense Entry</span>
        </div>

        <h1 className="text-4xl">Add expense</h1>

        <div className="space-y-8">
          <div className="space-y-3">
            <label className="text-base font-medium">Amount</label>
            <Input
              type="text"
              value={`₹ ${amount}`}
              onChange={(e) => setAmount(e.target.value.replace('₹ ', ''))}
              className="text-2xl border-2 border-gray-200 focus:border-blue-500 h-16 px-4"
            />

            <label class="text-sm font-medium">Date</label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border-2 border-gray-200 h-12"
            />
          </div>

          <div className="space-y-3">
            <label className="text-base font-medium">Category</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="border-2 border-gray-200 focus:border-blue-500 h-14 text-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="food">🍔 Food</SelectItem>
                <SelectItem value="transport">🚗 Transport</SelectItem>
                <SelectItem value="academics">📚 Academics</SelectItem>
                <SelectItem value="personal">💼 Personal</SelectItem>
                <SelectItem value="misc">📦 Misc</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <label className="text-base font-medium">Optional note</label>
            <Input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="border-2 border-gray-200 focus:border-blue-500 h-14 text-lg px-4"
              placeholder="What was this for?"
            />
          </div>

          <div className="space-y-3">
            <label className="text-base font-medium">Emotion tags</label>
            <p className="text-sm text-gray-500">How did you feel about this purchase?</p>
            <div className="flex flex-wrap gap-3">
              {emotions.map((emotion) => (
                <button
                  key={emotion.label}
                  onClick={() => toggleEmotion(emotion.label)}
                  className={`px-6 py-3 rounded-lg border-2 text-base font-medium transition-all ${selectedEmotions.includes(emotion.label)
                      ? emotion.color + " shadow-sm"
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                    }`}
                >
                  {emotion.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-6">
          <Button
            onClick={onContinue}
            className="w-full bg-blue-600 text-white hover:bg-blue-700 h-14 text-lg"
          >
            Add expense
          </Button>
        </div>

        {/* Previous Entries */}
        <div className="pt-12 border-t-2 border-gray-100">
          <h2 className="text-2xl mb-6">Previous entries</h2>

          <div className="space-y-8">
            {Object.entries(groupedEntries).map(([monthYear, entries]) => (
              <div key={monthYear} className="space-y-3">
                <div className="flex items-center gap-2 text-gray-600 mb-3">
                  <Calendar size={16} />
                  <span className="text-sm font-medium uppercase tracking-wide">{monthYear}</span>
                </div>

                <div className="space-y-2">
                  {entries.map((entry) => (
                    <div
                      key={entry.id}
                      className={`p-4 border-2 rounded-lg ${categoryColors[entry.category]} hover:shadow-sm transition-shadow`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{categoryIcons[entry.category]}</span>
                          <div>
                            <p className="font-medium text-base">{entry.note}</p>
                            <p className="text-sm text-gray-600 capitalize">{entry.category} • {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                          </div>
                        </div>
                        <span className="text-lg font-semibold">₹{entry.amount}</span>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-3">
                        {entry.emotions.map((emotion) => {
                          const emotionColor = emotions.find(e => e.label === emotion)?.color || "";
                          return (
                            <span
                              key={emotion}
                              className={`text-xs px-3 py-1 rounded-full border ${emotionColor}`}
                            >
                              {emotion}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
