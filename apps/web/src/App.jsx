import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import UploadPage from './pages/UploadPage';
import AssetPreviewPage from './pages/AssetPreviewPage';
import ExportHistoryPage from './pages/ExportHistoryPage';
import PricingPage from './pages/PricingPage';
import CancelPage from './pages/CancelPage';
import SuccessPage from './pages/SuccessPage';

import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/cancel" element={<CancelPage />} />

        {/* Protected routes for logged-in users */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/preview" element={<AssetPreviewPage />} />
          <Route path="/history" element={<ExportHistoryPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
