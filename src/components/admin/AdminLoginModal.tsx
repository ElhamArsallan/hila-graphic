import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, X, KeyRound, ShieldAlert, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useSiteConfig } from '../../context/SiteConfigContext';
import { Logo } from '../common/Logo';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { t, isRtl } = useLanguage();
  const { loginAdmin } = useSiteConfig();
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await loginAdmin(passcode);
    if (success) {
      setError(false);
      setPasscode('');
      onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md rounded-3xl liquid-glass liquid-glass-specular border border-white/80 dark:border-white/15 shadow-2xl p-6 sm:p-8 z-10 text-start"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/5 dark:bg-white/10 text-zinc-500 hover:text-black dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="p-3.5 rounded-2xl bg-[#FF5E1E]/10 text-[#FF5E1E] mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="font-display text-xl font-bold text-zinc-900 dark:text-white">
              {t.admin.portalTitle}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-xs">
              Exclusive management gateway for Hila Graphic studio administrators.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                {t.admin.loginPasscodeLabel}
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    setError(false);
                  }}
                  placeholder="Enter administrator passcode..."
                  className="w-full px-4 py-3 pl-10 rounded-xl bg-black/[0.03] dark:bg-white/[0.05] border border-black/10 dark:border-white/15 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-[#FF5E1E] transition-colors"
                  autoFocus
                />
                <KeyRound className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
              </div>
              <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-1.5">
                Use the studio administrator password configured on the server.
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-500 flex items-center gap-2"
              >
                <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                <span>{t.admin.invalidPasscode}</span>
              </motion.div>
            )}

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-[#FF5E1E] hover:bg-[#E84D0E] active:scale-[0.98] transition-all orange-glow shadow-lg cursor-pointer"
            >
              <span>{t.admin.loginButton}</span>
              <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
            </button>
          </form>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
