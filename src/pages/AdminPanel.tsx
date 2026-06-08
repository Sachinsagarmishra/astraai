import React, { useState, useEffect } from 'react';
import { Shield, Users, Sparkles, AlertCircle, Save, LogOut, CheckCircle2, Moon, Sun, Smartphone, Bell, Power } from 'lucide-react';

interface Stats {
  totalUsers: number;
  totalPalmReadings: number;
  totalSubscriptions: number;
  recentUsers: Array<{ id: number; email: string; created_at: string }>;
  recentReadings: Array<{ id: number; user_id: number | null; snippet: string; created_at: string }>;
}

interface AppConfig {
  min_app_version: string;
  current_app_version: string;
  force_update: number;
  update_url: string;
  announcement_title: string;
  announcement_message: string;
  show_announcement: number;
  maintenance_mode: number;
}

export default function AdminPanel() {
  const [token, setToken] = useState<string | null>(sessionStorage.getItem('adminToken'));
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loadingStats, setLoadingStats] = useState(true);
  const [savingConfig, setSavingConfig] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  
  const [config, setConfig] = useState<AppConfig>({
    min_app_version: '1.0.0',
    current_app_version: '1.0.0',
    force_update: 0,
    update_url: '',
    announcement_title: '',
    announcement_message: '',
    show_announcement: 0,
    maintenance_mode: 0,
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        sessionStorage.setItem('adminToken', data.token);
        setToken(data.token);
      } else {
        setLoginError(data.error || 'Incorrect Admin Password');
      }
    } catch (err) {
      setLoginError('Server connection failed.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminToken');
    setToken(null);
    setPassword('');
  };

  // Fetch stats and configuration
  const fetchData = async () => {
    if (!token) return;
    try {
      setLoadingStats(true);
      
      // Fetch stats
      const statsRes = await fetch('/api/admin/stats');
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      // Fetch config
      const configRes = await fetch('/api/admin/config');
      if (configRes.ok) {
        const configData = await configRes.json();
        setConfig(configData);
      }
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingConfig(true);
    setSaveSuccess(false);
    try {
      const res = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        alert('Failed to save configuration');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to connect to the server');
    } finally {
      setSavingConfig(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-radial from-[#1e1b4b] to-[#0f172a] flex items-center justify-center p-6 text-white">
        <div className="w-full max-w-md bg-[#1e293b]/70 backdrop-blur-md rounded-3xl border border-[#334155]/60 p-8 shadow-2xl relative overflow-hidden">
          {/* Neon gradient glows */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-indigo-500/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center mb-8 relative z-10">
            <div className="inline-flex p-4 bg-gradient-to-tr from-[#ea580c]/20 to-[#4f46e5]/20 rounded-2xl border border-[#ea580c]/30 mb-4">
              <Shield className="w-8 h-8 text-[#ea580c]" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-orange-400 to-indigo-300 bg-clip-text text-transparent">
              Astrai Admin Terminal
            </h1>
            <p className="text-slate-400 text-sm mt-2">Enter credentials to connect to VPS database</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            <div>
              <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
                Secret Access Key
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••••••"
                className="w-full bg-[#0f172a]/80 border border-[#334155] rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-[#ea580c]/50 focus:border-[#ea580c] transition-all"
              />
            </div>

            {loginError && (
              <div className="flex items-center gap-2 text-rose-400 text-sm bg-rose-500/10 border border-rose-500/20 px-4 py-3 rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#ea580c] to-[#e64a19] hover:from-[#f97316] hover:to-[#ea580c] text-white font-medium py-3 rounded-xl shadow-lg hover:shadow-orange-500/10 transition-all cursor-pointer"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200">
      {/* Top Navigation Bar */}
      <header className="border-b border-[#1e293b] bg-[#0f172a]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#ea580c]/10 rounded-xl border border-[#ea580c]/30">
              <Shield className="w-5 h-5 text-[#ea580c]" />
            </div>
            <div>
              <span className="font-bold tracking-tight text-white">Astrai Panel</span>
              <span className="text-xs text-[#ea580c] ml-2 px-2 py-0.5 bg-[#ea580c]/10 rounded-full border border-[#ea580c]/20">VPS Connected</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-slate-400 hover:text-white bg-[#1e293b]/60 hover:bg-[#1e293b] border border-[#334155]/60 px-4 py-2 rounded-xl text-sm transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Section */}
        {loadingStats ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 bg-[#1e293b]/50 border border-[#334155]/50 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-[#1e293b]/50 border border-[#334155]/50 rounded-2xl p-6 flex items-center gap-5 relative overflow-hidden">
              <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Users</p>
                <h3 className="text-3xl font-bold text-white mt-1">{stats?.totalUsers || 0}</h3>
              </div>
            </div>

            <div className="bg-[#1e293b]/50 border border-[#334155]/50 rounded-2xl p-6 flex items-center gap-5 relative overflow-hidden">
              <div className="p-4 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-xl">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Palm Readings</p>
                <h3 className="text-3xl font-bold text-white mt-1">{stats?.totalPalmReadings || 0}</h3>
              </div>
            </div>

            <div className="bg-[#1e293b]/50 border border-[#334155]/50 rounded-2xl p-6 flex items-center gap-5 relative overflow-hidden">
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Subscriptions</p>
                <h3 className="text-3xl font-bold text-white mt-1">{stats?.totalSubscriptions || 0}</h3>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* App Configurations Form */}
          <section className="lg:col-span-2 bg-[#1e293b]/40 border border-[#1e293b] rounded-3xl p-6 lg:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-[#ea580c]" />
              <span>App Updates Control Panel</span>
            </h2>

            <form onSubmit={handleSaveConfig} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Current Version (Expo Go)
                  </label>
                  <input
                    type="text"
                    required
                    value={config.current_app_version}
                    onChange={(e) => setConfig({ ...config, current_app_version: e.target.value })}
                    placeholder="e.g. 1.0.0"
                    className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-[#ea580c]/50 focus:border-[#ea580c] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Min Required Version (Force Update Threshold)
                  </label>
                  <input
                    type="text"
                    required
                    value={config.min_app_version}
                    onChange={(e) => setConfig({ ...config, min_app_version: e.target.value })}
                    placeholder="e.g. 1.0.0"
                    className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-[#ea580c]/50 focus:border-[#ea580c] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Update Store URL
                </label>
                <input
                  type="url"
                  value={config.update_url}
                  onChange={(e) => setConfig({ ...config, update_url: e.target.value })}
                  placeholder="https://play.google.com/store/apps/details?id=..."
                  className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-[#ea580c]/50 focus:border-[#ea580c] transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#1e293b]">
                <label className="flex items-start gap-3 bg-[#0f172a]/60 p-4 rounded-xl border border-[#334155]/40 hover:border-[#ea580c]/30 cursor-pointer transition-all select-none">
                  <input
                    type="checkbox"
                    checked={config.force_update === 1}
                    onChange={(e) => setConfig({ ...config, force_update: e.target.checked ? 1 : 0 })}
                    className="mt-1 accent-[#ea580c]"
                  />
                  <div>
                    <span className="block text-sm font-semibold text-white">Enable Force Update</span>
                    <span className="block text-xs text-slate-400 mt-1">Locks app if user's app version is below Min Required Version</span>
                  </div>
                </label>

                <label className="flex items-start gap-3 bg-[#0f172a]/60 p-4 rounded-xl border border-[#334155]/40 hover:border-[#ea580c]/30 cursor-pointer transition-all select-none">
                  <input
                    type="checkbox"
                    checked={config.maintenance_mode === 1}
                    onChange={(e) => setConfig({ ...config, maintenance_mode: e.target.checked ? 1 : 0 })}
                    className="mt-1 accent-[#ea580c]"
                  />
                  <div>
                    <span className="block text-sm font-semibold text-white flex items-center gap-1.5">
                      <Power className="w-3.5 h-3.5 text-orange-500" />
                      <span>Maintenance Mode</span>
                    </span>
                    <span className="block text-xs text-slate-400 mt-1">Blocks all access on mobile app with an "Under Maintenance" message</span>
                  </div>
                </label>
              </div>

              {/* Announcement Block */}
              <div className="pt-6 border-t border-[#1e293b] space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Bell className="w-4 h-4 text-indigo-400" />
                    <span>Global App Announcement</span>
                  </h3>
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.show_announcement === 1}
                      onChange={(e) => setConfig({ ...config, show_announcement: e.target.checked ? 1 : 0 })}
                      className="accent-indigo-500"
                    />
                    <span>Publish Announcement</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Title</label>
                    <input
                      type="text"
                      value={config.announcement_title}
                      onChange={(e) => setConfig({ ...config, announcement_title: e.target.value })}
                      placeholder="e.g. Special Festival Panchang Update!"
                      className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Message</label>
                    <textarea
                      rows={3}
                      value={config.announcement_message}
                      onChange={(e) => setConfig({ ...config, announcement_message: e.target.value })}
                      placeholder="e.g. Live puja streaming details or minor adjustments..."
                      className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#1e293b]">
                {saveSuccess && (
                  <div className="flex items-center gap-1.5 text-emerald-400 text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Settings updated successfully!</span>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={savingConfig}
                  className="bg-orange-600 hover:bg-orange-500 text-white font-medium px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-md hover:shadow-orange-500/10 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingConfig ? 'Saving...' : 'Save Settings'}</span>
                </button>
              </div>
            </form>
          </section>

          {/* Recent Database Users */}
          <section className="space-y-6">
            <div className="bg-[#1e293b]/40 border border-[#1e293b] rounded-3xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" />
                <span>Recent Registrations</span>
              </h2>

              {loadingStats ? (
                <div className="space-y-3 animate-pulse">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-10 bg-[#0f172a]/60 rounded-xl" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {stats?.recentUsers && stats.recentUsers.length > 0 ? (
                    stats.recentUsers.map((user) => (
                      <div key={user.id} className="p-3 bg-[#0f172a]/60 rounded-xl border border-[#334155]/20 flex items-center justify-between text-sm">
                        <span className="text-slate-300 font-medium truncate max-w-[170px]">{user.email}</span>
                        <span className="text-slate-500 text-xs shrink-0">
                          {new Date(user.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-slate-500 text-sm">No users registered yet</div>
                  )}
                </div>
              )}
            </div>

            <div className="bg-[#1e293b]/40 border border-[#1e293b] rounded-3xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-400" />
                <span>Recent Palm Readings</span>
              </h2>

              {loadingStats ? (
                <div className="space-y-3 animate-pulse">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-12 bg-[#0f172a]/60 rounded-xl" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {stats?.recentReadings && stats.recentReadings.length > 0 ? (
                    stats.recentReadings.map((reading) => (
                      <div key={reading.id} className="p-3 bg-[#0f172a]/60 rounded-xl border border-[#334155]/20 text-xs">
                        <div className="flex justify-between text-slate-500 mb-1">
                          <span>User ID: {reading.user_id || 'Guest'}</span>
                          <span>{new Date(reading.created_at).toLocaleDateString()}</span>
                        </div>
                        <p className="text-slate-300 line-clamp-2 italic">{reading.snippet}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-slate-500 text-sm">No palm readings completed yet</div>
                  )}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
