import { useState } from "react";
import { Button } from "./ui/button"; 
import { Input } from "./ui/input";
import { ArrowRight, User, Mail, Lock, Sparkles } from "lucide-react";

export function AuthPage({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false);
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleSignup = (e) => {
    e.preventDefault();
    if (signupData.fullName && signupData.email && signupData.password) {
      // Store user data in localStorage
      localStorage.setItem("unfold_user", JSON.stringify({
        name: signupData.fullName,
        email: signupData.email,
      }));
      onLogin({ name: signupData.fullName, email: signupData.email });
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginData.email && loginData.password) {
      // Check if user exists in localStorage or create a guest user
      const storedUser = localStorage.getItem("unfold_user");
      if (storedUser) {
        onLogin(JSON.parse(storedUser));
      } else {
        // Create a default user
        const user = { name: "Student", email: loginData.email };
        localStorage.setItem("unfold_user", JSON.stringify(user));
        onLogin(user);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-teal-50 flex items-center justify-center p-8">
      <div className="w-full max-w-6xl">
        {/* Logo/Brand Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-teal-600 flex items-center justify-center shadow-lg">
              <Sparkles className="text-white" size={24} />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-teal-600 bg-clip-text text-transparent">
              UnFold
            </h1>
          </div>
          <p className="text-xl text-gray-600">Patterns over prescriptions.</p>
        </div>

        {/* Main Auth Container */}
        <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid md:grid-cols-2 min-h-[600px]">
            {/* Left Side - Signup */}
            <div
              className={`p-12 flex flex-col justify-center transition-all duration-500 ${
                isSignup
                  ? "bg-gradient-to-br from-indigo-50 to-purple-50 border-r-4 border-indigo-200"
                  : "bg-gray-50"
              }`}
            >
              <div className="max-w-md mx-auto w-full">
                <div className="mb-8">
                  <h2 className="text-3xl font-semibold mb-2">
                    Welcome to <span className="text-indigo-600">UnFold</span>
                  </h2>
                  <p className="text-gray-600 text-lg">Create your account</p>
                </div>

                <form onSubmit={handleSignup} className="space-y-5" action="/signup">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <User size={16} />
                      Full Name
                    </label>
                    <Input
                      type="text"
                      value={signupData.fullName}
                      onChange={(e) =>
                        setSignupData({ ...signupData, fullName: e.target.value })
                      }
                      placeholder="Enter your full name"
                      className="h-14 border-2 border-gray-200 focus:border-indigo-500 rounded-xl text-base"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Mail size={16} />
                      Email
                    </label>
                    <Input
                      type="email"
                      value={signupData.email}
                      onChange={(e) =>
                        setSignupData({ ...signupData, email: e.target.value })
                      }
                      placeholder="Enter your email"
                      className="h-14 border-2 border-gray-200 focus:border-indigo-500 rounded-xl text-base"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Lock size={16} />
                      Password
                    </label>
                    <Input
                      type="password"
                      value={signupData.password}
                      onChange={(e) =>
                        setSignupData({ ...signupData, password: e.target.value })
                      }
                      placeholder="Create a password"
                      className="h-14 border-2 border-gray-200 focus:border-indigo-500 rounded-xl text-base"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-14 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-lg font-medium shadow-lg hover:shadow-xl transition-all"
                  >
                    Create My Account
                  </Button>
                </form>
              </div>
            </div>

            {/* Center Toggle Button */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden md:block">
              <button
                onClick={() => setIsSignup(!isSignup)}
                className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-600 to-teal-600 text-white shadow-2xl hover:scale-110 transition-transform flex items-center justify-center group"
              >
                <ArrowRight
                  className={`transition-transform duration-500 ${
                    isSignup ? "rotate-180" : ""
                  }`}
                  size={24}
                />
              </button>
            </div>

            {/* Right Side - Login */}
            <div
              className={`p-12 flex flex-col justify-center transition-all duration-500 ${
                !isSignup
                  ? "bg-gradient-to-br from-teal-50 to-emerald-50 border-l-4 border-teal-200"
                  : "bg-gray-50"
              }`}
            >
              <div className="max-w-md mx-auto w-full">
                <div className="mb-8">
                  <h2 className="text-3xl font-semibold mb-2">
                    Login your account
                  </h2>
                  <p className="text-gray-600 text-lg">Continue your journey</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Mail size={16} />
                      Email
                    </label>
                    <Input
                      type="email"
                      value={loginData.email}
                      onChange={(e) =>
                        setLoginData({ ...loginData, email: e.target.value })
                      }
                      placeholder="Enter your email"
                      className="h-14 border-2 border-gray-200 focus:border-teal-500 rounded-xl text-base"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Lock size={16} />
                      Password
                    </label>
                    <Input
                      type="password"
                      value={loginData.password}
                      onChange={(e) =>
                        setLoginData({ ...loginData, password: e.target.value })
                      }
                      placeholder="Enter your password"
                      className="h-14 border-2 border-gray-200 focus:border-teal-500 rounded-xl text-base"
                      required
                    />
                  </div>

                  <div className="flex items-center justify-end">
                    <button
                      type="button"
                      className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-14 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-xl text-lg font-medium shadow-lg hover:shadow-xl transition-all"
                  >
                    Login
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-gray-600">
                    Don't have an account?{" "}
                    <button
                      onClick={() => setIsSignup(true)}
                      className="text-teal-600 hover:text-teal-700 font-medium"
                    >
                      Sign up
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden p-6 border-t-2 border-gray-100 bg-gray-50 text-center">
            <button
              onClick={() => setIsSignup(!isSignup)}
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              {isSignup
                ? "Already have an account? Login →"
                : "Need an account? Sign up →"}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>Your journey to financial self-awareness starts here</p>
        </div>
      </div>
    </div>
  );
}
