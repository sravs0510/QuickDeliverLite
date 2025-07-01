import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  User, Mail, Eye, EyeOff, Phone, Shield, Edit3, Save, X,
  Check, Lock, Sparkles
} from 'lucide-react';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [editData, setEditData] = useState(null);
  const [errors, setErrors] = useState({});
  const email = localStorage.getItem("userEmail");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/user/getFullProfile?email=${email}`);
        setProfileData(res.data);
        setEditData({ ...res.data, password: '' }); // do not prefill hashed password
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };

    if (email) fetchProfile();
  }, [email]);

  const validateForm = () => {
    const newErrors = {};
    if (!editData.name.trim()) newErrors.name = 'Name is required';
    if (!editData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(editData.email)) {
      newErrors.email = 'Email is invalid';
    }
  
    // ✅ Password is optional but must be min 6 chars if provided
    if (editData.password.trim() && editData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
  
    if (!editData.mobile.trim()) newErrors.mobile = 'Mobile number is required';
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({ ...profileData, password: '' }); // reset password field
    setErrors({});
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const res = await axios.put('http://localhost:5000/api/user/updateProfile', {
        email: editData.email,
        name: editData.name,
        password: editData.password,
        mobile: editData.mobile
      });

      setProfileData(res.data);
      setEditData({ ...res.data, password: '' });
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  const handleCancel = () => {
    setEditData({ ...profileData, password: '' });
    setIsEditing(false);
    setErrors({});
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  if (!profileData) return <div className="text-center py-20 text-lg font-medium">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 py-12 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
              Profile
            </h1>
          </div>
          <p className="text-xl text-gray-600 font-medium">
            {isEditing ? 'Update your personal information' : 'Manage your account details'}
          </p>
        </div>

        <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl shadow-blue-500/10 border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">{profileData.name}</h2>
                <p className="text-blue-100 font-medium">{isEditing ? 'Editing Mode' : 'View Mode'}</p>
              </div>
              <div className="flex gap-3">
                {isEditing ? (
                  <>
                    <button onClick={handleCancel} className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all duration-200 flex items-center gap-2 font-semibold">
                      <X className="w-4 h-4" /> Cancel
                    </button>
                    <button onClick={handleSave} className="px-6 py-3 bg-white text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 flex items-center gap-2 font-semibold">
                      <Save className="w-4 h-4" /> Save Changes
                    </button>
                  </>
                ) : (
                  <button onClick={handleEdit} className="px-6 py-3 bg-white text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 flex items-center gap-2 font-semibold">
                    <Edit3 className="w-4 h-4" /> Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Profile Fields */}
          <div className="p-8">
            {!isEditing ? (
              <div className="grid gap-6">
                <ProfileField icon={User} label="Full Name" value={profileData.name} />
                <ProfileField icon={Mail} label="Email Address" value={profileData.email} />
                <ProfileField icon={Shield} label="Account Role" value={profileData.role} isRole />
                <ProfileField icon={Phone} label="Mobile Number" value={profileData.mobile} />
              </div>
            ) : (
              <div className="grid gap-8">
                <EditField icon={User} label="Full Name" field="name" />
                <EditField icon={Mail} label="Email Address" field="email" type="email" />
                <EditField icon={Eye} label="Password" field="password" type="password" />
                <EditRoleField />
                <EditField icon={Phone} label="Mobile Number" field="mobile" type="tel" />
              </div>
            )}

            {!isEditing && Object.keys(errors).length === 0 && (
              <div className="mt-8 p-6 bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-200/50 rounded-2xl flex items-center gap-3 text-emerald-700">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold">Profile information is secure and up to date</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  function ProfileField({ icon: Icon, label, value, isRole = false }) {
    return (
      <div className="group relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-2xl"></div>
        <div className="relative p-6 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl hover:border-blue-300/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{label}</p>
                <p className="text-lg font-semibold text-gray-900">{value}</p>
              </div>
            </div>
          </div>
          {isRole && (
            <div className="mt-4">
              <div className={`inline-flex px-4 py-2 rounded-full text-sm font-semibold ${
                profileData.role === 'customer'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25'
              }`}>
                {profileData.role.charAt(0).toUpperCase() + profileData.role.slice(1)}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  function EditField({ icon: Icon, label, field, type = 'text' }) {
    const isPassword = field === 'password';
    const displayType = isPassword && showPassword ? 'text' : type;

    return (
      <div className="space-y-3">
        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 uppercase tracking-wide">
          <Icon className="w-4 h-4 text-blue-600" />
          {label}
        </label>
        <div className="relative group">
          <input
            type={displayType}
            value={editData[field] || ''}
            onChange={(e) => handleInputChange(field, e.target.value)}
            className={`w-full px-6 py-4 rounded-2xl border-2 transition-all duration-300 bg-white/80 backdrop-blur-sm ${
              errors[field]
                ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100 shadow-lg shadow-red-500/10'
                : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 group-hover:border-blue-300 shadow-lg shadow-blue-500/5'
            } text-lg font-medium placeholder-gray-400`}
            placeholder={`Enter your ${label.toLowerCase()}`}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors p-1"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          )}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none"></div>
        </div>
        {errors[field] && (
          <p className="text-sm text-red-600 flex items-center gap-2 font-medium">
            <X className="w-4 h-4" /> {errors[field]}
          </p>
        )}
      </div>
    );
  }

  function EditRoleField() {
    return (
      <div className="space-y-3">
        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 uppercase tracking-wide">
          <Shield className="w-4 h-4 text-blue-600" />
          Role
        </label>
        <div className="relative p-6 rounded-2xl border-2 border-gray-200 bg-gray-50/80 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className={`inline-flex px-4 py-2 rounded-full text-sm font-semibold ${
              profileData.role === 'customer'
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25'
                : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25'
            }`}>
              {profileData.role.charAt(0).toUpperCase() + profileData.role.slice(1)}
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <Lock className="w-4 h-4" />
              <span className="text-sm font-medium">Cannot be modified</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default ProfilePage;
