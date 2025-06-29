
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Layout } from "@/components/layout/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import GraphEditor from "./pages/GraphEditor";
import Metrics from "./pages/Metrics";
import DataSources from "./pages/DataSources";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} 
      />
      
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route 
          path="editor" 
          element={
            <ProtectedRoute roles={['Editor', 'Admin']}>
              <GraphEditor />
            </ProtectedRoute>
          } 
        />
        <Route path="metrics" element={<Metrics />} />
        <Route 
          path="datasources" 
          element={
            <ProtectedRoute roles={['Admin']}>
              <DataSources />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="settings" 
          element={
            <ProtectedRoute roles={['Admin']}>
              <Settings />
            </ProtectedRoute>
          } 
        />
        <Route path="help" element={<Help />} />
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
