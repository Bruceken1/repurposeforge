import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import UploadPage from './pages/UploadPage.jsx';
import ProcessingPage from './pages/ProcessingPage.jsx';
import AssetPreviewPage from './pages/AssetPreviewPage.jsx';
import ExportPage from './pages/ExportPage.jsx';
import ExportHistoryPage from './pages/ExportHistoryPage.jsx';
import PricingPage from './pages/PricingPage.jsx';
import SuccessPage from './pages/SuccessPage.jsx';
import CancelPage from './pages/CancelPage.jsx';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/cancel" element={<CancelPage />} />
          
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <UploadPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/processing/:projectId"
            element={
              <ProtectedRoute>
                <ProcessingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/asset-preview/:projectId"
            element={
              <ProtectedRoute>
                <AssetPreviewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/export/:projectId"
            element={
              <ProtectedRoute>
                <ExportPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/export-history"
            element={
              <ProtectedRoute>
                <ExportHistoryPage />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default App;