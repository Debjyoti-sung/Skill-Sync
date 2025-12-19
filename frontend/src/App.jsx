import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SplashScreen from './components/SplashScreen';
import Register from './components/Register';
import Login from './components/Login';
import ChooseGoal from './components/ChooseGoal';
import GoalSetup from './components/GoalSetup';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);

    // Check if user has completed onboarding
    const onboarding = localStorage.getItem('hasCompletedOnboarding');
    setHasCompletedOnboarding(onboarding === 'true');

    // Hide splash screen after checking (component handles its own timing)
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    // If authenticated but hasn't completed onboarding, redirect to choose goal
    if (!hasCompletedOnboarding) {
      return <Navigate to="/choose-goal" replace />;
    }

    return children;
  };

  // Auth Route (redirect if already logged in)
  const AuthRoute = ({ children }) => {
    if (isAuthenticated && hasCompletedOnboarding) {
      return <Navigate to="/dashboard" replace />;
    }
    return children;
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Splash Screen - shown first */}
          <Route path="/" element={<SplashScreen />} />

          {/* Auth Routes */}
          <Route 
            path="/auth" 
            element={
              <AuthRoute>
                <Login />
              </AuthRoute>
            } 
          />
          <Route 
            path="/login" 
            element={
              <AuthRoute>
                <Login />
              </AuthRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <AuthRoute>
                <Register />
              </AuthRoute>
            } 
          />

          {/* Onboarding Routes */}
          <Route 
            path="/choose-goal" 
            element={
              isAuthenticated ? <ChooseGoal /> : <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/goal-setup" 
            element={
              isAuthenticated ? <GoalSetup /> : <Navigate to="/login" replace />
            } 
          />

          {/* Protected Dashboard */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />

          {/* Catch all - redirect to splash */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
