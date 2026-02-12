import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import AuthPage from './pages/AuthPage';

import Navbar from './components/Navbar';
import { Toaster } from './components/ui/sonner';


function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const token = localStorage.getItem('token');
  const savedUser = localStorage.getItem('user');

  if (savedUser) {
    setUser(JSON.parse(savedUser));
  }

  if (token) {
    fetchUser(token);
  } else {
    setLoading(false);
  }
}, []);


 const fetchUser = async (token) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/auth/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (response.ok) {
      const data = await response.json();
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
    } else if (response.status === 401) {
  // ❗ Only logout on auth failure, not server crash
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  setUser(null);
} else {
  // 👇 This prevents logout on 500 errors
  console.error('Auth check failed with status:', response.status);
}

  } catch (error) {
    console.error('Error fetching user:', error);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  } finally {
    setLoading(false);
  }
};

  const ProtectedRoute = ({ children }) => {
    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!user) return <Navigate to="/auth" />;
    return children;
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen" style={{ backgroundColor: '#FDFBF7' }}>
        <Navbar user={user} setUser={setUser} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage user={user} />} />
          <Route path="/auth" element={<AuthPage setUser={setUser} />} />
          <Route path="/cart" element={
            <ProtectedRoute>
              <CartPage user={user} />
            </ProtectedRoute>
          } />
          <Route path="/checkout" element={
            <ProtectedRoute>
              <CheckoutPage user={user} />
            </ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute>
              <OrdersPage user={user} />
            </ProtectedRoute>
          } />
        </Routes>
        <Toaster />
      </div>
    </BrowserRouter>
  );
}

export default App;