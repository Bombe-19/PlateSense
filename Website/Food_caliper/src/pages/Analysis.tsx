import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, Download, Search, FlaskConical, Ruler, Scale, Target, BarChart3, Layers, Home, Microscope, BarChart4, Settings, User, Clipboard, Video, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import Navbar from "@/components/Navbar";
import BackgroundLayout from "@/components/BackgroundLayout";
import ScanAnimation from "@/components/ScanAnimation";
import AnimatedCounter from "@/components/AnimatedCounter";
import Dock from "@/components/Dock";
import heroFood from "@/assets/hero-food.jpg";
import { apiClient } from "@/services/apiClient";

// Add nutrition-specific CSS classes
const nutritionStyles = `
  .metric-red { @apply bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800; }
  .metric-yellow { @apply bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800; }
`;

interface NutritionalInfo {
  calories?: number;
  protein_g?: number;
  carbohydrates_g?: number;
  fat_g?: number;
  fiber_g?: number;
  sugar_g?: number;
  sodium_mg?: number;
  calcium_mg?: number;
  iron_mg?: number;
  vitamin_c_mg?: number;
  matched_food_name?: string;
}

interface NutritionalSummary {
  total_calories: number;
  total_protein_g: number;
  total_carbohydrates_g: number;
  total_fat_g: number;
  total_fiber_g: number;
  items_with_nutrition_data: number;
}

