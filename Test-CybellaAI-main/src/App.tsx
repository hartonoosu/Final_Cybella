import { ToastProvider } from "@/components/ui/toast-system";
import { SonnerToaster } from "@/components/ui/toast-system";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserPreferencesProvider } from "@/contexts/UserPreferencesContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ConnectivityWarning from "@/components/ConnectivityWarning";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile"

// Create a client for React Query
const queryClient = new QueryClient();

// Protected Route component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = localStorage.getItem("auth") !== null;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserPreferencesProvider>
      <BrowserRouter basename="/Test-CybellaAI/">
        <AuthProvider>
          <TooltipProvider>
            <ToastProvider />
            <SonnerToaster />
            <ConnectivityWarning />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/chat" element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              } />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </UserPreferencesProvider>
  </QueryClientProvider>
);

export default App;