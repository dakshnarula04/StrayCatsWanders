import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const loginSchema = z.object({
  username: z.string().min(1, 'username is required'),
  password: z.string().min(6, 'password is too short'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const { login, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  // Redirect if already logged in
  useEffect(() => {
    if (isAdmin) {
      navigate('/journal', { replace: true });
    }
  }, [isAdmin, navigate]);

  const onSubmit = async (data: LoginForm) => {
    setAuthError(null);
    try {
      await login(data.username, data.password);
      navigate('/journal', { replace: true });
    } catch (err: any) {
      setAuthError(err.message ?? 'Login failed');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F2EDE0] dark:bg-[#2A2318] relative overflow-hidden">
        {/* Cork board dot pattern overlay */}
        <div 
          className="absolute inset-0 opacity-40 dark:opacity-20 mix-blend-multiply dark:mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#D4C5A9 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
          aria-hidden="true"
        />
        <Loader2 className="w-8 h-8 text-[#9C8A6E] animate-spin z-10" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F2EDE0] dark:bg-[#2A2318] relative overflow-hidden px-4">
      {/* Cork board dot pattern overlay */}
      <div 
        className="absolute inset-0 opacity-40 dark:opacity-20 mix-blend-multiply dark:mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#D4C5A9 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
        aria-hidden="true"
      />

      <motion.div
        initial={{ y: 20, opacity: 0, rotate: 0 }}
        animate={{ y: 0, opacity: 1, rotate: -1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        className="relative bg-[#FFFDF7] dark:bg-[#1E1A12] w-full max-w-[380px] pt-8 px-7 pb-9 shadow-[4px_8px_32px_rgba(0,0,0,0.2)] dark:shadow-[4px_8px_32px_rgba(0,0,0,0.5)] z-10"
      >
        {/* Washi tape strip */}
        <div 
          className="absolute top-[-12px] left-1/2 -translate-x-1/2 w-16 h-[22px] bg-[#F0DAA0]/60 dark:bg-[#C4B89A]/40 border border-[#C8AF6E]/40 dark:border-[#9C8A6E]/40 shadow-sm"
          style={{ transform: 'translateX(-50%) rotate(-2deg)' }}
          aria-hidden="true"
        />

        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-full bg-[#F5F0E8] dark:bg-[#2A261F] flex items-center justify-center mb-3">
            <Lock size={24} className="text-[#9C8A6E]" />
          </div>
          <h1 className="font-['Caveat'] text-[32px] text-[#3A2E1E] dark:text-[#EDE5D0] leading-none mb-1">
            admin
          </h1>
          <p className="font-sans text-[12px] text-[#9C8A6E] text-center">
            sign in to manage your journal
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Username */}
          <div className="relative">
            <label className="block text-[11px] lowercase tracking-wider text-[#9C8A6E] mb-1 font-sans">
              username
            </label>
            <input
              type="text"
              {...register('username')}
              placeholder="enter username"
              disabled={isSubmitting}
              className="w-full bg-transparent border-b-[1.5px] border-[#C4B89A] dark:border-[#5C4E36] py-1.5 font-sans text-[14px] text-[#2C2416] dark:text-[#EDE5D0] placeholder:text-[#C4B89A]/50 focus:outline-none focus:border-[#3A2E1E] dark:focus:border-[#C4B89A] transition-colors disabled:opacity-50"
            />
            <AnimatePresence mode="wait">
              {errors.username && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute -bottom-5 left-0 text-[11px] text-[#C0392B] dark:text-[#E74C3C] font-sans"
                >
                  {errors.username.message}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Password */}
          <div className="relative pt-2">
            <label className="block text-[11px] lowercase tracking-wider text-[#9C8A6E] mb-1 font-sans">
              password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                placeholder="••••••••"
                disabled={isSubmitting}
                className="w-full bg-transparent border-b-[1.5px] border-[#C4B89A] dark:border-[#5C4E36] py-1.5 pr-8 font-sans text-[14px] text-[#2C2416] dark:text-[#EDE5D0] placeholder:text-[#C4B89A]/50 focus:outline-none focus:border-[#3A2E1E] dark:focus:border-[#C4B89A] transition-colors disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-[#C4B89A] hover:text-[#9C8A6E] dark:hover:text-[#EDE5D0] transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <AnimatePresence mode="wait">
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute -bottom-5 left-0 text-[11px] text-[#C0392B] dark:text-[#E74C3C] font-sans"
                >
                  {errors.password.message}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Auth Error Banner */}
          <AnimatePresence mode="wait">
            {authError && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="pt-2"
              >
                <div className="bg-[#FDEDEC] dark:bg-[#311B1B] text-[#C0392B] dark:text-[#E74C3C] text-[12px] font-sans px-3 py-2 border border-[#FADBD8] dark:border-[#4A2626]">
                  {authError}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#3A2E1E] dark:bg-[#C4B89A] text-[#F5F0E8] dark:text-[#2A2318] py-2.5 font-['Caveat'] text-[22px] leading-none hover:bg-[#4A3C28] dark:hover:bg-[#D5C9A9] transition-colors disabled:opacity-70 flex justify-center items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span className="text-[18px]">signing in...</span>
                </>
              ) : (
                'sign in'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
