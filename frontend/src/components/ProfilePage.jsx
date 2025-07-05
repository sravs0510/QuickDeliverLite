import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  User, Mail, Eye, EyeOff, Phone, Shield, Edit3, Save, X,
  Lock, Sparkles, ImagePlus
} from 'lucide-react';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [editData, setEditData] = useState(null);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState('');
  const email = localStorage.getItem("userEmail");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/user/getFullProfile?email=${email}`);
        setProfileData(res.data);
        setEditData({ ...res.data, password: '', image: '' });
        setImagePreview(res.data.profileImage || '');
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
    if (editData.password.trim() && editData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!editData.mobile.trim()) newErrors.mobile = 'Mobile number is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({ ...profileData, password: '', image: '' });
    setImagePreview(profileData.profileImage || '');
    setErrors({});
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    try {
      const formData = new FormData();
      formData.append("email", editData.email);
      formData.append("name", editData.name);
      formData.append("password", editData.password);
      formData.append("mobile", editData.mobile);
      if (editData.image) {
        formData.append("profileImage", editData.image);
      }

      const res = await axios.put('http://localhost:5000/api/user/updateProfile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setProfileData(res.data);
      setEditData({ ...res.data, password: '', image: '' });
      setImagePreview(res.data.profileImage || '');
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  const handleCancel = () => {
    setEditData({ ...profileData, password: '', image: '' });
    setImagePreview(profileData.profileImage || '');
    setIsEditing(false);
    setErrors({});
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditData(prev => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  if (!profileData) return <div className="text-center py-20 text-lg font-medium">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-md">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              My Profile
            </h1>
          </div>
          <p className="text-gray-600 text-lg">{isEditing ? 'Edit your information' : 'View your details'}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              {imagePreview && (
                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-blue-500">
                  <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                </div>
              )}
              <div>
                <h2 className="text-2xl font-semibold">{profileData.name}</h2>
                <p className="text-sm text-gray-500">{profileData.email}</p>
              </div>
            </div>
            <div className="flex gap-3">
              {isEditing ? (
                <>
                  <button onClick={handleCancel} className="bg-gray-200 px-4 py-2 rounded-lg text-gray-700 flex items-center gap-1">
                    <X size={16} /> Cancel
                  </button>
                  <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-1">
                    <Save size={16} /> Save
                  </button>
                </>
              ) : (
                <button onClick={handleEdit} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-1">
                  <Edit3 size={16} /> Edit
                </button>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="mb-6">
              <label className="block text-gray-600 font-semibold mb-2 flex items-center gap-2">
                <ImagePlus className="w-5 h-5 text-blue-600" />
                Upload Profile Image
              </label>
              <input type="file" accept="image/*" onChange={handleImageChange} />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Full Name" value={editData.name} field="name" icon={User} />
            <Field label="Email" value={editData.email} field="email" icon={Mail} />
            <Field label="Mobile" value={editData.mobile} field="mobile" icon={Phone} />
            {isEditing && <Field label="Password" value={editData.password} field="password" icon={Lock} type="password" />}
          </div>
        </div>
      </div>
    </div>
  );

  function Field({ label, value, field, icon: Icon, type = 'text' }) {
    return (
      <div>
        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Icon className="w-4 h-4 text-blue-600" />
          {label}
        </label>
        {isEditing ? (
          <input
            type={type}
            value={value}
            onChange={(e) => handleInputChange(field, e.target.value)}
            className="w-full px-4 py-2 mt-1 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <div className="w-full px-4 py-2 mt-1 rounded-lg bg-gray-100 border border-gray-300">
            {value || 'N/A'}
          </div>
        )}
        {errors[field] && <p className="text-sm text-red-500 mt-1">{errors[field]}</p>}
      </div>
    );
  }
};

export default ProfilePage;
