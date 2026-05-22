import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { ArenaContext } from '../../context/ArenaContext';
import { AuthContext } from '../../context/AuthContext';
import { LayoutDashboard, Users, Ticket, MonitorPlay, BarChart3, HelpCircle, Gamepad2, Settings, Landmark, Baby, Dumbbell } from 'lucide-react';

const Sidebar = () => {
  const { playClick } = useContext(ArenaContext);
  const { isAdmin } = useContext(AuthContext);

  const menuItems = [
    {
      title: 'ARENA OVERVIEW',
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Analytics', path: '/analytics', icon: BarChart3 },
      ]
    },
    {
      title: 'DEPARTMENTS (QUEUES)',
      items: [
        { name: 'Reception Dept.', path: '/reception', icon: Landmark, color: 'text-neonBlue border-neonBlue' },
        { name: 'Kids Activities', path: '/kids-activities', icon: Baby, color: 'text-neonPurple border-neonPurple' },
        { name: 'Adult Activities', path: '/adult-activities', icon: Dumbbell, color: 'text-neonPink border-neonPink' },
        { name: 'Gaming Zone', path: '/gaming-zone', icon: Gamepad2, color: 'text-neonGreen border-neonGreen' },
      ]
    },
    {
      title: 'SIMULATOR LAB',
      items: [
        { name: 'Master Simulator', path: '/simulation', icon: MonitorPlay },
      ]
    }
  ];

  return (
    <aside className="w-full lg:w-64 shrink-0 glass-panel border-r border-darkBorder/70 p-6 flex flex-col gap-6 select-none">
      
      {menuItems.map((section, idx) => (
        <div key={idx} className="flex flex-col gap-2">
          <p className="font-display text-[10px] font-bold text-gray-500 tracking-[0.2em] px-3 uppercase">
            {section.title}
          </p>

          <div className="flex flex-col gap-1">
            {section.items.map((item, itemIdx) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={itemIdx}
                  to={item.path}
                  onClick={playClick}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all tracking-wider font-display ${
                      isActive
                        ? 'bg-gradient-to-r from-neonPurple/20 to-neonBlue/10 text-white border-l-2 border-neonPurple shadow-glowPurple/10'
                        : 'text-gray-400 hover:text-white hover:bg-darkBorder/30 border-l-2 border-transparent'
                    }`
                  }
                >
                  <Icon className={`w-4.5 h-4.5`} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      ))}

      {/* Admin Quick Link */}
      {isAdmin && (
        <div className="mt-auto pt-6 border-t border-darkBorder/40">
          <NavLink
            to="/powerplay-secret-admin"
            onClick={playClick}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold font-display border transition-all ${
                isActive
                  ? 'border-neonPink text-white bg-neonPink/15 shadow-glowPink'
                  : 'border-neonPink/30 text-neonPink hover:bg-neonPink hover:text-white'
              }`
            }
          >
            <Settings className="w-4 h-4 animate-spin [animation-duration:8s]" />
            DECRYPT ADMIN PANEL
          </NavLink>
        </div>
      )}

    </aside>
  );
};

export default Sidebar;
