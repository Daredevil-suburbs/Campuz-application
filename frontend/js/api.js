// --- Developer Easter Egg ---
setTimeout(() => {
    console.log(
        "%c ✨ Crafted with passion by Armaan ✨ ", 
        "background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%); color: white; font-size: 14px; font-weight: bold; border-radius: 8px; padding: 10px 20px; text-shadow: 1px 1px 2px rgba(0,0,0,0.5);"
    );
}, 1000);

// API Configuration
const API_BASE_URL = "/api";
let authToken = localStorage.getItem("access_token");

// API Helper Functions
const api = {
  async request(endpoint, method = "GET", data = null) {
    const headers = {
      "Content-Type": "application/json",
    };

    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }

    const config = {
      method,
      headers,
    };

    if (data) {
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

      if (response.status === 401 && endpoint !== "/users/login/" && endpoint !== "/users/token/refresh/") {
        // Token expired, try to refresh (don't refresh if login/refresh itself failed)
        const refreshed = await this.refreshToken();
        if (refreshed) {
          headers["Authorization"] = `Bearer ${authToken}`;
          const newResponse = await fetch(`${API_BASE_URL}${endpoint}`, config);
          return await newResponse.json();
        } else {
          window.location.href = "/index.html";
          throw new Error("Session expired");
        }
      }

      const responseData = await response.json();
      
      if (!response.ok) {
        // Return JSON as well, but can throw or let the caller handle it.
        // For login, we want the 401 error message.
        return responseData;
      }

      return responseData;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },

  async refreshToken() {
    const refresh = localStorage.getItem("refresh_token");
    if (!refresh) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/users/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("access_token", data.access);
        authToken = data.access;
        return true;
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
    }
    return false;
  },

  // Auth endpoints
  async login(email, password) {
    const data = await this.request("/users/login/", "POST", {
      email,
      password,
    });
    if (data.access) {
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      localStorage.setItem("user", JSON.stringify(data.user));
      authToken = data.access;
    }
    return data;
  },

  async register(userData) {
    return await this.request("/users/register/", "POST", userData);
  },

  async logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    authToken = null;
    window.location.href = "/index.html";
  },

  // User endpoints
  async getProfile() {
    return await this.request("/users/profile/");
  },

  async updateProfile(data) {
    return await this.request("/users/profile/", "PUT", data);
  },

  async getUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await this.request(
      `/users/list/${queryString ? "?" + queryString : ""}`,
    );
  },

  // Posts endpoints
  async getPosts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await this.request(`/posts/${queryString ? "?" + queryString : ""}`);
  },

  async createPost(data) {
    return await this.request("/posts/", "POST", data);
  },

  async likePost(postId) {
    return await this.request(`/posts/${postId}/like/`, "POST");
  },

  async getComments(postId) {
    return await this.request(`/posts/${postId}/comments/`);
  },

  async addComment(postId, content) {
    return await this.request(`/posts/${postId}/comments/`, "POST", {
      content,
    });
  },

  // Academic endpoints
  async getAcademicRecords() {
    return await this.request("/academics/records/");
  },

  // Bot endpoints
  async sendMessage(message) {
    return await this.request("/bot/chat/", "POST", { message });
  },

  async getChatHistory() {
    return await this.request("/bot/history/");
  },
};

// Check authentication on page load
function checkAuth() {
  const token = localStorage.getItem("access_token");
  if (!token && !window.location.pathname.includes("index.html")) {
    window.location.href = "/index.html";
  }
}

// Get current user
function getCurrentUser() {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
}
