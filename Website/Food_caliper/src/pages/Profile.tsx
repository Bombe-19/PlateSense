import { useState, useEffect } from "react";
import { ArrowLeft, Save, Upload, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import BackgroundLayout from "@/components/BackgroundLayout";
import Navbar from "@/components/Navbar";
import Dock from "@/components/Dock";
import { Home, Microscope, BarChart4, Settings, User } from "lucide-react";
import { apiClient } from "@/services/apiClient";

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    full_name: "",
    profile_picture: "",
    height_cm: "",
    weight_kg: "",
    age: "",
    dietary_preferences: "",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          profile_picture: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const dockItems = [
    { 
      icon: <Home size={20} />, 
      label: 'Home', 
      onClick: () => navigate('/') 
    },
    { 
      icon: <Microscope size={20} />, 
      label: 'Analyze', 
      onClick: () => navigate('/analysis') 
    },
    { 
      icon: <BarChart4 size={20} />, 
      label: 'Dashboard', 
      onClick: () => navigate('/dashboard') 
    },
    { 
      icon: <Settings size={20} />, 
      label: 'Settings', 
      onClick: () => navigate('/login') 
    },
    { 
      icon: <User size={20} />, 
      label: 'Profile', 
      onClick: () => navigate('/profile') 
    },
  ];

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setInitialLoading(true);
      setError(null);
      const userId = apiClient.getUserId();
      
      if (!userId) {
        navigate("/login");
        return;
      }

      const profile = await apiClient.getUserProfile(userId);
      setFormData({
        username: profile.username || "",
        email: profile.email || "",
        full_name: profile.full_name || "",
        profile_picture: profile.profile_picture || "",
        height_cm: profile.height_cm?.toString() || "",
        weight_kg: profile.weight_kg?.toString() || "",
        age: profile.age?.toString() || "",
        dietary_preferences: profile.dietary_preferences || "",
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || "Failed to load profile";
      setError(errorMessage);
      console.error("Error fetching profile:", err);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const userId = apiClient.getUserId();
      await apiClient.updateUserProfile(userId, {
        username: formData.username,
        email: formData.email,
        full_name: formData.full_name,
        profile_picture: formData.profile_picture,
        height_cm: formData.height_cm ? parseFloat(formData.height_cm) : null,
        weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : null,
        age: formData.age ? parseInt(formData.age) : null,
        dietary_preferences: formData.dietary_preferences,
      });
      setIsEditing(false);
      alert("Profile updated successfully!");
      // Fetch updated profile data and display
      await fetchUserProfile();
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || "Error updating profile";
      setError(errorMessage);
      console.error("Error updating profile:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BackgroundLayout>
      <Navbar isAuthenticated />

      <div className="container py-12 pb-32">
        {initialLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft size={20} />
                Back
              </button>
              <h1 className="text-4xl font-bold text-foreground">My Profile</h1>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-600 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto glass-card p-8"
            >
              {/* Profile Picture Section */}
              <div className="flex flex-col items-center mb-8 pb-8 border-b border-border">
                <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center mb-4 overflow-hidden shadow-lg group">
                  {formData.profile_picture ? (
                    <img src={formData.profile_picture} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl">👤</span>
                  )}
                  {isEditing && (
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Upload size={24} className="text-white" />
                    </div>
                  )}
                </div>
                {isEditing && (
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors bg-orange-500/10 px-4 py-2 rounded-lg hover:bg-orange-500/20">
                    <Upload size={16} />
                    <span>Change Photo</span>
                    <input 
                      type="file" 
                      hidden 
                      accept="image/*" 
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                {/* Username */}
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground disabled:opacity-50 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground disabled:opacity-50 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">Full Name</label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground disabled:opacity-50 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                {/* Health Information */}
                <div className="grid grid-cols-3 gap-4">
                  {/* Height */}
                  <div>
                    <label className="block text-sm font-bold text-foreground mb-2">Height (cm)</label>
                    <input
                      type="number"
                      name="height_cm"
                      value={formData.height_cm}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground disabled:opacity-50 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  {/* Weight */}
                  <div>
                    <label className="block text-sm font-bold text-foreground mb-2">Weight (kg)</label>
                    <input
                      type="number"
                      name="weight_kg"
                      value={formData.weight_kg}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground disabled:opacity-50 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  {/* Age */}
                  <div>
                    <label className="block text-sm font-bold text-foreground mb-2">Age</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground disabled:opacity-50 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Dietary Preferences */}
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">Dietary Preferences</label>
                  <textarea
                    name="dietary_preferences"
                    value={formData.dietary_preferences}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground disabled:opacity-50 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="e.g., Vegetarian, Gluten-free, Vegan..."
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8 pt-8 border-t border-border">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-colors cursor-target"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        fetchUserProfile();
                      }}
                      className="flex-1 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-foreground font-bold py-3 rounded-lg transition-colors cursor-target"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-target"
                    >
                      <Save size={18} />
                      {isLoading ? "Saving..." : "Save Changes"}
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}

        {/* Navigation Dock */}
        <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
          <div className="pointer-events-auto">
            <Dock 
              items={dockItems}
              panelHeight={68}
              baseItemSize={50}
              magnification={70}
            />
          </div>
        </div>
      </div>
    </BackgroundLayout>
  );
};

export default Profile;
