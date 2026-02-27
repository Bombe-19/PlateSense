import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, Download, Search, FlaskConical, Ruler, Scale, Target, BarChart3, Layers, Home, Microscope, BarChart4, Settings, User, Clipboard, Video, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import Navbar from "@/components/Navbar";
import ScanAnimation from "@/components/ScanAnimation";
import AnimatedCounter from "@/components/AnimatedCounter";
import Dock from "@/components/Dock";
import heroFood from "@/assets/hero-food.jpg";
import { apiClient } from "@/services/apiClient";

interface FoodItem {
  name: string;
  volume: number;
  weight: number;
  area: number;
  height: number;
  confidence: number;
  components: string[];
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

  const handleAnalyze = async () => {
    if (!imageFileObject) {
      setError("Please upload an image first");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      // Use apiClient.uploadImage which handles authentication and FormData properly
      const analysisData = await apiClient.uploadImage(imageFileObject);

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
            bbox: bbox,
          };
        }),
        totalVolume: analysisData.total_volume_ml || analysisData.totalVolume,
        totalWeight: analysisData.total_weight_grams || analysisData.totalWeight,
        totalItems: analysisData.total_items_detected || analysisData.totalItems,
        avgConfidence: analysisData.avg_confidence || analysisData.avgConfidence,
        status: analysisData.status,
      };

      setResult(transformedResult);
      console.log("Analysis Result:", transformedResult);
      console.log("Foods with bbox:", transformedResult.foods.map(f => ({ name: f.name, bbox: f.bbox })));
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
    <div className="page-gradient min-h-screen">
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
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !imageFile}
                className="cursor-target mt-4 w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isAnalyzing ? "Analyzing..." : "Analyze Now"}
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
                <h2 className="font-semibold text-foreground mb-4">Summary Analytics</h2>
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

              {/* Quick Stats */}
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
                </div>
              </motion.div>
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
                    {["Food Name", "Volume (ml)", "Weight (g)", "Area (cm²)", "Height (cm)", "Confidence", "Components"].map(h => (
                      <th key={h} className="text-left py-3 px-3 text-muted-foreground font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredFoods.map((f: FoodItem) => (
                    <tr key={f.name} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-3 font-medium text-foreground">{f.name}</td>
                      <td className="py-3 px-3 text-foreground">{f.volume.toFixed(2)}</td>
                      <td className="py-3 px-3 text-foreground">{f.weight.toFixed(2)}</td>
                      <td className="py-3 px-3 text-foreground">{f.area.toFixed(2)}</td>
                      <td className="py-3 px-3 text-foreground">{f.height.toFixed(2)}</td>
                      <td className="py-3 px-3">
                        <span className={`metric-badge ${f.confidence > 90 ? "metric-green" : "metric-orange"}`}>
                          {f.confidence.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex flex-wrap gap-1">
                          {f.components.length > 0 ? (
                            f.components.map(c => (
                              <span key={c} className="metric-badge metric-violet text-xs">{c}</span>
                            ))
                          ) : (
                            <span className="text-xs text-muted-foreground">None</span>
                          )}
                        </div>
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
                onClick: () => navigate('/login') 
              },
            ]}
            panelHeight={68}
            baseItemSize={50}
            magnification={70}
          />
        </div>
      </div>
    </div>
  );
};

export default Analysis;