interface FoodItem {
  name: string;
  volume: number;
  weight: number;
  area: number;
  height: number;
  confidence: number;
  components: string[];
  nutrition?: NutritionalInfo;
  bbox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

interface AnalysisResult {
  id: string;
  imageUrl: string;
  foods: FoodItem[];
  totalVolume: number;
  totalWeight: number;
  totalItems: number;
  avgConfidence: number;
  nutritionalSummary?: NutritionalSummary;
  status: string;
}

const COLORS = ["hsl(145, 63%, 42%)", "hsl(260, 50%, 65%)", "hsl(220, 70%, 55%)", "hsl(30, 90%, 55%)"];

const Analysis = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const webcamInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<string | null>(null);
  const [imageFileObject, setImageFileObject] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);
  const [nutritionDatasetPath, setNutritionDatasetPath] = useState("indian_Food_Nutrition_Processed.csv");
  const [plateDiameter, setPlateDiameter] = useState(25);
  const [enableNutrition, setEnableNutrition] = useState(true);

  const handleAnalyze = async () => {
    if (!imageFileObject) {
      setError("Please upload an image first");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      // Create FormData for multipart/form-data request
      const formData = new FormData();
      formData.append('file', imageFileObject);
      formData.append('plate_diameter_cm', plateDiameter.toString());
      
      // Only add nutrition dataset if enabled and path is provided
      if (enableNutrition && nutritionDatasetPath.trim()) {
        formData.append('nutrition_dataset_path', nutritionDatasetPath.trim());
      }

      // Use direct fetch instead of apiClient to handle FormData with additional fields
      const response = await fetch('/api/v1/analysis/upload?user_id=1', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = 'Analysis failed';
        try {
          // Check if response has content and is JSON
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            errorMessage = errorData.detail || errorData.message || 'Analysis failed';
          } else {
            // If not JSON, try to get text
            const errorText = await response.text();
            errorMessage = errorText || `HTTP Error ${response.status}: ${response.statusText}`;
          }
        } catch (parseError) {
          // If parsing fails, use HTTP status info
          errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      let analysisData;
      try {
        // Check if response has content and is JSON
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          analysisData = await response.json();
        } else {
          throw new Error('Server returned non-JSON response');
        }
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        throw new Error('Invalid response format from server');
      }

      // Transform backend response to match our interface
      const transformedResult: AnalysisResult = {
        id: analysisData.id,
        imageUrl: imageFile || "",
        foods: (analysisData.foods || []).map((f: any) => {
          // Convert bbox coordinates from corner format (x1, y1, x2, y2) to center format (x, y, width, height)
          let bbox;
          if (f.bbox) {
            // If already in correct format
            bbox = {
              x: f.bbox.x || 0,
              y: f.bbox.y || 0,
              width: f.bbox.width || 0,
              height: f.bbox.height || 0,
            };
          } else if (f.bbox_x1 != null && f.bbox_y1 != null && f.bbox_x2 != null && f.bbox_y2 != null) {
            // Convert from corner coordinates to x, y, width, height
            bbox = {
              x: f.bbox_x1,
              y: f.bbox_y1,
              width: f.bbox_x2 - f.bbox_x1,
              height: f.bbox_y2 - f.bbox_y1,
            };
          }
          
          return {
            name: f.name || f.food_name,
            volume: f.volume || f.volume_ml,
            weight: f.weight || f.weight_grams,
            area: f.area || f.area_cm2 || 0,
            height: f.height || f.height_cm || 0,
            confidence: f.confidence,
            components: Array.isArray(f.components) ? f.components : [],
            nutrition: (f.nutrition && Object.keys(f.nutrition).length > 0) ? f.nutrition : 
                      (f.nutritional_info && Object.keys(f.nutritional_info).length > 0) ? f.nutritional_info : undefined,
            bbox: bbox,
          };
        }),
        totalVolume: analysisData.total_volume_ml || analysisData.totalVolume,
        totalWeight: analysisData.total_weight_grams || analysisData.totalWeight,
        totalItems: analysisData.total_items_detected || analysisData.totalItems,
        avgConfidence: analysisData.avg_confidence || analysisData.avgConfidence,
        nutritionalSummary: analysisData.nutritional_summary,
        status: analysisData.status,
      };

      setResult(transformedResult);
      console.log("Analysis Result:", transformedResult);
      console.log("Nutritional Summary:", transformedResult.nutritionalSummary);
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || "Analysis failed";
      setError(errorMessage);
      console.error("Analysis error:", err);
      console.error("Analysis response:", err.response?.data);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFileObject(file);
      setImageFile(URL.createObjectURL(file));
      setError(null);
    } else {
      setError("Please drop an image file");
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImageFileObject(file);
      const url = URL.createObjectURL(file);
      setImageFile(url);
      setError(null);
    } else {
      setError("Please select an image file");
    }
  };

  const handlePaste = async () => {
    try {
      const items = await navigator.clipboard.read();
      for (const item of items) {
        const imageTypes = item.types.filter(type => type.startsWith("image/"));
        if (imageTypes.length > 0) {
          const blob = await item.getType(imageTypes[0]);
          if (blob) {
            setImageFileObject(blob as File);
            const url = URL.createObjectURL(blob);
            setImageFile(url);
            setError(null);
          }
          break;
        }
      }
    } catch (err) {
      setError("Unable to paste image. Please use upload or take a photo instead.");
    }
  };

  const handleWebcam = () => {
    webcamInputRef.current?.click();
  };

  const handleWebcamCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImageFileObject(file);
      const url = URL.createObjectURL(file);
      setImageFile(url);
      setError(null);
    } else {
      setError("Failed to capture image");
    }
  };

  const handleClearImage = () => {
    setImageFile(null);
    setImageFileObject(null);
    setResult(null);
    setError(null);
    setImageWidth(0);
    setImageHeight(0);
  };

  const filteredFoods = result?.foods.filter(f =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) ?? [];

  const volumeChartData = result?.foods.map(f => ({ name: f.name, volume: f.volume })) ?? [];
  const weightChartData = result?.foods.map(f => ({ name: f.name, value: f.weight })) ?? [];

  return (
    <BackgroundLayout>
      <Navbar isAuthenticated />

      <div className="container py-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-foreground">Food Analysis Report</h1>
          <p className="text-muted-foreground mt-1">AI-powered volume and weight estimation results</p>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-500 text-sm"
          >
            {error}
          </motion.div>
        )}

        <div className="mt-8 space-y-6">
          {/* Image Cards - Side by Side */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Upload / Original Image */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
              <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <FlaskConical className="h-5 w-5 text-primary" /> Original Image
              </h2>
              <div
                className="relative rounded-xl overflow-hidden bg-muted flex items-center justify-center cursor-pointer min-h-[300px] max-h-[600px]"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
              >
                {imageFile ? (
                  <>
                    <button
                      onClick={handleClearImage}
                      className="cursor-target absolute top-3 right-3 z-10 p-1.5 rounded-lg bg-red-500/90 hover:bg-red-600 text-white transition-colors"
                      title="Cancel image"
                    >
                      <X className="h-5 w-5" />
                    </button>
                    <img 
                      src={imageFile} 
                      alt="Food" 
                      className="w-full h-full object-contain" 
                      onLoad={(e) => {
                        const img = e.currentTarget as HTMLImageElement;
                        setImageWidth(img.naturalWidth);
                        setImageHeight(img.naturalHeight);
                      }}
                    />
                    <ScanAnimation isScanning={isAnalyzing} />
                  </>
                ) : (
                  <div className="text-center p-8">
                    <div className="space-y-4">
                      <div>
                        <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm font-medium text-muted-foreground">Upload Image</p>
                      </div>
                      <div className="flex gap-3 justify-center flex-wrap">
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="cursor-target flex flex-col items-center gap-2 px-4 py-3 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
                        >
                          <Upload className="h-5 w-5 text-primary" />
                          <span className="text-xs font-medium text-primary">Upload</span>
                        </button>
                        <button
                          onClick={handlePaste}
                          className="cursor-target flex flex-col items-center gap-2 px-4 py-3 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
                        >
                          <Clipboard className="h-5 w-5 text-primary" />
                          <span className="text-xs font-medium text-primary">Paste</span>
                        </button>
                        <button
                          onClick={handleWebcam}
                          className="cursor-target flex flex-col items-center gap-2 px-4 py-3 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
                        >
                          <Video className="h-5 w-5 text-primary" />
                          <span className="text-xs font-medium text-primary">Webcam</span>
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground">or drag & drop an image</p>
                    </div>
                  </div>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileInput} />
                <input ref={webcamInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleWebcamCapture} />
              </div>
              
              {/* Nutritional Analysis Settings */}
              <div className="mt-4 p-4 rounded-lg bg-muted/50 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Microscope className="h-4 w-4" />
                    Nutritional Analysis
                  </label>
                  <button
                    onClick={() => setEnableNutrition(!enableNutrition)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      enableNutrition ? 'bg-primary' : 'bg-muted-foreground/30'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        enableNutrition ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                
                {enableNutrition && (
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs text-muted-foreground">Nutrition Dataset Path:</label>
                      <input
                        type="text"
                        value={nutritionDatasetPath}
                        onChange={(e) => setNutritionDatasetPath(e.target.value)}
                        placeholder="indian_Food_Nutrition_Processed.csv"
                        className="w-full mt-1 px-2 py-1 text-xs border border-border rounded bg-background text-foreground"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Plate Diameter (cm):</label>
                      <input
                        type="number"
                        value={plateDiameter}
                        onChange={(e) => setPlateDiameter(Number(e.target.value))}
                        min="15"
                        max="35"
                        step="0.5"
                        className="w-full mt-1 px-2 py-1 text-xs border border-border rounded bg-background text-foreground"
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !imageFile}
                className="cursor-target mt-4 w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isAnalyzing ? "Analyzing..." : enableNutrition ? "Analyze with Nutrition" : "Analyze"}
              </button>
            </motion.div>

            {/* Detection Result */}
            {result && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
                <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" /> AI Detection Result
                </h2>
                <div className="relative rounded-xl overflow-hidden bg-muted flex items-center justify-center min-h-[300px] max-h-[600px]">
                  <img 
                    src={imageFile!} 
                    alt="Detection" 
                    className="w-full h-full object-contain relative z-0" 
                  />
                  {/* Bounding box overlays based on detected items */}
                  {result.foods.map((f, i) => {
                    // Use backend bbox if available, otherwise use fallback
                    const bbox = f.bbox;
                    const hasBbox = bbox && bbox.width > 0 && bbox.height > 0 && imageWidth > 0 && imageHeight > 0;
                    
                    // Calculate percentages
                    const leftPercent = hasBbox ? (bbox.x / imageWidth) * 100 : 15 + i * 18;
                    const topPercent = hasBbox ? (bbox.y / imageHeight) * 100 : 10 + i * 8;
                    const widthPercent = hasBbox ? (bbox.width / imageWidth) * 100 : 20 + (i % 2) * 5;
                    const heightPercent = hasBbox ? (bbox.height / imageHeight) * 100 : 30 + (i % 3) * 5;
                    
                    return (
                      <div
                        key={`${f.name}-${i}`}
                        className="absolute border-3 border-green-400 rounded-lg group hover:border-yellow-300 transition-all pointer-events-none"
                        style={{
                          left: `${leftPercent}%`,
                          top: `${topPercent}%`,
                          width: `${widthPercent}%`,
                          height: `${heightPercent}%`,
                          minWidth: '50px',
                          minHeight: '50px',
                          boxShadow: '0 0 0 2px rgba(74, 222, 128, 0.5)',
                        }}
                      >
                        <span className="absolute -top-7 left-0 bg-green-500 text-white text-xs px-2 py-1 rounded-md font-medium whitespace-nowrap group-hover:bg-green-400 transition-colors shadow-lg pointer-events-auto">
                          {f.name}
                        </span>
                        <span className="absolute left-1 top-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded font-semibold pointer-events-auto">
                          {f.volume.toFixed(1)}ml
                        </span>
                        <span className="absolute -bottom-7 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-md font-medium whitespace-nowrap group-hover:bg-blue-400 transition-colors shadow-lg pointer-events-auto">
                          {f.weight.toFixed(1)}g · {f.confidence.toFixed(0)}%
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className="metric-green metric-badge"><Layers className="h-3.5 w-3.5" /> {result.totalItems} items</div>
                  <div className="metric-violet metric-badge"><Ruler className="h-3.5 w-3.5" /> {result.totalVolume} ml</div>
                  <div className="metric-blue metric-badge"><Scale className="h-3.5 w-3.5" /> {result.totalWeight} g</div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Summary Cards - Side by Side */}
          {result && (
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Summary */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
                <h2 className="font-semibold text-foreground mb-4">Volume & Weight Analytics</h2>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Total Items", value: result.totalItems, icon: Layers, cls: "metric-green" },
                    { label: "Total Volume", value: result.totalVolume, suffix: " ml", icon: Ruler, cls: "metric-violet" },
                    { label: "Total Weight", value: result.totalWeight, suffix: " g", icon: Scale, cls: "metric-blue" },
                    { label: "Avg Confidence", value: Math.round(result.avgConfidence), suffix: "%", icon: Target, cls: "metric-orange" },
                  ].map(m => (
                    <div key={m.label} className="glass-card p-4">
                      <div className={`${m.cls} metric-badge mb-2`}>
                        <m.icon className="h-3.5 w-3.5" />
                      </div>
                      <p className="text-xs text-muted-foreground">{m.label}</p>
                      <p className="text-xl font-bold text-foreground">
                        <AnimatedCounter value={m.value} suffix={m.suffix} />
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Nutritional Summary or Quick Stats */}
              {result.nutritionalSummary && result.nutritionalSummary.items_with_nutrition_data > 0 ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
                  <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Microscope className="h-5 w-5 text-primary" /> 
                    Nutritional Summary
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Total Calories", value: Math.round(result.nutritionalSummary.total_calories), suffix: " kcal", icon: FlaskConical, cls: "metric-red" },
                      { label: "Protein", value: Math.round(result.nutritionalSummary.total_protein_g), suffix: "g", icon: BarChart4, cls: "metric-green" },
                      { label: "Carbohydrates", value: Math.round(result.nutritionalSummary.total_carbohydrates_g), suffix: "g", icon: BarChart4, cls: "metric-yellow" },
                      { label: "Fat", value: Math.round(result.nutritionalSummary.total_fat_g), suffix: "g", icon: BarChart4, cls: "metric-orange" },
                    ].map(m => (
                      <div key={m.label} className="glass-card p-4">
                        <div className={`${m.cls} metric-badge mb-2`}>
                          <m.icon className="h-3.5 w-3.5" />
                        </div>
                        <p className="text-xs text-muted-foreground">{m.label}</p>
                        <p className="text-xl font-bold text-foreground">
                          <AnimatedCounter value={m.value} suffix={m.suffix} />
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-xs text-muted-foreground text-center">
                    Nutrition data available for {result.nutritionalSummary.items_with_nutrition_data} of {result.totalItems} items
                  </div>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
                  <h2 className="font-semibold text-foreground mb-2">Avg per Item</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Avg Volume</span>
                      <span className="font-medium text-foreground">{(result.totalVolume / result.totalItems).toFixed(1)} ml</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Avg Weight</span>
                      <span className="font-medium text-foreground">{(result.totalWeight / result.totalItems).toFixed(1)} g</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Avg Confidence</span>
                      <span className="font-medium text-foreground">{result.avgConfidence.toFixed(1)}%</span>
                    </div>
                    {!enableNutrition && (
                      <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                        <p className="text-xs text-yellow-600 dark:text-yellow-400 text-center">
                          Enable nutritional analysis to see calorie and macro information
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* Food Breakdown Table */}
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-6 glass-card p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" /> Food Breakdown
              </h2>
              <div className="flex gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    placeholder="Search foods..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 rounded-xl bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring w-48"
                  />
                </div>
                <button className="cursor-target px-4 py-2 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors flex items-center gap-1.5">
                  <Download className="h-3.5 w-3.5" /> CSV
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {["Food Name", "Volume (ml)", "Weight (g)", "Area (cm²)", "Height (cm)", "Confidence", "Calories", "Protein (g)", "Carbs (g)", "Fat (g)", "Components"].map(h => (
                      <th key={h} className="text-left py-3 px-3 text-muted-foreground font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredFoods.map((f: FoodItem) => (
                    <tr key={f.name} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-medium text-foreground">{f.name}</div>
                        {f.nutrition?.matched_food_name && f.nutrition.matched_food_name !== f.name && (
                          <div className="text-xs text-muted-foreground mt-1">Matched: {f.nutrition.matched_food_name}</div>
                        )}
                      </td>
                      <td className="py-3 px-3 text-foreground">{f.volume.toFixed(2)}</td>
                      <td className="py-3 px-3 text-foreground">{f.weight.toFixed(2)}</td>
                      <td className="py-3 px-3 text-foreground">{f.area.toFixed(2)}</td>
                      <td className="py-3 px-3 text-foreground">{f.height.toFixed(2)}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          f.confidence > 0.8 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                          f.confidence > 0.6 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                          'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                        }`}>
                          {(f.confidence * 100).toFixed(0)}%
                        </span>
                      </td>
                      <td className="py-3 px-3 text-foreground">
                        {f.nutrition?.calories ? (
                          <span className="font-medium">{f.nutrition.calories.toFixed(0)} kcal</span>
                        ) : (
                          <span className="text-muted-foreground text-xs">No data</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-foreground">
                        {f.nutrition?.protein_g ? (
                          <span>{f.nutrition.protein_g.toFixed(1)}g</span>
                        ) : (
                          <span className="text-muted-foreground text-xs">-</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-foreground">
                        {f.nutrition?.carbohydrates_g ? (
                          <span>{f.nutrition.carbohydrates_g.toFixed(1)}g</span>
                        ) : (
                          <span className="text-muted-foreground text-xs">-</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-foreground">
                        {f.nutrition?.fat_g ? (
                          <span>{f.nutrition.fat_g.toFixed(1)}g</span>
                        ) : (
                          <span className="text-muted-foreground text-xs">-</span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        {f.components && f.components.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {f.components.slice(0, 2).map(c => (
                              <span key={c} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded font-medium">
                                {c}
                              </span>
                            ))}
                            {f.components.length > 2 && (
                              <span className="text-xs text-muted-foreground">+{f.components.length - 2} more</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-xs">None</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Charts */}
        {result && (
          <div className="mt-6 grid lg:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6">
              <h2 className="font-semibold text-foreground mb-4">Volume Distribution</h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={volumeChartData}>
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: "hsl(240, 10%, 50%)" }} />
                  <YAxis tick={{ fontSize: 12, fill: "hsl(240, 10%, 50%)" }} />
                  <Tooltip />
                  <Bar dataKey="volume" fill="hsl(145, 63%, 42%)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-6">
              <h2 className="font-semibold text-foreground mb-4">Weight Distribution</h2>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={weightChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={50} label>
                    {weightChartData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        )}
      </div>

      {/* Navigation Dock */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
        <div className="pointer-events-auto">
          <Dock 
            items={[
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
            ]}
            panelHeight={68}
            baseItemSize={50}
            magnification={70}
          />
        </div>
      </div>
    </BackgroundLayout>
  );
};

export default Analysis;
