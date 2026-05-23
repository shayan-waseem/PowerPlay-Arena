import React, { useState, useEffect, useContext } from 'react';
import { ArenaContext } from '../../context/ArenaContext';
import axios from 'axios';
import { motion } from 'framer-motion';
import Card from '../../components/ui/Card';
import {
  Database, Search, Clock, User, Shield, Activity, Globe,
  ChevronLeft, RefreshCcw, Filter, AlertTriangle, FileText,
  LogIn, Ticket, Cpu, Settings
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const SystemLogs = () => {
  const { playClick } = useContext(ArenaContext);

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/admin/logs');
      if (res.data.success) {
        setLogs(res.data.logs);
      }
    } catch (err) {
      toast.error('FAILED TO LOAD SYSTEM LOGS');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'LOGIN': return LogIn;
      case 'SIGNUP': return User;
      case 'BOOKING_CREATE': return Ticket;
      case 'SIMULATION_RUN': return Cpu;
      case 'BOOKING_SIMULATE': return Activity;
      case 'ADMIN_ACTION': return Shield;
      default: return Settings;
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'LOGIN': return 'text-neonBlue bg-neonBlue/10 border-neonBlue/20';
      case 'SIGNUP': return 'text-neonGreen bg-neonGreen/10 border-neonGreen/20';
      case 'BOOKING_CREATE': return 'text-neonPurple bg-neonPurple/10 border-neonPurple/20';
      case 'SIMULATION_RUN': return 'text-neonPink bg-neonPink/10 border-neonPink/20';
      case 'BOOKING_SIMULATE': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'ADMIN_ACTION': return 'text-red-400 bg-red-500/10 border-red-500/20';
      default: return 'text-gray-400 bg-darkBg border-darkBorder';
    }
  };

  // Get unique action types
  const actionTypes = [...new Set(logs.map(l => l.action))].filter(Boolean);

  // Filter logs
  const filteredLogs = logs.filter(l => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q ||
      l.action?.toLowerCase().includes(q) ||
      l.details?.toLowerCase().includes(q) ||
      l.userId?.name?.toLowerCase().includes(q) ||
      l.userId?.email?.toLowerCase().includes(q) ||
      l.ipAddress?.includes(q);
    const matchAction = actionFilter === 'all' || l.action === actionFilter;
    return matchSearch && matchAction;
  });

  // Stats
  const uniqueActions = new Set(logs.map(l => l.action)).size;
  const uniqueUsers = new Set(logs.map(l => l.userId?._id).filter(Boolean)).size;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } }
  };
  const itemVariants = {
    hidden: { y: 12, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.35 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-6 py-2 select-none"
    >
      {/* HEADER */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link
              to="/powerplay-secret-admin"
              onClick={playClick}
              className="flex items-center gap-1 text-neonPink hover:text-white text-[10px] font-mono font-bold tracking-wider transition-all"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              ADMIN
            </Link>
            <span className="text-gray-600">/</span>
            <span className="text-[10px] font-mono text-gray-400 font-bold uppercase tracking-wider">SYSTEM LOGS</span>
          </div>
          <h1 className="font-display font-black text-xl text-white tracking-widest uppercase text-glow-green flex items-center gap-3">
            <Database className="w-5 h-5 text-neonGreen" />
            SYSTEM AUDIT LOGS
          </h1>
          <p className="text-xs text-gray-400 font-semibold mt-1">
            Comprehensive audit trail of all user activities, authentication events, and simulation runs.
          </p>
        </div>

        <button
          onClick={() => { playClick(); fetchLogs(); }}
          className="flex items-center gap-1.5 px-4 py-2 border border-neonGreen/30 text-neonGreen hover:bg-neonGreen/10 rounded-xl text-[10px] font-bold font-display tracking-widest transition-all uppercase self-start"
        >
          <RefreshCcw className="w-3.5 h-3.5" />
          REFRESH
        </button>
      </motion.div>

      {/* STATS + SEARCH */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search logs by action, details, user, or IP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-darkBg border border-darkBorder rounded-xl pl-10 pr-4 py-2.5 text-xs text-white outline-none focus:border-neonGreen font-semibold placeholder:text-gray-600"
          />
        </div>
        <select
          value={actionFilter}
          onChange={(e) => { playClick(); setActionFilter(e.target.value); }}
          className="bg-darkBg border border-darkBorder rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-neonGreen font-semibold"
        >
          <option value="all">All Actions ({logs.length})</option>
          {actionTypes.map(action => (
            <option key={action} value={action}>{action} ({logs.filter(l => l.action === action).length})</option>
          ))}
        </select>
        <div className="flex gap-2">
          <div className="flex-1 p-2 bg-neonGreen/10 border border-neonGreen/20 rounded-xl text-center">
            <span className="text-[7px] font-mono text-gray-500 font-bold uppercase">EVENTS</span>
            <p className="text-neonGreen font-mono font-bold text-sm">{logs.length}</p>
          </div>
          <div className="flex-1 p-2 bg-neonBlue/10 border border-neonBlue/20 rounded-xl text-center">
            <span className="text-[7px] font-mono text-gray-500 font-bold uppercase">ACTORS</span>
            <p className="text-neonBlue font-mono font-bold text-sm">{uniqueUsers}</p>
          </div>
        </div>
      </motion.div>

      {/* LOGS TIMELINE */}
      <motion.div variants={itemVariants}>
        <Card className="flex flex-col gap-0 border border-darkBorder/60 bg-darkCard/35 p-0 overflow-hidden">
          
          {/* Terminal Header */}
          <div className="px-5 py-3 border-b border-darkBorder/60 bg-darkBg/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-neonGreen animate-pulse"></div>
              <span className="font-mono text-[9px] text-neonGreen font-bold tracking-wider uppercase">AUDIT LOG STREAM — LIVE</span>
            </div>
            <span className="font-mono text-[9px] text-gray-500 font-bold">
              SHOWING {filteredLogs.length} OF {logs.length} ENTRIES
            </span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-10 h-10 border-2 border-t-neonGreen border-b-transparent border-l-transparent border-r-transparent rounded-full animate-spin"></div>
              <p className="font-mono text-[10px] text-gray-500 tracking-wider">DECRYPTING AUDIT RECORDS...</p>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-2 text-gray-500 font-mono text-[10px]">
              <FileText className="w-8 h-8 text-darkBorder mb-1" />
              {searchQuery || actionFilter !== 'all'
                ? 'NO LOGS MATCH YOUR FILTER CRITERIA.'
                : 'NO SYSTEM LOGS RECORDED YET.'}
              <p className="text-[9px] text-neonGreen/80 font-semibold">LOGS ARE GENERATED WHEN USERS INTERACT WITH THE ARENA SYSTEM.</p>
            </div>
          ) : (
            <div className="max-h-[550px] overflow-y-auto">
              {filteredLogs.map((log, idx) => {
                const ActionIcon = getActionIcon(log.action);
                const actionColor = getActionColor(log.action);
                return (
                  <motion.div
                    key={log._id || idx}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.015 }}
                    className="px-5 py-3.5 border-b border-darkBorder/15 hover:bg-darkBorder/10 transition-all flex items-start gap-4 group"
                  >
                    {/* Timeline dot */}
                    <div className="flex flex-col items-center gap-1 pt-0.5 shrink-0">
                      <div className={`p-1.5 rounded-lg border ${actionColor}`}>
                        <ActionIcon className="w-3.5 h-3.5" />
                      </div>
                      {idx < filteredLogs.length - 1 && (
                        <div className="w-px h-6 bg-darkBorder/40 group-hover:bg-neonGreen/20 transition-all"></div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        {/* Action badge */}
                        <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border tracking-wider uppercase ${actionColor}`}>
                          {log.action}
                        </span>
                        
                        {/* User */}
                        {log.userId && (
                          <span className="text-[10px] font-mono text-gray-400">
                            <span className="text-white font-bold">{log.userId.name}</span>
                            {' '}
                            <span className="text-gray-500">({log.userId.email})</span>
                          </span>
                        )}
                      </div>

                      {/* Details */}
                      <p className="text-[10px] text-gray-400 font-semibold leading-relaxed">{log.details}</p>

                      {/* Meta row */}
                      <div className="flex flex-wrap items-center gap-4 mt-1.5">
                        <span className="flex items-center gap-1 text-[9px] font-mono text-gray-600">
                          <Clock className="w-3 h-3" />
                          {new Date(log.createdAt).toLocaleString()}
                        </span>
                        {log.ipAddress && (
                          <span className="flex items-center gap-1 text-[9px] font-mono text-gray-600">
                            <Globe className="w-3 h-3" />
                            {log.ipAddress}
                          </span>
                        )}
                        {log.userId?.role && (
                          <span className="flex items-center gap-1 text-[9px] font-mono text-gray-600">
                            <Shield className="w-3 h-3" />
                            {log.userId.role.toUpperCase()}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </Card>
      </motion.div>

      {/* INFO NOTICE */}
      <motion.div variants={itemVariants}>
        <div className="p-3 bg-neonGreen/5 border border-neonGreen/20 rounded-xl flex items-start gap-2">
          <Database className="w-4 h-4 text-neonGreen shrink-0 mt-0.5" />
          <p className="text-[10px] text-gray-400 font-semibold leading-relaxed">
            <span className="text-neonGreen font-bold">LOG RETENTION:</span> System logs display the most recent 100 entries.
            All logs are stored in MongoDB and are timestamped with user identification and IP address tracking for security auditing.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SystemLogs;
