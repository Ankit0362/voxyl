import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { loginUser } from '../api/auth';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await loginUser({ email, password });
      login(data.token, data.user);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[70vh] flex items-center justify-center">
      {}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-[400px] h-[400px] bg-primary/20 blur-[100px] rounded-full -z-10"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-tertiary/10 blur-[80px] rounded-full -z-10"></div>

      <div className="glass p-2xl rounded-xl voxly-glow border border-primary/20 w-full max-w-[480px]">
        <div className="text-center mb-xl">
          <span className="text-label-md font-label-md text-primary tracking-widest uppercase mb-sm block">Welcome Back</span>
          <h2 className="font-headline-xl text-headline-xl mb-sm">Log in to Voxly</h2>
          <p className="text-on-surface-variant text-body-sm">Access your real-time insights.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-lg">
          <div>
            <label className="block text-sm font-bold mb-xs text-on-surface-variant">Email</label>
            <Input 
              type="email" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="name@company.com"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-xs text-on-surface-variant">Password</label>
            <Input 
              type="password" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••"
            />
          </div>
          <Button type="submit" className="w-full mt-lg" disabled={loading}>
            {loading ? 'Logging in...' : 'Log in'}
          </Button>
        </form>

        <p className="text-center mt-xl text-sm text-on-surface-variant">
          Don't have an account? <Link to="/register" className="text-primary font-bold hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
