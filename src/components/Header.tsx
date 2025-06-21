"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Brain, ArrowLeft } from "lucide-react";

interface HeaderProps {
  showBackButton?: boolean;
  backTo?: string;
  title?: string;
}

export default function Header({
  showBackButton = false,
  backTo = "/",
  title,
}: HeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-4">
            {showBackButton && (
              <Link href={backTo}>
                <motion.div
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm font-medium">Retour</span>
                </motion.div>
              </Link>
            )}

            <Link href="/">
              <motion.div
                className="flex items-center space-x-3 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    IA Booster
                  </h1>
                  {title && (
                    <p className="text-sm text-gray-500 -mt-1">{title}</p>
                  )}
                </div>
              </motion.div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <motion.a
              href="#contact"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
            >
              Contact
            </motion.a>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden"></div>
        </div>
      </div>
    </motion.header>
  );
}
