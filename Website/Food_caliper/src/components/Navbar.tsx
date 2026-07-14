import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { LogOut, User, Menu, X, BarChart4, Microscope, FileText } from "lucide-react";
import logo from "@/assets/logo.png";
import { apiClient } from "@/services/apiClient";
import { useLenis } from "lenis/react";

const Navbar = ({ isAuthenticated = false }: { isAuthenticated?: boolean }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const lenis = useLenis();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserProfile();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, to: string) => {
    if (to.startsWith("#")) {
      e.preventDefault();
      
      // If we are on index page, scroll directly
      if (location.pathname === "/") {
        if (to === "#") {
          lenis?.scrollTo(0);
        } else {
          const targetEl = document.querySelector(to);
          if (targetEl) {
            lenis?.scrollTo(targetEl, { offset: -80 });
          }
        }
      } else {
        // If on another page, navigate to homepage first, then scroll
        navigate("/", { state: { scrollTo: to } });
      }
    }
  };

  const navLinks = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/analysis", label: "New Analysis" },
    { to: "/reports", label: "Reports" },
  ];

  const publicNavLinks = [
    { to: "#", label: "Home" },
    { to: "#product", label: "Product" },
    { to: "#solutions", label: "Solutions" },
    { to: "#platform", label: "Platform" },
    { to: "#features", label: "Technology" },
  ];

  return (
    <>
      <motion.header
        layout
        transition={{ type: "spring", stiffness: 180, damping: 22 }}
        className={`sticky z-50 flex items-center justify-between whitespace-nowrap transition-all duration-300 ${
          isScrolled
            ? "top-6 w-[90%] max-w-7xl rounded-full premium-glass bg-black/40 border border-white/10 py-3 px-6 shadow-2xl mx-auto backdrop-blur-2xl"
            : "top-0 w-full max-w-none rounded-none bg-white/90 dark:bg-slate-950/95 border-b border-slate-200 dark:border-slate-900 py-5 px-6 md:px-20 mx-auto backdrop-blur-md"
        }`}
      >
        {/* Logo (Left side) */}
        <div className="flex items-center gap-2">
          <img src={logo} alt="FoodCaliper" className="h-9 w-9" />
          <Link 
            to="/" 
            className={`text-xl font-black leading-tight tracking-tight hover:opacity-80 transition-all hidden md:block ${
              isScrolled ? "text-white" : "text-slate-900 dark:text-white"
            }`}
          >
            FoodCaliper
          </Link>
        </div>

        {/* Desktop Links (Center) */}
        <div className="hidden md:flex items-center gap-8">
          {isAuthenticated ? (
            navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-semibold transition-colors ${
                  isScrolled
                    ? location.pathname === link.to
                      ? "text-orange-500"
                      : "text-white/60 hover:text-white"
                    : location.pathname === link.to
                      ? "text-orange-600 dark:text-orange-500"
                      : "text-slate-700 dark:text-slate-200 hover:text-orange-600 dark:hover:text-orange-500"
                }`}
              >
                {link.label}
              </Link>
            ))
          ) : (
            publicNavLinks.map((link) => (
              <a
                key={link.to}
                href={link.to}
                onClick={(e) => handleNavClick(e, link.to)}
                className={`text-sm font-semibold transition-colors ${
                  isScrolled
                    ? "text-white/60 hover:text-white"
                    : "text-slate-700 dark:text-slate-200 hover:text-orange-600 dark:hover:text-orange-500"
                }`}
              >
                {link.label}
              </a>
            ))
          )}
        </div>

        {/* CTA & Profile (Right side) */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                  isScrolled
                    ? "bg-orange-500/20 border border-orange-500/50 text-orange-500 hover:bg-orange-500/40"
                    : "bg-orange-600/10 text-orange-600 dark:text-orange-500 hover:bg-orange-600/20"
                }`}
              >
                {getInitials(user)}
              </button>
              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className={`absolute right-0 mt-4 w-56 rounded-2xl p-2 shadow-2xl z-[70] border ${
                      isScrolled
                        ? "bg-black/90 backdrop-blur-xl border-white/10"
                        : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-900"
                    }`}
                  >
                    {user && (
                      <>
                        <div className="px-3 py-3 border-b mb-2 border-slate-100 dark:border-slate-900">
                          <p className={`font-semibold ${isScrolled ? "text-white" : "text-slate-900 dark:text-white"}`}>
                            {user.full_name || user.username}
                          </p>
                          <p className={`text-xs ${isScrolled ? "text-white/50" : "text-slate-500 dark:text-slate-400"}`}>
                            {user.email}
                          </p>
                        </div>
                        <button
                          onClick={() => { setShowDropdown(false); navigate(`/profile`); }}
                          className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl transition-colors text-sm mb-1 ${
                            isScrolled
                              ? "hover:bg-white/10 text-white/80 hover:text-white"
                              : "hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-200"
                          }`}
                        >
                          <User className="h-4 w-4" />
                          Profile
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-red-500/10 transition-colors text-sm text-red-500"
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
          ) : (
            <Link 
              to="/login"
              className={`hidden md:flex items-center justify-center font-bold text-white transition-all ${
                isScrolled
                  ? "h-9 px-5 rounded-full text-sm bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)] hover:bg-orange-400"
                  : "h-11 px-6 rounded-xl text-sm bg-orange-600 shadow-lg shadow-orange-600/20 hover:bg-orange-700"
              }`}
            >
              Let's Caliper
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setShowMobileMenu(!showMobileMenu)} 
            className={`md:hidden flex items-center justify-center h-9 w-9 rounded-full transition-colors ${
              isScrolled 
                ? "bg-white/10 text-white hover:bg-white/20" 
                : "bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-800"
            }`}
          >
            {showMobileMenu ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(16px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="fixed inset-0 z-[55] bg-black/80 flex flex-col items-center justify-center px-6 pointer-events-auto"
          >
            <div className="flex flex-col gap-6 w-full max-w-sm">
              {isAuthenticated ? (
                <>
                  {[
                    { to: "/dashboard", label: "Dashboard", icon: <BarChart4 size={20} /> },
                    { to: "/analysis", label: "New Analysis", icon: <Microscope size={20} /> },
                    { to: "/reports", label: "Reports", icon: <FileText size={20} /> },
                    { to: "/profile", label: "Profile", icon: <User size={20} /> },
                  ].map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setShowMobileMenu(false)}
                      className="flex items-center gap-4 text-xl font-bold text-white/70 hover:text-white transition-colors p-4 rounded-2xl hover:bg-white/5"
                    >
                      <span className="text-orange-500">{link.icon}</span>
                      {link.label}
                    </Link>
                  ))}
                  <button
                    onClick={() => { setShowMobileMenu(false); handleLogout(); }}
                    className="flex items-center gap-4 text-xl font-bold text-red-400 hover:text-red-300 transition-colors p-4 rounded-2xl hover:bg-red-500/10 mt-4"
                  >
                    <LogOut size={20} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  {publicNavLinks.map((link) => (
                    <a
                      key={link.to}
                      href={link.to}
                      onClick={(e) => {
                        setShowMobileMenu(false);
                        handleNavClick(e, link.to);
                      }}
                      className="flex items-center gap-4 text-2xl font-bold text-white/70 hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  ))}
                  <Link 
                    to="/login"
                    onClick={() => setShowMobileMenu(false)}
                    className="mt-8 flex h-14 items-center justify-center rounded-full bg-orange-600 text-white text-lg font-bold shadow-[0_0_20px_rgba(234,88,12,0.4)] hover:bg-orange-500"
                  >
                    Let's Caliper
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
