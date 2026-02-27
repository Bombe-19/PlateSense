import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { LogOut, User } from "lucide-react";
import logo from "@/assets/logo.png";
import { apiClient } from "@/services/apiClient";

const Navbar = ({ isAuthenticated = false }: { isAuthenticated?: boolean }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserProfile();
    }
  }, [isAuthenticated]);

  const fetchUserProfile = async () => {
    try {
      const userId = apiClient.getUserId();
      if (userId) {
        const profile = await apiClient.getUserProfile(userId);
        setUser(profile);
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    }
  };

  const handleLogout = () => {
    apiClient.logout();
    setUser(null);
    setShowDropdown(false);
    navigate("/");
  };

  const getInitials = (user: any) => {
    if (!user) return "U";
    const name = user.full_name || user.username;
    return name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";
  };

  const navLinks = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/analysis", label: "New Analysis" },
    { to: "/history", label: "History" },
    { to: "/reports", label: "Reports" },
  ];

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="glass-card sticky top-0 z-50 border-b border-border/50 m-4 rounded-full"
    >
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="cursor-target flex items-center gap-2">
          <img src={logo} alt="Food Caliper" className="h-9 w-9 rounded-lg" />
          <span className="text-lg font-bold text-foreground">Food Caliper</span>
        </Link>

        {isAuthenticated ? (
          <>
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`cursor-target px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    location.pathname === link.to
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="cursor-target h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary hover:bg-primary/20 transition-colors"
              >
                {getInitials(user)}
              </button>
              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-56 rounded-xl glass-card border border-border p-2 shadow-lg z-50"
                  >
                    {user && (
                      <>
                        <div className="px-3 py-2 border-b border-border/50 mb-2">
                          <p className="font-semibold text-foreground">{user.full_name || user.username}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                        <button
                          onClick={() => navigate(`/profile`)}
                          className="cursor-target w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm text-foreground mb-1"
                        >
                          <User className="h-4 w-4" />
                          View Profile
                        </button>
                        <button
                          onClick={handleLogout}
                          className="cursor-target w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-500/10 transition-colors text-sm text-red-500"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="cursor-target px-5 py-2 rounded-xl text-sm font-medium border border-border text-foreground hover:bg-muted transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/login"
              className="cursor-target px-5 py-2 rounded-xl text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Let's Caliper
            </Link>
          </div>
        )}
      </div>
    </motion.header>
  );
};

export default Navbar;
