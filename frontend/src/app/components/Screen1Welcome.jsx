import { Button } from "./ui/button";
import { Sparkles } from "lucide-react";

export function Screen1Welcome({ onContinue }) {
  return (
    <div className="flex flex-col min-h-[600px] px-12 py-16">
      <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto space-y-10">
        <div className="inline-flex items-center gap-2 text-indigo-600 mb-4">
          <Sparkles size={24} />
          <span className="text-sm uppercase tracking-wider font-medium">Financial Self-Awareness</span>
        </div>
        
        <h1 className="text-5xl leading-tight">Understand how you use money.</h1>
        
        <p className="text-xl leading-relaxed text-gray-600">
          This app doesn't tell you what to buy. It helps you see your spending patterns clearly. 
          Awareness first. Decisions stay yours.
        </p>

        <div className="pt-4">
          <Button 
            onClick={onContinue}
            className="bg-indigo-600 text-white hover:bg-indigo-700 px-8 py-6 text-lg"
          >
            Continue →
          </Button>
        </div>
      </div>
    </div>
  );
}
