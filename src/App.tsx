import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider, useAuth } from "@/components/AuthContext";
import { Layout } from "@/components/layout/Layout";
import { LandingPage } from "@/pages/LandingPage";
import { LoginPage } from "@/pages/auth/LoginPage";
import { OrganizationsPage } from "@/pages/OrganizationsPage";
import { UserManagementPage } from "@/pages/UserManagementPage";
import { PatientsPage } from "@/pages/PatientsPage";
import PatientDetailPage from "@/pages/PatientDetailPage";
import { PractitionersPage } from "@/pages/PractitionersPage";
import { AppointmentsPage } from "@/pages/AppointmentsPage";
import { Dashboard } from "@/pages/Dashboard";
import { AIHub } from "@/pages/AIHub";
import { EncountersPage } from '@/pages/EncountersPage'
import { ObservationsPage } from '@/pages/ObservationsPage'
import { MedicationsPage } from '@/pages/MedicationsPage'
import { ImmunizationsPage } from '@/pages/ImmunizationsPage'
import { CarePlansPage } from '@/pages/CarePlansPage'
import { DiagnosticsPage } from '@/pages/DiagnosticsPage'
import { BillingPage } from '@/pages/BillingPage'
import { ConsentPage } from '@/pages/ConsentPage'
import { TerminologyPage } from '@/pages/TerminologyPage'
import { NotFound } from './pages/NotFound';

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="vitalai-theme">
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<Dashboard />} />
              </Route>
              <Route path="/ai-hub" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<AIHub />} />
              </Route>
              {/* Placeholder routes for other pages */}
              <Route path="/organizations" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<OrganizationsPage />} />
              </Route>
              <Route path="/users" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<UserManagementPage />} />
              </Route>
              <Route path="/patients" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<PatientsPage />} />
                <Route path=":patientId" element={<PatientDetailPage />} />
              </Route>
              <Route path="/practitioners" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<PractitionersPage />} />
              </Route>
              <Route path="/appointments" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<AppointmentsPage />} />
              </Route>
              <Route path="/encounters" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<EncountersPage />} />
              </Route>
              <Route path="/observations" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<ObservationsPage />} />
              </Route>
              <Route path="/medications" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<MedicationsPage />} />
              </Route>
              <Route path="/immunizations" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<ImmunizationsPage />} />
              </Route>
              <Route path="/care-plans" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<CarePlansPage />} />
              </Route>
              <Route path="/diagnostics" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<DiagnosticsPage />} />
              </Route>
              <Route path="/billing" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<BillingPage />} />
              </Route>
              <Route path="/consent" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<ConsentPage />} />
              </Route>
              <Route path="/terminology" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<TerminologyPage />} />
              </Route>
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
