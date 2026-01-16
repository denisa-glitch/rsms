import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../utils/api';

const UserPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    full_name: '',
    role: 'front_office',
    specialization: '',
    phone_number: '',
  });
  const [newPassword, setNewPassword] = useState('');
  const [activityLogs, setActivityLogs] = useState([]);
  const [showActivityLogs, setShowActivityLogs] = useState(false);
  const [stats, setStats] = useState({
    appointments: 0,
    prescriptions: 0,
    transactions: 0,
    lastMonthActivity: 0,
  });

  // Fetch user details
  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await api.get(`/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setUser(response.data.data);
        setFormData({
          username: response.data.data.username,
          email: response.data.data.email,
          password: '',
          full_name: response.data.data.full_name,
          role: response.data.data.role,
          specialization: response.data.data.specialization || '',
          phone_number: response.data.data.phone_number || '',
        });
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      toast.error('Gagal mengambil data user');
      navigate('/users');
    } finally {
      setLoading(false);
    }
  };

  // Fetch user activity logs
  const fetchActivityLogs = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await api.get(`/users/${id}/activity-logs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setActivityLogs(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      toast.error('Gagal mengambil log aktivitas');
    }
  };

  // Fetch user statistics
  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await api.get(`/users/${id}/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
      // Fallback stats
      setStats({
        appointments: 0,
        prescriptions: 0,
        transactions: 0,
        lastMonthActivity: 0,
      });
    }
  };

  useEffect(() => {
    if (id) {
      fetchUserDetails();
      fetchUserStats();
    }
  }, [id]);

  useEffect(() => {
    if (showActivityLogs) {
      fetchActivityLogs();
    }
  }, [showActivityLogs]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Update user
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const updateData = { ...formData };
      
      // Remove password if empty
      if (!updateData.password) {
        delete updateData.password;
      }

      const response = await api.put(`/users/${id}`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        toast.success('User berhasil diupdate');
        setShowEditModal(false);
        fetchUserDetails();
        fetchUserStats();
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error(error.response?.data?.message || 'Gagal mengupdate user');
    }
  };

  // Reset password
  const handleResetPassword = async () => {
    if (!newPassword) {
      toast.error('Password baru harus diisi');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password minimal 6 karakter');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      const response = await api.put(`/users/${id}/password`, {
        password: newPassword,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        toast.success('Password berhasil direset');
        setShowResetPasswordModal(false);
        setNewPassword('');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error('Gagal reset password');
    }
  };

  // Toggle user status
  const toggleUserStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await api.put(`/users/${id}/status`, {
        is_active: !user.is_active,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        toast.success(`User berhasil ${!user.is_active ? 'diaktifkan' : 'dinonaktifkan'}`);
        fetchUserDetails();
      }
    } catch (error) {
      console.error('Error toggling user status:', error);
      toast.error('Gagal mengubah status user');
    }
  };

  // Role badge
  const getRoleBadge = (role) => {
    const colors = {
      admin: 'bg-red-100 text-red-800',
      dokter: 'bg-blue-100 text-blue-800',
      apoteker: 'bg-green-100 text-green-800',
      kasir: 'bg-yellow-100 text-yellow-800',
      front_office: 'bg-purple-100 text-purple-800',
    };

    const labels = {
      admin: 'Admin',
      dokter: 'Dokter',
      apoteker: 'Apoteker',
      kasir: 'Kasir',
      front_office: 'Front Office',
    };

    return (
      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${colors[role] || 'bg-gray-100 text-gray-800'}`}>
        {labels[role] || role}
      </span>
    );
  };

  // Status badge
  const getStatusBadge = (isActive) => {
    return isActive ? (
      <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
        Active
      </span>
    ) : (
      <span className="px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
        Inactive
      </span>
    );
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">User tidak ditemukan</h2>
          <button
            onClick={() => navigate('/users')}
            className="text-blue-600 hover:text-blue-800"
          >
            Kembali ke daftar user
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/users')}
                className="text-gray-600 hover:text-gray-900"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.full_name}</h1>
                <p className="text-gray-600">Detail dan aktivitas user</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetPasswordModal(true)}
                className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
              >
                Reset Password
              </button>
              <button
                onClick={() => setShowEditModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit User
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - User Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* User Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="text-2xl font-bold text-blue-600">{stats.appointments}</div>
                <div className="text-gray-600 text-sm">Appointments</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="text-2xl font-bold text-green-600">{stats.prescriptions}</div>
                <div className="text-gray-600 text-sm">Prescriptions</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="text-2xl font-bold text-purple-600">{stats.transactions}</div>
                <div className="text-gray-600 text-sm">Transactions</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="text-2xl font-bold text-orange-600">{stats.lastMonthActivity}</div>
                <div className="text-gray-600 text-sm">Aktivitas 30 Hari</div>
              </div>
            </div>

            {/* User Details Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Informasi User</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Identitas</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs text-gray-500">Nama Lengkap</div>
                      <div className="font-medium">{user.full_name}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Username</div>
                      <div className="font-medium">{user.username}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Email</div>
                      <div className="font-medium">{user.email}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Nomor Telepon</div>
                      <div className="font-medium">{user.phone_number || '-'}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Role & Status</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Role</div>
                      {getRoleBadge(user.role)}
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Status</div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(user.is_active)}
                        <button
                          onClick={toggleUserStatus}
                          className={`px-3 py-1 rounded text-sm ${user.is_active 
                            ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                            : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                        >
                          {user.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                        </button>
                      </div>
                    </div>
                    {user.specialization && (
                      <div>
                        <div className="text-xs text-gray-500">Spesialisasi</div>
                        <div className="font-medium">{user.specialization}</div>
                      </div>
                    )}
                    <div>
                      <div className="text-xs text-gray-500">Bergabung Sejak</div>
                      <div className="font-medium">{formatDate(user.created_at)}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity Section */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Aktivitas Terakhir</h3>
                  <button
                    onClick={() => setShowActivityLogs(!showActivityLogs)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    {showActivityLogs ? 'Sembunyikan' : 'Lihat Semua'}
                  </button>
                </div>
                
                {showActivityLogs ? (
                  <div className="space-y-3">
                    {activityLogs.length > 0 ? (
                      activityLogs.map((log, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="flex-shrink-0">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              log.action_type === 'login' ? 'bg-green-100 text-green-600' :
                              log.action_type === 'create' ? 'bg-blue-100 text-blue-600' :
                              log.action_type === 'update' ? 'bg-yellow-100 text-yellow-600' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={
                                  log.action_type === 'login' ? 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' :
                                  log.action_type === 'create' ? 'M12 4v16m8-8H4' :
                                  log.action_type === 'update' ? 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' :
                                  'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                                } />
                              </svg>
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{log.description}</div>
                            <div className="text-xs text-gray-500">{formatDate(log.created_at)}</div>
                          </div>
                          <div className="text-xs text-gray-400">
                            IP: {log.ip_address || '-'}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        Tidak ada aktivitas
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-gray-500">
                    Last login: {user.last_login ? formatDate(user.last_login) : 'Never'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Quick Actions */}
          <div className="space-y-6">
            {/* Quick Actions Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setShowEditModal(true)}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium">Edit Profile</div>
                    <div className="text-xs text-gray-500">Update informasi user</div>
                  </div>
                </button>

                <button
                  onClick={() => setShowResetPasswordModal(true)}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg"
                >
                  <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                    <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium">Reset Password</div>
                    <div className="text-xs text-gray-500">Setel ulang password</div>
                  </div>
                </button>

                <button
                  onClick={toggleUserStatus}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg"
                >
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium">
                      {user.is_active ? 'Nonaktifkan User' : 'Aktifkan User'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {user.is_active ? 'Blokir akses login' : 'Izinkan akses login'}
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => navigate(`/users/${id}/sessions`)}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg"
                >
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium">Session Logs</div>
                    <div className="text-xs text-gray-500">Lihat riwayat login</div>
                  </div>
                </button>
              </div>
            </div>

            {/* System Info Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Information</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-gray-500">User ID</div>
                  <div className="font-mono text-sm">{user.id}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Dibuat Pada</div>
                  <div className="text-sm">{formatDate(user.created_at)}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Terakhir Diupdate</div>
                  <div className="text-sm">{formatDate(user.updated_at)}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Terakhir Login</div>
                  <div className="text-sm">{user.last_login ? formatDate(user.last_login) : 'Never'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Edit User</h2>
              <form onSubmit={handleUpdateUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password (Kosongkan jika tidak ingin mengubah)
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="New password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="front_office">Front Office</option>
                    <option value="dokter">Dokter</option>
                    <option value="apoteker">Apoteker</option>
                    <option value="kasir">Kasir</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                {formData.role === 'dokter' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Specialization
                    </label>
                    <input
                      type="text"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Spesialisasi dokter"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="081234567890"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
                  <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Reset Password
                </h3>
                <p className="text-gray-500">
                  Masukkan password baru untuk user <span className="font-semibold">{user.full_name}</span>
                </p>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); handleResetPassword(); }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password Baru
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Minimal 6 karakter"
                    required
                  />
                </div>
                <div className="text-xs text-gray-500">
                  Password harus minimal 6 karakter
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-700"
                  >
                    Reset Password
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowResetPasswordModal(false);
                      setNewPassword('');
                    }}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPage;