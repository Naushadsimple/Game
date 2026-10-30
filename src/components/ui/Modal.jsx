import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-lg', showClose = true }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-vyapar-navy/70 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 12 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className={`relative w-full ${maxWidth} bg-white rounded-brutal-lg border-3 border-vyapar-navy shadow-brutal-xl overflow-hidden my-auto`}
        >
          {/* Header */}
          {(title || showClose) && (
            <div className="flex items-center justify-between px-5 py-3.5 bg-vyapar-skyblue/40 border-b-2 border-vyapar-navy">
              <h3 className="font-black text-lg text-vyapar-navy tracking-tight">{title}</h3>
              {showClose && (
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg border-2 border-vyapar-navy bg-white hover:bg-vyapar-red transition-colors text-vyapar-navy shadow-brutal-sm"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          )}

          {/* Body */}
          <div className="p-5 max-h-[80vh] overflow-y-auto">{children}</div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
