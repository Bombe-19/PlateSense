import { useState, useEffect, useRef } from "react";
import { 
  ArrowLeft, 
  Save, 
  Upload, 
  Loader, 
  RefreshCw, 
  FileText, 
  X, 
  Ruler, 
  Scale, 
  Calendar, 
  Mail, 
  Tag, 
  Sparkles, 
  UserCheck, 
  Activity, 
  Utensils, 
  Home, 
  Microscope, 
  BarChart4, 
  User 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import BackgroundLayout from "@/components/BackgroundLayout";
import Navbar from "@/components/Navbar";
import Dock from "@/components/Dock";
import { apiClient } from "@/services/apiClient";
import { toast } from "sonner";

const SUGGESTED_DIETARY = [
  "Vegetarian",
  "Vegan",
  "Keto",
  "Gluten-Free",
  "Dairy-Free",
  "Low-Carb",
  "High-Protein",
  "Halal",
  "Kosher"
];

const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
        toast.success("New image loaded! Click Save changes to apply.");
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    if (isEditing) {
      fileInputRef.current?.click();
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
      icon: <FileText size={20} />, 
      label: 'Reports', 
      onClick: () => navigate('/reports') 
    },
    { 
      icon: <User size={20} />, 
      label: 'Profile', 
      onClick: () => navigate('/profile') 
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUserProfile();
    }, 100);
    
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchUserProfile();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
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
        username: profile.username != null ? String(profile.username).trim() : "",
        email: profile.email != null ? String(profile.email).trim() : "",
        full_name: profile.full_name != null ? String(profile.full_name).trim() : "",
        profile_picture: profile.profile_picture != null ? String(profile.profile_picture).trim() : "",
        height_cm: profile.height_cm != null ? String(profile.height_cm).trim() : "",
        weight_kg: profile.weight_kg != null ? String(profile.weight_kg).trim() : "",
        age: profile.age != null ? String(profile.age).trim() : "",
        dietary_preferences: profile.dietary_preferences != null ? String(profile.dietary_preferences).trim() : "",
      });
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || "Failed to load profile";
      setError(errorMessage);
      toast.error(errorMessage);
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

  const toggleDietaryPreference = (pref: string) => {
    const currentPrefs = formData.dietary_preferences
      ? formData.dietary_preferences.split(",").map(p => p.trim()).filter(Boolean)
      : [];
    
    let newPrefs;
    if (currentPrefs.includes(pref)) {
      newPrefs = currentPrefs.filter(p => p !== pref);
    } else {
      newPrefs = [...currentPrefs, pref];
    }
    
    setFormData(prev => ({
      ...prev,
      dietary_preferences: newPrefs.join(", ")
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const userId = apiClient.getUserId();
      
      const dataToSend = {
        username: formData.username,
        email: formData.email,
        full_name: formData.full_name,
        profile_picture: formData.profile_picture,
        height_cm: formData.height_cm ? parseFloat(formData.height_cm) : null,
        weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : null,
        age: formData.age ? parseInt(formData.age) : null,
        dietary_preferences: formData.dietary_preferences,
      };
      
      await apiClient.updateUserProfile(userId, dataToSend);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
      
      setTimeout(() => {
        fetchUserProfile();
      }, 500);
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || "Error updating profile";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateBMI = () => {
    const h = parseFloat(formData.height_cm);
    const w = parseFloat(formData.weight_kg);
    if (!h || !w || h <= 0 || w <= 0) return null;
    const heightM = h / 100;
    return parseFloat((w / (heightM * heightM)).toFixed(1));
  };

  const bmi = calculateBMI();

  const getBMICategory = (bmiVal: number) => {
    if (bmiVal < 18.5) {
      return { 
        label: "Underweight", 
        color: "text-amber-500 bg-amber-500/10 border-amber-500/20 dark:bg-amber-500/20", 
        message: "Consider speaking with a health professional to see if you need to gain weight."
      };
    }
    if (bmiVal < 25) {
      return { 
        label: "Normal Weight", 
        color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20 dark:bg-emerald-500/20", 
        message: "Great job! Maintaining a healthy weight reduces the risk of serious health conditions."
      };
    }
    if (bmiVal < 30) {
      return { 
        label: "Overweight", 
        color: "text-orange-500 bg-orange-500/10 border-orange-500/20 dark:bg-orange-500/20", 
        message: "You may benefit from balanced dietary adjustments and increased physical activity."
      };
    }
    return { 
      label: "Obese", 
      color: "text-rose-500 bg-rose-500/10 border-rose-500/20 dark:bg-rose-500/20", 
      message: "We recommend consulting a doctor or dietitian for guidance on weight management."
    };
  };

  const bmiInfo = bmi ? getBMICategory(bmi) : null;

  const getBmiPercentage = (bmiVal: number) => {
    const minBmi = 15;
    const maxBmi = 35;
    const pct = ((bmiVal - minBmi) / (maxBmi - minBmi)) * 100;
    return Math.min(Math.max(pct, 0), 100);
  };

  const dietaryPills = formData.dietary_preferences
    ? formData.dietary_preferences.split(",").map(p => p.trim()).filter(Boolean)
    : [];

  const getInitials = () => {
    if (formData.full_name) {
      return formData.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (formData.username) {
      return formData.username.slice(0, 2).toUpperCase();
    }
    return "U";
  };

  const getProfileCompletion = () => {
    const fields = [
      formData.full_name,
      formData.email,
      formData.username,
      formData.height_cm,
      formData.weight_kg,
      formData.age,
      formData.dietary_preferences,
      formData.profile_picture
    ];
    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  };

  const completionPct = getProfileCompletion();

  return (
    <BackgroundLayout>
      <Navbar isAuthenticated />

      <div className="container py-12 pb-32 max-w-6xl mx-auto px-4 md:px-8">
        {initialLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <Loader className="h-10 w-10 animate-spin text-primary" />
            <p className="text-muted-foreground text-sm font-medium animate-pulse">Loading profile data...</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between gap-4 mb-10">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate("/")}
                  className="cursor-pointer flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-all bg-card/40 border border-border/40 hover:border-border px-3 py-1.5 rounded-lg"
                >
                  <ArrowLeft size={16} />
                  Back
                </button>
                <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">My Profile</h1>
              </div>
              <button
                onClick={fetchUserProfile}
                disabled={initialLoading}
                className="cursor-pointer flex items-center justify-center p-2.5 text-muted-foreground hover:text-foreground bg-card/40 border border-border/40 hover:border-border rounded-xl transition-all disabled:opacity-50"
                title="Refresh Profile"
              >
                <RefreshCw size={18} className={initialLoading ? "animate-spin" : ""} />
              </button>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                {error}
              </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 items-start">
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-3 flex flex-col gap-6"
              >
                <div className="glass-card p-6 flex flex-col items-center text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
                  
                  <div 
                    onClick={triggerFileInput}
                    className={`relative w-28 h-28 rounded-full flex items-center justify-center mb-5 overflow-hidden shadow-xl border-4 border-background transition-all group ${isEditing ? "cursor-pointer ring-2 ring-primary/50 ring-offset-2 ring-offset-background hover:scale-105" : ""}`}
                  >
                    {formData.profile_picture ? (
                      <img src={formData.profile_picture} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-emerald-500 via-teal-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold tracking-wider">
                        {getInitials()}
                      </div>
                    )}
                    
                    {isEditing && (
                      <div className="absolute inset-0 bg-black/45 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1 select-none">
                        <Upload size={18} className="animate-bounce" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Upload</span>
                      </div>
                    )}
                  </div>
                  
                  {isEditing && (
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      hidden 
                      accept="image/*" 
                      onChange={handleImageChange}
                    />
                  )}

                  <h2 className="text-xl font-bold text-foreground truncate max-w-full">
                    {formData.full_name || "FoodCaliper User"}
                  </h2>
                  <p className="text-sm text-muted-foreground font-medium mb-4 truncate max-w-full">
                    @{formData.username || "username"}
                  </p>

                  <div className="w-full border-t border-border/60 my-2" />

                  <div className="w-full mt-3 text-left">
                    <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground mb-1.5">
                      <span>Profile Setup</span>
                      <span className="text-primary font-bold">{completionPct}%</span>
                    </div>
                    <div className="h-2 w-full bg-muted/80 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-emerald-400 to-primary rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${completionPct}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 justify-center mt-5 w-full">
                    {completionPct === 100 && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
                        <UserCheck size={10} /> Fully Setup
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      <Sparkles size={10} /> Caliper Pro
                    </span>
                    {bmi && (
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold ${bmiInfo?.color} px-2.5 py-1 rounded-full uppercase tracking-wider`}>
                        <Activity size={10} /> Health Sync
                      </span>
                    )}
                  </div>
                </div>

                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="cursor-pointer w-full bg-primary hover:bg-primary/95 text-white font-bold py-3.5 px-4 rounded-2xl transition-all shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20 transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        fetchUserProfile();
                      }}
                      className="cursor-pointer flex-1 bg-card border border-border/80 hover:bg-muted text-foreground font-bold py-3 px-4 rounded-2xl transition-all flex items-center justify-center gap-2"
                    >
                      <X size={16} />
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="cursor-pointer flex-1 bg-primary hover:bg-primary/95 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-2xl transition-all shadow-md shadow-primary/10 hover:shadow-lg flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <Loader size={16} className="animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={16} />
                          Save
                        </>
                      )}
                    </button>
                  </div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-7 flex flex-col gap-6"
              >
                <div className="glass-card p-6 md:p-8">
                  <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2 pb-3 border-b border-border/60">
                    <User size={18} className="text-primary" />
                    Personal Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Full Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="full_name"
                          value={formData.full_name}
                          onChange={handleInputChange}
                          placeholder="e.g. John Doe"
                          className="cursor-pointer w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        />
                      ) : (
                        <p className="text-base font-semibold text-foreground bg-muted/30 border border-border/20 px-4 py-3 rounded-xl min-h-[46px] flex items-center">
                          {formData.full_name || <span className="text-muted-foreground font-normal italic">Not set</span>}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Username</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          placeholder="e.g. johndoe"
                          className="cursor-pointer w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        />
                      ) : (
                        <p className="text-base font-semibold text-foreground bg-muted/30 border border-border/20 px-4 py-3 rounded-xl min-h-[46px] flex items-center">
                          {formData.username || <span className="text-muted-foreground font-normal italic">Not set</span>}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Email Address</label>
                      {isEditing ? (
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="email@example.com"
                            className="cursor-pointer w-full pl-10 pr-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                          />
                        </div>
                      ) : (
                        <p className="text-base font-semibold text-foreground bg-muted/30 border border-border/20 px-4 py-3 rounded-xl min-h-[46px] flex items-center gap-2">
                          <Mail size={16} className="text-muted-foreground" />
                          {formData.email || <span className="text-muted-foreground font-normal italic">Not set</span>}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="glass-card p-6 md:p-8">
                  <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2 pb-3 border-b border-border/60">
                    <Activity size={18} className="text-primary" />
                    Health & Body Metrics
                  </h3>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-card/60 dark:bg-card/20 rounded-2xl p-4 border border-border/60 flex flex-col relative overflow-hidden">
                      <div className="flex items-center justify-between text-muted-foreground mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider">Height</span>
                        <Ruler size={16} className="text-primary/70" />
                      </div>
                      {isEditing ? (
                        <input
                          type="number"
                          name="height_cm"
                          value={formData.height_cm}
                          onChange={handleInputChange}
                          placeholder="cm"
                          className="cursor-pointer w-full bg-muted/50 border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      ) : (
                        <p className="text-2xl font-black text-foreground mt-1">
                          {formData.height_cm ? (
                            <>{formData.height_cm} <span className="text-xs font-semibold text-muted-foreground">cm</span></>
                          ) : <span className="text-sm font-semibold text-muted-foreground italic">—</span>}
                        </p>
                      )}
                    </div>

                    <div className="bg-card/60 dark:bg-card/20 rounded-2xl p-4 border border-border/60 flex flex-col relative overflow-hidden">
                      <div className="flex items-center justify-between text-muted-foreground mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider">Weight</span>
                        <Scale size={16} className="text-primary/70" />
                      </div>
                      {isEditing ? (
                        <input
                          type="number"
                          name="weight_kg"
                          value={formData.weight_kg}
                          onChange={handleInputChange}
                          placeholder="kg"
                          className="cursor-pointer w-full bg-muted/50 border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      ) : (
                        <p className="text-2xl font-black text-foreground mt-1">
                          {formData.weight_kg ? (
                            <>{formData.weight_kg} <span className="text-xs font-semibold text-muted-foreground">kg</span></>
                          ) : <span className="text-sm font-semibold text-muted-foreground italic">—</span>}
                        </p>
                      )}
                    </div>

                    <div className="bg-card/60 dark:bg-card/20 rounded-2xl p-4 border border-border/60 flex flex-col relative overflow-hidden">
                      <div className="flex items-center justify-between text-muted-foreground mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider">Age</span>
                        <Calendar size={16} className="text-primary/70" />
                      </div>
                      {isEditing ? (
                        <input
                          type="number"
                          name="age"
                          value={formData.age}
                          onChange={handleInputChange}
                          placeholder="yrs"
                          className="cursor-pointer w-full bg-muted/50 border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      ) : (
                        <p className="text-2xl font-black text-foreground mt-1">
                          {formData.age ? (
                            <>{formData.age} <span className="text-xs font-semibold text-muted-foreground">yrs</span></>
                          ) : <span className="text-sm font-semibold text-muted-foreground italic">—</span>}
                        </p>
                      )}
                    </div>
                  </div>

                  {bmi && bmiInfo ? (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 p-5 rounded-2xl border border-border/50 bg-muted/20 flex flex-col"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Body Mass Index (BMI)</span>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${bmiInfo.color}`}>
                          {bmi} ({bmiInfo.label})
                        </span>
                      </div>
                      <div className="relative h-2.5 w-full bg-muted/80 rounded-full overflow-visible mb-3">
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-emerald-500 via-orange-400 to-rose-500 rounded-full opacity-90" />
                        <motion.div 
                          className="absolute -top-1 w-4.5 h-4.5 rounded-full bg-white border-2 border-foreground dark:border-slate-800 shadow-md cursor-help flex items-center justify-center -ml-2"
                          style={{ left: `${getBmiPercentage(bmi)}%` }}
                          whileHover={{ scale: 1.2 }}
                          title={`BMI: ${bmi}`}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 leading-relaxed bg-card/40 dark:bg-card/10 border border-border/30 rounded-xl p-3">
                        {bmiInfo.message}
                      </p>
                    </motion.div>
                  ) : (
                    <div className="mt-6 p-5 rounded-2xl border border-dashed border-border/80 bg-muted/10 text-center flex flex-col items-center justify-center py-6 text-muted-foreground">
                      <Activity className="h-7 w-7 text-muted-foreground/40 mb-2" />
                      <p className="text-sm font-medium">Add your Height & Weight to calculate your BMI rating</p>
                    </div>
                  )}
                </div>

                <div className="glass-card p-6 md:p-8">
                  <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2 pb-3 border-b border-border/60">
                    <Utensils size={18} className="text-primary" />
                    Dietary Preferences
                  </h3>

                  {isEditing ? (
                    <div className="space-y-5">
                      <textarea
                        name="dietary_preferences"
                        value={formData.dietary_preferences}
                        onChange={handleInputChange}
                        rows={2}
                        className="cursor-pointer w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                        placeholder="e.g. Vegetarian, Gluten-free, Low-sodium..."
                      />
                      <div>
                        <span className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Quick Add Suggestions</span>
                        <div className="flex flex-wrap gap-2">
                          {SUGGESTED_DIETARY.map((pref) => {
                            const isSelected = dietaryPills.some(p => p.toLowerCase() === pref.toLowerCase());
                            return (
                              <button
                                key={pref}
                                type="button"
                                onClick={() => toggleDietaryPreference(pref)}
                                className={`cursor-pointer text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                                  isSelected 
                                    ? "bg-primary text-white border-primary shadow-sm shadow-primary/15" 
                                    : "bg-card border-border/80 hover:bg-muted text-foreground"
                                }`}
                              >
                                {pref}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {dietaryPills.length > 0 ? (
                        <div className="flex flex-wrap gap-2.5">
                          {dietaryPills.map((pref, idx) => (
                            <span 
                              key={idx}
                              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/8 border border-primary/15 px-3.5 py-1.5 rounded-full tracking-wide shadow-sm"
                            >
                              <Tag size={12} className="opacity-80" />
                              {pref}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <div className="p-6 rounded-2xl border border-dashed border-border/80 bg-muted/10 text-center flex flex-col items-center justify-center text-muted-foreground">
                          <Utensils className="h-7 w-7 text-muted-foreground/40 mb-2" />
                          <p className="text-sm font-medium mb-1">No dietary preferences specified</p>
                          <p className="text-xs text-muted-foreground/80">Click Edit Profile to add diets or food restrictions.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </>
        )}

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
