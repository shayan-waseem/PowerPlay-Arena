import React from 'react';
import { motion } from 'framer-motion';

export const Card = ({ children, className = '', animate = false, delay = 0, onClick }) => {
  const content = (
    <div
      onClick={onClick}
      className={`glass-panel rounded-2xl p-6 relative overflow-hidden group border border-darkBorder/60 ${
        onClick ? 'cursor-pointer hover:border-neonPurple/50 hover:bg-darkCard/80 transition-all duration-300' : ''
      } ${className}`}
    >
      {/* Cyberpunk corner accent dots */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-neonBlue/50 opacity-40 group-hover:border-neonPurple transition-all"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-neonBlue/50 opacity-40 group-hover:border-neonPurple transition-all"></div>
      
      {/* Internal ambient backglow */}
      <div className="absolute -right-20 -top-20 w-40 h-40 bg-neonBlue/5 rounded-full blur-[60px] pointer-events-none group-hover:bg-neonPurple/10 transition-all duration-500"></div>
      
      {children}
    </div>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay }}
      >
        {content}
      </motion.div>
    );
  }

  return content;
};

export default Card;
