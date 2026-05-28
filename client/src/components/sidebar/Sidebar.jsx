import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { ArenaContext } from '../../context/ArenaContext';
import { AuthContext } from '../../context/AuthContext';
import { LayoutDashboard, Users, Ticket, MonitorPlay, BarChart3, HelpCircle, Gamepad2, Settings, Landmark, Baby, Dumbbell } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const { playClick } = useContext(ArenaContext);
  const { isAdmin } = useContext(AuthContext);

  const menuItems = [
    {
      title: 'ARENA OVERVIEW',
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, color: 'text-gray-400' },
        { name: 'Analytics', path: '/analytics', icon: BarChart3, color: 'text-gray-400' },
      ]
    },
    {
      title: 'DEPARTMENTS (QUEUES)',
      items: [
        { name: 'Reception Dept.', path: '/reception', icon: Landmark, color: 'text-neonBlue', activeGlow: 'shadow-glowBlue/20', activeBg: 'from-neonBlue/20 to-neonBlue/5' },
        { name: 'Kids Activities', path: '/kids-activities', icon: Baby, color: 'text-neonPurple', activeGlow: 'shadow-glowPurple/20', activeBg: 'from-neonPurple/20 to-neonPurple/5' },
        { name: 'Adult Activities', path: '/adult-activities', icon: Dumbbell, color: 'text-neonPink', activeGlow: 'shadow-glowPink/20', activeBg: 'from-neonPink/20 to-neonPink/5' },
        { name: 'Gaming Zone', path: '/gaming-zone', icon: Gamepad2, color: 'text-neonGreen', activeGlow: 'shadow-glowGreen/20', activeBg: 'from-neonGreen/20 to-neonGreen/5' },
      ]
    },
    {
      title: 'SIMULATOR LAB',
      items: [
        { name: 'Master Simulator', path: '/simulation', icon: MonitorPlay, color: 'text-gray-400' },
      ]
    }
  ];

  return (
    <aside className="w-full lg:w-64 shrink-0 glass-panel border-r border-darkBorder/70 p-5 flex flex-col gap-5 select-none">
      
      {menuItems.map((section, idx) => (
        <div key={idx} className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 px-3 mb-1">
            <div className="gradient-divider flex-1"></div>
            <p className="font-display text-[9px] font-bold text-gray-500 tracking-[0.15em] uppercase whitespace-nowrap">
              {section.title}
            </p>
            <div className="gradient-divider flex-1"></div>
          </div>

          <div className="flex flex-col gap-0.5">
            {section.items.map((item, itemIdx) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={itemIdx}
                  to={item.path}
                  onClick={playClick}
                  className={({ isActive }) =>
                    `relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all tracking-wider font-display group overflow-hidden ${
                      isActive
                        ? `bg-gradient-to-r ${item.activeBg || 'from-neonPurple/20 to-neonBlue/10'} text-white border border-white/5 ${item.activeGlow || 'shadow-glowPurple/10'}`
                        : 'text-gray-400 hover:text-white hover:bg-darkBorder/20 border border-transparent'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* Active indicator bar */}
                      {isActive && (
                        <motion.div
                          layoutId="sidebar-indicator"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full bg-gradient-to-b from-neonBlue to-neonPurple"
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                          style={{ boxShadow: '0 0 8px rgba(6, 182, 212, 0.6)' }}
                        />
                      )}
                      <Icon className={`w-[18px] h-[18px] transition-all duration-200 ${isActive ? (item.color !== 'text-gray-400' ? item.color : 'text-neonBlue') : item.color} group-hover:scale-110`} />
                      <span className="relative">
                        {item.name}
                        {isActive && (
                          <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-gradient-to-r from-neonBlue/40 to-transparent"></span>
                        )}
                      </span>
                      
                      {/* Hover shimmer */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.015] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                      </div>
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>
      ))}

      {/* Admin Quick Link */}
      {isAdmin && (
        <div className="mt-auto pt-4">
          <div className="gradient-divider-animated mb-4"></div>
          <NavLink
            to="/powerplay-secret-admin"
            onClick={playClick}
            className={({ isActive }) =>
              `relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold font-display border transition-all group overflow-hidden ${
                isActive
                  ? 'border-neonPink text-white bg-neonPink/15 shadow-glowPink'
                  : 'border-neonPink/30 text-neonPink hover:bg-neonPink/10 hover:border-neonPink/60'
              }`
            }
          >
            <div className="relative">
              <Settings className="w-4 h-4 animate-spin-slow" />
              {/* Orbit electron */}
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-neonPink rounded-full animate-pulse shadow-glowPink"></span>
            </div>
            DECRYPT ADMIN PANEL
            
            {/* Glow sweep */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neonPink/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </div>
          </NavLink>
        </div>
      )}

    </aside>
  );
};

export default Sidebar;
