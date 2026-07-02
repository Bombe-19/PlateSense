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
    { to: "/reports", label: "Reports" },
  ];

  const publicNavLinks = [
    { to: "#", label: "Home" },
    { to: "#product", label: "Problem" },
    { to: "#solutions", label: "Solutions" },
    { to: "#platform", label: "Platform" },
    { to: "#features", label: "Technology" },
  ];

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex items-center justify-between whitespace-nowrap border-b border-slate-200 dark:border-slate-900 px-6 md:px-20 py-5 bg-white/90 dark:bg-slate-950/95 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300"
    >
      <div className="flex items-center gap-2 text-slate-900 dark:text-white">
        <img src={logo} alt="FoodCaliper" className="h-9 w-9" />
        <Link to="/" className="cursor-target text-xl font-black leading-tight tracking-tight hover:opacity-80 transition-all text-slate-900 dark:text-white">
          FoodCaliper
        </Link>
      </div>

      <div className="hidden md:flex flex-1 justify-end gap-10 items-center">
        {isAuthenticated ? (
          <>
            <nav className="flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`cursor-target text-sm font-semibold hover:text-primary transition-colors ${
                    location.pathname === link.to
                      ? "text-primary"
                      : "text-slate-700 dark:text-slate-200"
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
          <>
            <nav className="flex items-center gap-8">
              {publicNavLinks.map((link) => (
                <a
                  key={link.to}
                  href={link.to}
                  className="cursor-target text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-primary transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <button className="cursor-target flex min-w-[120px] items-center justify-center rounded-xl h-11 px-6 bg-orange-600 text-white text-sm font-bold shadow-lg shadow-orange-600/20 hover:bg-orange-700 transition-colors">
              <Link to="/login" className="w-full h-full flex items-center justify-center">
                Let's Caliper
              </Link>
            </button>
          </>
        )}
      </div>
      <button className="md:hidden material-symbols-outlined text-slate-900 dark:text-white">menu</button>
    </motion.header>
  );
};

export default Navbar;
