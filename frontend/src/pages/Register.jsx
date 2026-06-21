import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaUserPlus, 
  FaArrowLeft,
  FaCheckCircle,
  FaCamera,
  FaUpload,
  FaSpinner
} from "react-icons/fa";

function Register() {
  // ==================== ROUTER HOOKS ====================
  const navigate = useNavigate();

  // ==================== STATE MANAGEMENT ====================
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    profilePicture: null,
  });
  
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("");
  

  // ==================== PRE-DEFINED AVATARS ====================
  const avatars = [
    { id: 1, emoji: "👩‍💻", label: "Developer" },
    { id: 2, emoji: "👨‍💻", label: "Programmer" },
    { id: 3, emoji: "🧑‍🎨", label: "Designer" },
    { id: 4, emoji: "👩‍🎓", label: "Student" },
    { id: 5, emoji: "👨‍🚀", label: "Astronaut" },
    { id: 6, emoji: "👩‍🔬", label: "Scientist" },
  ];

  // ==================== HANDLE INPUT CHANGE ====================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError("");
  };

  // ==================== HANDLE AVATAR SELECTION ====================
  const handleAvatarSelect = (avatar) => {
    setSelectedAvatar(avatar);
    setPreviewImage(null);
    setFormData({
      ...formData,
      profilePicture: avatar.emoji,
    });
    if (error) setError("");
  };

  // ==================== HANDLE FILE UPLOAD ====================
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError("Please upload a valid image (jpg, jpeg, png, webp)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }

    setSelectedAvatar(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
      setFormData({
        ...formData,
        profilePicture: reader.result,
      });
    };
    reader.readAsDataURL(file);
    if (error) setError("");
  };

  // ==================== HANDLE FORM SUBMISSION ====================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // ==================== VALIDATION ====================
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (!formData.profilePicture) {
      setError("Please select a profile picture or avatar");
      return;
    }

    setIsLoading(true);

    try {
      // ==================== API CALL ====================
      const response = await axios.post(
        "http://23.22.136.183:8000/api/tasks/register/",
        {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          profile_picture: formData.profilePicture,
        }
      );

      setSuccess("Registration successful! 🎉 Redirecting to login...");
      
      // ==================== REDIRECT TO LOGIN ====================
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error(error);
      console.log(error.response?.data);

setError(
  JSON.stringify(error.response?.data)
);
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== GO BACK TO LOGIN ====================
  const goToLogin = () => {
    navigate("/");
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
      {/* ==================== REGISTER CARD ==================== */}
      <div
        style={{
          background: "rgba(255, 255, 255, 0.08)",
          backdropFilter: "blur(20px)",
          borderRadius: "24px",
          padding: "40px 35px",
          maxWidth: "480px",
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          border: "1px solid rgba(255,255,255,0.1)",
          transition: "all 0.3s ease",
        }}
      >
        {/* ==================== HEADER ==================== */}
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "700",
              background: "linear-gradient(135deg, #ec4899, #8b5cf6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              margin: "0 0 5px 0",
            }}
          >
            Create Account
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: "0.95rem",
              margin: 0,
            }}
          >
            Join TaskFlow and start managing your tasks
          </p>
        </div>

        {/* ==================== SUCCESS MESSAGE ==================== */}
        {success && (
          <div
            style={{
              background: "rgba(34, 197, 94, 0.15)",
              border: "1px solid rgba(34, 197, 94, 0.3)",
              borderRadius: "10px",
              padding: "12px 16px",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              color: "#4ade80",
              fontSize: "0.9rem",
            }}
          >
            <FaCheckCircle />
            {success}
          </div>
        )}

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

        {/* ==================== REGISTER FORM ==================== */}
        <form onSubmit={handleSubmit}>
          {/* ==================== USERNAME FIELD ==================== */}
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                color: "rgba(255,255,255,0.8)",
                fontSize: "0.85rem",
                fontWeight: "500",
                marginBottom: "6px",
              }}
            >
              Username
            </label>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <FaUser
                style={{
                  position: "absolute",
                  left: "14px",
                  color: "rgba(255,255,255,0.4)",
                  fontSize: "0.95rem",
                }}
              />
              <input
                type="text"
                name="username"
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "12px 14px 12px 44px",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "10px",
                  color: "white",
                  fontSize: "0.95rem",
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

          {/* ==================== EMAIL FIELD ==================== */}
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                color: "rgba(255,255,255,0.8)",
                fontSize: "0.85rem",
                fontWeight: "500",
                marginBottom: "6px",
              }}
            >
              Email Address
            </label>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <FaEnvelope
                style={{
                  position: "absolute",
                  left: "14px",
                  color: "rgba(255,255,255,0.4)",
                  fontSize: "0.95rem",
                }}
              />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "12px 14px 12px 44px",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "10px",
                  color: "white",
                  fontSize: "0.95rem",
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
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                color: "rgba(255,255,255,0.8)",
                fontSize: "0.85rem",
                fontWeight: "500",
                marginBottom: "6px",
              }}
            >
              Password
            </label>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <FaLock
                style={{
                  position: "absolute",
                  left: "14px",
                  color: "rgba(255,255,255,0.4)",
                  fontSize: "0.95rem",
                }}
              />
              <input
                type="password"
                name="password"
                placeholder="Create a password (min 6 chars)"
                value={formData.password}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "12px 14px 12px 44px",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "10px",
                  color: "white",
                  fontSize: "0.95rem",
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

          {/* ==================== CONFIRM PASSWORD FIELD ==================== */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                color: "rgba(255,255,255,0.8)",
                fontSize: "0.85rem",
                fontWeight: "500",
                marginBottom: "6px",
              }}
            >
              Confirm Password
            </label>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <FaLock
                style={{
                  position: "absolute",
                  left: "14px",
                  color: "rgba(255,255,255,0.4)",
                  fontSize: "0.95rem",
                }}
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "12px 14px 12px 44px",
                  background: "rgba(255,255,255,0.06)",
                  border: formData.confirmPassword && formData.password !== formData.confirmPassword
                    ? "1px solid rgba(220, 38, 38, 0.5)"
                    : formData.confirmPassword && formData.password === formData.confirmPassword
                    ? "1px solid rgba(34, 197, 94, 0.5)"
                    : "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "10px",
                  color: "white",
                  fontSize: "0.95rem",
                  transition: "all 0.3s ease",
                  outline: "none",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#ec4899";
                  e.target.style.boxShadow = "0 0 0 3px rgba(236, 72, 153, 0.15)";
                }}
                onBlur={(e) => {
                  if (formData.confirmPassword && formData.password !== formData.confirmPassword) {
                    e.target.style.borderColor = "rgba(220, 38, 38, 0.5)";
                  } else if (formData.confirmPassword && formData.password === formData.confirmPassword) {
                    e.target.style.borderColor = "rgba(34, 197, 94, 0.5)";
                  } else {
                    e.target.style.borderColor = "rgba(255,255,255,0.1)";
                  }
                  e.target.style.boxShadow = "none";
                }}
              />
              {formData.confirmPassword && formData.password === formData.confirmPassword && (
                <FaCheckCircle
                  style={{
                    position: "absolute",
                    right: "14px",
                    color: "#22c55e",
                    fontSize: "1rem",
                  }}
                />
              )}
            </div>
          </div>

          {/* ==================== PROFILE PICTURE SECTION ==================== */}
          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                color: "rgba(255,255,255,0.8)",
                fontSize: "0.85rem",
                fontWeight: "500",
                marginBottom: "10px",
              }}
            >
              Profile Picture
            </label>

            {/* ==================== AVATAR SELECTION ==================== */}
            <div style={{ marginBottom: "12px" }}>
              <p
                style={{
                  color: "rgba(255,255,255,0.5)",
                  fontSize: "0.8rem",
                  margin: "0 0 8px 0",
                }}
              >
                Option 1: Choose an avatar
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "8px",
                }}
              >
                {avatars.map((avatar) => (
                  <button
                    key={avatar.id}
                    type="button"
                    onClick={() => handleAvatarSelect(avatar)}
                    style={{
                      padding: "10px 8px",
                      background: selectedAvatar?.id === avatar.id
                        ? "rgba(236, 72, 153, 0.2)"
                        : "rgba(255,255,255,0.05)",
                      border: selectedAvatar?.id === avatar.id
                        ? "2px solid #ec4899"
                        : "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "10px",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      textAlign: "center",
                      color: "white",
                    }}
                    onMouseEnter={(e) => {
                      if (selectedAvatar?.id !== avatar.id) {
                        e.target.style.background = "rgba(255,255,255,0.1)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedAvatar?.id !== avatar.id) {
                        e.target.style.background = "rgba(255,255,255,0.05)";
                      }
                    }}
                  >
                    <div style={{ fontSize: "2rem", marginBottom: "4px" }}>
                      {avatar.emoji}
                    </div>
                    <div style={{ fontSize: "0.65rem", opacity: 0.6 }}>
                      {avatar.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* ==================== FILE UPLOAD ==================== */}
            <div>
              <p
                style={{
                  color: "rgba(255,255,255,0.5)",
                  fontSize: "0.8rem",
                  margin: "0 0 8px 0",
                }}
              >
                Option 2: Upload from device
              </p>
              <div
                style={{
                  position: "relative",
                  border: "2px dashed rgba(255,255,255,0.15)",
                  borderRadius: "10px",
                  padding: "20px",
                  textAlign: "center",
                  transition: "all 0.3s ease",
                  background: "rgba(255,255,255,0.03)",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = "rgba(236, 72, 153, 0.4)";
                  e.target.style.background = "rgba(236, 72, 153, 0.05)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = "rgba(255,255,255,0.15)";
                  e.target.style.background = "rgba(255,255,255,0.03)";
                }}
              >
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleFileUpload}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    opacity: 0,
                    cursor: "pointer",
                  }}
                />
                <FaUpload
                  style={{
                    fontSize: "1.5rem",
                    color: "rgba(255,255,255,0.4)",
                    marginBottom: "8px",
                  }}
                />
                <p
                  style={{
                    color: "rgba(255,255,255,0.6)",
                    fontSize: "0.85rem",
                    margin: 0,
                  }}
                >
                  Click or drag to upload
                </p>
                <p
                  style={{
                    color: "rgba(255,255,255,0.3)",
                    fontSize: "0.7rem",
                    margin: "4px 0 0 0",
                  }}
                >
                  JPG, JPEG, PNG, WEBP • Max 5MB
                </p>
              </div>
            </div>

            {/* ==================== PREVIEW ==================== */}
            {(selectedAvatar || previewImage) && (
              <div
                style={{
                  marginTop: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px",
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: "10px",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "2rem",
                    background: "rgba(236, 72, 153, 0.15)",
                    border: "2px solid rgba(236, 72, 153, 0.3)",
                    overflow: "hidden",
                  }}
                >
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Profile"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    selectedAvatar?.emoji
                  )}
                </div>
                <div>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.8)",
                      fontSize: "0.85rem",
                      margin: 0,
                      fontWeight: "500",
                    }}
                  >
                    {previewImage ? "Custom Image" : selectedAvatar?.label}
                  </p>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.4)",
                      fontSize: "0.75rem",
                      margin: "2px 0 0 0",
                    }}
                  >
                    ✓ Selected
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ==================== REGISTER BUTTON ==================== */}
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
                <FaSpinner style={{ animation: "spin 1s linear infinite" }} />
                Creating Account...
              </>
            ) : (
              <>
                <FaUserPlus />
                Create Account
              </>
            )}
          </button>
        </form>

        {/* ==================== LOGIN LINK ==================== */}
        <div
          style={{
            textAlign: "center",
            marginTop: "20px",
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
            Already have an account?{" "}
            <span
              onClick={goToLogin}
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
              <FaArrowLeft style={{ fontSize: "0.8rem" }} />
              Sign In
            </span>
          </p>
        </div>

        {/* ==================== FOOTER TEXT ==================== */}
        <div
          style={{
            textAlign: "center",
            marginTop: "12px",
          }}
        >
          <p
            style={{
              color: "rgba(255,255,255,0.25)",
              fontSize: "0.7rem",
              margin: 0,
            }}
          >
            By registering, you agree to our Terms & Conditions
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

export default Register;