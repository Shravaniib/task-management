import { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  FaTasks,
  FaChartBar,
  FaSignOutAlt,
  FaPlus,
  FaSearch,
  FaBell,
  FaChevronLeft,
  FaChevronRight,
  FaEdit,
  FaTrash,
  FaCheck,
  FaUndo,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaCalendarAlt,
  FaClock,
  FaFlag,
  FaGripHorizontal,
  FaTh,
  FaList,
  FaTimes,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaSpinner,
  FaBars,
  FaUser,
} from "react-icons/fa";
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

function Dashboard() {
  // ==================== STATE MANAGEMENT ====================
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [viewMode, setViewMode] = useState("list");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [theme, setTheme] = useState("pink");
  const [userData, setUserData] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ==================== REFS FOR SCROLLING ====================
  const analyticsRef = useRef(null);

  // ==================== SCROLL TO ANALYTICS ====================
  const scrollToAnalytics = () => {
    analyticsRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    setMobileMenuOpen(false);
  };

  // ==================== NOTIFICATION SYSTEM ====================
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // ==================== FETCH TASKS ====================
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsLoading(true);
    axios
      .get("http://23.22.136.183:8000/api/tasks/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setTasks(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });

    axios
      .get("http://23.22.136.183:8000/api/tasks/profile/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("PROFILE DATA:");
        console.log(response.data);
        setUserData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // ==================== AUTHENTICATION ====================
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    window.location.href = "/";
    showNotification("Logged out successfully", "info");
  };

  // ==================== CRUD OPERATIONS ====================
  const createTask = async () => {
    const token = localStorage.getItem("access_token");
    try {
      const response = await axios.post(
        "http://23.22.136.183:8000/api/tasks/",
        {
          title,
          description,
          status: "Pending",
          priority: priority,
          due_date: dueDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTasks([...tasks, response.data]);
      setTitle("");
      setDescription("");
      setPriority("Medium");
      setDueDate("");
      showNotification("Task created successfully! 🎉", "success");
    } catch (error) {
      console.error(error);
      showNotification("Failed to create task", "error");
    }
  };

  const deleteTask = async (id) => {
    const token = localStorage.getItem("access_token");

    try {
      await axios.delete(
        `http://23.22.136.183:8000/api/tasks/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTasks(tasks.filter((task) => task.id !== id));
      showNotification("Task deleted successfully", "success");
    } catch (error) {
      console.error(error);
      showNotification("Failed to delete task", "error");
    }
  };

  const completeTask = async (task) => {
    const token = localStorage.getItem("access_token");
    try {
      await axios.put(
        `http://23.22.136.183:8000/api/tasks/${task.id}/`,
        {
          title: task.title,
          description: task.description,
          status: "Completed",
          priority: task.priority || "Medium",
          due_date: task.due_date || "",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTasks(
        tasks.map((t) =>
          t.id === task.id
            ? { ...t, status: "Completed" }
            : t
        )
      );
      showNotification("Task completed! 🎉", "success");
    } catch (error) {
      console.error(error);
      showNotification("Failed to complete task", "error");
    }
  };

  const undoComplete = async (task) => {
    const token = localStorage.getItem("access_token");
    try {
      await axios.put(
        `http://23.22.136.183:8000/api/tasks/${task.id}/`,
        {
          title: task.title,
          description: task.description,
          status: "Pending",
          priority: task.priority || "Medium",
          due_date: task.due_date || "",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTasks(
        tasks.map((t) =>
          t.id === task.id
            ? { ...t, status: "Pending" }
            : t
        )
      );
      showNotification("Task reopened", "info");
    } catch (error) {
      console.error(error);
      showNotification("Failed to undo complete", "error");
    }
  };

  const editTask = async (task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setPriority(task.priority || "Medium");
    setDueDate(task.due_date || "");
    setShowModal(true);
  };

  const updateTask = async () => {
    const token = localStorage.getItem("access_token");
    try {
      const response = await axios.put(
        `http://23.22.136.183:8000/api/tasks/${editingTask.id}/`,
        {
          title,
          description,
          status: editingTask.status,
          priority: priority,
          due_date: dueDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTasks(
        tasks.map((t) =>
          t.id === editingTask.id ? response.data : t
        )
      );
      setShowModal(false);
      setEditingTask(null);
      setTitle("");
      setDescription("");
      setPriority("Medium");
      setDueDate("");
      showNotification("Task updated successfully!", "success");
    } catch (error) {
      console.error(error);
      showNotification("Failed to update task", "error");
    }
  };

  // ==================== BULK OPERATIONS ====================
  const bulkDelete = async () => {
    if (selectedTasks.length === 0) {
      showNotification("No tasks selected", "error");
      return;
    }
    const token = localStorage.getItem("access_token");
    try {
      await Promise.all(
        selectedTasks.map(id =>
          axios.delete(`http://23.22.136.183:8000/api/tasks/${id}/`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );
      setTasks(tasks.filter((task) => !selectedTasks.includes(task.id)));
      setSelectedTasks([]);
      showNotification(`${selectedTasks.length} tasks deleted`, "success");
    } catch (error) {
      console.error(error);
      showNotification("Failed to delete tasks", "error");
    }
  };

  const bulkComplete = async () => {
    if (selectedTasks.length === 0) {
      showNotification("No tasks selected", "error");
      return;
    }
    const token = localStorage.getItem("access_token");
    try {
      await Promise.all(
        selectedTasks.map(id => {
          const task = tasks.find(t => t.id === id);
          return axios.put(
            `http://23.22.136.183:8000/api/tasks/${id}/`,
            {
              title: task.title,
              description: task.description,
              status: "Completed",
              priority: task.priority || "Medium",
              due_date: task.due_date || "",
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        })
      );
      setTasks(
        tasks.map((t) =>
          selectedTasks.includes(t.id)
            ? { ...t, status: "Completed" }
            : t
        )
      );
      setSelectedTasks([]);
      showNotification(`${selectedTasks.length} tasks completed`, "success");
    } catch (error) {
      console.error(error);
      showNotification("Failed to complete tasks", "error");
    }
  };

  // ==================== SELECTION HANDLERS ====================
  const toggleSelectTask = (id) => {
    if (selectedTasks.includes(id)) {
      setSelectedTasks(selectedTasks.filter((taskId) => taskId !== id));
    } else {
      setSelectedTasks([...selectedTasks, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedTasks.length === filteredTasks.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(filteredTasks.map((task) => task.id));
    }
  };

  // ==================== SORTING ====================
  const handleSort = (criteria) => {
    if (sortBy === criteria) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(criteria);
      setSortOrder("asc");
    }
  };

  // ==================== COMPUTED PROPERTIES ====================
  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const pendingTasks = tasks.length - completedTasks;
  const completionPercentage = tasks.length > 0 
    ? Math.round((completedTasks / tasks.length) * 100)
    : 0;

  const filteredTasks = tasks
    .filter((task) =>
      task.title.toLowerCase().includes(search.toLowerCase())
    )
    .filter((task) =>
      filter === "All" ? true : task.status === filter
    )
    .sort((a, b) => {
      if (sortBy === "name") {
        return sortOrder === "asc"
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else if (sortBy === "status") {
        return sortOrder === "asc"
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      } else if (sortBy === "priority") {
        const priorityOrder = { High: 3, Medium: 2, Low: 1 };
        return sortOrder === "asc"
          ? (priorityOrder[a.priority] || 0) - (priorityOrder[b.priority] || 0)
          : (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
      }
      return 0;
    });

  const overdueTasks = tasks.filter(
    (task) => task.due_date && new Date(task.due_date) < new Date() && task.status === "Pending"
  );

  // ==================== CHART DATA ====================
  const pieData = {
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        data: [completedTasks, pendingTasks],
        backgroundColor: ['#22c55e', '#f59e0b'],
        borderColor: ['#16a34a', '#d97706'],
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Tasks Created',
        data: [3, 5, 2, 7, 4, 1, 3],
        backgroundColor: 'rgba(219, 39, 119, 0.6)',
        borderColor: '#db2777',
        borderWidth: 1,
      },
    ],
  };

  // ==================== THEME STYLES ====================
  const getThemeColors = () => {
    switch(theme) {
      case "pink":
        return { primary: "#db2777", primaryHover: "#ec4899", gradient: "linear-gradient(135deg, #db2777, #8b5cf6)" };
      case "blue":
        return { primary: "#2563eb", primaryHover: "#3b82f6", gradient: "linear-gradient(135deg, #2563eb, #06b6d4)" };
      case "purple":
        return { primary: "#7c3aed", primaryHover: "#8b5cf6", gradient: "linear-gradient(135deg, #7c3aed, #ec4899)" };
      default:
        return { primary: "#db2777", primaryHover: "#ec4899", gradient: "linear-gradient(135deg, #db2777, #8b5cf6)" };
    }
  };

  const themeColors = getThemeColors();

  const themeStyles = {
    background: isDarkMode 
      ? "linear-gradient(135deg, #0f172a 0%, #1a1a2e 100%)" 
      : "linear-gradient(135deg, #f5f0eb 0%, #e8ddd0 100%)",
    color: isDarkMode ? "#ffffff" : "#1a1a1a",
    cardBg: isDarkMode 
      ? "rgba(30, 41, 59, 0.7)" 
      : "rgba(255, 255, 255, 0.7)",
    cardBorder: isDarkMode 
      ? "rgba(255, 255, 255, 0.1)" 
      : "rgba(0, 0, 0, 0.1)",
    inputBg: isDarkMode 
      ? "rgba(30, 41, 59, 0.7)" 
      : "rgba(255, 255, 255, 0.7)",
    inputBorder: isDarkMode 
      ? "rgba(255, 255, 255, 0.15)" 
      : "rgba(0, 0, 0, 0.15)",
    buttonBg: themeColors.primary,
    buttonHover: themeColors.primaryHover,
    shadow: isDarkMode 
      ? "0 8px 32px rgba(0,0,0,0.3)" 
      : "0 8px 32px rgba(0,0,0,0.1)",
    statBg: isDarkMode 
      ? "rgba(30, 41, 59, 0.7)" 
      : "rgba(255, 255, 255, 0.7)",
    sidebarBg: isDarkMode 
      ? "rgba(30, 41, 59, 0.8)" 
      : "rgba(255, 255, 255, 0.8)",
    textColor: isDarkMode ? "#ffffff" : "#1a1a1a",
    textSecondary: isDarkMode ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)",
    textMuted: isDarkMode ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
  };

  // ==================== TOGGLE FUNCTIONS ====================
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    showNotification(isDarkMode ? "Light mode activated" : "Dark mode activated", "info");
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case "High": return "#dc2626";
      case "Medium": return "#f59e0b";
      case "Low": return "#22c55e";
      default: return "#6b7280";
    }
  };

  const getPriorityIcon = (priority) => {
    switch(priority) {
      case "High": return "🔴";
      case "Medium": return "🟡";
      case "Low": return "🟢";
      default: return "⚪";
    }
  };

  // ==================== RENDER ====================
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: themeStyles.background,
        color: themeStyles.textColor,
        transition: "all 0.3s ease",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        position: "relative",
      }}
    >
      {/* ==================== NOTIFICATION TOAST ==================== */}
      {notification && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: 9999,
            padding: "15px 25px",
            borderRadius: "10px",
            background: notification.type === "success" ? "#22c55e" : 
                       notification.type === "error" ? "#dc2626" : 
                       notification.type === "info" ? "#3b82f6" : "#6b7280",
            color: "white",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            animation: "slideIn 0.3s ease",
            maxWidth: "400px",
            backdropFilter: "blur(10px)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "0.9rem",
          }}
        >
          {notification.type === "success" && <FaCheckCircle />}
          {notification.type === "error" && <FaExclamationTriangle />}
          {notification.type === "info" && <FaInfoCircle />}
          {notification.message}
        </div>
      )}

      {/* ==================== MOBILE HEADER ==================== */}
      <div
        style={{
          display: "none",
          padding: "15px 20px",
          background: themeStyles.sidebarBg,
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${themeStyles.cardBorder}`,
          justifyContent: "space-between",
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
        className="mobile-header"
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: "transparent",
              border: "none",
              color: themeStyles.textColor,
              fontSize: "1.5rem",
              cursor: "pointer",
            }}
          >
            <FaBars />
          </button>
          <h2 style={{ 
            fontSize: "1.3rem", 
            fontWeight: "700",
            background: "linear-gradient(135deg, #ec4899, #8b5cf6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: 0,
          }}>
            TaskFlow
          </h2>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <button
            onClick={toggleTheme}
            style={{
              padding: "8px 12px",
              background: isDarkMode ? "rgba(51,65,85,0.7)" : "rgba(224,213,200,0.7)",
              color: themeStyles.textColor,
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "20px",
              cursor: "pointer",
              fontSize: "0.9rem",
            }}
          >
            {isDarkMode ? "☀️" : "🌙"}
          </button>
          <button
            onClick={handleLogout}
            style={{
              padding: "8px 12px",
              background: "rgba(220,38,38,0.1)",
              color: "#dc2626",
              border: "1px solid rgba(220,38,38,0.2)",
              borderRadius: "20px",
              cursor: "pointer",
              fontSize: "0.9rem",
            }}
          >
            <FaSignOutAlt />
          </button>
        </div>
      </div>

      {/* ==================== MOBILE SIDEBAR OVERLAY ==================== */}
      {mobileMenuOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(5px)",
            zIndex: 99,
          }}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* ==================== MAIN LAYOUT ==================== */}
      <div
        style={{
          display: "flex",
          flex: 1,
          position: "relative",
        }}
      >
        {/* ==================== SIDEBAR ==================== */}
        <div
          style={{
            width: sidebarCollapsed ? "80px" : "260px",
            background: themeStyles.sidebarBg,
            backdropFilter: "blur(20px)",
            padding: "25px 20px",
            borderRight: `1px solid ${themeStyles.cardBorder}`,
            display: "flex",
            flexDirection: "column",
            height: "100vh",
            position: "sticky",
            top: 0,
            boxShadow: themeStyles.shadow,
            transition: "all 0.3s ease",
            overflow: "hidden",
            flexShrink: 0,
            zIndex: 100,
          }}
          className="sidebar"
        >
          {/* Sidebar Header */}
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            marginBottom: "40px"
          }}>
            {!sidebarCollapsed && (
              <h2 style={{ 
                fontSize: "1.8rem", 
                fontWeight: "700",
                background: "linear-gradient(135deg, #ec4899, #8b5cf6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                margin: 0,
                whiteSpace: "nowrap",
              }}>
                TaskFlow
              </h2>
            )}
            <button
              onClick={toggleSidebar}
              style={{
                background: "transparent",
                border: "none",
                color: themeStyles.textColor,
                cursor: "pointer",
                fontSize: "1.2rem",
                padding: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {sidebarCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
            </button>
          </div>

          {/* Sidebar Navigation */}
          <div style={{ flex: 1 }}>
            <div style={{ 
              padding: "12px 15px", 
              borderRadius: "10px",
              background: `rgba(${theme === "pink" ? "219, 39, 119" : theme === "blue" ? "37, 99, 235" : "124, 58, 237"}, 0.2)`,
              color: themeStyles.buttonBg,
              marginBottom: "5px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              cursor: "pointer",
              fontWeight: "600",
              whiteSpace: "nowrap",
            }}>
              <FaTasks /> {!sidebarCollapsed && "Dashboard"}
            </div>

            <div 
              onClick={scrollToAnalytics}
              style={{ 
                padding: "12px 15px", 
                borderRadius: "10px",
                marginBottom: "5px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                opacity: "0.7",
                cursor: "pointer",
                transition: "all 0.3s ease",
                whiteSpace: "nowrap",
                color: themeStyles.textColor,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
                e.currentTarget.style.opacity = "1";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.opacity = "0.7";
              }}
            >
              <FaChartBar /> {!sidebarCollapsed && "Analytics"}
            </div>

            <div style={{ 
              padding: "12px 15px", 
              borderRadius: "10px",
              marginBottom: "5px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              opacity: "0.7",
              cursor: "pointer",
              transition: "all 0.3s ease",
              color: "#dc2626",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(220, 38, 38, 0.1)";
              e.currentTarget.style.opacity = "1";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.opacity = "0.7";
            }}
            onClick={handleLogout}
            >
              <FaSignOutAlt /> {!sidebarCollapsed && "Logout"}
            </div>
          </div>

          {/* User Profile Card */}
          {!sidebarCollapsed && (
            <div
              style={{
                padding: "20px",
                borderRadius: "15px",
                background: isDarkMode ? "rgba(51, 65, 85, 0.5)" : "rgba(243, 244, 246, 0.5)",
                backdropFilter: "blur(10px)",
                border: `1px solid ${themeStyles.cardBorder}`,
                marginTop: "auto",
              }}
            >
              <div style={{ textAlign: "center" }}>
                {userData?.avatar?.startsWith("data:image") ? (
                  <img
                    src={userData.avatar}
                    alt="Profile"
                    style={{
                      width: "70px",
                      height: "70px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      margin: "0 auto",
                      display: "block",
                    }}
                  />
                ) : userData?.avatar ? (
                  <div
                    style={{
                      fontSize: "55px",
                      textAlign: "center",
                    }}
                  >
                    {userData.avatar}
                  </div>
                ) : (
                  <div
                    style={{
                      width: "70px",
                      height: "70px",
                      borderRadius: "50%",
                      background: "#7c3aed",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontSize: "28px",
                      margin: "0 auto",
                    }}
                  >
                    <FaUser />
                  </div>
                )}
                <h4 style={{ margin: "10px 0 5px 0", color: themeStyles.textColor, fontSize: "1rem" }}>{userData?.username || "User"}</h4>
                <p style={{ margin: "0 0 10px 0", fontSize: "0.85rem", color: themeStyles.textSecondary }}>
                  {userData?.email || "user@email.com"}
                </p>
              </div>
              <div style={{ 
                marginTop: "10px", 
                height: "4px", 
                background: isDarkMode ? "#334155" : "#e5e7eb",
                borderRadius: "2px",
                overflow: "hidden"
              }}>
                <div style={{ 
                  width: `${completionPercentage}%`, 
                  height: "100%", 
                  background: themeStyles.buttonBg,
                  borderRadius: "2px",
                  transition: "width 0.5s ease"
                }}></div>
              </div>
              <p style={{ margin: "5px 0 0 0", fontSize: "0.8rem", color: themeStyles.textMuted }}>
                {completionPercentage}% Complete
              </p>
            </div>
          )}
        </div>

        {/* ==================== MAIN CONTENT ==================== */}
        <div
          style={{
            flex: 1,
            padding: "30px 40px",
            overflowY: "auto",
            maxHeight: "100vh",
            minWidth: 0,
          }}
          className="main-content"
        >
          {/* ==================== HEADER ==================== */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "30px",
              flexWrap: "wrap",
              gap: "15px",
            }}
          >
            <div>
              <h1 style={{ margin: 0, fontSize: "clamp(1.3rem, 2.5vw, 2rem)", fontWeight: "700", color: themeStyles.textColor }}>
                Welcome Back 👋
              </h1>
              <p style={{ margin: "5px 0 0", color: themeStyles.textSecondary, fontSize: "clamp(0.8rem, 1vw, 1rem)" }}>
                {tasks.length} tasks • {pendingTasks} pending • {completedTasks} completed
              </p>
            </div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ display: "flex", gap: "5px" }}>
                <button
                  onClick={() => setTheme("pink")}
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: "#db2777",
                    border: theme === "pink" ? "2px solid white" : "2px solid transparent",
                    cursor: "pointer",
                    boxShadow: theme === "pink" ? "0 0 10px rgba(219,39,119,0.5)" : "none",
                  }}
                />
                <button
                  onClick={() => setTheme("blue")}
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: "#2563eb",
                    border: theme === "blue" ? "2px solid white" : "2px solid transparent",
                    cursor: "pointer",
                    boxShadow: theme === "blue" ? "0 0 10px rgba(37,99,235,0.5)" : "none",
                  }}
                />
                <button
                  onClick={() => setTheme("purple")}
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: "#7c3aed",
                    border: theme === "purple" ? "2px solid white" : "2px solid transparent",
                    cursor: "pointer",
                    boxShadow: theme === "purple" ? "0 0 10px rgba(124,58,237,0.5)" : "none",
                  }}
                />
              </div>
              
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  style={{
                    padding: "8px 10px",
                    borderRadius: "50%",
                    background: themeStyles.cardBg,
                    border: `1px solid ${themeStyles.cardBorder}`,
                    color: themeStyles.textColor,
                    cursor: "pointer",
                    position: "relative",
                  }}
                >
                  <FaBell />
                  {overdueTasks.length > 0 && (
                    <span style={{
                      position: "absolute",
                      top: "-5px",
                      right: "-5px",
                      background: "#dc2626",
                      color: "white",
                      borderRadius: "50%",
                      padding: "2px 6px",
                      fontSize: "10px",
                      fontWeight: "bold",
                    }}>
                      {overdueTasks.length}
                    </span>
                  )}
                </button>
                {showNotifications && (
                  <div style={{
                    position: "absolute",
                    top: "45px",
                    right: "0",
                    background: themeStyles.cardBg,
                    borderRadius: "10px",
                    padding: "15px",
                    width: "280px",
                    boxShadow: themeStyles.shadow,
                    border: `1px solid ${themeStyles.cardBorder}`,
                    backdropFilter: "blur(10px)",
                    zIndex: 1000,
                  }}>
                    <h4 style={{ margin: "0 0 10px 0", color: themeStyles.textColor, fontSize: "1rem" }}>Notifications</h4>
                    {overdueTasks.length > 0 ? (
                      <div>
                        <p style={{ color: "#dc2626", fontSize: "0.85rem" }}>
                          ⚠️ {overdueTasks.length} overdue tasks
                        </p>
                        {overdueTasks.slice(0, 3).map(task => (
                          <p key={task.id} style={{ fontSize: "0.8rem", margin: "5px 0", color: themeStyles.textSecondary }}>
                            • {task.title}
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p style={{ color: themeStyles.textMuted, fontSize: "0.9rem" }}>No new notifications</p>
                    )}
                  </div>
                )}
              </div>
              
              <button
                onClick={toggleTheme}
                style={{
                  padding: "8px 16px",
                  background: isDarkMode 
                    ? "rgba(51, 65, 85, 0.7)" 
                    : "rgba(224, 213, 200, 0.7)",
                  color: themeStyles.textColor,
                  border: isDarkMode 
                    ? "1px solid rgba(255,255,255,0.1)" 
                    : "1px solid rgba(0,0,0,0.1)",
                  borderRadius: "20px",
                  cursor: "pointer",
                  fontSize: "clamp(0.8rem, 0.9vw, 0.95rem)",
                  fontWeight: "500",
                  transition: "all 0.3s ease",
                  backdropFilter: "blur(10px)",
                  boxShadow: themeStyles.shadow,
                  whiteSpace: "nowrap",
                }}
              >
                {isDarkMode ? "☀️ Light" : "🌙 Dark"}
              </button>
            </div>
          </div>

          {/* ==================== STATS CARDS ==================== */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "15px",
              marginBottom: "30px",
            }}
          >
            <div
              className="stat-card"
              style={{
                background: themeStyles.statBg,
                padding: "15px 18px",
                borderRadius: "12px",
                boxShadow: themeStyles.shadow,
                border: `1px solid ${themeStyles.cardBorder}`,
                backdropFilter: "blur(10px)",
                transition: "transform 0.3s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => e.target.style.transform = "scale(1.02)"}
              onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
            >
              <h2 style={{ fontSize: "clamp(1.5rem, 2vw, 2rem)", margin: "0", color: "#3b82f6" }}>{tasks.length}</h2>
              <p style={{ margin: "5px 0 0", color: themeStyles.textSecondary, fontSize: "clamp(0.75rem, 0.8vw, 0.9rem)" }}>Total Tasks</p>
              <div style={{ marginTop: "8px", fontSize: "0.75rem", color: themeStyles.textMuted }}>
                All tasks
              </div>
            </div>

            <div
              className="stat-card"
              style={{
                background: themeStyles.statBg,
                padding: "15px 18px",
                borderRadius: "12px",
                boxShadow: themeStyles.shadow,
                border: `1px solid ${themeStyles.cardBorder}`,
                backdropFilter: "blur(10px)",
                transition: "transform 0.3s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => e.target.style.transform = "scale(1.02)"}
              onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
            >
              <h2 style={{ fontSize: "clamp(1.5rem, 2vw, 2rem)", margin: "0", color: "#22c55e" }}>{completedTasks}</h2>
              <p style={{ margin: "5px 0 0", color: themeStyles.textSecondary, fontSize: "clamp(0.75rem, 0.8vw, 0.9rem)" }}>Completed</p>
              <div style={{ marginTop: "8px", fontSize: "0.75rem", color: themeStyles.textMuted }}>
                {completionPercentage}% rate
              </div>
            </div>

            <div
              className="stat-card"
              style={{
                background: themeStyles.statBg,
                padding: "15px 18px",
                borderRadius: "12px",
                boxShadow: themeStyles.shadow,
                border: `1px solid ${themeStyles.cardBorder}`,
                backdropFilter: "blur(10px)",
                transition: "transform 0.3s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => e.target.style.transform = "scale(1.02)"}
              onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
            >
              <h2 style={{ fontSize: "clamp(1.5rem, 2vw, 2rem)", margin: "0", color: "#f59e0b" }}>{pendingTasks}</h2>
              <p style={{ margin: "5px 0 0", color: themeStyles.textSecondary, fontSize: "clamp(0.75rem, 0.8vw, 0.9rem)" }}>Pending</p>
              <div style={{ marginTop: "8px", fontSize: "0.75rem", color: themeStyles.textMuted }}>
                {overdueTasks.length} overdue
              </div>
            </div>

            <div
              className="stat-card"
              style={{
                background: themeStyles.statBg,
                padding: "15px 18px",
                borderRadius: "12px",
                boxShadow: themeStyles.shadow,
                border: `1px solid ${themeStyles.cardBorder}`,
                backdropFilter: "blur(10px)",
                transition: "transform 0.3s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => e.target.style.transform = "scale(1.02)"}
              onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
            >
              <h2 style={{ fontSize: "clamp(1.5rem, 2vw, 2rem)", margin: "0", color: "#8b5cf6" }}>
                {completionPercentage}%
              </h2>
              <p style={{ margin: "5px 0 0", color: themeStyles.textSecondary, fontSize: "clamp(0.75rem, 0.8vw, 0.9rem)" }}>Progress</p>
              <div style={{ 
                marginTop: "8px", 
                height: "5px", 
                background: isDarkMode ? "#334155" : "#e5e7eb",
                borderRadius: "3px",
                overflow: "hidden"
              }}>
                <div style={{ 
                  width: `${completionPercentage}%`, 
                  height: "100%", 
                  background: themeStyles.buttonBg,
                  borderRadius: "3px",
                  transition: "width 0.5s ease"
                }}></div>
              </div>
            </div>
          </div>

          {/* ==================== QUICK ACTIONS ==================== */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "12px",
            marginBottom: "25px",
          }}>
            <button
              onClick={() => document.getElementById('createTaskSection').scrollIntoView({ behavior: 'smooth' })}
              style={{
                padding: "10px 16px",
                background: themeStyles.buttonBg,
                color: "white",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: "600",
                transition: "all 0.3s ease",
                fontSize: "clamp(0.8rem, 0.9vw, 0.95rem)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
              onMouseEnter={(e) => e.target.style.transform = "scale(1.02)"}
              onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
            >
              <FaPlus size={14} /> Quick Add
            </button>
            {selectedTasks.length > 0 && (
              <>
                <button
                  onClick={bulkComplete}
                  style={{
                    padding: "10px 16px",
                    background: "#22c55e",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontWeight: "600",
                    transition: "all 0.3s ease",
                    fontSize: "clamp(0.75rem, 0.85vw, 0.9rem)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                  }}
                >
                  <FaCheck size={12} /> Complete ({selectedTasks.length})
                </button>
                <button
                  onClick={bulkDelete}
                  style={{
                    padding: "10px 16px",
                    background: "#dc2626",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontWeight: "600",
                    transition: "all 0.3s ease",
                    fontSize: "clamp(0.75rem, 0.85vw, 0.9rem)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                  }}
                >
                  <FaTrash size={12} /> Delete ({selectedTasks.length})
                </button>
              </>
            )}
          </div>

          {/* ==================== CREATE TASK SECTION ==================== */}
          <div
            id="createTaskSection"
            style={{
              background: themeStyles.cardBg,
              padding: "clamp(18px, 2vw, 30px)",
              borderRadius: "15px",
              marginBottom: "30px",
              boxShadow: themeStyles.shadow,
              border: `1px solid ${themeStyles.cardBorder}`,
              transition: "all 0.3s ease",
              backdropFilter: "blur(10px)",
            }}
          >
            <h2 style={{ marginTop: "0", marginBottom: "16px", fontSize: "clamp(1.1rem, 1.3vw, 1.4rem)", display: "flex", alignItems: "center", gap: "8px", color: themeStyles.textColor }}>
              <FaPlus style={{ color: themeStyles.buttonBg }} /> Create New Task
            </h2>

            <input
              type="text"
              placeholder="Task Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                marginBottom: "12px",
                borderRadius: "10px",
                border: `1px solid ${themeStyles.inputBorder}`,
                background: themeStyles.inputBg,
                color: themeStyles.textColor,
                fontSize: "clamp(0.9rem, 1vw, 1rem)",
                transition: "all 0.3s ease",
                backdropFilter: "blur(10px)",
                boxSizing: "border-box",
              }}
            />

            <textarea
              placeholder="Task Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                height: "80px",
                borderRadius: "10px",
                border: `1px solid ${themeStyles.inputBorder}`,
                background: themeStyles.inputBg,
                color: themeStyles.textColor,
                fontSize: "clamp(0.9rem, 1vw, 1rem)",
                transition: "all 0.3s ease",
                resize: "vertical",
                backdropFilter: "blur(10px)",
                boxSizing: "border-box",
                fontFamily: "inherit",
              }}
            />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "4px", fontWeight: "500", color: themeStyles.textSecondary, fontSize: "clamp(0.8rem, 0.9vw, 0.9rem)" }}>
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "10px",
                    border: `1px solid ${themeStyles.inputBorder}`,
                    background: themeStyles.inputBg,
                    color: themeStyles.textColor,
                    fontSize: "clamp(0.85rem, 0.95vw, 1rem)",
                    boxSizing: "border-box",
                  }}
                >
                  <option value="Low">🟢 Low</option>
                  <option value="Medium">🟡 Medium</option>
                  <option value="High">🔴 High</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "4px", fontWeight: "500", color: themeStyles.textSecondary, fontSize: "clamp(0.8rem, 0.9vw, 0.9rem)" }}>
                  Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "10px",
                    border: `1px solid ${themeStyles.inputBorder}`,
                    background: themeStyles.inputBg,
                    color: themeStyles.textColor,
                    fontSize: "clamp(0.85rem, 0.95vw, 1rem)",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            <button
              onClick={createTask}
              style={{
                width: "100%",
                padding: "12px",
                background: themeStyles.buttonBg,
                color: "white",
                border: "none",
                borderRadius: "25px",
                cursor: "pointer",
                fontSize: "clamp(0.9rem, 1vw, 1rem)",
                fontWeight: "600",
                transition: "all 0.3s ease",
                boxShadow: `0 4px 6px ${themeStyles.buttonBg}40`,
                backdropFilter: "blur(10px)",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = themeStyles.buttonHover;
                e.target.style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = themeStyles.buttonBg;
                e.target.style.transform = "scale(1)";
              }}
            >
              ➕ Create Task
            </button>
          </div>

          {/* ==================== SEARCH & FILTERS ==================== */}
          <div
            style={{
              marginBottom: "25px",
            }}
          >
            <div style={{ position: "relative" }}>
              <FaSearch style={{ 
                position: "absolute", 
                left: "14px", 
                top: "50%", 
                transform: "translateY(-50%)",
                color: themeStyles.textMuted,
              }} />
              <input
                type="text"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 14px 12px 42px",
                  borderRadius: "10px",
                  border: `1px solid ${themeStyles.inputBorder}`,
                  background: themeStyles.inputBg,
                  color: themeStyles.textColor,
                  fontSize: "clamp(0.9rem, 1vw, 1rem)",
                  marginBottom: "15px",
                  transition: "all 0.3s ease",
                  backdropFilter: "blur(10px)",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "12px" }}>
              <button
                onClick={() => setFilter("All")}
                style={{
                  padding: "6px 16px",
                  background: filter === "All" ? themeStyles.buttonBg : "transparent",
                  color: filter === "All" ? "white" : themeStyles.textColor,
                  border: `1px solid ${filter === "All" ? themeStyles.buttonBg : themeStyles.cardBorder}`,
                  borderRadius: "20px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  backdropFilter: "blur(10px)",
                  fontSize: "clamp(0.75rem, 0.85vw, 0.9rem)",
                }}
              >
                All
              </button>
              <button
                onClick={() => setFilter("Pending")}
                style={{
                  padding: "6px 16px",
                  background: filter === "Pending" ? themeStyles.buttonBg : "transparent",
                  color: filter === "Pending" ? "white" : themeStyles.textColor,
                  border: `1px solid ${filter === "Pending" ? themeStyles.buttonBg : themeStyles.cardBorder}`,
                  borderRadius: "20px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  backdropFilter: "blur(10px)",
                  fontSize: "clamp(0.75rem, 0.85vw, 0.9rem)",
                }}
              >
                Pending
              </button>
              <button
                onClick={() => setFilter("Completed")}
                style={{
                  padding: "6px 16px",
                  background: filter === "Completed" ? themeStyles.buttonBg : "transparent",
                  color: filter === "Completed" ? "white" : themeStyles.textColor,
                  border: `1px solid ${filter === "Completed" ? themeStyles.buttonBg : themeStyles.cardBorder}`,
                  borderRadius: "20px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  backdropFilter: "blur(10px)",
                  fontSize: "clamp(0.75rem, 0.85vw, 0.9rem)",
                }}
              >
                Completed
              </button>
            </div>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
              <button
                onClick={() => handleSort("name")}
                style={{
                  padding: "5px 12px",
                  background: "transparent",
                  color: themeStyles.textColor,
                  border: `1px solid ${themeStyles.cardBorder}`,
                  borderRadius: "15px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "clamp(0.7rem, 0.8vw, 0.85rem)",
                }}
              >
                Name {sortBy === "name" && (sortOrder === "asc" ? <FaSortUp /> : <FaSortDown />)}
              </button>
              <button
                onClick={() => handleSort("status")}
                style={{
                  padding: "5px 12px",
                  background: "transparent",
                  color: themeStyles.textColor,
                  border: `1px solid ${themeStyles.cardBorder}`,
                  borderRadius: "15px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "clamp(0.7rem, 0.8vw, 0.85rem)",
                }}
              >
                Status {sortBy === "status" && (sortOrder === "asc" ? <FaSortUp /> : <FaSortDown />)}
              </button>
              <button
                onClick={() => handleSort("priority")}
                style={{
                  padding: "5px 12px",
                  background: "transparent",
                  color: themeStyles.textColor,
                  border: `1px solid ${themeStyles.cardBorder}`,
                  borderRadius: "15px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "clamp(0.7rem, 0.8vw, 0.85rem)",
                }}
              >
                Priority {sortBy === "priority" && (sortOrder === "asc" ? <FaSortUp /> : <FaSortDown />)}
              </button>
              <div style={{ marginLeft: "auto", display: "flex", gap: "4px" }}>
                <button
                  onClick={() => setViewMode("list")}
                  style={{
                    padding: "5px 10px",
                    background: viewMode === "list" ? themeStyles.buttonBg : "transparent",
                    color: viewMode === "list" ? "white" : themeStyles.textColor,
                    border: `1px solid ${viewMode === "list" ? themeStyles.buttonBg : themeStyles.cardBorder}`,
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  <FaList size={14} />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  style={{
                    padding: "5px 10px",
                    background: viewMode === "grid" ? themeStyles.buttonBg : "transparent",
                    color: viewMode === "grid" ? "white" : themeStyles.textColor,
                    border: `1px solid ${viewMode === "grid" ? themeStyles.buttonBg : themeStyles.cardBorder}`,
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  <FaTh size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* ==================== TASKS LIST ==================== */}
          <h2 style={{ marginBottom: "20px", fontSize: "clamp(1.1rem, 1.3vw, 1.4rem)", display: "flex", alignItems: "center", gap: "8px", color: themeStyles.textColor, flexWrap: "wrap" }}>
            <FaTasks style={{ color: themeStyles.buttonBg }} /> Your Tasks
            <span style={{ fontSize: "0.8rem", color: themeStyles.textMuted, fontWeight: "normal" }}>
              ({filteredTasks.length} tasks)
            </span>
            {filteredTasks.length > 0 && (
              <label style={{ marginLeft: "auto", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "5px", color: themeStyles.textSecondary }}>
                <input
                  type="checkbox"
                  checked={selectedTasks.length === filteredTasks.length}
                  onChange={toggleSelectAll}
                />
                Select All
              </label>
            )}
          </h2>

          {/* Loading Spinner */}
          {isLoading && (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <FaSpinner style={{ fontSize: "2.5rem", animation: "spin 1s linear infinite", color: themeStyles.buttonBg }} />
              <p style={{ marginTop: "15px", color: themeStyles.textSecondary }}>Loading your tasks...</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && filteredTasks.length === 0 && (
            <div style={{ 
              textAlign: "center", 
              padding: "60px 20px",
              background: themeStyles.cardBg,
              borderRadius: "15px",
              border: `1px solid ${themeStyles.cardBorder}`,
              backdropFilter: "blur(10px)",
            }}>
              <div style={{ fontSize: "3.5rem", marginBottom: "15px" }}>📋</div>
              <h3 style={{ margin: "0 0 8px 0", color: themeStyles.textColor, fontSize: "1.2rem" }}>No Tasks Found</h3>
              <p style={{ color: themeStyles.textSecondary, margin: "0", fontSize: "0.9rem" }}>
                {search ? "Try adjusting your search or filters" : "Create your first task above! ✨"}
              </p>
            </div>
          )}

          {/* Task Cards */}
          {!isLoading && (
            <div style={{
              display: viewMode === "grid" ? "grid" : "block",
              gridTemplateColumns: viewMode === "grid" ? "repeat(auto-fill, minmax(280px, 1fr))" : "1fr",
              gap: "16px",
            }}>
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  style={{
                    border: `1px solid ${themeStyles.cardBorder}`,
                    background: themeStyles.cardBg,
                    borderRadius: "12px",
                    padding: "16px 18px",
                    marginBottom: viewMode === "list" ? "16px" : "0",
                    boxShadow: themeStyles.shadow,
                    transition: "all 0.3s ease",
                    position: "relative",
                    overflow: "hidden",
                    backdropFilter: "blur(10px)",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => e.target.style.transform = "translateY(-3px)"}
                  onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "4px",
                      height: "100%",
                      background: task.status === "Completed" ? "#22c55e" : 
                                 overdueTasks.includes(task) ? "#dc2626" : "#f59e0b",
                    }}
                  />
                  
                  <div style={{ paddingLeft: "12px" }}>
                    <div style={{ display: "flex", alignItems: "start", gap: "8px" }}>
                      <input
                        type="checkbox"
                        checked={selectedTasks.includes(task.id)}
                        onChange={() => toggleSelectTask(task.id)}
                        style={{ marginTop: "3px", cursor: "pointer", flexShrink: 0 }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                          <h3 style={{ margin: "0", fontSize: "clamp(0.95rem, 1.1vw, 1.1rem)", textDecoration: task.status === "Completed" ? "line-through" : "none", opacity: task.status === "Completed" ? 0.6 : 1, color: themeStyles.textColor, wordBreak: "break-word" }}>
                            {task.title}
                          </h3>
                          <span style={{ 
                            fontSize: "0.7rem", 
                            padding: "2px 8px", 
                            borderRadius: "12px",
                            background: task.status === "Completed" ? "#22c55e20" : "#f59e0b20",
                            color: task.status === "Completed" ? "#22c55e" : "#f59e0b",
                            fontWeight: "500",
                            whiteSpace: "nowrap",
                          }}>
                            {task.status}
                          </span>
                          <span style={{ 
                            fontSize: "0.7rem",
                            padding: "2px 6px",
                            borderRadius: "12px",
                            background: `${getPriorityColor(task.priority)}20`,
                            color: getPriorityColor(task.priority),
                            whiteSpace: "nowrap",
                          }}>
                            {getPriorityIcon(task.priority)} {task.priority || "Medium"}
                          </span>
                          {task.due_date && (
                            <span style={{ 
                              fontSize: "0.7rem",
                              display: "flex",
                              alignItems: "center",
                              gap: "3px",
                              color: new Date(task.due_date) < new Date() && task.status === "Pending" ? "#dc2626" : themeStyles.textSecondary,
                              whiteSpace: "nowrap",
                            }}>
                              <FaCalendarAlt size={10} /> {new Date(task.due_date).toLocaleDateString()}
                              {new Date(task.due_date) < new Date() && task.status === "Pending" && " ⚠️"}
                            </span>
                          )}
                        </div>
                        <p style={{ margin: "6px 0", color: themeStyles.textSecondary, fontSize: "clamp(0.8rem, 0.9vw, 0.9rem)", wordBreak: "break-word" }}>{task.description}</p>
                        
                        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "8px" }}>
                          {task.status !== "Completed" && (
                            <button
                              onClick={(e) => { e.stopPropagation(); completeTask(task); }}
                              style={{
                                background: "#22c55e",
                                color: "white",
                                border: "none",
                                padding: "5px 12px",
                                borderRadius: "15px",
                                cursor: "pointer",
                                fontSize: "clamp(0.7rem, 0.8vw, 0.8rem)",
                                transition: "all 0.3s ease",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                              }}
                              onMouseEnter={(e) => { e.target.style.background = "#16a34a"; e.target.style.transform = "scale(1.05)" }}
                              onMouseLeave={(e) => { e.target.style.background = "#22c55e"; e.target.style.transform = "scale(1)" }}
                            >
                              <FaCheck size={10} /> Complete
                            </button>
                          )}
                          {task.status === "Completed" && (
                            <button
                              onClick={(e) => { e.stopPropagation(); undoComplete(task); }}
                              style={{
                                background: "#f59e0b",
                                color: "white",
                                border: "none",
                                padding: "5px 12px",
                                borderRadius: "15px",
                                cursor: "pointer",
                                fontSize: "clamp(0.7rem, 0.8vw, 0.8rem)",
                                transition: "all 0.3s ease",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                              }}
                            >
                              <FaUndo size={10} /> Undo
                            </button>
                          )}
                          <button
                            onClick={(e) => { e.stopPropagation(); editTask(task); }}
                            style={{
                              background: "#3b82f6",
                              color: "white",
                              border: "none",
                              padding: "5px 12px",
                              borderRadius: "15px",
                              cursor: "pointer",
                              fontSize: "clamp(0.7rem, 0.8vw, 0.8rem)",
                              transition: "all 0.3s ease",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <FaEdit size={10} /> Edit
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
                            style={{
                              background: "#dc2626",
                              color: "white",
                              border: "none",
                              padding: "5px 12px",
                              borderRadius: "15px",
                              cursor: "pointer",
                              fontSize: "clamp(0.7rem, 0.8vw, 0.8rem)",
                              transition: "all 0.3s ease",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <FaTrash size={10} /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ==================== CHARTS SECTION (ANALYTICS) ==================== */}
          <div ref={analyticsRef} style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
            marginTop: "35px",
            paddingTop: "15px",
          }}>
            <div style={{
              background: themeStyles.cardBg,
              padding: "20px",
              borderRadius: "15px",
              boxShadow: themeStyles.shadow,
              border: `1px solid ${themeStyles.cardBorder}`,
              backdropFilter: "blur(10px)",
            }}>
              <h3 style={{ margin: "0 0 15px 0", textAlign: "center", color: themeStyles.textColor, fontSize: "clamp(0.9rem, 1.1vw, 1.1rem)" }}>Task Distribution</h3>
              <div style={{ maxWidth: "220px", margin: "0 auto" }}>
                <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: true }} />
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: "15px", marginTop: "12px", fontSize: "clamp(0.75rem, 0.85vw, 0.9rem)" }}>
                <div style={{ color: themeStyles.textSecondary }}><span style={{ display: "inline-block", width: "10px", height: "10px", background: "#22c55e", borderRadius: "3px", marginRight: "5px" }}></span> {completedTasks}</div>
                <div style={{ color: themeStyles.textSecondary }}><span style={{ display: "inline-block", width: "10px", height: "10px", background: "#f59e0b", borderRadius: "3px", marginRight: "5px" }}></span> {pendingTasks}</div>
              </div>
            </div>

            <div style={{
              background: themeStyles.cardBg,
              padding: "20px",
              borderRadius: "15px",
              boxShadow: themeStyles.shadow,
              border: `1px solid ${themeStyles.cardBorder}`,
              backdropFilter: "blur(10px)",
            }}>
              <h3 style={{ margin: "0 0 15px 0", textAlign: "center", color: themeStyles.textColor, fontSize: "clamp(0.9rem, 1.1vw, 1.1rem)" }}>Weekly Activity</h3>
              <Bar data={barData} options={{ 
                responsive: true, 
                maintainAspectRatio: true,
                plugins: { legend: { display: false } }
              }} />
            </div>
          </div>

          {/* ==================== TASK MODAL ==================== */}
          {showModal && editingTask && (
            <div style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(5px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
              padding: "16px",
            }}>
              <div style={{
                background: themeStyles.cardBg,
                padding: "clamp(20px, 3vw, 30px)",
                borderRadius: "15px",
                maxWidth: "500px",
                width: "100%",
                maxHeight: "90vh",
                overflowY: "auto",
                boxShadow: themeStyles.shadow,
                border: `1px solid ${themeStyles.cardBorder}`,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <h2 style={{ margin: 0, color: themeStyles.textColor, fontSize: "clamp(1.1rem, 1.3vw, 1.4rem)" }}>Edit Task</h2>
                  <button
                    onClick={() => setShowModal(false)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: themeStyles.textColor,
                      fontSize: "1.3rem",
                      cursor: "pointer",
                    }}
                  >
                    <FaTimes />
                  </button>
                </div>
                
                <input
                  type="text"
                  placeholder="Task Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    marginBottom: "12px",
                    borderRadius: "10px",
                    border: `1px solid ${themeStyles.inputBorder}`,
                    background: themeStyles.inputBg,
                    color: themeStyles.textColor,
                    fontSize: "clamp(0.9rem, 1vw, 1rem)",
                    boxSizing: "border-box",
                  }}
                />

                <textarea
                  placeholder="Task Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    height: "80px",
                    borderRadius: "10px",
                    border: `1px solid ${themeStyles.inputBorder}`,
                    background: themeStyles.inputBg,
                    color: themeStyles.textColor,
                    fontSize: "clamp(0.9rem, 1vw, 1rem)",
                    resize: "vertical",
                    boxSizing: "border-box",
                    fontFamily: "inherit",
                  }}
                />

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "4px", fontWeight: "500", color: themeStyles.textSecondary, fontSize: "clamp(0.8rem, 0.9vw, 0.9rem)" }}>
                      Priority
                    </label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "10px",
                        border: `1px solid ${themeStyles.inputBorder}`,
                        background: themeStyles.inputBg,
                        color: themeStyles.textColor,
                        fontSize: "clamp(0.85rem, 0.95vw, 1rem)",
                        boxSizing: "border-box",
                      }}
                    >
                      <option value="Low">🟢 Low</option>
                      <option value="Medium">🟡 Medium</option>
                      <option value="High">🔴 High</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "4px", fontWeight: "500", color: themeStyles.textSecondary, fontSize: "clamp(0.8rem, 0.9vw, 0.9rem)" }}>
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "10px",
                        border: `1px solid ${themeStyles.inputBorder}`,
                        background: themeStyles.inputBg,
                        color: themeStyles.textColor,
                        fontSize: "clamp(0.85rem, 0.95vw, 1rem)",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={updateTask}
                    style={{
                      flex: 1,
                      padding: "10px",
                      background: themeStyles.buttonBg,
                      color: "white",
                      border: "none",
                      borderRadius: "10px",
                      cursor: "pointer",
                      fontWeight: "600",
                      transition: "all 0.3s ease",
                      fontSize: "clamp(0.85rem, 0.95vw, 1rem)",
                    }}
                  >
                    Update Task
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    style={{
                      padding: "10px 16px",
                      background: "transparent",
                      color: themeStyles.textColor,
                      border: `1px solid ${themeStyles.cardBorder}`,
                      borderRadius: "10px",
                      cursor: "pointer",
                      fontSize: "clamp(0.85rem, 0.95vw, 1rem)",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ==================== FLOATING CREATE BUTTON ==================== */}
      <button
        onClick={() => document.getElementById('createTaskSection').scrollIntoView({ behavior: 'smooth' })}
        style={{
          position: "fixed",
          bottom: "clamp(20px, 3vh, 30px)",
          right: "clamp(20px, 3vw, 30px)",
          width: "clamp(50px, 5vw, 60px)",
          height: "clamp(50px, 5vw, 60px)",
          borderRadius: "50%",
          background: themeStyles.buttonBg,
          color: "white",
          border: "none",
          fontSize: "clamp(1.5rem, 2vw, 2rem)",
          cursor: "pointer",
          boxShadow: `0 4px 20px ${themeStyles.buttonBg}60`,
          transition: "all 0.3s ease",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = "scale(1.1)";
          e.target.style.boxShadow = `0 6px 30px ${themeStyles.buttonBg}80`;
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = "scale(1)";
          e.target.style.boxShadow = `0 4px 20px ${themeStyles.buttonBg}60`;
        }}
      >
        <FaPlus />
      </button>

      {/* ==================== RESPONSIVE STYLES ==================== */}
      <style>
        {`
          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }

          /* Mobile Responsive */
          @media (max-width: 768px) {
            .sidebar {
              display: none !important;
            }
            .mobile-header {
              display: flex !important;
            }
            .main-content {
              padding: 16px !important;
              max-height: none !important;
              overflow-y: visible !important;
            }
            .stat-card {
              padding: 12px 14px !important;
            }
            .profile-card {
              display: none !important;
            }
          }

          @media (min-width: 769px) {
            .mobile-header {
              display: none !important;
            }
          }

          @media (max-width: 480px) {
            .main-content {
              padding: 12px !important;
            }
            .stat-card {
              padding: 10px 12px !important;
            }
            .stat-card h2 {
              font-size: 1.3rem !important;
            }
          }
        `}
      </style>
    </div>
  );
}

export default Dashboard;