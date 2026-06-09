import React, { useState, useEffect } from 'react';
import { 
  Shield, Users, Sparkles, AlertCircle, Save, LogOut, CheckCircle2, 
  Moon, Sun, Smartphone, Bell, Power, Plus, Trash2, Edit, Menu, X, Image as ImageIcon 
} from 'lucide-react';

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

interface Announcement {
  id?: number;
  title: string;
  message: string;
  image_url: string | null;
  is_active: number;
  created_at?: string;
}

type TabType = 'overview' | 'config' | 'announcements';

export default function AdminPanel() {
  const [token, setToken] = useState<string | null>(sessionStorage.getItem('adminToken'));
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loadingStats, setLoadingStats] = useState(true);
  const [savingConfig, setSavingConfig] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);

  // Tab State
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Mobile Menu State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('adminTheme') as 'light' | 'dark') || 'dark';
  });
  
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

  // Announcements States
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState<Announcement | null>(null);

  // Announcement Form Fields
  const [annFormTitle, setAnnFormTitle] = useState('');
  const [annFormMessage, setAnnFormMessage] = useState('');
  const [annFormImage, setAnnFormImage] = useState<string | null>(null);
  const [annFormIsActive, setAnnFormIsActive] = useState(false);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('adminTheme', newTheme);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        sessionStorage.setItem('adminToken', data.token);
        setToken(data.token);
      } else {
        setLoginError(data.error || 'Incorrect Admin Username or Password');
      }
    } catch (err) {
      setLoginError('Server connection failed.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminToken');
    setToken(null);
    setPassword('');
    setUsername('');
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

  // Fetch announcements list
  const fetchAnnouncements = async () => {
    if (!token) return;
    try {
      setLoadingAnnouncements(true);
      const res = await fetch('/api/admin/announcements');
      if (res.ok) {
        const data = await res.json();
        setAnnouncements(data);
      }
    } catch (err) {
      console.error('Failed to load announcements:', err);
    } finally {
      setLoadingAnnouncements(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchData();
      fetchAnnouncements();
    }
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

  // Announcement Handlers
  const handleSaveAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    
    const payload = {
      title: annFormTitle,
      message: annFormMessage,
      image_url: annFormImage,
      is_active: annFormIsActive ? 1 : 0
    };

    try {
      let res;
      if (currentAnnouncement?.id) {
        // Edit mode
        res = await fetch(`/api/admin/announcements/${currentAnnouncement.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        // Create mode
        res = await fetch('/api/admin/announcements', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        setShowAnnouncementModal(false);
        resetAnnouncementForm();
        fetchAnnouncements();
        fetchData(); // Refresh app config stats
      } else {
        alert('Failed to save announcement');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to connect to server');
    }
  };

  const handleDeleteAnnouncement = async (id: number) => {
    if (!token) return;
    if (!confirm('Are you sure you want to delete this announcement? This will remove it from the database.')) return;
    
    try {
      const res = await fetch(`/api/admin/announcements/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchAnnouncements();
        fetchData();
      } else {
        alert('Failed to delete announcement');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to connect to server');
    }
  };

  const handleActivateAnnouncement = async (id: number) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/admin/announcements/${id}/activate`, {
        method: 'POST'
      });
      if (res.ok) {
        fetchAnnouncements();
        fetchData();
      } else {
        alert('Failed to activate announcement');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to connect to server');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a valid image file (PNG, JPG, GIF, WEBP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size exceeds 5MB. Please choose a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAnnFormImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const resetAnnouncementForm = () => {
    setCurrentAnnouncement(null);
    setAnnFormTitle('');
    setAnnFormMessage('');
    setAnnFormImage(null);
    setAnnFormIsActive(false);
  };

  const handleEditAnnouncement = (ann: Announcement) => {
    setCurrentAnnouncement(ann);
    setAnnFormTitle(ann.title);
    setAnnFormMessage(ann.message);
    setAnnFormImage(ann.image_url);
    setAnnFormIsActive(ann.is_active === 1);
    setShowAnnouncementModal(true);
  };

  if (!token) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-6 transition-all duration-300 ${
        theme === 'dark' ? 'bg-[#0f172a] text-white' : 'bg-[#fbfaf6] text-[#211a16]'
      }`}>
        <div className={`w-full max-w-md rounded-3xl border p-8 shadow-2xl relative overflow-hidden transition-all duration-300 ${
          theme === 'dark' ? 'bg-[#1e293b]/70 border-[#334155]/60' : 'bg-white border-[#eadfd2]'
        }`}>
          {/* Neon gradient glows */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Theme Switcher on Login Page */}
          <button 
            onClick={toggleTheme}
            className={`absolute top-6 right-6 p-2 rounded-xl transition-all ${
              theme === 'dark' ? 'bg-[#334155] text-amber-400 hover:bg-[#475569]' : 'bg-[#eadfd2]/40 text-[#c6531d] hover:bg-[#eadfd2]/70'
            }`}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <div className="text-center mb-8 relative z-10">
            <div className="inline-flex p-4 bg-gradient-to-tr from-[#ea580c]/20 to-[#4f46e5]/20 rounded-2xl border border-[#ea580c]/30 mb-4">
              <Shield className="w-8 h-8 text-[#ea580c]" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-orange-500 to-indigo-500 bg-clip-text text-transparent">
              Astrai Admin Terminal
            </h1>
            <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-slate-400' : 'text-[#6f5a49]'}`}>
              Enter credentials to connect to VPS database
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            <div>
              <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                theme === 'dark' ? 'text-slate-300' : 'text-[#6f5a49]'
              }`}>
                Admin Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. admin"
                className={`w-full rounded-xl px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-[#ea580c]/50 focus:border-[#ea580c] transition-all ${
                  theme === 'dark' ? 'bg-[#0f172a]/80 border-[#334155] text-white placeholder-slate-600' : 'bg-[#fbfaf6] border-[#eadfd2] text-[#211a16] placeholder-stone-400'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                theme === 'dark' ? 'text-slate-300' : 'text-[#6f5a49]'
              }`}>
                Secret Access Key
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••••••"
                className={`w-full rounded-xl px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-[#ea580c]/50 focus:border-[#ea580c] transition-all ${
                  theme === 'dark' ? 'bg-[#0f172a]/80 border-[#334155] text-white placeholder-slate-600' : 'bg-[#fbfaf6] border-[#eadfd2] text-[#211a16] placeholder-stone-400'
                }`}
              />
            </div>

            {loginError && (
              <div className="flex items-center gap-2 text-rose-500 text-sm bg-rose-500/10 border border-rose-500/20 px-4 py-3 rounded-xl">
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
    <div className={`min-h-screen flex flex-col md:flex-row transition-all duration-300 ${
      theme === 'dark' ? 'bg-[#0f172a] text-slate-200' : 'bg-[#fbfaf6] text-[#211a16]'
    }`}>
      {/* Mobile Header */}
      <div className={`md:hidden flex items-center justify-between p-4 border-b ${
        theme === 'dark' ? 'bg-[#0f172a] border-[#1e293b]' : 'bg-white border-[#eadfd2]'
      }`}>
        <div className="flex items-center gap-2">
          <div className="p-2 bg-[#ea580c]/10 rounded-lg border border-[#ea580c]/30">
            <Shield className="w-5 h-5 text-[#ea580c]" />
          </div>
          <span className="font-bold tracking-tight">Astrai Panel</span>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`p-2 rounded-lg border ${
            theme === 'dark' ? 'border-[#334155] text-white' : 'border-[#eadfd2] text-[#211a16]'
          }`}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar - Sticky on desktop, overlay drawer on mobile */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 border-r transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:flex md:flex-col ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } ${
        theme === 'dark' ? 'bg-[#1e293b]/70 border-[#334155]/60' : 'bg-white border-[#eadfd2]'
      }`}>
        {/* Sidebar Header */}
        <div className="p-6 flex items-center justify-between border-b border-inherit">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#ea580c]/10 rounded-xl border border-[#ea580c]/30">
              <Shield className="w-5 h-5 text-[#ea580c]" />
            </div>
            <div>
              <span className="font-bold tracking-tight text-inherit block">Astrai Panel</span>
              <span className="text-[10px] text-[#ea580c] block mt-0.5 font-semibold">VPS Connected</span>
            </div>
          </div>
          <button className="md:hidden" onClick={() => setMobileMenuOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <button
            onClick={() => { setActiveTab('overview'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-[#ea580c] to-[#e64a19] text-white shadow-md'
                : theme === 'dark' ? 'text-slate-400 hover:bg-[#334155]/50 hover:text-white' : 'text-[#6f5a49] hover:bg-[#eadfd2]/30 hover:text-[#c6531d]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Overview & Stats</span>
          </button>

          <button
            onClick={() => { setActiveTab('config'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'config'
                ? 'bg-gradient-to-r from-[#ea580c] to-[#e64a19] text-white shadow-md'
                : theme === 'dark' ? 'text-slate-400 hover:bg-[#334155]/50 hover:text-white' : 'text-[#6f5a49] hover:bg-[#eadfd2]/30 hover:text-[#c6531d]'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>App Configuration</span>
          </button>

          <button
            onClick={() => { setActiveTab('announcements'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'announcements'
                ? 'bg-gradient-to-r from-[#ea580c] to-[#e64a19] text-white shadow-md'
                : theme === 'dark' ? 'text-slate-400 hover:bg-[#334155]/50 hover:text-white' : 'text-[#6f5a49] hover:bg-[#eadfd2]/30 hover:text-[#c6531d]'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Announcements</span>
          </button>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-inherit space-y-3">
          {/* Theme toggle inside sidebar */}
          <button
            onClick={toggleTheme}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-medium border transition-all ${
              theme === 'dark' ? 'border-[#334155] bg-[#0f172a]/40 text-slate-300 hover:bg-[#334155]' : 'border-[#eadfd2] bg-[#fbfaf6] text-[#6f5a49] hover:bg-[#eadfd2]/40'
            }`}
          >
            <span className="flex items-center gap-2">
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#c6531d]" />}
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </span>
            <span className="text-[10px] uppercase tracking-wider font-semibold opacity-60">Toggle</span>
          </button>

          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-medium transition-all ${
              theme === 'dark' ? 'text-slate-400 hover:bg-rose-500/10 hover:text-rose-400' : 'text-[#6f5a49] hover:bg-rose-50 hover:text-rose-600'
            }`}
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        {/* Top welcome/status header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className={`text-2xl font-extrabold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-[#211a16]'}`}>
              {activeTab === 'overview' && 'System Overview'}
              {activeTab === 'config' && 'App Updates Control'}
              {activeTab === 'announcements' && 'Announcements Manager'}
            </h1>
            <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-[#8c6f5a]'}`}>
              Manage database settings, system configurations, and dynamic notifications.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Hostinger VPS Connected</span>
          </div>
        </div>

        {/* -------------------- OVERVIEW TAB -------------------- */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Stats Cards */}
            {loadingStats ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
                {[1, 2, 3].map((i) => (
                  <div key={i} className={`h-28 rounded-2xl ${theme === 'dark' ? 'bg-[#1e293b]/50' : 'bg-stone-200'}`} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className={`border rounded-2xl p-6 flex items-center gap-5 relative overflow-hidden ${
                  theme === 'dark' ? 'bg-[#1e293b]/40 border-[#334155]/60' : 'bg-white border-[#eadfd2]'
                }`}>
                  <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <p className={`text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-slate-400' : 'text-[#6f5a49]'}`}>Total Users</p>
                    <h3 className={`text-3xl font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-[#211a16]'}`}>{stats?.totalUsers || 0}</h3>
                  </div>
                </div>

                <div className={`border rounded-2xl p-6 flex items-center gap-5 relative overflow-hidden ${
                  theme === 'dark' ? 'bg-[#1e293b]/40 border-[#334155]/60' : 'bg-white border-[#eadfd2]'
                }`}>
                  <div className="p-4 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-xl">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <p className={`text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-slate-400' : 'text-[#6f5a49]'}`}>Palm Readings</p>
                    <h3 className={`text-3xl font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-[#211a16]'}`}>{stats?.totalPalmReadings || 0}</h3>
                  </div>
                </div>

                <div className={`border rounded-2xl p-6 flex items-center gap-5 relative overflow-hidden ${
                  theme === 'dark' ? 'bg-[#1e293b]/40 border-[#334155]/60' : 'bg-white border-[#eadfd2]'
                }`}>
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <p className={`text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-slate-400' : 'text-[#6f5a49]'}`}>Subscriptions</p>
                    <h3 className={`text-3xl font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-[#211a16]'}`}>{stats?.totalSubscriptions || 0}</h3>
                  </div>
                </div>
              </div>
            )}

            {/* Recents Grids */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Registrations */}
              <div className={`border rounded-3xl p-6 shadow-sm ${
                theme === 'dark' ? 'bg-[#1e293b]/40 border-[#334155]/40' : 'bg-white border-[#eadfd2]'
              }`}>
                <h2 className={`text-lg font-bold mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-[#211a16]'}`}>
                  <Users className="w-4 h-4 text-indigo-400" />
                  <span>Recent Registrations</span>
                </h2>

                {loadingStats ? (
                  <div className="space-y-3 animate-pulse">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className={`h-11 rounded-xl ${theme === 'dark' ? 'bg-[#0f172a]/60' : 'bg-stone-100'}`} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {stats?.recentUsers && stats.recentUsers.length > 0 ? (
                      stats.recentUsers.map((user) => (
                        <div key={user.id} className={`p-3 rounded-xl border flex items-center justify-between text-sm ${
                          theme === 'dark' ? 'bg-[#0f172a]/40 border-[#334155]/20 text-slate-300' : 'bg-[#fbfaf6] border-[#eadfd2]/50 text-[#211a16]'
                        }`}>
                          <span className="font-medium truncate max-w-[190px]">{user.email}</span>
                          <span className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-[#8c6f5a]'}`}>
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

              {/* Recent Readings */}
              <div className={`border rounded-3xl p-6 shadow-sm ${
                theme === 'dark' ? 'bg-[#1e293b]/40 border-[#334155]/40' : 'bg-white border-[#eadfd2]'
              }`}>
                <h2 className={`text-lg font-bold mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-[#211a16]'}`}>
                  <Sparkles className="w-4 h-4 text-orange-400" />
                  <span>Recent Palm Readings</span>
                </h2>

                {loadingStats ? (
                  <div className="space-y-3 animate-pulse">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className={`h-14 rounded-xl ${theme === 'dark' ? 'bg-[#0f172a]/60' : 'bg-stone-100'}`} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {stats?.recentReadings && stats.recentReadings.length > 0 ? (
                      stats.recentReadings.map((reading) => (
                        <div key={reading.id} className={`p-3 rounded-xl border text-xs ${
                          theme === 'dark' ? 'bg-[#0f172a]/40 border-[#334155]/20 text-slate-300' : 'bg-[#fbfaf6] border-[#eadfd2]/50 text-[#211a16]'
                        }`}>
                          <div className={`flex justify-between mb-1 ${theme === 'dark' ? 'text-slate-500' : 'text-[#8c6f5a]'}`}>
                            <span className="font-semibold">User ID: {reading.user_id || 'Guest'}</span>
                            <span>{new Date(reading.created_at).toLocaleDateString()}</span>
                          </div>
                          <p className={`line-clamp-2 italic ${theme === 'dark' ? 'text-slate-400' : 'text-[#6f5a49]'}`}>{reading.snippet}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-slate-500 text-sm">No palm readings completed yet</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* -------------------- APP UPDATES TAB -------------------- */}
        {activeTab === 'config' && (
          <div className="animate-fadeIn">
            <div className={`border rounded-3xl p-6 lg:p-8 shadow-sm ${
              theme === 'dark' ? 'bg-[#1e293b]/40 border-[#334155]/40' : 'bg-white border-[#eadfd2]'
            }`}>
              <h2 className={`text-xl font-bold mb-6 flex items-center gap-2.5 ${theme === 'dark' ? 'text-white' : 'text-[#211a16]'}`}>
                <Smartphone className="w-5 h-5 text-[#ea580c]" />
                <span>App Updates & Maintenance Control</span>
              </h2>

              <form onSubmit={handleSaveConfig} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                      theme === 'dark' ? 'text-slate-400' : 'text-[#6f5a49]'
                    }`}>
                      Current Version (Expo Go)
                    </label>
                    <input
                      type="text"
                      required
                      value={config.current_app_version}
                      onChange={(e) => setConfig({ ...config, current_app_version: e.target.value })}
                      placeholder="e.g. 1.0.0"
                      className={`w-full rounded-xl px-4 py-2.5 border focus:outline-none focus:ring-1 focus:ring-[#ea580c] ${
                        theme === 'dark' ? 'bg-[#0f172a] border-[#334155] text-white' : 'bg-[#fbfaf6] border-[#eadfd2] text-[#211a16]'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                      theme === 'dark' ? 'text-slate-400' : 'text-[#6f5a49]'
                    }`}>
                      Min Required Version (Force Update Threshold)
                    </label>
                    <input
                      type="text"
                      required
                      value={config.min_app_version}
                      onChange={(e) => setConfig({ ...config, min_app_version: e.target.value })}
                      placeholder="e.g. 1.0.0"
                      className={`w-full rounded-xl px-4 py-2.5 border focus:outline-none focus:ring-1 focus:ring-[#ea580c] ${
                        theme === 'dark' ? 'bg-[#0f172a] border-[#334155] text-white' : 'bg-[#fbfaf6] border-[#eadfd2] text-[#211a16]'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                    theme === 'dark' ? 'text-slate-400' : 'text-[#6f5a49]'
                  }`}>
                    Update Store URL
                  </label>
                  <input
                    type="url"
                    value={config.update_url}
                    onChange={(e) => setConfig({ ...config, update_url: e.target.value })}
                    placeholder="https://play.google.com/store/apps/details?id=..."
                    className={`w-full rounded-xl px-4 py-2.5 border focus:outline-none focus:ring-1 focus:ring-[#ea580c] ${
                      theme === 'dark' ? 'bg-[#0f172a] border-[#334155] text-white' : 'bg-[#fbfaf6] border-[#eadfd2] text-[#211a16]'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-inherit">
                  <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer select-none transition-all ${
                    theme === 'dark' ? 'bg-[#0f172a]/60 border-[#334155]/40 hover:border-[#ea580c]/30' : 'bg-[#fbfaf6] border-[#eadfd2]/50 hover:border-[#ea580c]/30'
                  }`}>
                    <input
                      type="checkbox"
                      checked={config.force_update === 1}
                      onChange={(e) => setConfig({ ...config, force_update: e.target.checked ? 1 : 0 })}
                      className="mt-1 accent-[#ea580c]"
                    />
                    <div>
                      <span className={`block text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-[#211a16]'}`}>Enable Force Update</span>
                      <span className={`block text-xs mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-[#6f5a49]'}`}>
                        Locks app if user's app version is below Min Required Version
                      </span>
                    </div>
                  </label>

                  <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer select-none transition-all ${
                    theme === 'dark' ? 'bg-[#0f172a]/60 border-[#334155]/40 hover:border-[#ea580c]/30' : 'bg-[#fbfaf6] border-[#eadfd2]/50 hover:border-[#ea580c]/30'
                  }`}>
                    <input
                      type="checkbox"
                      checked={config.maintenance_mode === 1}
                      onChange={(e) => setConfig({ ...config, maintenance_mode: e.target.checked ? 1 : 0 })}
                      className="mt-1 accent-[#ea580c]"
                    />
                    <div>
                      <span className={`block text-sm font-semibold flex items-center gap-1.5 ${theme === 'dark' ? 'text-white' : 'text-[#211a16]'}`}>
                        <Power className="w-3.5 h-3.5 text-orange-500" />
                        <span>Maintenance Mode</span>
                      </span>
                      <span className={`block text-xs mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-[#6f5a49]'}`}>
                        Blocks all access on mobile app with an "Under Maintenance" message
                      </span>
                    </div>
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 pt-6 border-t border-inherit">
                  {saveSuccess && (
                    <div className="flex items-center gap-1.5 text-emerald-500 text-sm">
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
            </div>
          </div>
        )}

        {/* -------------------- ANNOUNCEMENTS TAB -------------------- */}
        {activeTab === 'announcements' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Announcements list control header */}
            <div className="flex justify-between items-center">
              <h2 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-[#211a16]'}`}>
                Saved Announcements
              </h2>
              <button
                onClick={() => { resetAnnouncementForm(); setShowAnnouncementModal(true); }}
                className="bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Announcement</span>
              </button>
            </div>

            {/* Announcements Grid list */}
            {loadingAnnouncements ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
                {[1, 2].map((i) => (
                  <div key={i} className={`h-40 rounded-3xl ${theme === 'dark' ? 'bg-[#1e293b]/50' : 'bg-stone-200'}`} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {announcements.length > 0 ? (
                  announcements.map((ann) => (
                    <div 
                      key={ann.id} 
                      className={`border rounded-3xl p-5 relative overflow-hidden flex flex-col md:flex-row gap-5 shadow-sm transition-all ${
                        ann.is_active === 1
                          ? theme === 'dark' ? 'bg-[#1e293b] border-orange-500/60' : 'bg-orange-50/50 border-orange-200'
                          : theme === 'dark' ? 'bg-[#1e293b]/40 border-[#334155]/40' : 'bg-white border-[#eadfd2]'
                      }`}
                    >
                      {/* Image Thumbnail */}
                      <div className={`w-full md:w-32 h-32 rounded-xl flex items-center justify-center shrink-0 border overflow-hidden ${
                        theme === 'dark' ? 'bg-[#0f172a]/80 border-[#334155]/40' : 'bg-stone-50 border-[#eadfd2]/50'
                      }`}>
                        {ann.image_url ? (
                          <img src={ann.image_url} alt="thumbnail" className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className={`w-8 h-8 ${theme === 'dark' ? 'text-slate-600' : 'text-stone-300'}`} />
                        )}
                      </div>

                      {/* Announcement Details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <h3 className={`font-bold text-sm md:text-base ${theme === 'dark' ? 'text-white' : 'text-[#211a16]'}`}>
                              {ann.title}
                            </h3>
                            {ann.is_active === 1 && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 uppercase tracking-wider">
                                Active Live
                              </span>
                            )}
                          </div>
                          <p className={`text-xs line-clamp-3 leading-5 ${theme === 'dark' ? 'text-slate-400' : 'text-[#6f5a49]'}`}>
                            {ann.message}
                          </p>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center justify-between gap-3 pt-4 border-t border-inherit mt-3">
                          <button
                            onClick={() => handleEditAnnouncement(ann)}
                            className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-all ${
                              theme === 'dark' ? 'border-[#334155] text-slate-300 hover:text-white hover:bg-[#334155]/50' : 'border-[#eadfd2] text-[#6f5a49] hover:text-[#c6531d] hover:bg-[#eadfd2]/20'
                            }`}
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>

                          <div className="flex items-center gap-2">
                            {ann.is_active !== 1 && (
                              <button
                                onClick={() => handleActivateAnnouncement(ann.id!)}
                                className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg hover:from-emerald-500 hover:to-emerald-400 transition-all flex items-center gap-1 shadow-sm cursor-pointer"
                              >
                                <Power className="w-3.5 h-3.5" />
                                <span>Go Live</span>
                              </button>
                            )}

                            <button
                              onClick={() => handleDeleteAnnouncement(ann.id!)}
                              className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-all ${
                                theme === 'dark' ? 'border-rose-500/20 text-rose-400 hover:bg-rose-500/15' : 'border-rose-200 text-rose-600 hover:bg-rose-50'
                              }`}
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={`col-span-full py-12 text-center rounded-3xl border ${
                    theme === 'dark' ? 'bg-[#1e293b]/20 border-[#334155]/20 text-slate-500' : 'bg-stone-50 border-[#eadfd2]/50 text-[#8c6f5a]'
                  }`}>
                    <Bell className="w-8 h-8 mx-auto mb-3 opacity-40" />
                    <p className="text-sm font-semibold">No announcements created yet</p>
                    <p className="text-xs opacity-70 mt-1">Create announcements with customized notifications and images</p>
                  </div>
                )}
              </div>
            )}

            {/* Announcement Modal Dialog */}
            {showAnnouncementModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
                <div className={`w-full max-w-lg rounded-3xl border shadow-2xl p-6 relative flex flex-col max-h-[90vh] overflow-y-auto ${
                  theme === 'dark' ? 'bg-[#1e293b] border-[#334155]/60 text-white' : 'bg-white border-[#eadfd2] text-[#211a16]'
                }`}>
                  <button 
                    onClick={() => { setShowAnnouncementModal(false); resetAnnouncementForm(); }}
                    className={`absolute top-6 right-6 p-2 rounded-xl transition-all ${
                      theme === 'dark' ? 'hover:bg-[#334155] text-slate-400 hover:text-white' : 'hover:bg-stone-100 text-stone-500 hover:text-[#211a16]'
                    }`}
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <h3 className="text-xl font-bold mb-6">
                    {currentAnnouncement ? 'Edit Announcement' : 'Add New Announcement'}
                  </h3>

                  <form onSubmit={handleSaveAnnouncement} className="space-y-5">
                    <div>
                      <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                        theme === 'dark' ? 'text-slate-400' : 'text-[#6f5a49]'
                      }`}>
                        Title
                      </label>
                      <input
                        type="text"
                        required
                        value={annFormTitle}
                        onChange={(e) => setAnnFormTitle(e.target.value)}
                        placeholder="e.g. Special Festival Panchang Update!"
                        className={`w-full rounded-xl px-4 py-2.5 border focus:outline-none focus:ring-1 focus:ring-[#ea580c] ${
                          theme === 'dark' ? 'bg-[#0f172a] border-[#334155] text-white' : 'bg-[#fbfaf6] border-[#eadfd2] text-[#211a16]'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                        theme === 'dark' ? 'text-slate-400' : 'text-[#6f5a49]'
                      }`}>
                        Message / Description
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={annFormMessage}
                        onChange={(e) => setAnnFormMessage(e.target.value)}
                        placeholder="Provide details about the update or notice..."
                        className={`w-full rounded-xl px-4 py-2.5 border focus:outline-none focus:ring-1 focus:ring-[#ea580c] ${
                          theme === 'dark' ? 'bg-[#0f172a] border-[#334155] text-white' : 'bg-[#fbfaf6] border-[#eadfd2] text-[#211a16]'
                        }`}
                      />
                    </div>

                    {/* Image Upload Area */}
                    <div>
                      <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                        theme === 'dark' ? 'text-slate-400' : 'text-[#6f5a49]'
                      }`}>
                        Announcement Image (JPG, PNG, GIF)
                      </label>
                      
                      <div className="flex flex-col sm:flex-row gap-4 items-center">
                        <div className={`w-24 h-24 rounded-xl border flex items-center justify-center shrink-0 overflow-hidden ${
                          theme === 'dark' ? 'bg-[#0f172a] border-[#334155]' : 'bg-[#fbfaf6] border-[#eadfd2]'
                        }`}>
                          {annFormImage ? (
                            <img src={annFormImage} alt="Preview" className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className={`w-8 h-8 ${theme === 'dark' ? 'text-slate-700' : 'text-stone-300'}`} />
                          )}
                        </div>

                        <div className="flex-1 w-full space-y-2">
                          <input
                            type="file"
                            accept="image/png, image/jpeg, image/jpg, image/gif, image/webp"
                            onChange={handleImageUpload}
                            className={`w-full text-xs file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border file:text-xs file:font-semibold ${
                              theme === 'dark' 
                                ? 'text-slate-400 file:bg-[#334155] file:text-white file:border-[#475569] file:hover:bg-[#475569]'
                                : 'text-[#6f5a49] file:bg-[#eadfd2]/40 file:text-[#c6531d] file:border-[#eadfd2] file:hover:bg-[#eadfd2]/70'
                            }`}
                          />
                          <p className={`text-[10px] ${theme === 'dark' ? 'text-slate-500' : 'text-[#8c6f5a]'}`}>
                            PNG, JPG, JPEG, GIF or WEBP format. Max file size: 5MB.
                          </p>
                          {annFormImage && (
                            <button
                              type="button"
                              onClick={() => setAnnFormImage(null)}
                              className="text-xs text-rose-500 font-semibold hover:underline cursor-pointer block"
                            >
                              Remove Image
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer select-none transition-all ${
                      theme === 'dark' ? 'bg-[#0f172a]/60 border-[#334155]/40 hover:border-[#ea580c]/30' : 'bg-[#fbfaf6] border-[#eadfd2]/50 hover:border-[#ea580c]/30'
                    }`}>
                      <input
                        type="checkbox"
                        checked={annFormIsActive}
                        onChange={(e) => setAnnFormIsActive(e.target.checked)}
                        className="mt-1 accent-[#ea580c]"
                      />
                      <div>
                        <span className={`block text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-[#211a16]'}`}>
                          Go Live Immediately
                        </span>
                        <span className={`block text-xs mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-[#6f5a49]'}`}>
                          Publish this announcement directly. This will automatically deactivate all other announcements.
                        </span>
                      </div>
                    </label>

                    <div className="flex items-center justify-end gap-3 pt-6 border-t border-inherit">
                      <button
                        type="button"
                        onClick={() => { setShowAnnouncementModal(false); resetAnnouncementForm(); }}
                        className={`font-semibold px-5 py-2.5 rounded-xl text-xs transition-all ${
                          theme === 'dark' ? 'bg-[#334155] hover:bg-[#475569] text-white' : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                        }`}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-all shadow-md hover:shadow-orange-500/10 cursor-pointer"
                      >
                        Save Announcement
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
