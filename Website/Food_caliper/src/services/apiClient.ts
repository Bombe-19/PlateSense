import axios, { AxiosInstance } from "axios";

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

interface User {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  profile_picture?: string;
  height_cm?: number;
  weight_kg?: number;
  age?: number;
  dietary_preferences?: string;
  created_at: string;
}

class APIClient {
  private client: AxiosInstance;
  private userId: number | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Load userId from localStorage
    const stored = localStorage.getItem("userId");
    if (stored) {
      this.userId = parseInt(stored);
    }
  }

  // ==================== AUTH ENDPOINTS ====================

  async register(username: string, email: string, password: string, fullName?: string): Promise<User> {
    const response = await this.client.post("/api/v1/auth/register", {
      username,
      email,
      password,
      full_name: fullName,
    });
    this.setUserId(response.data.id);
    return response.data;
  }

  async login(email: string, password: string): Promise<User> {
    const response = await this.client.post("/api/v1/auth/login", {
      email,
      password,
    });
    this.setUserId(response.data.id);
    return response.data;
  }

  async logout() {
    this.clearUserId();
  }

  async post(endpoint: string, data: any) {
    const response = await this.client.post(endpoint, data);
    return response.data;
  }

  async getUserProfile(userId: number): Promise<User> {
    const response = await this.client.get(`/api/v1/auth/profile/${userId}`);
    return response.data;
  }

  async updateUserProfile(userId: number, data: any): Promise<User> {
    const response = await this.client.put(`/api/v1/auth/profile/${userId}`, data);
    return response.data;
  }

  // ==================== USER ENDPOINTS ====================

  async getDashboard() {
    if (!this.userId) {
      throw new Error("Not authenticated");
    }
    const response = await this.client.get("/api/v1/user/dashboard", {
      params: { user_id: this.userId },
    });
    return response.data;
  }

  async getWeeklyStats() {
    if (!this.userId) {
      throw new Error("Not authenticated");
    }
    const response = await this.client.get("/api/v1/user/stats/weekly", {
      params: { user_id: this.userId },
    });
    return response.data;
  }

  async getMonthlyStats() {
    if (!this.userId) {
      throw new Error("Not authenticated");
    }
    const response = await this.client.get("/api/v1/user/stats/monthly", {
      params: { user_id: this.userId },
    });
    return response.data;
  }

  // ==================== ANALYSIS ENDPOINTS ====================

  async uploadImage(file: File) {
    if (!this.userId) {
      throw new Error("Not authenticated");
    }
    const formData = new FormData();
    formData.append("file", file);

    const response = await this.client.post("/api/v1/analysis/upload", formData, {
      params: { user_id: this.userId },
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  async getAnalysis(analysisId: number) {
    if (!this.userId) {
      throw new Error("Not authenticated");
    }
    const response = await this.client.get(`/api/v1/analysis/${analysisId}`, {
      params: { user_id: this.userId },
    });
    return response.data;
  }

  async getAnalysisHistory(limit: number = 30, offset: number = 0) {
    if (!this.userId) {
      throw new Error("Not authenticated");
    }
    const response = await this.client.get("/api/v1/analysis/history/all", {
      params: { user_id: this.userId, limit, offset },
    });
    return response.data;
  }

  async deleteAnalysis(analysisId: number) {
    if (!this.userId) {
      throw new Error("Not authenticated");
    }
    await this.client.delete(`/api/v1/analysis/${analysisId}`, {
      params: { user_id: this.userId },
    });
  }

  // ==================== UTILITY ====================

  private setUserId(userId: number) {
    this.userId = userId;
    localStorage.setItem("userId", userId.toString());
  }

  private clearUserId() {
    this.userId = null;
    localStorage.removeItem("userId");
  }

  isAuthenticated(): boolean {
    return !!this.userId;
  }

  getUserId(): number | null {
    return this.userId;
  }
}

export const apiClient = new APIClient();
