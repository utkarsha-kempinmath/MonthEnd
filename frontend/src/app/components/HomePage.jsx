import { Button } from "./ui/button";
import { 
  Sparkles, 
  WalletMinimal, 
  ChartPie, 
  Plus, 
  ChartBar, 
  Target, 
  Lightbulb, 
  Share2,
  ArrowRight,
  CalendarDays,
  MessageCircle
} from "lucide-react";

export function HomePage({ onNavigate }) {
  const sections = [
    {
      id: 10,
      title: "Ask Before You Spend",
      description: "Get personalized insights for confident decisions",
      icon: MessageCircle,
      color: "indigo",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-700",
      hoverColor: "hover:bg-indigo-100",
      borderColor: "border-indigo-200"
    },
    {
      id: 9,
      title: "Sync Calendar",
      description: "Connect academic events for better insights",
      icon: CalendarDays,
      color: "green",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
      hoverColor: "hover:bg-green-100",
      borderColor: "border-green-200"
    },
    {
      id: 2,
      title: "Setup Allowance",
      description: "Set your monthly baseline",
      icon: WalletMinimal,
      color: "emerald",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-700",
      hoverColor: "hover:bg-emerald-100",
      borderColor: "border-emerald-200"
    },
    {
      id: 3,
      title: "Expected Spending",
      description: "Plan your monthly distribution",
      icon: ChartPie,
      color: "violet",
      bgColor: "bg-violet-50",
      textColor: "text-violet-700",
      hoverColor: "hover:bg-violet-100",
      borderColor: "border-violet-200"
    },
    {
      id: 4,
      title: "Add Expense",
      description: "Track spending with emotion tags",
      icon: Plus,
      color: "blue",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      hoverColor: "hover:bg-blue-100",
      borderColor: "border-blue-200"
    },
    {
      id: 5,
      title: "Expected vs Actual",
      description: "Compare and find patterns",
      icon: ChartBar,
      color: "amber",
      bgColor: "bg-amber-50",
      textColor: "text-amber-700",
      hoverColor: "hover:bg-amber-100",
      borderColor: "border-amber-200"
    },
    {
      id: 6,
      title: "Goal Tracking",
      description: "Monitor your savings progress",
      icon: Target,
      color: "teal",
      bgColor: "bg-teal-50",
      textColor: "text-teal-700",
      hoverColor: "hover:bg-teal-100",
      borderColor: "border-teal-200"
    },
    {
      id: 7,
      title: "Monthly Reflection",
      description: "See your patterns and insights",
      icon: Lightbulb,
      color: "rose",
      bgColor: "bg-rose-50",
      textColor: "text-rose-700",
      hoverColor: "hover:bg-rose-100",
      borderColor: "border-rose-200"
    },
    {
      id: 8,
      title: "Share with Parents",
      description: "Keep parents informed about your journey",
      icon: Share2,
      color: "purple",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
      hoverColor: "hover:bg-purple-100",
      borderColor: "border-purple-200"
    }
  ];

  return (
    <div className="min-h-screen px-12 py-16">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h1 className="text-5xl">UnFold</h1>
          <p className="text-xl text-gray-600">Patterns over prescriptions.</p>
        </div>

        <div className="grid grid-cols-2 gap-6 pt-8">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => onNavigate(section.id)}
                className={`p-8 rounded-2xl border-2 ${section.borderColor} ${section.bgColor} ${section.hoverColor} transition-all text-left group`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-4 flex-1">
                    <div className={`w-14 h-14 rounded-xl ${section.bgColor} flex items-center justify-center ${section.textColor} group-hover:scale-110 transition-transform`}>
                      <Icon size={28} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold mb-2">{section.title}</h3>
                      <p className="text-lg text-gray-600">{section.description}</p>
                    </div>
                  </div>
                  <ArrowRight className={`${section.textColor} opacity-0 group-hover:opacity-100 transition-opacity mt-2`} size={24} />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
