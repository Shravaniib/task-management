import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaTasks, FaUser, FaLock, FaSignInAlt, FaUserPlus } from "react-icons/fa";

function Login() {
  // ==================== ROUTER HOOKS ====================
  const navigate = useNavigate();

  // ==================== STATE MANAGEMENT ====================
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // ==================== HANDLE INPUT CHANGE ====================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (error) setError("");
  };

  // ==================== HANDLE FORM SUBMISSION ====================
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.username || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://23.22.136.183:8000/api/token/",
        formData
      );

      // Store token in localStorage
      localStorage.setItem("access_token", response.data.access);
      
      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error(error.response?.data);
      setError(
        error.response?.data?.detail || 
        error.response?.data?.message || 
        "Invalid username or password. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== NAVIGATE TO REGISTER ====================
  const handleRegister = () => {
    navigate("/register");
  };

  return (
    // ==================== MAIN CONTAINER ====================
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0f172a 0%, #1a1a2e 50%, #2d1b69 100%)",
        padding: "20px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* ==================== LOGIN CARD ==================== */}
      <div
        style={{
          background: "rgba(255, 255, 255, 0.08)",
          backdropFilter: "blur(20px)",
          borderRadius: "24px",
          padding: "50px 40px",
          maxWidth: "420px",
          width: "100%",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          border: "1px solid rgba(255,255,255,0.1)",
          transition: "all 0.3s ease",
        }}
      >
        {/* ==================== LOGO / HEADER ==================== */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              marginBottom: "10px",
            }}
          >
            <FaTasks
              style={{
                fontSize: "2.5rem",
                color: "#ec4899",
                background: "rgba(236, 72, 153, 0.15)",
                padding: "12px",
                borderRadius: "16px",
              }}
            />
            <h1
              style={{
                fontSize: "2.2rem",
                fontWeight: "700",
                background: "linear-gradient(135deg, #ec4899, #8b5cf6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                margin: 0,
              }}
            >
              TaskFlow
            </h1>
          </div>
          <p
            style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: "0.95rem",
              margin: "5px 0 0 0",
            }}
          >
            Welcome Back! Sign in to continue
          </p>
        </div>

        {/* ==================== ERROR MESSAGE ==================== */}
        {error && (
          <div
            style={{
              background: "rgba(220, 38, 38, 0.15)",
              border: "1px solid rgba(220, 38, 38, 0.3)",
              borderRadius: "10px",
              padding: "12px 16px",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              color: "#f87171",
              fontSize: "0.9rem",
            }}
          >
            <span style={{ fontSize: "1.2rem" }}>⚠️</span>
            {error}
          </div>
        )}

        {/* ==================== LOGIN FORM ==================== */}
        <form onSubmit={handleSubmit}>
          {/* ==================== USERNAME FIELD ==================== */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                color: "rgba(255,255,255,0.8)",
                fontSize: "0.9rem",
                fontWeight: "500",
                marginBottom: "6px",
              }}
            >
              Username
            </label>
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
              }}
            >
              <FaUser
                style={{
                  position: "absolute",
                  left: "14px",
                  color: "rgba(255,255,255,0.4)",
                  fontSize: "1rem",
                }}
              />
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "14px 14px 14px 44px",
                  background: "rgba(255,255,255,0.06)",
                  border: error ? "1px solid rgba(220,38,38,0.5)" : "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  color: "white",
                  fontSize: "1rem",
                  transition: "all 0.3s ease",
                  outline: "none",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#ec4899";
                  e.target.style.boxShadow = "0 0 0 3px rgba(236, 72, 153, 0.15)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255,255,255,0.1)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
          </div>

          {/* ==================== PASSWORD FIELD ==================== */}
          <div style={{ marginBottom: "28px" }}>
            <label
              style={{
                display: "block",
                color: "rgba(255,255,255,0.8)",
                fontSize: "0.9rem",
                fontWeight: "500",
                marginBottom: "6px",
              }}
            >
              Password
            </label>
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
              }}
            >
              <FaLock
                style={{
                  position: "absolute",
                  left: "14px",
                  color: "rgba(255,255,255,0.4)",
                  fontSize: "1rem",
                }}
              />
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "14px 14px 14px 44px",
                  background: "rgba(255,255,255,0.06)",
                  border: error ? "1px solid rgba(220,38,38,0.5)" : "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  color: "white",
                  fontSize: "1rem",
                  transition: "all 0.3s ease",
                  outline: "none",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#ec4899";
                  e.target.style.boxShadow = "0 0 0 3px rgba(236, 72, 153, 0.15)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255,255,255,0.1)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
          </div>

          {/* ==================== LOGIN BUTTON ==================== */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "14px",
              background: "linear-gradient(135deg, #ec4899, #db2777)",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "1.05rem",
              fontWeight: "600",
              cursor: isLoading ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 15px rgba(236, 72, 153, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              opacity: isLoading ? 0.7 : 1,
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 25px rgba(236, 72, 153, 0.4)";
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 15px rgba(236, 72, 153, 0.3)";
            }}
          >
            {isLoading ? (
              <>
                <span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>⏳</span>
                Logging in...
              </>
            ) : (
              <>
                <FaSignInAlt />
                Sign In
              </>
            )}
          </button>
        </form>

        {/* ==================== REGISTER LINK ==================== */}
        <div
          style={{
            textAlign: "center",
            marginTop: "25px",
            paddingTop: "20px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <p
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: "0.95rem",
              margin: 0,
            }}
          >
            New to TaskFlow?{" "}
            <span
              onClick={handleRegister}
              style={{
                color: "#ec4899",
                cursor: "pointer",
                fontWeight: "600",
                transition: "all 0.3s ease",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
              onMouseEnter={(e) => {
                e.target.style.color = "#f472b6";
                e.target.style.textDecoration = "underline";
              }}
              onMouseLeave={(e) => {
                e.target.style.color = "#ec4899";
                e.target.style.textDecoration = "none";
              }}
            >
              <FaUserPlus style={{ fontSize: "0.8rem" }} />
              Create Account
            </span>
          </p>
        </div>

        {/* ==================== FOOTER TEXT ==================== */}
        <div
          style={{
            textAlign: "center",
            marginTop: "15px",
          }}
        >
          <p
            style={{
              color: "rgba(255,255,255,0.3)",
              fontSize: "0.75rem",
              margin: 0,
            }}
          >
            Secure Login • End-to-End Encrypted
          </p>
        </div>
      </div>

      {/* ==================== KEYFRAME ANIMATIONS ==================== */}
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}

export default Login;