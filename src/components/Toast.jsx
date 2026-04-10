import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  IoCheckmarkCircleOutline,
  IoWarningOutline,
  IoAlertCircleOutline,
  IoCloseOutline,
} from "react-icons/io5";

const Toast = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const typeStyles = {
    success:
      "bg-green-500/10 border-green-500/50 text-green-400 shadow-[0_0_30px_rgba(34,197,94,0.2)]",
    error:
      "bg-red-500/10 border-red-500/50 text-red-400 shadow-[0_0_30px_rgba(239,68,68,0.2)]",
    warning:
      "bg-yellow-500/10 border-yellow-500/50 text-yellow-400 shadow-[0_0_30px_rgba(234,179,8,0.2)]",
  };

  const icons = {
    success: <IoCheckmarkCircleOutline className="text-2xl shrink-0" />,
    error: <IoAlertCircleOutline className="text-2xl shrink-0" />,
    warning: <IoWarningOutline className="text-2xl shrink-0" />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9, transition: { duration: 0.2 } }}
      className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-1000 flex items-center gap-3 px-6 py-4 rounded-2xl border backdrop-blur-md min-w-75 max-w-[90vw] ${typeStyles[type]}`}
    >
      {icons[type]}

      <p className="text-xs sm:text-sm font-black uppercase tracking-widest grow">
        {message}
      </p>

      <button
        onClick={onClose}
        className="ml-2 p-1 hover:bg-white/10 rounded-full transition-colors opacity-70 hover:opacity-100 shrink-0"
      >
        <IoCloseOutline className="text-xl" />
      </button>
    </motion.div>
  );
};

export default Toast;
