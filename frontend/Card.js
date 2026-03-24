"use client";

import { motion } from "framer-motion";

export default function Card({
  title,
  value,
  subtitle,
  icon,
  children,
  highlight = false,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      className={`p-6 rounded-2xl shadow-lg transition-all duration-300
      ${
        highlight
          ? "bg-green-500 text-black"
          : "bg-gray-800 text-white hover:bg-gray-700"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>

      {/* Main Value */}
      {value && (
        <p className="text-3xl font-bold mb-2">
          {value}
        </p>
      )}

      {/* Subtitle */}
      {subtitle && (
        <p className="text-sm opacity-70">
          {subtitle}
        </p>
      )}

      {/* Custom Content */}
      {children && (
        <div className="mt-4">
          {children}
        </div>
      )}
    </motion.div>
  );
}