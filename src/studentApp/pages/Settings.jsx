import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const Settings = () => {
  return (
    <div className="min-h-screen bg-background font-mono selection:bg-primary selection:text-black">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-10 relative overflow-hidden">
          {/* Background Grid */}
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
            <h1 className="text-3xl font-bold mb-8 uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-cyan-400 animate-gradient-x">System_Configuration</h1>
            <div className="space-y-6">
              <div className="bg-surface border border-white/10 rounded-none p-6 relative group overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity">
                  <div className="w-2 h-2 bg-primary"></div>
                </div>
                <h2 className="text-xl font-bold text-white mb-6 uppercase flex items-center">
                  <span className="w-1 h-6 bg-primary mr-3"></span>
                  Account_Settings
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-text-muted mb-2 uppercase tracking-widest">Email_Address</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 bg-black border border-white/20 text-white focus:border-primary focus:outline-none transition-colors font-mono"
                      defaultValue="student@institution.edu"
                    />
                  </div>
                  <button className="px-6 py-3 bg-white text-black font-bold uppercase tracking-widest hover:bg-primary transition-colors text-xs clip-diagonal">
                    Save_Changes
                  </button>
                </div>
              </div>

              <div className="bg-surface border border-white/10 rounded-none p-6 relative group">
                <h2 className="text-xl font-bold text-white mb-6 uppercase flex items-center">
                  <span className="w-1 h-6 bg-secondary mr-3"></span>
                  Notification_Protocols
                </h2>
                <div className="space-y-3">
                  {['Email_Transmission', 'Push_Notifications', 'SMS_Alerts'].map((pref) => (
                    <label key={pref} className="flex items-center space-x-3 cursor-pointer group/item">
                      <div className="relative">
                        <input type="checkbox" className="peer sr-only" defaultChecked />
                        <div className="w-5 h-5 border border-white/30 peer-checked:bg-primary peer-checked:border-primary transition-all"></div>
                      </div>
                      <span className="text-text-muted group-hover/item:text-white transition-colors uppercase text-sm tracking-wider">{pref}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
