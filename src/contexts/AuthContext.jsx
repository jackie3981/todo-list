import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [name, setName] = useState('');
  const [token, setToken] = useState('');

  const baseUrl = import.meta.env.VITE_BASE_URL;

  const login = useCallback(async (userEmail, password) => {
    try {
      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, password }),
        credentials: 'include',
      };
      
      const res = await fetch(`${baseUrl}/user/logon`, options);
      const data = await res.json();
      
      if (res.status === 200 && data.name && data.csrfToken) {
        // Success: Update state
        setName(data.name);
        setToken(data.csrfToken);
        return { success: true };
      } else {
        // Failure: Return error
        return {
          success: false,
          error: `Authentication failed: ${data?.message || 'Unknown error'}`,
        };
      }
    } catch (error) {
      return {
        success: false,
        error: 'Network error during login',
      };
    }
  }, [baseUrl]);

  const logout = useCallback(async () => {
    try {
      // Only call logout API if we have a token
      if (token) {
        await fetch(`${baseUrl}/user/logoff`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': token,
          },
          credentials: 'include',
        });
      }
      
      // Always clear local state whether API succeeds or fails
      setName('');
      setToken('');
      
      return { success: true };
    } catch (error) {
      // Even if API fails, clear local state
      setName('');
      setToken('');
      return {
        success: false,
        error: 'Logout completed locally but server error occurred',
      };
    }
  }, [baseUrl, token]);

  const value = {
    name,
    token,
    isAuthenticated: !!token,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}