import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SplashScreen from './components/SplashScreen';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import ChooseGoal from './components/ChooseGoal';
import GoalSetup from './components/GoalSetup';
import Dashboard from './components/Dashboard/Dashboard';
import TaskManager from './components/Tasks/TaskManager';
import SkillExtractor from './components/Skills/SkillExtractor';
import RetentionTracker from './components/Retention/RetentionTracker';
import CareerNavigator from './components/Career/CareerNavigator';
import './App.css';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState({});

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      setUser(storedUser);
    } catch (e) {
      setUser({});
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  const isAuthenticated = !!localStorage.getItem('token');
  const hasCompletedOnboarding = localStorage.getItem('hasCompletedOnboarding') === 'true';

  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    if (!hasCompletedOnboarding) {
      return <Navigate to="/choose-goal" replace />;
    }
    if (!user || !user.id) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

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
          <Route 
            path="/" 
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
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/tasks" 
            element={
              <ProtectedRoute>
                <TaskManager user={user} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/skills" 
            element={
              <ProtectedRoute>
                <SkillExtractor user={user} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/retention" 
            element={
              <ProtectedRoute>
                <RetentionTracker user={user} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/career" 
            element={
              <ProtectedRoute>
                <CareerNavigator user={user} />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
