
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#8B5CF6] to-[#C4B5FD]">
      <div className="text-center bg-white/20 backdrop-blur-md p-8 rounded-lg border border-white/30 shadow-lg">
        <h1 className="text-5xl font-bold mb-4 text-white">404</h1>
        <p className="text-xl text-white/90 mb-6">Oops! Page not found</p>
        <Link to="/" className="text-white bg-purple-600 px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;