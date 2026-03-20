import { useState, useEffect } from "react";
import { ArrowLeft, Loader, Calendar, Activity, Target, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import BackgroundLayout from "@/components/BackgroundLayout";
import Navbar from "@/components/Navbar";
import Dock from "@/components/Dock";
import { Home, Microscope, BarChart4, Settings, User } from "lucide-react";
import { apiClient } from "@/services/apiClient";

const Reports = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [analysisHistory, setAnalysisHistory] = useState<any[]>([]);
  const [latestAnalysis, setLatestAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reportStyles = `
    .report-container {
      max-width: 750px;
      margin: 0 auto;
      padding: 40px 20px;
    }

    .report-container h2 {
      font-size: 22px;
      font-weight: 600;
      color: var(--foreground);
      margin-top: 28px;
    }

    .report-container p {
      font-size: 15px;
      line-height: 1.7;
      color: var(--muted-foreground);
      margin-top: 10px;
    }

    .report-container h2:first-child {
      margin-top: 0;
    }

    .key-metrics {
      max-width: 750px;
      margin: 0 auto;
      padding: 30px 0;
    }

    .key-metrics h2 {
      font-size: 22px;
      font-weight: 600;
      color: var(--foreground);
    }

    .key-metrics p {
      font-size: 15px;
      line-height: 1.7;
      color: var(--muted-foreground);
      margin-top: 10px;
    }

    .metrics-pills {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      margin-top: 18px;
    }

    .pill {
      display: flex;
      align-items: center;
      gap: 6px;
      background: #374151;
      color: #fff;
      padding: 8px 14px;
      border-radius: 999px;
      font-size: 13px;
      font-weight: 500;
    }

    .pill strong {
      font-weight: 600;
      color: #e5e7eb;
    }

    .detected-foods {
      max-width: 750px;
      margin: 0 auto;
      padding: 30px 0;
    }

    .detected-foods h2 {
      font-size: 22px;
      font-weight: 600;
      color: var(--foreground);
      margin-top: 0;
    }

    .detected-foods p {
      font-size: 15px;
      line-height: 1.7;
      color: var(--muted-foreground);
      margin-top: 10px;
      margin-bottom: 18px;
    }

    .food-items-container {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-top: 15px;
    }

    .food-pill {
      display: flex;
      align-items: center;
      gap: 6px;
      background: #374151;
      color: #fff;
      padding: 10px 16px;
      border-radius: 999px;
      font-size: 14px;
      font-weight: 500;
    }

    .food-pill strong {
      font-weight: 600;
      color: #e5e7eb;
    }

    .detected-foods-image-container {
      display: flex;
      gap: 20px;
      margin-top: 20px;
      align-items: flex-start;
    }

    .detected-foods-image-box {
      flex-shrink: 0;
      border: 2px solid var(--border);
      border-radius: 12px;
      padding: 12px;
      min-width: 200px;
      max-width: 250px;
      background: var(--background);
    }

    .detected-foods-image-box img {
      width: 100%;
      height: 200px;
      object-fit: cover;
      border-radius: 8px;
      display: block;
    }

    .detected-foods-text {
      flex: 1;
      font-size: 15px;
      line-height: 1.7;
      color: var(--muted-foreground);
    }

    .nutrition-table {
      margin-top: 16px;
      display: grid;
      grid-template-columns: 1.5fr 1fr 1fr 1fr;
      border: 2px solid #d1d5db;
      border-radius: 10px;
      overflow: hidden;
    }

    @media (prefers-color-scheme: dark) {
      .nutrition-table {
        border-color: #4b5563;
      }
    }

    .table-row {
      display: contents;
    }

    .table-row span {
      padding: 12px 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      border-right: 1px solid #d1d5db;
      border-bottom: 1px solid #d1d5db;
      background: var(--background);
      color: var(--foreground);
    }

    @media (prefers-color-scheme: dark) {
      .table-row span {
        border-right-color: #4b5563;
        border-bottom-color: #4b5563;
      }
    }

    .table-row span:nth-child(4n) {
      border-right: none;
    }

    .table-row:last-child span {
      border-bottom: none;
    }

    .table-row.header span {
      background: #f3f4f6;
      border-bottom: 2px solid #d1d5db;
      font-weight: 600;
      color: #ffffff;
    }

    @media (prefers-color-scheme: dark) {
      .table-row.header span {
        background: #374151;
        border-bottom-color: #4b5563;
        color: #ffffff;
      }
    }

    .pill {
      padding: 4px 10px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 500;
      text-align: center;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .protein {
      background: transparent;
      color: #dc2626;
      font-weight: 600;
    }

    .carbs {
      background: transparent;
      color: #ea580c;
      font-weight: 600;
    }

    .fat {
      background: transparent;
      color: #ca8a04;
      font-weight: 600;
    }

    /* Colored backgrounds for table cells */
    .table-row span:nth-child(4n+2) {
      background: rgba(239, 68, 68, 0.15);
    }

    .table-row span:nth-child(4n+3) {
      background: rgba(249, 115, 22, 0.15);
    }

    .table-row span:nth-child(4n) {
      background: rgba(234, 179, 8, 0.15);
    }

    .table-row.header span:nth-child(4n+2),
    .table-row.header span:nth-child(4n+3),
    .table-row.header span:nth-child(4n) {
      background: #f3f4f6;
    }

    @media (prefers-color-scheme: dark) {
      .table-row span:nth-child(4n+2) {
        background: rgba(239, 68, 68, 0.2);
      }

      .table-row span:nth-child(4n+3) {
        background: rgba(249, 115, 22, 0.2);
      }

      .table-row span:nth-child(4n) {
        background: rgba(234, 179, 8, 0.2);
      }

      .table-row.header span:nth-child(4n+2),
      .table-row.header span:nth-child(4n+3),
      .table-row.header span:nth-child(4n) {
        background: #374151;
      }
    }
  `;

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
      fetchReportsData();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const fetchReportsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const userId = apiClient.getUserId();
      if (!userId) {
        setUser({ full_name: "Guest User", email: "Not logged in" });
        setAnalysisHistory([]);
        setLoading(false);
        return;
      }

      // Fetch user profile
      try {
        const profile = await apiClient.getUserProfile(userId);
        setUser(profile);
      } catch (profileErr) {
        console.error("Profile fetch error:", profileErr);
        setUser(null);
      }

      // Fetch analysis history
      try {
        const history = await apiClient.getAnalysisHistory(100, 0);
        console.log("Full analysis history response:", history);
        
        // Handle both direct array and wrapped response
        let analysisArray = [];
        if (Array.isArray(history)) {
          analysisArray = history;
        } else if (history?.analyses && Array.isArray(history.analyses)) {
          analysisArray = history.analyses;
        } else if (history?.data && Array.isArray(history.data)) {
          analysisArray = history.data;
        }
        
        console.log("Extracted analysis array:", analysisArray);
        
        if (analysisArray.length > 0) {
          setAnalysisHistory(analysisArray);
          const latest = analysisArray[0];
          console.log("Latest analysis data:", latest);
          console.log("Latest analysis fields:", Object.keys(latest));
          console.log("Latest analysis total_volume_ml:", latest.total_volume_ml);
          console.log("Latest analysis total_weight_grams:", latest.total_weight_grams);
          console.log("Latest analysis total_calories:", latest.total_calories);
          console.log("Latest analysis foods:", latest.foods);
          setLatestAnalysis(latest);
        } else {
          setAnalysisHistory([]);
          setLatestAnalysis(null);
          console.log("No analysis history found");
        }
      } catch (historyErr) {
        console.error("History fetch error:", historyErr);
        setAnalysisHistory([]);
        setLatestAnalysis(null);
      }
    } catch (err: any) {
      console.error("Error fetching reports:", err);
      setError(err.message || "Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (fullName?: string) => {
    if (!fullName) return "U";
    return fullName
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Unknown date";
    }
  };

  if (loading) {
    return (
      <BackgroundLayout>
        <Navbar isAuthenticated={true} />
        <div className="relative z-20 flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="inline-block mb-4"
            >
              <Loader className="h-8 w-8 text-orange-500" />
            </motion.div>
            <p className="text-foreground font-medium">Loading your reports...</p>
          </div>
        </div>
      </BackgroundLayout>
    );
  }

  return (
    <BackgroundLayout>
      <Navbar isAuthenticated={true} />
      
      <div className="relative z-20 min-h-[calc(100vh-80px)] px-4 py-12 pb-24">
        <div className="max-w-3xl mx-auto">
          {/* Back Button */}
          <motion.button
            whileHover={{ x: -4 }}
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-12 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back to Dashboard</span>
          </motion.button>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-lg"
            >
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </motion.div>
          )}

          {/* User Profile Section */}
          {user && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-16 pb-12 border-b border-border"
              style={{
                maxWidth: '750px',
                margin: '0 auto',
                padding: '0 20px'
              }}
            >
              <div className="flex items-start gap-8">
                {/* User Info */}
                <div className="flex-1 pt-2">
                  <h1 className="text-4xl font-bold text-foreground mb-2">
                    {user?.full_name || user?.username || "User"}
                  </h1>
                  <p className="text-muted-foreground text-lg mb-4">
                    {user?.email || "No email"}
                  </p>
                  <p className="text-sm text-muted-foreground mb-6">
                    {user?.created_at 
                      ? `Member since ${new Date(user.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                        })}`
                      : "Member since recent"}
                  </p>

                  {/* Health Information Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
                    {user?.height_cm && (
                      <div>
                        <p className="text-xs uppercase font-bold text-muted-foreground mb-1">Height</p>
                        <p className="text-lg font-semibold text-foreground">{user.height_cm} <span className="text-sm">cm</span></p>
                      </div>
                    )}
                    {user?.weight_kg && (
                      <div>
                        <p className="text-xs uppercase font-bold text-muted-foreground mb-1">Weight</p>
                        <p className="text-lg font-semibold text-foreground">{user.weight_kg} <span className="text-sm">kg</span></p>
                      </div>
                    )}
                    {user?.age && (
                      <div>
                        <p className="text-xs uppercase font-bold text-muted-foreground mb-1">Age</p>
                        <p className="text-lg font-semibold text-foreground">{user.age} <span className="text-sm">yrs</span></p>
                      </div>
                    )}
                    {user?.dietary_preferences && (
                      <div>
                        <p className="text-xs uppercase font-bold text-muted-foreground mb-1">Diet</p>
                        <p className="text-lg font-semibold text-foreground">{user.dietary_preferences}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Avatar */}
                <div className="flex-shrink-0">
                  {user?.profile_picture ? (
                    <img
                      src={user.profile_picture}
                      alt={user.full_name || "User"}
                      className="h-24 w-24 rounded-full object-cover ring-2 ring-orange-500"
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-2xl ring-2 ring-orange-500">
                      {getInitials(user?.full_name)}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Analysis Report Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mb-16"
          >
            <style>{reportStyles}</style>
            
            <div className="report-container">
              <h2>Food Analysis Report - {latestAnalysis?.food_items?.[0]?.name || latestAnalysis?.created_at ? formatDate(latestAnalysis.created_at) : "Latest Analysis"}</h2>
              <p>
                This report provides a comprehensive analysis of the scanned meal, transforming
                a simple image into meaningful nutritional insights. By interpreting visual details,
                it estimates portion size, weight, calorie content, and overall composition,
                offering a clear and practical understanding of the meal at a glance.
              </p>

              <h2>Summary</h2>
              <p>
                The analyzed meal is estimated to weigh approximately <strong>{latestAnalysis?.total_weight_grams ? `${latestAnalysis.total_weight_grams}g` : "—"}</strong> and delivers
                around <strong>{latestAnalysis?.total_calories ? `${Math.round(latestAnalysis.total_calories)} kcal` : "—"}</strong> of energy. Multiple food components have been identified
                and evaluated to present a balanced view of portion size and nutritional distribution,
                helping you quickly understand the overall dietary impact.
              </p>

              <div className="detected-foods">
                <h2>Detected Food Items</h2>

                {(latestAnalysis?.image_data || latestAnalysis?.image_path) && (
                  <div className="detected-foods-image-container">
                    <div className="detected-foods-image-box">
                      <img 
                        src={latestAnalysis.image_data || latestAnalysis.image_path} 
                        alt="Latest food analysis" 
                      />
                    </div>
                    <div className="detected-foods-text">
                      <p>
                        The meal is analyzed by examining visual cues such as color, texture, and structure,
                        allowing distinct portions to be identified and separated. Each component is then
                        interpreted individually to understand what items are present on the plate, ensuring
                        a more accurate representation of the meal. As the process completes, the system
                        successfully detects and recognizes the food items, forming the basis for further
                        measurement and nutritional analysis.
                      </p>
                    </div>
                  </div>
                )}

                {latestAnalysis?.foods && latestAnalysis.foods.length > 0 ? (
                  <div>
                    <p style={{marginTop: '5px', marginBottom: '12px'}}>
                      <strong>Total Items Detected: {latestAnalysis.total_items_detected}</strong>
                    </p>
                    <div className="food-items-container">
                      {latestAnalysis.foods.map((food: any, idx: number) => (
                        <div key={idx} className="food-pill">
                          🍽️ <strong>{food.name}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p>No food items detected in this analysis.</p>
                )}
              </div>

              <div className="key-metrics">
                <h2>Key Metrics</h2>
                <p>
                  Once the food items are clearly identified, their portion size, weight, and overall
                  energy value can be understood more meaningfully. These key measurements offer a
                  clear picture of how much is being consumed and its nutritional impact, making it
                  easier to assess the meal in a practical and relatable way.
                </p>

                {/* Pills */}
                <div className="metrics-pills">
                  <div className="pill">💧 Volume <strong>{latestAnalysis?.total_volume_ml ? `${latestAnalysis.total_volume_ml} ml` : "— ml"}</strong></div>
                  <div className="pill">⚖️ Weight <strong>{latestAnalysis?.total_weight_grams ? `${latestAnalysis.total_weight_grams} g` : "— g"}</strong></div>
                  <div className="pill">🔥 Calories <strong>{latestAnalysis?.total_calories ? `${latestAnalysis.total_calories} kcal` : "— kcal"}</strong></div>
                </div>
              </div>

              <h2>Nutritional Breakdown</h2>
              <p>
                With the key measurements in place, the meal can be further understood through its
                nutritional composition. Each food item contributes differently, and the breakdown
                below highlights how proteins, carbohydrates, and fats are distributed across the meal.
              </p>
              {latestAnalysis?.foods && latestAnalysis.foods.length > 0 ? (
                <div className="nutrition-table">
                  {/* Header */}
                  <div className="table-row header">
                    <span>Food Item</span>
                    <span>Protein</span>
                    <span>Carbs</span>
                    <span>Fats</span>
                  </div>
                  {/* Data Rows */}
                  {latestAnalysis.foods.map((food: any, idx: number) => (
                    <div key={idx} className="table-row">
                      <span><strong>{food.name}</strong></span>
                      <span className="pill protein">{food.protein_g && food.protein_g > 0 ? `${food.protein_g.toFixed(1)}g` : "—"}</span>
                      <span className="pill carbs">{food.carbohydrates_g && food.carbohydrates_g > 0 ? `${food.carbohydrates_g.toFixed(1)}g` : "—"}</span>
                      <span className="pill fat">{food.fat_g && food.fat_g > 0 ? `${food.fat_g.toFixed(1)}g` : "—"}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Nutritional breakdown data not available.</p>
              )}

              <h2>AI Insights</h2>
              <p>
                The analysis offers an overall understanding of the meal based on the visual input,
                with an estimated confidence level of <strong>{latestAnalysis?.avg_confidence ? `${Math.round(latestAnalysis.avg_confidence * 100)}%` : "90%"}</strong>. This indicates a moderate level of
                reliability in identifying the food and estimating its measurements. While factors
                such as lighting, image clarity, or food arrangement may influence precision, the
                results still provide a useful and practical view of portion size and nutritional impact.
              </p>

              <h2>Disclaimer</h2>
              <p>
                The values presented in this report are estimated based on image analysis and
                standard nutritional data. Actual results may vary depending on ingredients,
                preparation methods, and portion sizes. This report is intended to provide general
                dietary insights and should be used as a reference for understanding food composition,
                not as a substitute for professional medical or nutritional advice.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

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
    </BackgroundLayout>
  );
};

export default Reports;
