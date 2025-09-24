import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LoginPage } from "@/components/auth/LoginPage";
import { AppProviders } from "@/components/providers/AppProviders";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

function AppContent() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

const App = () => (
  <AppProviders>
    <AppContent />
  </AppProviders>
);

export default App;
