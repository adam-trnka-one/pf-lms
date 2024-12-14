import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LoginForm from './components/LoginForm';
import ForgotPasswordForm from './components/ForgotPasswordForm';
import ResetPasswordForm from './components/ResetPasswordForm';
import InvitationAcceptForm from './components/InvitationAcceptForm';
import ProfileSettings from './components/ProfileSettings';
import ToastContainer from './components/ToastContainer';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import MyCourses from './pages/MyCourses';
import AdminDashboard from './pages/AdminDashboard';
import { useToast } from './hooks/useToast';
import { loginUser, getStoredUser, storeUser, updateUser, clearStoredUser } from './utils/auth';
import type { User, LoginCredentials } from './types/auth';
import type { NavigationPage } from './types/navigation';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [currentPage, setCurrentPage] = useState<NavigationPage>('dashboard');
  const { toasts, showToast, removeToast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [showInvitation, setShowInvitation] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'courses':
        return <MyCourses user={user} />;
      case 'admin':
        return user?.role === 'admin' ? <AdminDashboard onToast={showToast} /> : null;
      default:
        return <Dashboard user={user} />;
    }
  };

  useEffect(() => {
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      setError(null);
      const loggedInUser = await loginUser(credentials);
      storeUser(loggedInUser);
      setUser(loggedInUser);
      showToast('Successfully logged in', 'success');
    } catch (err) {
      showToast((err as Error).message, 'error');
      setError((err as Error).message);
    }
  };

  const handleUpdateProfile = async (updates: Partial<User>) => {
    if (!user) return;
    try {
      setError(null);
      const updatedUser = await updateUser(user.id, updates);
      setUser(updatedUser);
      setShowProfile(false);
      showToast('Profile updated successfully', 'success');
    } catch (err) {
      const errorMessage = (err as Error).message;
      showToast((err as Error).message, 'error');
      setError(errorMessage);
      throw err; // Re-throw to be caught by the form's error handling
    }
  };

  const handleLogout = () => {
    clearStoredUser();
    setUser(null);
    showToast('Successfully logged out', 'success');
  };

  if (!user) {
    return (
      <>
        <div className="min-h-screen flex flex-col w-full">
          {resetToken ? (
            <ResetPasswordForm
              token={resetToken}
              onBack={() => setResetToken(null)}
              onSuccess={message => {
                showToast(message, 'success');
                setResetToken(null);
              }}
              onError={message => {
                showToast(message, 'error');
                setError(message);
              }}
            />
          ) : showForgotPassword ? (
            <ForgotPasswordForm
              onBack={() => setShowForgotPassword(false)}
              onSuccess={message => {
                showToast(message, 'success');
                setShowForgotPassword(false);
              }}
              onError={message => {
                showToast(message, 'error');
                setError(message);
              }}
            />
          ) : showInvitation ? (
            <InvitationAcceptForm
              onBack={() => setShowInvitation(false)}
              onSuccess={message => {
                showToast(message, 'success');
                setShowInvitation(false);
              }}
              onError={message => {
                showToast(message, 'error');
                setError(message);
              }}
            />
          ) : (
            <LoginForm
              onLogin={handleLogin}
              onForgotPassword={() => setShowForgotPassword(true)}
              onAcceptInvitation={() => setShowInvitation(true)}
              error={error}
            />
          )}
          <ToastContainer toasts={toasts} onRemove={removeToast} />
          <Footer onLoginClick={() => {}} />
        </div>
      </>
    );
  }

  if (showProfile) {
    return (
      <>
        <div className="min-h-screen bg-gray-100 flex flex-col w-full">
          <Header 
            user={user} 
            currentPage={currentPage}
            onNavigate={(page) => {
              if (showProfile) {
                setShowProfile(false);
              }
              setCurrentPage(page);
            }}
            onLogout={handleLogout}
            onProfileClick={() => setShowProfile(true)} 
          />
          <ProfileSettings 
            user={user} 
            onSave={handleUpdateProfile} 
            onCancel={() => setShowProfile(false)} 
          />
          <Footer onLoginClick={() => {}} />
        </div>
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex flex-col w-full">
        <Header 
          user={user} 
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          onLogout={handleLogout}
          onProfileClick={() => setShowProfile(true)}
        />
        <main className="w-[75%] mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {renderPage()}
        </main>
        <Footer onLoginClick={() => {}} />
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}

export default App;