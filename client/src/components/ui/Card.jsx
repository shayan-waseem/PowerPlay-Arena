import React, { useRef } from 'react';
import { motion } from 'framer-motion';

export const Card = ({ children, className = '', animate = false, delay = 0, onClick, tilt = false }) => {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!tilt || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -3;
    const rotateY = ((x - centerX) / centerX) * 3;
    cardRef.current.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
  };

  const handleMouseLeave = () => {
    if (!tilt || !cardRef.current) return;
    cardRef.current.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)';
  };

  const content = (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`glass-panel rounded-2xl p-6 relative overflow-hidden group border border-darkBorder/60 transition-all duration-300 ${
        tilt ? 'card-3d' : ''
      } ${
        onClick ? 'cursor-pointer hover:border-neonPurple/50 hover:bg-darkCard/80' : ''
      } ${className}`}
      style={tilt ? { transformStyle: 'preserve-3d', transition: 'transform 0.2s ease-out, box-shadow 0.3s ease' } : {}}
    >
      {/* Animated corner accent decorations */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-neonBlue/40 opacity-50 group-hover:opacity-100 group-hover:border-neonPurple group-hover:w-4 group-hover:h-4 transition-all duration-300"></div>
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-neonBlue/40 opacity-50 group-hover:opacity-100 group-hover:border-neonPurple group-hover:w-4 group-hover:h-4 transition-all duration-300"></div>
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-neonPurple/20 opacity-0 group-hover:opacity-60 transition-all duration-500"></div>
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-neonPurple/20 opacity-0 group-hover:opacity-60 transition-all duration-500"></div>
      
      {/* Internal ambient backglow */}
      <div className="absolute -right-20 -top-20 w-40 h-40 bg-neonBlue/5 rounded-full blur-[60px] pointer-events-none group-hover:bg-neonPurple/10 group-hover:w-48 group-hover:h-48 transition-all duration-700"></div>
      
      {/* Hover shimmer sweep */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      </div>
      
      {children}
    </div>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay, type: 'spring', stiffness: 120, damping: 20 }}
      >
        {content}
      </motion.div>
    );
  }

  return content;
};

export default Card;
