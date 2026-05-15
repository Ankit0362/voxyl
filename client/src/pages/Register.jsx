import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { registerUser } from '../api/auth';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import toast from 'react-hot-toast';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await registerUser({ username, email, password });
      login(data.token, data.user);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[70vh] flex items-center justify-center">
      <div className="absolute top-1/4 right-1/4 -translate-x-1/2 w-[400px] h-[400px] bg-primary/20 blur-[100px] rounded-full -z-10"></div>
      <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-secondary/10 blur-[80px] rounded-full -z-10"></div>

      <div className="glass p-2xl rounded-xl voxly-glow border border-primary/20 w-full max-w-[480px]">
        <div className="text-center mb-xl">
          <span className="text-label-md font-label-md text-primary tracking-widest uppercase mb-sm block">Join Voxly</span>
          <h2 className="font-headline-xl text-headline-xl mb-sm">Create an Account</h2>
          <p className="text-on-surface-variant text-body-sm">Start gathering real-time insights today.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-lg">
          <div>
            <label className="block text-sm font-bold mb-xs text-on-surface-variant">Username</label>
            <Input 
              type="text" 
              required 
              value={username} 
              onChange={(e) => setUsername(e.target.value.replace(/\s+/g, '_').toLowerCase())} 
              placeholder="janedoe"
            />
          </div>
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
              minLength={6}
            />
          </div>
          <Button type="submit" className="w-full mt-lg" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>

        <p className="text-center mt-xl text-sm text-on-surface-variant">
          Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
