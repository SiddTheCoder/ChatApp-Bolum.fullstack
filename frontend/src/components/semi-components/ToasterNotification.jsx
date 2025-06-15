import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

const toastVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const ToasterNotification = ({ message, show, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed bottom-6 h-12 w-96 right-0  z-50 bg-purple-700 text-white px-6 py-3 rounded-2xl shadow-lg border border-white font-medium"
          variants={toastVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.4 }}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ToasterNotification;
