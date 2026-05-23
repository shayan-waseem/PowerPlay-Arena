import React, { useState, useEffect, useContext } from 'react';
import { ArenaContext } from '../../context/ArenaContext';
import axios from 'axios';
import { motion } from 'framer-motion';
import Card from '../../components/ui/Card';
import {
  Users, Search, Trash2, Mail, Calendar, Shield, UserX,
  AlertTriangle, ChevronLeft, RefreshCcw
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const ManageUsers = () => {
  const { playClick } = useContext(ArenaContext);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/admin/users');
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (err) {
      toast.error('FAILED TO LOAD USER DATABASE');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      setDeletingId(userId);
      const res = await axios.delete(`/api/admin/users/${userId}`);
      if (res.data.success) {
        playClick();
        toast.success('USER NODE TERMINATED SUCCESSFULLY');
        setUsers(prev => prev.filter(u => u._id !== userId));
        setConfirmDelete(null);
      }
    } catch (err) {
      toast.error('FAILED TO DELETE USER RECORD');
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  // Filter users based on search
  const filteredUsers = users.filter(u => {
    const q = searchQuery.toLowerCase();
    return u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
  });

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
            <span className="text-[10px] font-mono text-gray-400 font-bold uppercase tracking-wider">USER MANAGEMENT</span>
          </div>
          <h1 className="font-display font-black text-xl text-white tracking-widest uppercase text-glow-blue flex items-center gap-3">
            <Users className="w-5 h-5 text-neonBlue" />
            MANAGE VISITORS
          </h1>
          <p className="text-xs text-gray-400 font-semibold mt-1">
            View all registered visitor accounts. Delete users and their associated booking data.
          </p>
        </div>

        <button
          onClick={() => { playClick(); fetchUsers(); }}
          className="flex items-center gap-1.5 px-4 py-2 border border-neonBlue/30 text-neonBlue hover:bg-neonBlue/10 rounded-xl text-[10px] font-bold font-display tracking-widest transition-all uppercase self-start"
        >
          <RefreshCcw className="w-3.5 h-3.5" />
          REFRESH
        </button>
      </motion.div>

      {/* SEARCH + STATS BAR */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-darkBg border border-darkBorder rounded-xl pl-10 pr-4 py-2.5 text-xs text-white outline-none focus:border-neonBlue font-semibold placeholder:text-gray-600"
          />
        </div>
        <div className="flex gap-2">
          <div className="px-4 py-2 bg-neonBlue/10 border border-neonBlue/20 rounded-xl text-center">
            <span className="font-mono text-[9px] text-gray-500 font-bold uppercase">TOTAL</span>
            <p className="text-neonBlue font-mono font-bold text-xs">{users.length}</p>
          </div>
          <div className="px-4 py-2 bg-neonGreen/10 border border-neonGreen/20 rounded-xl text-center">
            <span className="font-mono text-[9px] text-gray-500 font-bold uppercase">SHOWING</span>
            <p className="text-neonGreen font-mono font-bold text-xs">{filteredUsers.length}</p>
          </div>
        </div>
      </motion.div>

      {/* USERS TABLE */}
      <motion.div variants={itemVariants}>
        <Card className="flex flex-col gap-0 border border-darkBorder/60 bg-darkCard/35 p-0 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-10 h-10 border-2 border-t-neonBlue border-b-transparent border-l-transparent border-r-transparent rounded-full animate-spin"></div>
              <p className="font-mono text-[10px] text-gray-500 tracking-wider">QUERYING USER DATABASE...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-2 text-gray-500 font-mono text-[10px]">
              <UserX className="w-8 h-8 text-darkBorder mb-1" />
              {searchQuery ? 'NO VISITORS MATCH YOUR SEARCH QUERY.' : 'NO REGISTERED VISITORS FOUND IN DATABASE.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-darkBorder/60 bg-darkBg/60">
                    <th className="text-left px-5 py-3 font-mono text-[9px] text-gray-500 font-bold uppercase tracking-wider">#</th>
                    <th className="text-left px-5 py-3 font-mono text-[9px] text-gray-500 font-bold uppercase tracking-wider">Visitor Name</th>
                    <th className="text-left px-5 py-3 font-mono text-[9px] text-gray-500 font-bold uppercase tracking-wider">Email</th>
                    <th className="text-left px-5 py-3 font-mono text-[9px] text-gray-500 font-bold uppercase tracking-wider">Role</th>
                    <th className="text-left px-5 py-3 font-mono text-[9px] text-gray-500 font-bold uppercase tracking-wider">Registered</th>
                    <th className="text-center px-5 py-3 font-mono text-[9px] text-gray-500 font-bold uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u, idx) => (
                    <motion.tr
                      key={u._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="border-b border-darkBorder/20 hover:bg-darkBorder/10 transition-all group"
                    >
                      <td className="px-5 py-3 font-mono text-[10px] text-gray-500">{idx + 1}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neonBlue/30 to-neonPurple/30 border border-darkBorder flex items-center justify-center">
                            <span className="font-display font-bold text-xs text-white uppercase">{u.name?.charAt(0)}</span>
                          </div>
                          <span className="font-display font-bold text-xs text-white tracking-wider">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className="font-mono text-[10px] text-gray-400 flex items-center gap-1.5">
                          <Mail className="w-3 h-3" />
                          {u.email}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="font-mono text-[9px] font-bold text-neonGreen bg-neonGreen/10 px-2 py-0.5 rounded border border-neonGreen/20 uppercase tracking-wider">
                          {u.role}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="font-mono text-[10px] text-gray-500 flex items-center gap-1.5">
                          <Calendar className="w-3 h-3" />
                          {new Date(u.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-center">
                        {confirmDelete === u._id ? (
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleDeleteUser(u._id)}
                              disabled={deletingId === u._id}
                              className="flex items-center gap-1 px-2.5 py-1 bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500 hover:text-white rounded-lg text-[9px] font-mono font-bold transition-all disabled:opacity-50"
                            >
                              {deletingId === u._id ? 'DELETING...' : 'CONFIRM'}
                            </button>
                            <button
                              onClick={() => { playClick(); setConfirmDelete(null); }}
                              className="px-2.5 py-1 bg-darkBg border border-darkBorder text-gray-400 hover:text-white rounded-lg text-[9px] font-mono font-bold transition-all"
                            >
                              CANCEL
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => { playClick(); setConfirmDelete(u._id); }}
                            className="flex items-center gap-1 px-3 py-1.5 border border-neonPink/30 text-neonPink hover:bg-neonPink hover:text-white rounded-lg text-[9px] font-mono font-bold transition-all mx-auto"
                          >
                            <Trash2 className="w-3 h-3" />
                            DELETE
                          </button>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </motion.div>

      {/* WARNING */}
      <motion.div variants={itemVariants}>
        <div className="p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-xl flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
          <p className="text-[10px] text-gray-400 font-semibold leading-relaxed">
            <span className="text-yellow-400 font-bold">CAUTION:</span> Deleting a user will permanently remove their account, all associated bookings, 
            and simulation data. This action cannot be undone.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ManageUsers;
