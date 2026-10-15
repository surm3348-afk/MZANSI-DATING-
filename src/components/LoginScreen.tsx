import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { CloverIcon } from './CloverLogo';

interface LoginScreenProps {
  onLoginSuccess: (email: string) => void;
  onNavigateToSignUp: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onNavigateToSignUp
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(email);
    }, 700);
  };

  const handleOAuthLogin = (provider: 'Google' | 'Apple') => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(provider === 'Google' ? 'sipho.khumalo@gmail.com' : 'thandeka.apple@icloud.com');
    }, 600);
  };

  const handleDemoFill = () => {
    setEmail('thandeka.zulu@mzansidating.co.za');
    setPassword('MzansiLove2026!');
  };

  return (
    <div className="w-full max-w-[430px] mx-auto px-5 py-6 flex flex-col justify-between min-h-[92vh]">
      {/* Top Branding Section */}
      <div className="text-center pt-2 pb-5">
        {/* Top Logo + Brand */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <CloverIcon size={24} />
          <span className="font-serif-mzansi text-lg md:text-xl font-bold tracking-wide text-[#9E7728] drop-shadow-sm">
            Mzansi Dating
          </span>
        </div>

        {/* Large White Serif Headline */}
        <h1 className="font-serif-mzansi text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight drop-shadow-md text-balance">
          Find Love E Mzansi
        </h1>

        {/* Subtitle */}
        <p className="text-white/90 text-sm mt-1.5 font-normal tracking-wide drop-shadow-sm">
          Welcome back! Log in to continue your journey
        </p>
      </div>

      {/* Main White Card (24px rounded corners, soft shadow) */}
      <div className="bg-white rounded-[24px] p-6 shadow-xl shadow-purple-950/10 border border-white/60 relative z-10 backdrop-blur-sm">
        {errorMessage && (
          <div className="mb-4 text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2 text-center">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 pointer-events-none text-[#C5A253]">
                <Mail size={18} strokeWidth={1.8} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                required
                className="w-full pl-11 pr-4 py-3 bg-slate-50/70 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#C5A253] focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 pointer-events-none text-[#C5A253]">
                <Lock size={18} strokeWidth={1.8} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-11 pr-11 py-3 bg-slate-50/70 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#C5A253] focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-slate-400 hover:text-slate-600 p-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-[#C5A253] focus:ring-[#C5A253] border-slate-300 accent-[#C5A253]"
              />
              <span>Remember me</span>
            </label>
            <button
              type="button"
              onClick={() => {
                setShowForgotModal(true);
                setForgotSent(false);
                setForgotEmail(email);
              }}
              className="text-[#B78E3E] hover:text-[#9E7728] font-medium transition-colors"
            >
              Forgot password?
            </button>
          </div>

          {/* Gold Gradient Button "Log In" */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-gold-gradient text-white font-semibold text-sm rounded-xl shadow-md shadow-[#C5A253]/25 hover:shadow-lg active:scale-[0.99] transition-all flex items-center justify-center cursor-pointer"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Connecting...</span>
              </div>
            ) : (
              'Log In'
            )}
          </button>
        </form>

        {/* Divider: "or continue with" */}
        <div className="relative my-5 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <span className="relative px-3 bg-white text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            or continue with
          </span>
        </div>

        {/* OAuth Buttons */}
        <div className="grid grid-cols-2 gap-3">
          {/* Google Button */}
          <button
            type="button"
            onClick={() => handleOAuthLogin('Google')}
            className="flex items-center justify-center gap-2.5 py-2.5 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Google</span>
          </button>

          {/* Apple Button */}
          <button
            type="button"
            onClick={() => handleOAuthLogin('Apple')}
            className="flex items-center justify-center gap-2.5 py-2.5 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 transition-all cursor-pointer"
          >
            <svg className="w-4 h-4 fill-slate-900" viewBox="0 0 170 170">
              <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.08-7.7-7.97-12.04-14.68-6.19-9.61-11.05-20.48-14.58-32.61-3.53-12.13-5.3-23.72-5.3-34.77 0-14.58 3.73-26.68 11.19-36.3 7.46-9.61 16.89-14.5 28.29-14.68 5.73 0 11.89 1.54 18.49 4.63 6.6 3.09 10.97 4.67 13.11 4.74 2.14 0 6.64-1.6 13.5-4.81 6.86-3.21 12.63-4.66 17.31-4.35 12.87.62 23.01 5.39 30.43 14.3-11.47 6.94-17.07 16.48-16.79 28.62.28 9.53 4.02 17.5 11.22 23.91 7.2 6.41 15.69 10.23 25.48 11.47-2.22 6.74-5.06 13.78-8.52 21.12zm-35.14-118.89c-.14 3.01-.89 6.23-2.25 9.66-1.36 3.43-3.47 6.65-6.33 9.66-3.17 3.3-6.84 5.91-11.02 7.83-4.18 1.92-8.31 3.03-12.39 3.33-.28-2.61-.22-5.22.18-7.83.4-2.61 1.4-5.46 3.01-8.55 1.74-3.3 4.03-6.23 6.87-8.79 2.84-2.56 6.17-4.48 9.99-5.76 3.82-1.28 7.8-1.92 11.94 0z" />
            </svg>
            <span>Apple</span>
          </button>
        </div>

        {/* Demo Fill Helper for Fast Testing */}
        <div className="mt-3 text-center">
          <button
            type="button"
            onClick={handleDemoFill}
            className="text-[11px] text-slate-400 hover:text-[#B78E3E] underline transition-colors"
          >
            Quick test fill: Thandeka's credentials
          </button>
        </div>

        {/* Don't have an account? Sign Up */}
        <div className="mt-5 text-center text-xs text-slate-600">
          <span>Don't have an account? </span>
          <button
            type="button"
            onClick={onNavigateToSignUp}
            className="font-semibold text-[#B78E3E] hover:text-[#9E7728] underline underline-offset-2 transition-colors cursor-pointer"
          >
            Sign Up
          </button>
        </div>
      </div>

      {/* Footer: Terms - Privacy Policy */}
      <div className="text-center py-4 text-[11px] text-white/80 font-normal">
        <a href="#terms" onClick={(e) => { e.preventDefault(); alert('Mzansi Dating strictly enforces 18+ adult consent, POPIA compliance, and safe online meeting protocols.'); }} className="hover:underline">Terms</a>
        <span className="mx-2">·</span>
        <a href="#privacy" onClick={(e) => { e.preventDefault(); alert('Privacy Policy: All personal data, ID verification scans, and chats are encrypted.'); }} className="hover:underline">Privacy Policy</a>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="font-serif-mzansi text-lg font-bold text-slate-900 mb-1">
              Reset Your Password
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter your email and we will send you a secure link to reset your account password.
            </p>

            {forgotSent ? (
              <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl p-3 text-xs mb-4 text-center">
                Check your inbox! We sent password reset instructions to <strong>{forgotEmail}</strong>.
              </div>
            ) : (
              <div className="space-y-3 mb-4">
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A253]"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (forgotEmail.includes('@')) {
                      setForgotSent(true);
                    }
                  }}
                  className="w-full py-2.5 bg-gold-gradient text-white font-medium text-xs rounded-xl shadow-sm hover:shadow"
                >
                  Send Reset Link
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowForgotModal(false)}
              className="w-full py-2 text-xs text-slate-500 hover:text-slate-800 font-medium"
            >
              Back to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
