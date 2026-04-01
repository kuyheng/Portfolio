"use client";

import { motion, AnimatePresence } from "framer-motion";

type LoadingScreenProps = {
  show: boolean;
};

export default function LoadingScreen({ show }: LoadingScreenProps) {
  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center"
          style={{ background: "var(--bg)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="flex flex-col items-center gap-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur-2xl opacity-70 accent-gradient" />
              <motion.div
                className="relative flex h-20 w-20 items-center justify-center rounded-full border border-white/20 bg-white/5 text-xl font-semibold text-white"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                KT
              </motion.div>
            </div>
            <p className="text-sm uppercase tracking-[0.4em] text-slate-400">
              Loading
            </p>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
