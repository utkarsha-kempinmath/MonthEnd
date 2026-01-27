import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useState } from "react";
import { WalletMinimal } from "lucide-react";

export function Screen2Allowance({ onContinue }) {
  const [amount, setAmount] = useState("10,000");
  const [source, setSource] = useState("parent");
  const [period, setPeriod] = useState("")
  const [startDate, setDate] = useState("")

  return (
    <div className="flex flex-col min-h-[600px] px-12 py-16">
      <div className="flex-1 max-w-xl mx-auto w-full space-y-10">
        <div className="inline-flex items-center gap-2 text-emerald-600 mb-4">
          <WalletMinimal size={24} />
          <span className="text-sm uppercase tracking-wider font-medium">Setup</span>
        </div>

        <h1 className="text-4xl">Monthly allowance</h1>

        <div className="space-y-8">
          <div className="space-y-3">
            <label className="text-base font-medium">Amount</label>
            <Input
              type="text"
              value={`₹ ${amount}`}
              onChange={(e) => setAmount(e.target.value.replace('₹ ', ''))}
              className="text-2xl border-2 border-gray-200 focus:border-emerald-500 h-16 px-4"
            />
            <label className="text-base font-medium">Period</label>
            <Input
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              placeholder="e.g. 1 month"
              className="border-2 border-gray-200 h-12"
            />
            <label className="text-sm font-medium">Start date</label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border-2 border-gray-200 h-12"
            />
          </div>

          <div className="space-y-3">
            <label className="text-base font-medium">Source</label>
            <Select value={source} onValueChange={setSource}>
              <SelectTrigger className="border-2 border-gray-200 focus:border-emerald-500 h-14 text-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="parent">Parent / Guardian</SelectItem>
                <SelectItem value="scholarship">Scholarship</SelectItem>
                <SelectItem value="parttime">Part-time Work</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="pt-6">
          <Button
            onClick={onContinue}
            className="w-full bg-emerald-600 text-white hover:bg-emerald-700 h-14 text-lg"
          >
            Set baseline →
          </Button>
        </div>
      </div>
    </div>
  );
}
