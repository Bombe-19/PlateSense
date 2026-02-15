import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="page-gradient flex min-h-screen items-center justify-center p-4">
      <div className="glass-card p-12 max-w-md w-full text-center">
        <h1 className="mb-4 text-6xl font-bold text-foreground">404</h1>
        <p className="mb-6 text-lg text-muted-foreground">Oops! Page not found</p>
        <a href="/" className="cursor-target inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
