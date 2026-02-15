import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "@/assets/logo.png";

const Navbar = ({ isAuthenticated = false }: { isAuthenticated?: boolean }) => {
  const location = useLocation();

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
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                U
              </div>
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
