import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Cpu, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

function AuthShell({ title, subtitle, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border-subtle bg-canvas-surface p-7 shadow-xl">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center text-white">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-ink-primary">
              Multi – Agent AI Content Engine
            </p>
            <p className="text-[11px] text-ink-muted">Spring Boot JWT Authentication</p>
          </div>
        </div>

        <h1 className="text-lg font-semibold text-ink-primary">{title}</h1>
        <p className="text-xs text-ink-secondary mt-1 mb-6">{subtitle}</p>

        {children}
      </div>
    </div>
  );
}

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('alex.rivera@contentengine.ai');
  const [password, setPassword] = useState('demo1234');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await login({ email, password, rememberMe });
      navigate('/');
    } catch (err) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Sign in to your workspace"
      subtitle="Access orchestrated multi-agent content pipelines and analytics."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 p-2.5 rounded-lg border border-rose-500/30 bg-rose-500/10 text-xs text-rose-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-ink-primary mb-1.5">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full h-9 rounded-lg border border-border-subtle bg-canvas px-3 text-sm text-ink-primary focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-ink-primary mb-1.5">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-9 rounded-lg border border-border-subtle bg-canvas pl-3 pr-9 text-sm text-ink-primary focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink-primary"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <label className="inline-flex items-center gap-2 text-ink-secondary cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded border-border-strong text-violet-600 focus:ring-violet-500"
            />
            Remember me
          </label>
          <Link to="/forgot-password" className="text-violet-400 hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" loading={loading} className="w-full" size="lg">
          Sign In
        </Button>

        <p className="text-center text-xs text-ink-muted pt-2">
          Don’t have an account?{' '}
          <Link to="/register" className="text-violet-400 hover:underline font-medium">
            Create one
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Full name is required.');
      return;
    }
    if (!email.includes('@')) {
      setError('Valid email is required.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await register({ name, email, password });
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Provision a workspace for multi-agent content orchestration."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 p-2.5 rounded-lg border border-rose-500/30 bg-rose-500/10 text-xs text-rose-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-ink-primary mb-1.5">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Alex Rivera"
            required
            className="w-full h-9 rounded-lg border border-border-subtle bg-canvas px-3 text-sm text-ink-primary focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-ink-primary mb-1.5">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="alex@company.com"
            required
            className="w-full h-9 rounded-lg border border-border-subtle bg-canvas px-3 text-sm text-ink-primary focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-ink-primary mb-1.5">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              required
              className="w-full h-9 rounded-lg border border-border-subtle bg-canvas pl-3 pr-9 text-sm text-ink-primary focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink-primary"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <Button type="submit" loading={loading} className="w-full" size="lg">
          Create Account
        </Button>

        <p className="text-center text-xs text-ink-muted pt-2">
          Already have an account?{' '}
          <Link to="/login" className="text-violet-400 hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sentMessage, setSentMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.includes('@')) return;
    setLoading(true);
    try {
      const res = await authService.requestPasswordReset(email);
      setSentMessage(res.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Reset your password"
      subtitle="Enter your account email and we will send reset instructions."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {sentMessage && (
          <div className="flex items-center gap-2 p-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-xs text-emerald-400">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{sentMessage}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-ink-primary mb-1.5">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="alex@company.com"
            required
            className="w-full h-9 rounded-lg border border-border-subtle bg-canvas px-3 text-sm text-ink-primary focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        <Button type="submit" loading={loading} className="w-full" size="lg">
          Send Reset Link
        </Button>

        <p className="text-center text-xs text-ink-muted pt-2">
          Remembered your password?{' '}
          <Link to="/login" className="text-violet-400 hover:underline font-medium">
            Back to sign in
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
