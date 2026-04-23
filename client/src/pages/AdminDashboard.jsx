import { useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Users, Briefcase, Link2, TrendingUp, ShieldCheck, Calendar, Rss, Search, ChevronLeft, ChevronRight } from 'lucide-react';

const TABS = ['Overview', 'Users', 'Connections'];

export default function AdminDashboard() {
  const [tab, setTab] = useState('Overview');
  const [stats, setStats] = useState(null);
  const [userGrowth, setUserGrowth] = useState([]);
  const [users, setUsers] = useState([]);
  const [userTotal, setUserTotal] = useState(0);
  const [userPage, setUserPage] = useState(1);
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [connections, setConnections] = useState([]);
  const [connTotal, setConnTotal] = useState(0);
  const [connPage, setConnPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/stats');
      setStats(res.data.stats);
      setUserGrowth(res.data.userGrowth);
    } catch { toast.error('Failed to load stats'); }
    finally { setLoading(false); }
  };

  const fetchUsers = async (pg = 1) => {
    try {
      const params = { page: pg, limit: 15 };
      if (userSearch) params.search = userSearch;
      if (roleFilter) params.role = roleFilter;
      const res = await api.get('/admin/users', { params });
      setUsers(res.data.users);
      setUserTotal(res.data.total);
      setUserPage(pg);
    } catch { toast.error('Failed to load users'); }
  };

  const fetchConnections = async (pg = 1) => {
    try {
      const params = { page: pg, limit: 15 };
      if (statusFilter) params.status = statusFilter;
      const res = await api.get('/admin/connections', { params });
      setConnections(res.data.connections);
      setConnTotal(res.data.total);
      setConnPage(pg);
    } catch { toast.error('Failed to load connections'); }
  };

  useEffect(() => { fetchStats(); }, []);
  useEffect(() => { if (tab === 'Users') fetchUsers(1); }, [tab, roleFilter]);
  useEffect(() => { if (tab === 'Connections') fetchConnections(1); }, [tab, statusFilter]);

  const handleSearch = (e) => { e.preventDefault(); fetchUsers(1); };

  const toggleStatus = async (id) => {
    try {
      const res = await api.put(`/admin/users/${id}/toggle-status`);
      setUsers((prev) => prev.map((u) => u._id === id ? { ...u, isActive: res.data.isActive } : u));
      toast.success(res.data.message);
    } catch { toast.error('Failed'); }
  };

  const changeRole = async (id, role) => {
    try {
      await api.put(`/admin/users/${id}/role`, { role });
      setUsers((prev) => prev.map((u) => u._id === id ? { ...u, role } : u));
      toast.success('Role updated');
    } catch { toast.error('Failed to change role'); }
  };

  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const statCards = stats ? [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-600 bg-blue-50' },
    { label: 'Students', value: stats.totalStudents, icon: Users, color: 'text-purple-600 bg-purple-50' },
    { label: 'Mentors', value: stats.totalMentors, icon: ShieldCheck, color: 'text-green-600 bg-green-50' },
    { label: 'Active Connections', value: stats.activeConnections, icon: Link2, color: 'text-orange-600 bg-orange-50' },
    { label: 'Jobs Posted', value: stats.totalJobs, icon: Briefcase, color: 'text-red-600 bg-red-50' },
    { label: 'Workshops', value: stats.totalWorkshops, icon: Calendar, color: 'text-indigo-600 bg-indigo-50' },
    { label: 'Feed Posts', value: stats.totalPosts, icon: Rss, color: 'text-pink-600 bg-pink-50' },
    { label: 'New This Month', value: stats.newUsersThisMonth, icon: TrendingUp, color: 'text-teal-600 bg-teal-50' },
  ] : [];

  const maxGrowth = userGrowth.length > 0 ? Math.max(...userGrowth.map((g) => g.count)) : 1;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-24 lg:pb-8">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <ShieldCheck size={22} className="text-blue-700" />
          <h1 className="section-headline">Admin dashboard</h1>
        </div>
        <p className="section-subtle">Monitor users, connections, and platform health with role-safe controls.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-slate-200">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
              tab === t ? 'border-blue-700 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}>
            {t}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {tab === 'Overview' && (
        <div className="space-y-6">
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => <div key={i} className="card h-24 animate-pulse bg-gray-100" />)}
            </div>
          ) : (
            <>
              {/* Stat cards */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="card flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{value?.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">{label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* User growth chart */}
              {userGrowth.length > 0 && (
                <div className="card">
                  <h2 className="font-semibold text-gray-900 mb-4">User Growth (Last 6 Months)</h2>
                  <div className="flex items-end gap-3 h-36">
                    {userGrowth.map((g) => (
                      <div key={`${g._id.year}-${g._id.month}`} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-xs text-gray-500 font-medium">{g.count}</span>
                        <div
                          className="w-full bg-blue-500 rounded-t-md transition-all hover:bg-blue-600"
                          style={{ height: `${Math.max((g.count / maxGrowth) * 100, 8)}%` }}
                        />
                        <span className="text-xs text-gray-400">{MONTHS[g._id.month - 1]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ── USERS ── */}
      {tab === 'Users' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <form onSubmit={handleSearch} className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input className="input pl-9 text-sm" placeholder="Search by name, email, college..."
                value={userSearch} onChange={(e) => setUserSearch(e.target.value)} />
            </form>
            <div className="flex gap-2">
              {['', 'student', 'mentor', 'admin'].map((r) => (
                <button key={r} onClick={() => setRoleFilter(r)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${
                    roleFilter === r ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}>
                  {r || 'All'}
                </button>
              ))}
            </div>
          </div>

          <p className="text-sm text-gray-500">{userTotal} users found</p>

          {/* Table */}
          <div className="card p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">User</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Role</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">College</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Joined</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            {u.profilePhoto ? (
                              <img src={u.profilePhoto} className="w-8 h-8 rounded-full object-cover" alt="" />
                            ) : (
                              <span className="text-blue-600 text-xs font-bold">{u.name?.[0]}</span>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{u.name}</div>
                            <div className="text-xs text-gray-400">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <select value={u.role} onChange={(e) => changeRole(u._id, e.target.value)}
                          className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 capitalize">
                          <option value="student">Student</option>
                          <option value="mentor">Mentor</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 text-gray-500 hidden md:table-cell text-xs">{u.college || '—'}</td>
                      <td className="px-4 py-3 text-gray-400 hidden lg:table-cell text-xs">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          u.isActive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
                        }`}>
                          {u.isActive ? 'Active' : 'Banned'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => toggleStatus(u._id)}
                          className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${
                            u.isActive
                              ? 'bg-red-50 text-red-600 hover:bg-red-100'
                              : 'bg-green-50 text-green-600 hover:bg-green-100'
                          }`}>
                          {u.isActive ? 'Ban' : 'Unban'}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td className="px-4 py-10 text-center text-slate-500" colSpan={6}>No users found for the current filters.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Page {userPage} of {Math.ceil(userTotal / 15)}</span>
            <div className="flex gap-2">
              <button onClick={() => fetchUsers(userPage - 1)} disabled={userPage === 1}
                className="btn-secondary px-3 py-1.5 text-xs disabled:opacity-40 flex items-center gap-1">
                <ChevronLeft size={14} /> Prev
              </button>
              <button onClick={() => fetchUsers(userPage + 1)} disabled={userPage >= Math.ceil(userTotal / 15)}
                className="btn-secondary px-3 py-1.5 text-xs disabled:opacity-40 flex items-center gap-1">
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CONNECTIONS ── */}
      {tab === 'Connections' && (
        <div className="space-y-4">
          <div className="flex gap-2">
            {['', 'pending', 'active', 'declined', 'closed'].map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${
                  statusFilter === s ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                {s || 'All'}
              </button>
            ))}
          </div>

          <p className="text-sm text-gray-500">{connTotal} connections</p>

          <div className="card p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Student</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Mentor</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {connections.map((c) => (
                    <tr key={c._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{c.studentId?.name}</div>
                        <div className="text-xs text-gray-400">{c.studentId?.college}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{c.mentorId?.name}</div>
                        <div className="text-xs text-gray-400">{c.mentorId?.industry}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          c.status === 'active' ? 'bg-green-50 text-green-600' :
                          c.status === 'pending' ? 'bg-yellow-50 text-yellow-600' :
                          'bg-gray-100 text-gray-500'
                        }`}>{c.status}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400 hidden md:table-cell">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {connections.length === 0 && (
                    <tr>
                      <td className="px-4 py-10 text-center text-slate-500" colSpan={4}>No connections found for the selected status.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Page {connPage} of {Math.ceil(connTotal / 15)}</span>
            <div className="flex gap-2">
              <button onClick={() => fetchConnections(connPage - 1)} disabled={connPage === 1}
                className="btn-secondary px-3 py-1.5 text-xs disabled:opacity-40 flex items-center gap-1">
                <ChevronLeft size={14} /> Prev
              </button>
              <button onClick={() => fetchConnections(connPage + 1)} disabled={connPage >= Math.ceil(connTotal / 15)}
                className="btn-secondary px-3 py-1.5 text-xs disabled:opacity-40 flex items-center gap-1">
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
