import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, MessageCircle, Settings, ShieldCheck } from 'lucide-react';
import { useSiteConfig } from '../../context/SiteConfigContext';
import { useLanguage } from '../../context/LanguageContext';

interface WhatsAppConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WhatsAppConfigModal: React.FC<WhatsAppConfigModalProps> = ({ isOpen, onClose }) => {
  const { config, updateWhatsAppNumber } = useSiteConfig();
  const { t } = useLanguage();
  const [phoneNumber, setPhoneNumber] = useState(config.whatsappNumber);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateWhatsAppNumber(phoneNumber.trim());
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 900);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-md rounded-3xl liquid-glass liquid-glass-specular border border-white/80 dark:border-white/15 p-6 sm:p-8 shadow-2xl z-10 text-start"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#FF5E1E]/10 text-[#FF5E1E]">
                <Settings className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg font-bold text-zinc-900 dark:text-white">
                Official WhatsApp Settings
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-zinc-500 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
            Enter the official Hila Graphic WhatsApp number below (with international country code e.g. <span className="font-mono font-semibold">+93 79 912 3456</span>). All click-to-chat links across the entire site update dynamically.
          </p>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                WhatsApp Phone Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+93799123456"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-black/[0.03] dark:bg-white/[0.05] border border-black/10 dark:border-white/10 text-zinc-900 dark:text-white text-sm font-mono focus:outline-none focus:border-[#FF5E1E] transition-colors"
                />
                <MessageCircle className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FF5E1E]" />
              </div>
              <p className="text-[11px] text-zinc-400 mt-1">
                Currently set to: <span className="font-mono">{config.whatsappNumber}</span>
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#FF5E1E] hover:bg-[#E84D0E] orange-glow transition-all cursor-pointer"
              >
                {isSaved ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <span>Save Configuration</span>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
