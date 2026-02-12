import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { toast } from 'sonner';

export default function AuthPage({ setUser }) {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : formData;

      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
        toast.success(isLogin ? 'Welcome back!' : 'Account created successfully!');
        navigate('/');
      } else {
        toast.error(data.detail || 'Authentication failed');
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 md:p-12 border border-stone-200">
          <h1 data-testid="auth-heading" className="text-3xl font-medium tracking-tight mb-2" style={{ color: '#4A0404' }}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-sm mb-8" style={{ color: '#5A5A5A' }}>
            {isLogin ? 'Sign in to your account' : 'Join our luxury beauty community'}
          </p>

          <form data-testid="auth-form" onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#4A0404' }}>
                  Full Name
                </label>
                <Input
                  data-testid="name-input"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required={!isLogin}
                  className="h-12 bg-transparent border-b border-stone-300 focus:border-[#4A0404] rounded-none px-0"
                  placeholder="Enter your name"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#4A0404' }}>
                Email
              </label>
              <Input
                data-testid="email-input"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="h-12 bg-transparent border-b border-stone-300 focus:border-[#4A0404] rounded-none px-0"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#4A0404' }}>
                Password
              </label>
              <Input
                data-testid="password-input"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="h-12 bg-transparent border-b border-stone-300 focus:border-[#4A0404] rounded-none px-0"
                placeholder="Enter your password"
              />
            </div>

            <Button
              data-testid="submit-button"
              type="submit"
              disabled={loading}
              className="w-full bg-[#4A0404] text-white px-8 py-6 rounded-none hover:bg-[#2D0202] transition-all duration-300 font-medium tracking-wide text-sm uppercase"
            >
              {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              data-testid="toggle-auth-mode"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm hover:underline"
              style={{ color: '#4A0404' }}
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}