import { useState } from "react";
import { AuthPage } from "./components/AuthPage.jsx";
import { HomePage } from "./components/HomePage.jsx";
import { Screen1Welcome } from "./components/Screen1Welcome.jsx";
import { Screen2Allowance } from "./components/Screen2Allowance.jsx";
import { Screen3ExpectedSpending } from "./components/Screen3ExpectedSpending.jsx";
import { Screen4AddExpense } from "./components/Screen4AddExpense.jsx";
import { Screen5ExpectedVsActual } from "./components/Screen5ExpectedVsActual.jsx";
import { Screen6Goal } from "./components/Screen6Goal.jsx";
import { Screen7Reflection } from "./components/Screen7Reflection.jsx";
import { Screen8ShareWithParents } from "./components/Screen8ShareWithParents.jsx";
import { Screen9CalendarSync } from "./components/Screen9CalendarSync.jsx";
import { Screen10Chatbot } from "./components/Screen10Chatbot.jsx";
import { Button } from "./components/ui/button";
import { Home, LogOut } from "lucide-react";
import { useEffect } from "react";
import axios from "axios";

export default function App() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("unfold_user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    axios
      .get("/api/test", { withCredentials: true })
      .then((res) => console.log("Backend says:", res.data))
      .catch((err) => console.error(err));
  }, []);

  const [currentScreen, setCurrentScreen] = useState(0); // 0 is home page

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("unfold_user");
    setUser(null);
    setCurrentScreen(0);
  };

  // Show auth page if not logged in
  if (!user) {
    return <AuthPage onLogin={handleLogin} />;
  }

  const handleContinue = () => {
    if (currentScreen === 7) {
      setCurrentScreen(8); // Go to share screen after reflection
    } else if (currentScreen === 8 || currentScreen === 9 || currentScreen === 10) {
      setCurrentScreen(0); // Return to home after share, calendar sync, or chatbot
    } else if (currentScreen < 8 && currentScreen !== 0) {
      setCurrentScreen(currentScreen + 1);
    }
  };

  const handleNavigate = (screen) => {
    setCurrentScreen(screen);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 0:
        return <HomePage onNavigate={handleNavigate} />;
      case 1:
        return <Screen1Welcome onContinue={handleContinue} />;
      case 2:
        return <Screen2Allowance onContinue={handleContinue} />;
      case 3:
        return <Screen3ExpectedSpending onContinue={handleContinue} />;
      case 4:
        return <Screen4AddExpense onContinue={handleContinue} />;
      case 5:
        return <Screen5ExpectedVsActual onContinue={handleContinue} />;
      case 6:
        return <Screen6Goal onContinue={handleContinue} />;
      case 7:
        return <Screen7Reflection onContinue={handleContinue} />;
      case 8:
        return <Screen8ShareWithParents onContinue={handleContinue} />;
      case 9:
        return <Screen9CalendarSync onContinue={handleContinue} />;
      case 10:
        return <Screen10Chatbot onContinue={handleContinue} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {user && (
              <span className="text-sm text-gray-600">Welcome, <span className="font-medium text-gray-900">{user.name}</span></span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {currentScreen !== 0 && (
              <Button
                onClick={() => setCurrentScreen(0)}
                variant="outline"
                className="flex items-center gap-2 border-2 border-gray-200 hover:bg-gray-50"
              >
                <Home size={18} />
                Home
              </Button>
            )}
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2 border-2 border-red-200 text-red-600 hover:bg-red-50"
            >
              <LogOut size={18} />
              Logout
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {renderScreen()}
        </div>
      </div>
    </div>
  );
}