import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, AlertCircle, CheckCircle, Home, Microscope, BarChart4, Settings, User } from "lucide-react";
import logo from "@/assets/logo.png";
import Dock from "@/components/Dock";
import { apiClient } from "@/services/apiClient";

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setError(null);
    setSuccess(false);
    setIsLoading(true);

    try {
      // Send the Google token to backend for verification
      const response = await apiClient.post(`/auth/google-login`, {
        token: credentialResponse.credential
      });

      // Store user_id from response
      localStorage.setItem("userId", response.data.user.id);

      setSuccess(true);
      setTimeout(() => {
        navigate("/analysis");
      }, 1000);
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || "Google authentication failed";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Google authentication failed");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsLoading(true);

    try {
      if (isSignUp) {
        // Register
        if (!username || !email || !password) {
          throw new Error("Please fill in all required fields");
        }
        if (password.length < 6) {
          throw new Error("Password must be at least 6 characters");
        }
        await apiClient.register(username, email, password, fullName);
      } else {
        // Login
        if (!email || !password) {
          throw new Error("Please enter email and password");
        }
        await apiClient.login(email, password);
      }

      setSuccess(true);
      setTimeout(() => {
        navigate("/analysis");
      }, 1000);
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || "Authentication failed";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-gradient flex items-center justify-center min-h-screen p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="glass-card w-full max-w-md p-8"
      >
        <div className="text-center mb-8">
          <Link to="/" className="cursor-target inline-flex items-center gap-2 mb-4">
            <img src={logo} alt="Food Caliper" className="h-10 w-10 rounded-lg" />
            <span className="text-xl font-bold text-foreground">Food Caliper</span>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isSignUp ? "Start analyzing your meals" : "Sign in to continue"}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/50 flex items-start gap-2"
          >
            <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-500">{error}</p>
          </motion.div>
        )}

        {/* Success Message */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/50 flex items-start gap-2"
          >
            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-green-500">
              {isSignUp ? "Account created successfully!" : "Login successful!"}
            </p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  className="cursor-target w-full pl-4 pr-4 py-3 rounded-xl bg-muted border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                />
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Full Name (Optional)"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={isLoading}
                  className="cursor-target w-full pl-4 pr-4 py-3 rounded-xl bg-muted border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                />
              </div>
            </>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="cursor-target w-full pl-10 pr-4 py-3 rounded-xl bg-muted border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="cursor-target w-full pl-10 pr-4 py-3 rounded-xl bg-muted border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="cursor-target w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full" />
                {isSignUp ? "Creating Account..." : "Signing In..."}
              </>
            ) : (
              <>
                {isSignUp ? "Sign Up" : "Sign In"} <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="mt-6 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-background text-muted-foreground">Or continue with</span>
          </div>
        </div>

        {/* Google Sign-In Button */}
        <button
          onClick={() => {
            // This is a placeholder for Google OAuth integration
            // In a real implementation, you would initialize GoogleLogin here
            setError("Google Sign-In requires setup. Use email/password for now.");
          }}
          disabled={isLoading}
          className="cursor-target w-full mt-4 py-3 rounded-xl border border-border bg-background text-foreground font-semibold hover:bg-muted transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Sign in with Google
        </button>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
              setSuccess(false);
            }}
            disabled={isLoading}
            className="cursor-target text-primary font-medium hover:underline disabled:opacity-50"
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </motion.div>

      {/* Navigation Dock */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
        <div className="pointer-events-auto">
          <Dock 
            items={[
              { 
                icon: <Home size={20} />, 
                label: 'Home', 
                onClick: () => navigate('/') 
              },
              { 
                icon: <Microscope size={20} />, 
                label: 'Analyze', 
                onClick: () => navigate('/analysis') 
              },
              { 
                icon: <BarChart4 size={20} />, 
                label: 'Dashboard', 
                onClick: () => navigate('/dashboard') 
              },
              { 
                icon: <Settings size={20} />, 
                label: 'Settings', 
                onClick: () => navigate('/login') 
              },
              { 
                icon: <User size={20} />, 
                label: 'Profile', 
                onClick: () => navigate('/login') 
              },
            ]}
            panelHeight={68}
            baseItemSize={50}
            magnification={70}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
