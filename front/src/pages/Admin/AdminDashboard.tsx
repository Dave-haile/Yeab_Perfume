import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Perfume,
  User,
  StaffRequest,
  Gender,
  Category,
  DayNight,
  Season,
  StockStatus,
  UserRole,
} from "../../types";
import {
  perfumeService,
  userService,
  requestService,
  uploadService,
} from "../../lib/api";
import { safeStorage } from "../../lib/storage";
import {
  Sparkles,
  Inbox,
  Users,
  LogOut,
  Search,
  Plus,
  Trash2,
  Edit2,
  X,
  Loader2,
  Upload,
  AlertTriangle,
  UserX,
  Sun,
  Moon,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { imageUrl } from "@/src/lib/utils";

export default function AdminDashboard() {
  const navigate = useNavigate();

  // Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Navigation tabs: 'perfumes' | 'requests' | 'users'
  const [activeTab, setActiveTab] = useState<"perfumes" | "requests" | "users">(
    "perfumes",
  );

  // Data lists
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [staffUsers, setStaffUsers] = useState<User[]>([]);
  const [requests, setRequests] = useState<StaffRequest[]>([]);

  // Loading states
  const [loadingPerfumes, setLoadingPerfumes] = useState(false);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Search & Filter state for perfume table
  const [searchQuery, setSearchQuery] = useState("");
  const [filterGender, setFilterGender] = useState<string>("All");
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [filterStock, setFilterStock] = useState<string>("All");

  // Filter requests history vs pending
  const [showResolvedRequests, setShowResolvedRequests] = useState(false);

  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPerfume, setEditingPerfume] = useState<Partial<Perfume> | null>(
    null,
  );
  const [imageUploading, setImageUploading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);

  // User Page creation form
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newUserRole, setNewUserRole] = useState<UserRole>("staff");

  // Notifications
  const [toasts, setToasts] = useState<
    { id: string; type: "success" | "error"; message: string }[]
  >([]);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Sync state with global dark mode
  const [isAdminDark, setIsAdminDark] = useState<boolean>(() => {
    const saved = safeStorage.getItem("isDarkMode");
    return saved !== null ? saved === "true" : true;
  });

  useEffect(() => {
    if (isAdminDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isAdminDark]);

  const toggleAdminDark = () => {
    const nextVal = !isAdminDark;
    setIsAdminDark(nextVal);
    safeStorage.setItem("isDarkMode", String(nextVal));
  };

  // Trigger transient notice
  const triggerToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  // Auth intercept redirection listener
  useEffect(() => {
    const handleUnauthorized = () => {
      triggerToast("Session expired or unauthorized. Logging out.", "error");
      safeStorage.removeItem("adminToken");
      safeStorage.removeItem("adminUser");
      navigate("/admin/login");
    };

    window.addEventListener("admin-unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("admin-unauthorized", handleUnauthorized);
    };
  }, [navigate]);

  // Load user details
  useEffect(() => {
    const token = safeStorage.getItem("adminToken");
    const userStr = safeStorage.getItem("adminUser");
    if (!token || !userStr) {
      safeStorage.removeItem("adminToken");
      safeStorage.removeItem("adminUser");
      navigate("/admin/login");
      return;
    }
    try {
      setCurrentUser(JSON.parse(userStr));
    } catch {
      safeStorage.removeItem("adminToken");
      safeStorage.removeItem("adminUser");
      navigate("/admin/login");
    }
  }, [navigate]);

  // Fetch initial resources
  useEffect(() => {
    fetchPerfumes();
    fetchRequests();
    fetchUsers();
  }, []);

  const fetchPerfumes = async () => {
    setLoadingPerfumes(true);
    try {
      const data = await perfumeService.fetchAll();
      setPerfumes(data);
    } catch (err: any) {
      triggerToast("Failed to fetch perfume list.", "error");
    } finally {
      setLoadingPerfumes(false);
    }
  };

  const fetchRequests = async () => {
    setLoadingRequests(true);
    try {
      const data = await requestService.fetchAll();
      setRequests(data);
    } catch {
      triggerToast("Failed to retrieve station request stream.", "error");
    } finally {
      setLoadingRequests(false);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const data = await userService.fetchAll();
      setStaffUsers(data);
    } catch {
      triggerToast("Failed to fetch workforce accounts list.", "error");
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleLogout = () => {
    safeStorage.removeItem("adminToken");
    safeStorage.removeItem("adminUser");
    triggerToast("Logout successful.", "success");
    navigate("/admin/login");
  };

  // Perform operations
  const handleResolveRequest = async (id: string) => {
    setActionLoading(true);
    try {
      await requestService.resolve(id);
      triggerToast("Customer request resolved successfully.");
      await fetchRequests();
    } catch {
      triggerToast("Failed to resolve request.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeletePerfume = async (id: string, name: string) => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${name}? This action cannot be undone.`,
      )
    ) {
      return;
    }
    setActionLoading(true);
    try {
      await perfumeService.delete(id);
      triggerToast(`${name} removed from active gallery.`);
      await fetchPerfumes();
    } catch {
      triggerToast("Error deleting perfume from server database.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim() || !newPassword.trim()) {
      triggerToast("Please provide both name and security password.", "error");
      return;
    }
    setActionLoading(true);
    try {
      await userService.create(newUsername, newPassword, newUserRole);
      triggerToast(`Account for ${newUsername} successfully provisioned.`);
      setNewUsername("");
      setNewPassword("");
      await fetchUsers();
    } catch (err: any) {
      triggerToast(err.message || "Failed to create staff account.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async (targetUser: User) => {
    if (!currentUser) return;

    // Safety checks
    if (
      targetUser.id === currentUser.id ||
      targetUser.username === currentUser.username
    ) {
      triggerToast(
        "Failure: You are strictly forbidden from deleting your own active account.",
        "error",
      );
      return;
    }

    const adminsCount = staffUsers.filter((u) => u.role === "admin").length;
    if (targetUser.role === "admin" && adminsCount <= 1) {
      triggerToast(
        "Failure: Security override. You cannot delete the ultimate administrator account.",
        "error",
      );
      return;
    }

    if (
      !window.confirm(
        `Decommission staff account for "${targetUser.username}"?`,
      )
    ) {
      return;
    }

    setActionLoading(true);
    try {
      await userService.delete(targetUser.id);
      triggerToast(`Account "${targetUser.username}" deactivated.`);
      await fetchUsers();
    } catch {
      triggerToast("Failed to delete user account.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Immediately Upload Cover Image
  const handleMainImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploading(true);
    try {
      const uploadedUrl = await uploadService.uploadImage(file);
      setEditingPerfume((prev) => {
        if (!prev) return prev;
        return { ...prev, mainImage: uploadedUrl };
      });
      triggerToast("Flask asset upload complete!");
    } catch {
      triggerToast("Upload failed, utilizing dynamic mock path.", "error");
    } finally {
      setImageUploading(false);
    }
  };

  // Immediately Add Gallery Images
  const handleGalleryImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setGalleryUploading(true);
    try {
      const urls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const itemUrl = await uploadService.uploadImage(files[i]);
        urls.push(itemUrl);
      }
      setEditingPerfume((prev) => {
        if (!prev) return prev;
        const currentGallery = prev.galleryImages || [];
        return { ...prev, galleryImages: [...currentGallery, ...urls] };
      });
      triggerToast(`Added ${files.length} view(s) to formulation gallery!`);
    } catch {
      triggerToast("Problem uploading secondary library files.", "error");
    } finally {
      setGalleryUploading(false);
    }
  };

  const removeGalleryImage = (indexToRemove: number) => {
    setEditingPerfume((prev) => {
      if (!prev) return prev;
      const currentGallery = prev.galleryImages || [];
      return {
        ...prev,
        galleryImages: currentGallery.filter((_, idx) => idx !== indexToRemove),
      };
    });
  };

  // Open Form
  const triggerAddForm = () => {
    setEditingPerfume({
      name: "",
      brand: "",
      code: "P-W" + Math.floor(10 + Math.random() * 89),
      price: 2500,
      gender: "Unisex",
      category: "Perfume",
      description: "Crafted with handpicked raw materials.",
      rating: 4.5,
      mainImage: "",
      galleryImages: [],
      accords: [
        { name: "Woody", value: 70, color: "#8d6e63" },
        { name: "Spicy", value: 30, color: "#d84315" },
      ],
      fragranceProfile: {
        longevity: "8 Hours",
        projection: "Strong",
        sillage: "Heavy",
      },
      dayNight: "Both",
      seasons: ["Spring", "Autumn"],
      notes: {
        top: [
          {
            name: "Mandarin Orange",
            iconUrl:
              "https://images.unsplash.com/photo-1541643600914-78b084683601?w=100",
          },
        ],
        middle: [
          {
            name: "Turkish Rose",
            iconUrl:
              "https://images.unsplash.com/photo-1558223635-a6a9be78efaa?w=100",
          },
        ],
        base: [
          {
            name: "Indonesian Patchouli",
            iconUrl:
              "https://images.unsplash.com/photo-1550605995-1c390543f324?w=100",
          },
        ],
      },
      stockStatus: "In Stock",
    });
    setIsFormOpen(true);
  };

  const triggerEditForm = (item: Perfume) => {
    setEditingPerfume({
      ...item,
      accords: item.accords ? [...item.accords] : [],
      seasons: item.seasons ? [...item.seasons] : [],
      notes: {
        top: item.notes?.top ? [...item.notes.top] : [],
        middle: item.notes?.middle ? [...item.notes.middle] : [],
        base: item.notes?.base ? [...item.notes.base] : [],
      },
      galleryImages: item.galleryImages ? [...item.galleryImages] : [],
      stockStatus: item.stockStatus || "In Stock",
    });
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPerfume) return;

    if (
      !editingPerfume.name?.trim() ||
      !editingPerfume.brand?.trim() ||
      !editingPerfume.code?.trim()
    ) {
      triggerToast(
        "Verification failed: Please feed name, code, and designer brand.",
        "error",
      );
      return;
    }

    setActionLoading(true);
    try {
      if (editingPerfume.id) {
        // Update edit
        await perfumeService.update(
          editingPerfume.id,
          editingPerfume as Perfume,
        );
        triggerToast(`Updated fragrance: ${editingPerfume.name}`);
      } else {
        // Save new
        const completion: Perfume = {
          ...(editingPerfume as Perfume),
          id: String(Date.now()),
        };
        await perfumeService.create(completion);
        triggerToast(`New fragrance registered: ${editingPerfume.name}`);
      }
      setIsFormOpen(false);
      setEditingPerfume(null);
      await fetchPerfumes();
    } catch {
      triggerToast("Failed to save changes into Cloud DB index.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Form Row Helpers
  const addAccordRow = () => {
    const name = window.prompt(
      "Type accord structural category (e.g. Amber, Citrus, Floral):",
    );
    if (!name?.trim()) return;
    const valueNum = Number(window.prompt("Feed ratio score (0 - 100):")) || 50;
    const hex =
      window.prompt(
        "Hex color overlay (or leave blank for custom):",
        "#8a8a8a",
      ) || "#c19253";

    setEditingPerfume((prev) => {
      if (!prev) return prev;
      const currentAccords = prev.accords || [];
      return {
        ...prev,
        accords: [
          ...currentAccords,
          {
            name: name.trim(),
            value: Math.min(100, Math.max(0, valueNum)),
            color: hex,
          },
        ],
      };
    });
  };

  const removeAccordRow = (index: number) => {
    setEditingPerfume((prev) => {
      if (!prev) return prev;
      const currentAccords = prev.accords || [];
      return {
        ...prev,
        accords: currentAccords.filter((_, idx) => idx !== index),
      };
    });
  };

  const addNoteRow = (tier: "top" | "middle" | "base") => {
    const rawName = window.prompt(
      `Material designation to add in ${tier.toUpperCase()} notes:`,
    );
    if (!rawName?.trim()) return;
    const rawUrl = window.prompt(
      "Material visual reference (Unsplash URL or empty for default):",
      "https://images.unsplash.com/photo-1558223635-a6a9be78efaa?w=100",
    );

    setEditingPerfume((prev) => {
      if (!prev) return prev;
      const notes = prev.notes
        ? { ...prev.notes }
        : { top: [], middle: [], base: [] };
      const list = notes[tier] || [];
      notes[tier] = [
        ...list,
        {
          name: rawName.trim(),
          iconUrl:
            rawUrl ||
            "https://images.unsplash.com/photo-1558223635-a6a9be78efaa?w=100",
        },
      ];
      return { ...prev, notes };
    });
  };

  const removeNoteRow = (tier: "top" | "middle" | "base", index: number) => {
    setEditingPerfume((prev) => {
      if (!prev) return prev;
      const notes = prev.notes
        ? { ...prev.notes }
        : { top: [], middle: [], base: [] };
      const list = notes[tier] || [];
      notes[tier] = list.filter((_, idx) => idx !== index);
      return { ...prev, notes };
    });
  };

  const toggleFormSeason = (s: Season) => {
    setEditingPerfume((prev) => {
      if (!prev) return prev;
      const currentSeasons = prev.seasons || [];
      const updated = currentSeasons.includes(s)
        ? currentSeasons.filter((x) => x !== s)
        : [...currentSeasons, s];
      return { ...prev, seasons: updated };
    });
  };

  // Computation filters
  const filteredPerfumes = perfumes.filter((p) => {
    const matchesQuery =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGender = filterGender === "All" || p.gender === filterGender;
    const matchesCategory =
      filterCategory === "All" || p.category === filterCategory;
    const matchesStock = filterStock === "All" || p.stockStatus === filterStock;

    return matchesQuery && matchesGender && matchesCategory && matchesStock;
  });

  return (
    <div className="min-h-screen flex bg-[#faf8f5] dark:bg-black text-slate-800 dark:text-slate-100 font-sans antialiased overflow-hidden transition-colors duration-300">
      {/* Toast HUD Overlay */}
      <div className="fixed top-5 right-5 z-[9999] p-2 space-y-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, scale: 0.9, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: 20 }}
              className={`p-4 rounded-lg shadow-lg max-w-sm pointer-events-auto border flex items-start gap-2.5 font-mono text-[11px] ${
                t.type === "success"
                  ? "bg-white dark:bg-zinc-900 border-slate-200 dark:border-[#c19253]/30 text-slate-800 dark:text-teal-400"
                  : "bg-white dark:bg-red-950/70 border-red-200 dark:border-red-900/40 text-rose-600 dark:text-red-400"
              }`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full mt-1 ${
                  t.type === "success" ? "bg-emerald-500" : "bg-red-500"
                }`}
              />
              <span className="flex-1 leading-normal tracking-tight font-sans text-xs">
                {t.message}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 1. COMPACT SIDEBAR LAYOUT */}
      <aside className="w-64 bg-white dark:bg-black border-r border-slate-200 dark:border-[#c19253]/20 flex flex-col justify-between shrink-0 select-none transition-colors duration-300 fixed left-0 top-0 h-screen">
        <div className="flex flex-col min-h-0">
          {/* Brand header */}
          <div className="p-6 border-b border-slate-200 dark:border-[#c19253]/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-slate-100 dark:bg-black border border-slate-200 dark:border-[#c19253]/25 flex items-center justify-center text-[#c19253] dark:text-[#c19253] font-bold font-mono text-sm shadow-sm transition-colors duration-300">
                A
              </div>
              <div>
                <h2 className="text-sm font-bold tracking-wider leading-tight text-slate-800 dark:text-white uppercase">
                  Workspace
                </h2>
                <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
                  Management CLI
                </span>
              </div>
            </div>
          </div>

          {/* User role badged indicator */}
          {currentUser && (
            <div className="mx-4 my-6 p-4 bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#c19253]/20 rounded-lg flex items-center gap-3 transition-colors duration-300">
              <div className="w-8 h-8 bg-slate-100 dark:bg-black rounded-full flex items-center justify-center font-bold text-xs ring-1 ring-slate-200 dark:ring-[#c19253]/25 text-teal-650 dark:text-[#c19253] transition-colors font-serif">
                {currentUser.username[0]?.toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate leading-none mb-1">
                  {currentUser.username}
                </p>
                <span
                  className={`inline-block text-[8px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                    currentUser.role === "admin"
                      ? "bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 border border-red-200 dark:border-red-900/30"
                      : "bg-indigo-50 dark:bg-indigo-950/20 text-indigo-650 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/30"
                  }`}
                >
                  {currentUser.role}
                </span>
              </div>
            </div>
          )}

          {/* Internal Pages Navigation options */}
          <nav className="px-3 space-y-1">
            <button
              onClick={() => {
                setActiveTab("perfumes");
                setIsFormOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-medium tracking-wide transition-all ${
                activeTab === "perfumes"
                  ? "bg-slate-100 dark:bg-[#c19253]/15 text-teal-650 dark:text-[#c19253] font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-[#c19253] hover:bg-slate-100/50 dark:hover:bg-white/5"
              }`}
            >
              <Sparkles size={16} />
              Perfumes Collection
            </button>
            <button
              onClick={() => {
                setActiveTab("requests");
                setIsFormOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-medium tracking-wide transition-all relative ${
                activeTab === "requests"
                  ? "bg-slate-100 dark:bg-[#c19253]/15 text-teal-650 dark:text-[#c19253] font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-[#c19253] hover:bg-slate-100/50 dark:hover:bg-white/5"
              }`}
            >
              <Inbox size={16} />
              Customer Requests
              {requests.filter((r) => !r.resolved).length > 0 && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-rose-500 font-mono text-[9px] font-bold text-white px-1.5 py-0.5 rounded-md">
                  {requests.filter((r) => !r.resolved).length}
                </span>
              )}
            </button>
            {currentUser?.role === "admin" && (
              <button
                onClick={() => {
                  setActiveTab("users");
                  setIsFormOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-medium tracking-wide transition-all ${
                  activeTab === "users"
                    ? "bg-slate-100 dark:bg-[#c19253]/15 text-teal-650 dark:text-[#c19253] font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-[#c19253] hover:bg-slate-100/50 dark:hover:bg-white/5"
                }`}
              >
                <Users size={16} />
                User Accounts
              </button>
            )}
          </nav>
        </div>

        {/* Console Close or Kiosk Return */}
        <div className="p-4 border-t border-slate-200 dark:border-[#c19253]/20 space-y-2">
          <button
            onClick={() => navigate("/view/grid")}
            className="w-full text-center block bg-slate-50 hover:bg-slate-100 dark:bg-black dark:hover:bg-[#c19253]/10 border border-slate-200 dark:border-[#c19253]/30 rounded-lg py-2 text-[10px] font-mono uppercase tracking-widest text-[#c19253] transition-colors"
          >
            Launch Kiosk Screen
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold font-mono tracking-widest uppercase text-slate-500 dark:text-slate-450 hover:text-rose-650 dark:hover:text-rose-450 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all border border-dashed border-slate-200 dark:border-[#c19253]/20"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* 2. MAIN HUB WORKSPACE SCREEN */}
      <main className="ml-64 min-h-screen flex flex-col flex-1 min-w-0 overflow-hidden relative bg-[#faf8f5] dark:bg-black transition-colors duration-300">
        {/* Core Loading State Cover */}
        {actionLoading && (
          <div className="absolute inset-0 bg-[#faf8f5]/65 dark:bg-black/60 backdrop-blur-[1.5px] z-50 flex flex-col items-center justify-center gap-3 select-none">
            <Loader2
              className="animate-spin text-teal-600 dark:text-teal-400"
              size={32}
            />
            <span className="text-xs font-mono tracking-widest text-slate-500 dark:text-slate-400 uppercase">
              Executing Cloud Operations...
            </span>
          </div>
        )}

        {/* UPPER STATUS BAR */}
        <header className="h-16 border-b border-slate-200 dark:border-[#c19253]/20 px-8 flex items-center justify-between shrink-0 select-none bg-white dark:bg-black transition-colors duration-300">
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider pl-1">
              Atelier Workspace Dashboard
            </h1>
            <span className="text-[10px] text-slate-400 dark:text-slate-500">
              /
            </span>
            <span className="text-[10px] uppercase font-mono tracking-widest text-teal-600 dark:text-[#c19253] font-bold">
              {activeTab}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleAdminDark}
              className="p-1.5 px-3 rounded-lg border border-slate-200 dark:border-[#c19253]/30 text-slate-600 dark:text-[#c19253] hover:text-slate-900 dark:hover:text-white bg-slate-50 dark:bg-black text-[10px] font-mono flex items-center gap-1.5 transition-colors shadow-sm font-bold uppercase tracking-wider"
              title="Toggle theme mode"
            >
              {isAdminDark ? (
                <>
                  <Sun size={12} className="text-amber-500" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon size={12} className="text-[#c19253]" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
            <span className="hidden sm:inline-block text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase">
              Current Zone: Europe/West (UTC)
            </span>
          </div>
        </header>

        {/* WORK CONSOLE VIEW CONTENT */}
        <div
          className={`flex-1 overflow-y-auto relative ${isFormOpen && activeTab === "perfumes" ? "p-0" : "p-8"}`}
        >
          <AnimatePresence mode="wait">
            {/* TAB 1: PERFUMES COLLECTION */}
            {activeTab === "perfumes" && !isFormOpen && (
              <motion.div
                key="perfumes-module"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Search & Actions bar */}
                <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-white dark:bg-black border border-slate-200 dark:border-[#c19253]/20 p-5 rounded-xl shadow-md select-none transition-colors duration-305">
                  {/* Search bar */}
                  <div className="flex-1 relative max-w-md">
                    <input
                      type="text"
                      className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#c19253]/25 rounded-lg pl-10 pr-4 py-2 text-xs font-sans text-slate-800 dark:text-white focus:border-slate-450 dark:focus:border-[#c19253]/60 outline-none placeholder-slate-450 dark:placeholder-zinc-500 font-medium transition-colors"
                      placeholder="Search name, designer brand or scent code..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                      size={14}
                    />
                  </div>

                  {/* Multi-Filter parameters */}
                  <div className="flex gap-2.5 overflow-x-auto select-none py-1 sm:py-0">
                    <select
                      className="bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#c19253]/25 text-xs text-slate-705 dark:text-[#c19253] rounded-lg px-2.5 py-1.5 focus:border-slate-400 dark:focus:border-[#c19253]/55 outline-none font-sans"
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                    >
                      <option value="All">All Categories</option>
                      <option value="Perfume">Signature</option>
                      <option value="Brand Perfume">Designer</option>
                      <option value="Luxury Perfume">Private Blend</option>
                    </select>

                    <select
                      className="bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#c19253]/25 text-xs text-slate-705 dark:text-[#c19253] rounded-lg px-2.5 py-1.5 focus:border-slate-400 dark:focus:border-[#c19253]/55 outline-none font-sans"
                      value={filterGender}
                      onChange={(e) => setFilterGender(e.target.value)}
                    >
                      <option value="All">All Genders</option>
                      <option value="Male">Masculine</option>
                      <option value="Female">Feminine</option>
                      <option value="Unisex">Unisex</option>
                      <option value="Kids">Children</option>
                    </select>

                    <select
                      className="bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#c19253]/25 text-xs text-slate-705 dark:text-[#c19253] rounded-lg px-2.5 py-1.5 focus:border-slate-400 dark:focus:border-[#c19253]/55 outline-none font-sans"
                      value={filterStock}
                      onChange={(e) => setFilterStock(e.target.value)}
                    >
                      <option value="All">All Stock</option>
                      <option value="In Stock">In Stock</option>
                      <option value="Low Stock">Low Stock</option>
                      <option value="Out of Stock">Out of Stock</option>
                    </select>

                    <button
                      onClick={triggerAddForm}
                      className="flex items-center gap-1.5 bg-black hover:bg-neutral-850 dark:bg-[#c19253] dark:hover:bg-[#FAF9F5] text-white dark:text-black font-bold rounded-lg px-4 py-1.5 text-xs transition-colors shrink-0 shadow-sm"
                    >
                      <Plus size={14} /> Register Fragrance
                    </button>
                  </div>
                </div>

                {/* table list */}
                {loadingPerfumes ? (
                  <div className="flex py-20 flex-col items-center justify-center gap-2">
                    <Loader2
                      className="animate-spin text-slate-500"
                      size={24}
                    />
                    <span className="text-xs font-mono text-slate-500">
                      Querying collection archive...
                    </span>
                  </div>
                ) : filteredPerfumes.length === 0 ? (
                  <div className="border border-slate-200 dark:border-zinc-800 border-dashed rounded-xl p-16 text-center select-none bg-slate-100/30 dark:bg-zinc-900/10">
                    <p className="text-slate-500 text-sm">
                      No formulations match the current parameters.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setFilterCategory("All");
                        setFilterGender("All");
                        setFilterStock("All");
                      }}
                      className="text-[#c19253] text-xs font-mono mt-3 hover:underline"
                    >
                      Reset active queries
                    </button>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-black border border-slate-200 dark:border-[#c19253]/25 rounded-xl overflow-hidden shadow-lg select-none">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-[#c19253]/20 text-slate-500 dark:text-[#c19253]/80 font-mono text-[10px] uppercase font-bold tracking-widest bg-slate-50 dark:bg-black">
                            <th className="py-4.5 px-6">Product details</th>
                            <th className="py-4.5 px-6">Ref Code</th>
                            <th className="py-4.5 px-6">Category</th>
                            <th className="py-4.5 px-6">Gender</th>
                            <th className="py-4.5 px-6 text-right">
                              Price (ETB)
                            </th>
                            <th className="py-4.5 px-6 text-center">
                              Stock status
                            </th>
                            <th className="py-4.5 px-6 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-150 dark:divide-[#c19253]/15 font-sans text-xs">
                          {filteredPerfumes.map((p) => (
                            <tr
                              key={p.id}
                              className="hover:bg-slate-50 dark:hover:bg-[#c19253]/5 transition-colors"
                            >
                              <td className="py-4 px-6">
                                <div className="flex items-center gap-4">
                                  <div className="w-11 h-11 shrink-0 bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#c19253]/20 rounded-lg p-1 flex items-center justify-center overflow-hidden">
                                    <img
                                      src={imageUrl(p.mainImage)}
                                      alt=""
                                      className="max-w-full max-h-full object-contain"
                                    />
                                  </div>
                                  <div className="min-w-0">
                                    <span className="text-[10px] font-mono tracking-widest font-bold text-slate-400 dark:text-zinc-500 uppercase">
                                      {p.brand}
                                    </span>
                                    <h4 className="text-sm font-bold text-slate-800 dark:text-white leading-tight">
                                      {p.name}
                                    </h4>
                                  </div>
                                </div>
                              </td>

                              <td className="py-4 px-6 font-mono font-bold text-slate-500 dark:text-zinc-400">
                                {p.code}
                              </td>

                              <td className="py-4 px-6">
                                <span className="text-slate-700 dark:text-zinc-300 text-[11px] font-medium">
                                  {p.category === "Perfume"
                                    ? "Signature"
                                    : p.category === "Brand Perfume"
                                      ? "Designer"
                                      : "Private Blend"}
                                </span>
                              </td>

                              <td className="py-4 px-6">
                                <span
                                  className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-mono uppercase font-bold tracking-wider ${
                                    p.gender === "Male"
                                      ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400"
                                      : p.gender === "Female"
                                        ? "bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400"
                                        : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                                  }`}
                                >
                                  {p.gender}
                                </span>
                              </td>

                              <td className="py-4 px-6 text-right font-mono font-bold text-teal-600 dark:text-teal-400 text-sm">
                                {p.price.toLocaleString()}
                              </td>

                              <td className="py-4 px-6 text-center">
                                <span
                                  className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider ${
                                    p.stockStatus === "In Stock"
                                      ? "bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/30"
                                      : p.stockStatus === "Low Stock"
                                        ? "bg-amber-50 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/30"
                                        : "bg-rose-50 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/30"
                                  }`}
                                >
                                  {p.stockStatus || "In Stock"}
                                </span>
                              </td>

                              <td className="py-4 px-6 text-center">
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    onClick={() => triggerEditForm(p)}
                                    className="p-1.5 bg-slate-50 hover:bg-teal-50 border border-slate-200 dark:bg-zinc-800 dark:hover:bg-teal-500/25 dark:border-zinc-700/60 dark:hover:border-teal-500/30 text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-300 rounded-md transition-colors"
                                    title="Edit specifications"
                                  >
                                    <Edit2 size={13} />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeletePerfume(p.id, p.name)
                                    }
                                    className="p-1.5 bg-slate-50 hover:bg-rose-55 border border-slate-200 dark:bg-zinc-800 dark:hover:bg-rose-500/25 dark:border-zinc-700/60 dark:hover:border-rose-500/30 text-[#f43f5e] dark:text-[#f43f5e] rounded-md transition-colors"
                                    title="Retire fragrance"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB 2: REFINE PERFUME FORM (ADD / EDIT) */}
            {activeTab === "perfumes" && isFormOpen && editingPerfume && (
              <motion.div
                key="perfume-edit-form"
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.99 }}
                transition={{ duration: 0.2 }}
                className="w-full min-h-full space-y-6 select-none bg-white dark:bg-black p-8 transition-colors"
              >
                {/* Header */}
                <div className="flex justify-between items-center border-b border-slate-150 dark:border-[#c19253]/20 pb-5">
                  <div>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-[#c19253] uppercase tracking-wider font-serif">
                      {editingPerfume.id
                        ? "Refine Scent Specification"
                        : "Register Scent Specification"}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                      Set formulation aspects, raw chords, sillage metrics, and
                      graphics.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setIsFormOpen(false);
                      setEditingPerfume(null);
                    }}
                    className="w-8 h-8 rounded-md bg-slate-100 dark:bg-black border border-slate-200 dark:border-[#c19253]/30 flex items-center justify-center text-slate-500 dark:text-[#c19253] hover:text-slate-800 dark:hover:text-white dark:hover:bg-[#c19253]/15 transition-colors"
                  >
                    <X size={15} />
                  </button>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-8 text-xs">
                  {/* Row: Basics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-slate-500 dark:text-[#c19253]/80 mb-1.5">
                        Fragrance Name
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#c19253]/25 rounded-lg px-4 py-2.5 outline-none text-slate-800 dark:text-white focus:border-slate-400 dark:focus:border-[#c19253]/60 transition-colors bg-white"
                        value={editingPerfume.name || ""}
                        onChange={(e) =>
                          setEditingPerfume({
                            ...editingPerfume,
                            name: e.target.value,
                          })
                        }
                        placeholder="e.g. Cedarwood Gold Absolute"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-slate-500 dark:text-[#c19253]/80 mb-1.5">
                        Brand House / Designer
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#c19253]/25 rounded-lg px-4 py-2.5 outline-none text-slate-800 dark:text-white focus:border-slate-400 dark:focus:border-[#c19253]/60 transition-colors bg-white"
                        value={editingPerfume.brand || ""}
                        onChange={(e) =>
                          setEditingPerfume({
                            ...editingPerfume,
                            brand: e.target.value,
                          })
                        }
                        placeholder="e.g. Private Atelier"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-slate-500 dark:text-[#c19253]/80 mb-1.5">
                        Scent Code
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#c19253]/25 rounded-lg px-4 py-2.5 outline-none text-slate-800 dark:text-white focus:border-slate-400 dark:focus:border-[#c19253]/60 font-mono transition-colors bg-white"
                        value={editingPerfume.code || ""}
                        onChange={(e) =>
                          setEditingPerfume({
                            ...editingPerfume,
                            code: e.target.value,
                          })
                        }
                        placeholder="e.g. P-WA40"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-slate-500 dark:text-[#c19253]/80 mb-1.5">
                        Price tag (ETB)
                      </label>
                      <input
                        type="number"
                        required
                        className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#c19253]/25 rounded-lg px-4 py-2.5 outline-none text-slate-800 dark:text-white focus:border-slate-400 dark:focus:border-[#c19253]/60 font-mono transition-colors bg-white"
                        value={editingPerfume.price || 0}
                        onChange={(e) =>
                          setEditingPerfume({
                            ...editingPerfume,
                            price: Number(e.target.value) || 0,
                          })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-slate-500 dark:text-[#c19253]/80 mb-1.5">
                        Collection Category
                      </label>
                      <select
                        className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#c19253]/25 rounded-lg px-3 py-2.5 outline-none text-slate-800 dark:text-white focus:border-slate-400 dark:focus:border-[#c19253]/60 transition-colors bg-white"
                        value={editingPerfume.category}
                        onChange={(e) =>
                          setEditingPerfume({
                            ...editingPerfume,
                            category: e.target.value as Category,
                          })
                        }
                      >
                        <option value="Perfume">Signature</option>
                        <option value="Brand Perfume">Designer</option>
                        <option value="Luxury Perfume">Private Blend</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-slate-500 dark:text-[#c19253]/80 mb-1.5">
                        Target Gender
                      </label>
                      <select
                        className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#c19253]/25 rounded-lg px-3 py-2.5 outline-none text-slate-800 dark:text-white focus:border-slate-400 dark:focus:border-[#c19253]/60 transition-colors bg-white"
                        value={editingPerfume.gender}
                        onChange={(e) =>
                          setEditingPerfume({
                            ...editingPerfume,
                            gender: e.target.value as Gender,
                          })
                        }
                      >
                        <option value="Male">Masculine</option>
                        <option value="Female">Feminine</option>
                        <option value="Unisex">Unisex</option>
                        <option value="Kids">Children</option>
                      </select>
                    </div>
                  </div>
                  {/* Wear Settings & Stock */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-slate-500 dark:text-[#c19253]/80 mb-1.5">
                        Optimal Wear Hour
                      </label>
                      <select
                        className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#c19253]/25 rounded-lg px-3 py-2.5 outline-none text-slate-800 dark:text-white focus:border-slate-400 dark:focus:border-[#c19253]/60 transition-colors bg-white"
                        value={editingPerfume.dayNight}
                        onChange={(e) =>
                          setEditingPerfume({
                            ...editingPerfume,
                            dayNight: e.target.value as DayNight,
                          })
                        }
                      >
                        <option value="Day">Day Only</option>
                        <option value="Night">Night Only</option>
                        <option value="Both">Day and Night</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-slate-500 dark:text-[#c19253]/80 mb-1.5">
                        Current Stock Status
                      </label>
                      <select
                        className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#c19253]/25 rounded-lg px-4 py-2.5 outline-none text-slate-800 dark:text-white focus:border-slate-400 dark:focus:border-[#c19253]/60 transition-colors bg-white"
                        value={editingPerfume.stockStatus || "In Stock"}
                        onChange={(e) =>
                          setEditingPerfume({
                            ...editingPerfume,
                            stockStatus: e.target.value as StockStatus,
                          })
                        }
                      >
                        <option value="In Stock">In Stock</option>
                        <option value="Low Stock">Low Stock</option>
                        <option value="Out of Stock">Out of Stock</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-slate-500 dark:text-[#c19253]/80 mb-1.5">
                        Public Rating (0.0 - 5.0)
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min="1"
                          max="5"
                          step="0.1"
                          className="flex-1 accent-[#c19253] cursor-pointer h-2 bg-slate-100 dark:bg-black border-0"
                          value={editingPerfume.rating || 4.5}
                          onChange={(e) =>
                            setEditingPerfume({
                              ...editingPerfume,
                              rating: Number(e.target.value),
                            })
                          }
                        />
                        <span className="font-mono font-bold text-[#c19253] dark:text-[#c19253] w-8 text-right text-xs">
                          {editingPerfume.rating || 4.5} ★
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Multi-select Wear Seasons */}
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-slate-500 dark:text-[#c19253]/80 mb-2">
                      Wear Season Suitability (Select Multi-choice)
                    </label>
                    <div className="grid grid-cols-4 gap-2.5">
                      {(
                        ["Winter", "Spring", "Summer", "Autumn"] as Season[]
                      ).map((season) => {
                        const active = editingPerfume.seasons?.includes(season);
                        return (
                          <button
                            key={season}
                            type="button"
                            onClick={() => toggleFormSeason(season)}
                            className={`py-2 px-3 rounded-lg text-xs font-bold tracking-wide transition-all border ${
                              active
                                ? "bg-[#c19253]/10 dark:bg-[#c19253]/15 border-[#c19253]/40 dark:border-[#c19253]/40 text-[#c19253] dark:text-[#c19253] shadow-sm"
                                : "bg-slate-50 dark:bg-black border-slate-200 dark:border-[#c19253]/25 text-slate-500 hover:text-slate-800 dark:hover:text-[#c19253]"
                            }`}
                          >
                            {season}
                          </button>
                        );
                      })}
                    </div>
                  </div>{" "}
                  {/* Description Box */}
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-slate-500 dark:text-[#c19253]/80 mb-1.5">
                      Fragrance Narrative (Description)
                    </label>
                    <textarea
                      rows={3}
                      className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#c19253]/25 rounded-lg px-4 py-3 outline-none text-slate-800 dark:text-white focus:border-slate-400 dark:focus:border-[#c19253]/60 placeholder-slate-400 dark:placeholder-zinc-650 resize-none leading-relaxed transition-colors bg-white font-sans"
                      value={editingPerfume.description || ""}
                      onChange={(e) =>
                        setEditingPerfume({
                          ...editingPerfume,
                          description: e.target.value,
                        })
                      }
                      placeholder="Convey notes characteristics, material blends, etc."
                    />
                  </div>
                  {/* Image immediate uploads HUD */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#c19253]/20 rounded-lg transition-colors">
                    {/* Main Image upload */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-slate-500 dark:text-[#c19253]/80">
                          Flask Main Cover Image
                        </label>
                        {imageUploading && (
                          <span className="text-[10px] font-mono text-teal-600 dark:text-teal-400 flex items-center gap-1">
                            <Loader2 size={10} className="animate-spin" />{" "}
                            Uploading block...
                          </span>
                        )}
                      </div>
                      <div className="flex gap-4 items-center">
                        <div className="w-16 h-16 shrink-0 bg-slate-50 dark:bg-black ring-1 ring-slate-250 dark:ring-[#c19253]/20 rounded-lg p-1.5 flex items-center justify-center overflow-hidden transition-colors">
                          <img
                            src={imageUrl(editingPerfume.mainImage)}
                            alt=""
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                        <div className="flex-1">
                          <input
                            type="text"
                            className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#c19253]/25 rounded-lg px-3 py-1.5 outline-none font-mono text-[10px] text-slate-500 dark:text-slate-400 mb-2 focus:border-slate-400 transition-colors bg-white"
                            value={imageUrl(editingPerfume.mainImage) || ""}
                            onChange={(e) =>
                              setEditingPerfume({
                                ...editingPerfume,
                                mainImage: e.target.value,
                              })
                            }
                          />
                          <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            onChange={handleMainImageChange}
                          />
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-1 px-3 py-1 bg-slate-200 hover:bg-slate-300 dark:bg-black dark:hover:bg-[#c19253]/15 rounded border border-slate-300 dark:border-[#c19253]/30 text-[10px] font-bold tracking-wider uppercase transition-colors text-slate-700 dark:text-[#c19253] cursor-pointer"
                          >
                            <Upload size={12} /> Instant File Picker
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Secondary library/gallery images info */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-slate-500 dark:text-[#c19253]/80">
                          Gallery Views Section (Multiple uploads)
                        </label>
                        {galleryUploading && (
                          <span className="text-[10px] font-mono text-teal-600 dark:text-[#c19253] flex items-center gap-1">
                            <Loader2 size={10} className="animate-spin" />{" "}
                            Processing file gallery...
                          </span>
                        )}
                      </div>

                      <div className="flex gap-2 p-1 overflow-x-auto select-none bg-slate-100/20 dark:bg-black/20 max-h-16 rounded-md">
                        {editingPerfume.galleryImages?.map((img, i) => (
                          <div
                            key={i}
                            className="relative w-11 h-11 shrink-0 bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#c19253]/25 rounded p-0.5 group"
                          >
                            <img
                              src={imageUrl(img)}
                              alt=""
                              className="w-full h-full object-contain"
                            />
                            <button
                              type="button"
                              onClick={() => removeGalleryImage(i)}
                              className="absolute -top-1 -right-1 bg-red-600 hover:bg-red-500 rounded-full w-4.5 h-4.5 flex items-center justify-center text-[8px] text-white border border-slate-300 dark:border-slate-800 transition-colors cursor-pointer"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>

                      <div>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          ref={galleryInputRef}
                          style={{ display: "none" }}
                          onChange={handleGalleryImageChange}
                        />
                        <button
                          type="button"
                          onClick={() => galleryInputRef.current?.click()}
                          className="flex items-center gap-1 px-3 py-1 bg-slate-200 hover:bg-slate-350 dark:bg-slate-800 dark:hover:bg-slate-700 rounded border border-slate-300 dark:border-slate-705 text-[10px] font-bold tracking-wider uppercase transition-colors text-slate-700 dark:text-slate-300 cursor-pointer"
                        >
                          <Upload size={12} /> Add gallery assets
                        </button>
                      </div>
                    </div>
                  </div>{" "}
                  {/* Fragrance Sillage metrics profile */}
                  <div className="space-y-4 p-5 bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#c19253]/20 rounded-lg">
                    <h3 className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-600 dark:text-[#c19253]/90 border-b border-slate-200 dark:border-[#c19253]/20 pb-2">
                      Scent Longevity & Sillage Power Profile
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-slate-500 dark:text-[#c19253]/80 mb-1.5">
                          Longevity Duration (e.g., '10 Hours', '6 Hours')
                        </label>
                        <input
                          type="text"
                          required
                          className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#c19253]/25 rounded-lg px-4 py-2 outline-none text-slate-800 dark:text-white focus:border-slate-400 dark:focus:border-[#c19253]/60 transition-colors bg-white font-sans"
                          value={
                            editingPerfume.fragranceProfile?.longevity ||
                            "8 Hours"
                          }
                          onChange={(e) =>
                            setEditingPerfume({
                              ...editingPerfume,
                              fragranceProfile: {
                                ...editingPerfume.fragranceProfile!,
                                longevity: e.target.value,
                              },
                            })
                          }
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-slate-500 dark:text-[#c19253]/80 mb-1.5">
                          Scent Projection Scope (e.g., 'Heavy', 'Intimate',
                          'Moderate')
                        </label>
                        <input
                          type="text"
                          required
                          className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#c19253]/25 rounded-lg px-4 py-2 outline-none text-slate-800 dark:text-white focus:border-slate-400 dark:focus:border-[#c19253]/60 transition-colors bg-white font-sans"
                          value={
                            editingPerfume.fragranceProfile?.projection ||
                            "Strong"
                          }
                          onChange={(e) =>
                            setEditingPerfume({
                              ...editingPerfume,
                              fragranceProfile: {
                                ...editingPerfume.fragranceProfile!,
                                projection: e.target.value,
                              },
                            })
                          }
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-slate-500 dark:text-[#c19253]/80 mb-1.5">
                          Sillage Impression (e.g., 'Heavy Trail', 'Intimate
                          Cling')
                        </label>
                        <input
                          type="text"
                          required
                          className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#c19253]/25 rounded-lg px-4 py-2 outline-none text-slate-800 dark:text-white focus:border-slate-400 dark:focus:border-[#c19253]/60 transition-colors bg-white font-sans"
                          value={
                            editingPerfume.fragranceProfile?.sillage ||
                            "Moderate"
                          }
                          onChange={(e) =>
                            setEditingPerfume({
                              ...editingPerfume,
                              fragranceProfile: {
                                ...editingPerfume.fragranceProfile!,
                                sillage: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                  {/* Accords editor row section */}
                  <div className="space-y-4 p-5 bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#c19253]/20 rounded-lg">
                    <div className="flex justify-between items-center border-b border-slate-200 dark:border-[#c19253]/20 pb-2">
                      <h3 className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-600 dark:text-[#c19253]/90">
                        Constituent Accords spectrum composition
                      </h3>
                      <button
                        type="button"
                        onClick={addAccordRow}
                        className="text-[10px] font-mono uppercase font-bold text-[#c19253] dark:text-[#c19253] hover:underline"
                      >
                        + Append Accord Ratio row
                      </button>
                    </div>

                    {!editingPerfume.accords ||
                    editingPerfume.accords.length === 0 ? (
                      <p className="text-slate-500 italic text-[11px] py-1 pl-1">
                        No formulation accords configured. Click above to append
                        rows.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        {editingPerfume.accords.map((acc, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-slate-50 dark:bg-black ring-1 ring-slate-200 dark:ring-[#c19253]/20 p-3 rounded-lg border border-slate-255 dark:border-[#c19253]/20 shadow-sm"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className="w-5 h-5 rounded-md"
                                style={{ backgroundColor: acc.color }}
                              />
                              <div>
                                <span className="font-bold text-slate-700 dark:text-zinc-200 capitalize text-xs tracking-wide">
                                  {acc.name}
                                </span>
                                <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-mono">
                                  Score ratio: {acc.value}% &bull; Color:{" "}
                                  <span className="uppercase">{acc.color}</span>
                                </span>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeAccordRow(index)}
                              className="text-slate-400 hover:text-rose-500 p-1 rounded-md transition-colors hover:bg-rose-50 dark:hover:bg-rose-950/15 cursor-pointer"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>{" "}
                  {/* Notes groups top middle base */}
                  <div className="space-y-6 p-5 bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#c19253]/25 rounded-lg">
                    <h3 className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-600 dark:text-[#c19253]/90 border-b border-slate-255 dark:border-[#c19253]/20 pb-2">
                      Raw notes materials hierarchy formulation
                    </h3>

                    {(["top", "middle", "base"] as const).map((tier) => (
                      <div key={tier} className="space-y-2 pb-2 last:pb-0">
                        <div className="flex justify-between items-center text-[10px] font-mono uppercase font-bold tracking-wider">
                          <span
                            className={`${
                              tier === "top"
                                ? "text-amber-500 dark:text-amber-400"
                                : tier === "middle"
                                  ? "text-indigo-500 dark:text-indigo-400"
                                  : "text-slate-550"
                            }`}
                          >
                            {tier} materials (evaporates{" "}
                            {tier === "top"
                              ? "first"
                              : tier === "middle"
                                ? "mid-session"
                                : "slowly"}
                            )
                          </span>

                          <button
                            type="button"
                            onClick={() => addNoteRow(tier)}
                            className="text-[9px] hover:underline text-[#c19253] dark:text-[#c19253] hover:text-[#c19253]/80"
                          >
                            + Append ingredient
                          </button>
                        </div>

                        {!editingPerfume.notes?.[tier] ||
                        editingPerfume.notes[tier].length === 0 ? (
                          <p className="text-slate-400 italic text-[11px] pt-1 pl-1">
                            Empty list.
                          </p>
                        ) : (
                          <div className="flex flex-wrap gap-2 pt-1">
                            {editingPerfume.notes[tier].map((item, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-2 bg-slate-50 dark:bg-zinc-950 ring-1 ring-slate-150 dark:ring-zinc-850 border border-slate-200 dark:border-zinc-800 px-3 py-1.5 rounded-full"
                              >
                                <img
                                  src={item.iconUrl}
                                  alt=""
                                  className="w-4 h-4 rounded-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.src =
                                      "https://images.unsplash.com/photo-1558223635-a6a9be78efaa?w=100";
                                  }}
                                />
                                <span className="font-medium text-slate-700 dark:text-slate-350">
                                  {item.name}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => removeNoteRow(tier, i)}
                                  className="text-slate-400 hover:text-rose-500 ml-1 transition-colors cursor-pointer"
                                >
                                  <X size={11} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  {/* Actions Bar Footer */}
                  <div className="flex justify-end gap-3.5 border-t border-slate-200 dark:border-[#c19253]/20 pt-6 mt-8">
                    <button
                      type="button"
                      onClick={() => {
                        setIsFormOpen(false);
                        setEditingPerfume(null);
                      }}
                      className="px-6 py-3 border border-slate-200 dark:border-[#c19253]/30 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-[#c19253] rounded-lg font-mono text-[10px] uppercase font-bold tracking-widest hover:bg-slate-50 dark:hover:bg-[#c19253]/10 transition-colors"
                    >
                      Cancel Return
                    </button>
                    <button
                      type="submit"
                      className="px-8 py-3 bg-[#c19253] hover:bg-[#b08142] text-black rounded-lg text-xs font-bold uppercase tracking-widest transition-all shadow-sm"
                    >
                      Save Specifications
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* TAB 3: WORKSPACE CUSTOMER REQUESTS PIPELINE */}
            {activeTab === "requests" && (
              <motion.div
                key="requests-module"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Switch bar */}
                <div className="flex items-center justify-between bg-[#FAF9F5] dark:bg-black border border-slate-200 dark:border-[#c19253]/20 p-5 rounded-xl shadow-md select-none transition-colors">
                  <div>
                    <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                      Scent Playback Station Requests
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Monitor kiosk queries, scent playback streams, and station
                      dispatch alerts in real time.
                    </p>
                  </div>

                  {/* Switch queue filter resolved vs pending */}
                  <div className="flex bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#c19253]/25 p-1.5 rounded-lg select-none">
                    <button
                      onClick={() => setShowResolvedRequests(false)}
                      className={`px-4 py-1.5 rounded-md text-xs font-bold tracking-wide transition-all ${
                        !showResolvedRequests
                          ? "bg-[#c19253]/10 dark:bg-black text-[#c19253] dark:text-[#c19253] shadow ring-1 ring-[#c19253]/30"
                          : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-[#c19253]"
                      }`}
                    >
                      Pending Queue (
                      {requests.filter((r) => !r.resolved).length})
                    </button>
                    <button
                      onClick={() => setShowResolvedRequests(true)}
                      className={`px-4 py-1.5 rounded-md text-xs font-bold tracking-wide transition-all ${
                        showResolvedRequests
                          ? "bg-[#c19253]/10 dark:bg-black text-[#c19253] dark:text-[#c19253] shadow ring-1 ring-[#c19253]/30"
                          : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-[#c19253]"
                      }`}
                    >
                      Resolved History (
                      {requests.filter((r) => r.resolved).length})
                    </button>
                  </div>
                </div>

                {/* requests database list grid */}
                {loadingRequests ? (
                  <div className="flex py-20 flex-col items-center justify-center gap-2">
                    <Loader2
                      className="animate-spin text-[#c19253]"
                      size={24}
                    />
                    <span className="text-xs font-mono text-slate-500">
                      Retrieving playback log streams...
                    </span>
                  </div>
                ) : requests.filter((r) => r.resolved === showResolvedRequests)
                    .length === 0 ? (
                  <div className="border border-slate-200 dark:border-[#c19253]/20 border-dashed rounded-xl p-16 text-center select-none bg-slate-100/30 dark:bg-black">
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                      {showResolvedRequests
                        ? "No resolved request history is stored inside this local terminal pipeline."
                        : "Outstanding customer request queue is fully cleared! Great work."}
                    </p>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-black border border-slate-200 dark:border-[#c19253]/25 rounded-xl overflow-hidden shadow-lg select-none">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-[#c19253]/20 text-slate-500 dark:text-[#c19253] font-mono text-[10px] uppercase font-bold tracking-widest bg-slate-50 dark:bg-black">
                            <th className="py-4.5 px-6">Fragrance Name</th>
                            <th className="py-4.5 px-6">
                              Terminal / Station ID
                            </th>
                            <th className="py-4.5 px-6">Requested Time</th>
                            {showResolvedRequests && (
                              <th className="py-4.5 px-6">Resolved Time</th>
                            )}
                            <th className="py-4.5 px-6 text-center">Status</th>
                            {!showResolvedRequests && (
                              <th className="py-4.5 px-6 text-center">
                                Dispatch Action
                              </th>
                            )}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-150 dark:divide-[#c19253]/15 font-sans text-xs">
                          {requests
                            .filter((r) => r.resolved === showResolvedRequests)
                            .map((req) => (
                              <tr
                                key={req.id}
                                className="hover:bg-slate-50 dark:hover:bg-[#c19253]/5 transition-colors"
                              >
                                <td className="py-4.5 px-6 font-bold text-slate-800 dark:text-slate-100">
                                  {req.perfumeName}
                                </td>

                                <td className="py-4.5 px-6 font-mono font-bold text-slate-500 dark:text-slate-400">
                                  {req.station}
                                </td>

                                <td className="py-4.5 px-6 text-slate-600 dark:text-zinc-305">
                                  {req.time}
                                </td>

                                {showResolvedRequests && (
                                  <td className="py-4.5 px-6 text-slate-500 dark:text-zinc-400 font-mono">
                                    {req.resolvedAt || "N/A"}
                                  </td>
                                )}

                                <td className="py-4.5 px-6 text-center">
                                  {req.resolved ? (
                                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-widest bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/30">
                                      Resolved
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-widest bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/30">
                                      Pending
                                    </span>
                                  )}
                                </td>

                                {!showResolvedRequests && (
                                  <td className="py-4.5 px-6 text-center">
                                    <button
                                      onClick={() =>
                                        handleResolveRequest(req.id)
                                      }
                                      className="px-4 py-1 bg-[#c19253] hover:bg-[#b08142] text-black rounded text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                                    >
                                      Mark Resolved
                                    </button>
                                  </td>
                                )}
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB 4: WORKFORCE USER ACCOUNTS SETTINGS (ADMINS ONLY) */}
            {activeTab === "users" && currentUser?.role === "admin" && (
              <motion.div
                key="users-module"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8 select-none"
              >
                {/* Account Provisioning box */}
                <div className="lg:col-span-1 bg-[#FAF9F5] dark:bg-black border border-slate-200 dark:border-[#c19253]/25 p-6 rounded-xl shadow-lg h-fit space-y-5 transition-colors">
                  <div>
                    <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                      Provision Work Station
                    </h2>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      Instantly spawn new system records for internal employees
                      or staff.
                    </p>
                  </div>

                  <form
                    onSubmit={handleCreateUser}
                    className="space-y-4 text-xs font-sans"
                  >
                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-slate-500 dark:text-[#c19253]/80 mb-1.5 pl-1">
                        Employee username
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#c19253]/25 rounded-lg px-4 py-2 text-slate-800 dark:text-white focus:border-[#c19253]/60 dark:focus:border-[#c19253]/60 outline-none bg-white font-sans"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        placeholder="e.g. dave_staff"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-slate-500 dark:text-[#c19253]/80 mb-1.5 pl-1">
                        Password PIN Code
                      </label>
                      <input
                        type="password"
                        required
                        className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#c19253]/25 rounded-lg px-4 py-2 text-slate-800 dark:text-white focus:border-[#c19253]/60 dark:focus:border-[#c19253]/60 outline-none bg-white font-sans"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-slate-500 dark:text-[#c19253]/80 mb-1.5 pl-1">
                        Assigned privileges / role
                      </label>
                      <div className="grid grid-cols-2 gap-2 p-1 bg-slate-50 dark:bg-black rounded-lg border border-slate-200 dark:border-[#c19253]/25">
                        <button
                          type="button"
                          onClick={() => setNewUserRole("staff")}
                          className={`py-1.5 rounded-md text-[10px] font-mono uppercase font-bold tracking-wider transition-all ${
                            newUserRole === "staff"
                              ? "bg-[#c19253]/10 dark:bg-black border border-transparent dark:border-[#c19253]/60 text-[#c19253]"
                              : "text-slate-500 hover:text-[#c19253] dark:hover:text-[#c19253]/80"
                          }`}
                        >
                          Staff Kiosk
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewUserRole("admin")}
                          className={`py-1.5 rounded-md text-[10px] font-mono uppercase font-bold tracking-wider transition-all ${
                            newUserRole === "admin"
                              ? "bg-[#c19253]/10 dark:bg-black border border-transparent dark:border-[#c19253]/60 text-[#c19253]"
                              : "text-slate-500 hover:text-[#c19253] dark:hover:text-[#c19253]/80"
                          }`}
                        >
                          Administrator
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-[#c19253] hover:bg-[#b08142] text-black rounded-lg text-[10px] font-bold tracking-widest uppercase transition-colors cursor-pointer"
                    >
                      Provision Account
                    </button>
                  </form>
                </div>

                {/* Account records register lists */}
                <div className="lg:col-span-2 bg-[#FAF9F5] dark:bg-black border border-slate-200 dark:border-[#c19253]/25 p-6 rounded-xl shadow-lg h-fit space-y-4 transition-colors">
                  <div>
                    <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                      Workforce credentials ledger
                    </h2>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-widest font-mono">
                      Confidential Account Entries
                    </p>
                  </div>

                  {loadingUsers ? (
                    <div className="flex py-10 flex-col items-center justify-center gap-2">
                      <Loader2
                        className="animate-spin text-[#c19253]"
                        size={20}
                      />
                      <span className="text-[11px] font-mono text-slate-500">
                        Retrieving system ledger...
                      </span>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left font-sans text-xs">
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-[#c19253]/20 text-slate-500 font-mono text-[9px] uppercase tracking-widest font-bold">
                            <th className="pb-3 pl-2">
                              System record / Account
                            </th>
                            <th className="pb-3">Access Level</th>
                            <th className="pb-3 text-center">Revoke Account</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-150 dark:divide-[#c19253]/15 font-medium">
                          {staffUsers.map((item) => (
                            <tr
                              key={item.id}
                              className="hover:bg-slate-50 dark:hover:bg-[#c19253]/5 transition-colors"
                            >
                              <td className="py-3.5 pl-2 flex items-center gap-3">
                                <span className="w-7 h-7 bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#c19253]/25 text-slate-500 dark:text-[#c19253] flex items-center justify-center font-bold text-xs rounded-full">
                                  {item.username[0]?.toUpperCase()}
                                </span>
                                <div>
                                  <span className="text-slate-800 dark:text-white block font-bold truncate max-w-[150px]">
                                    {item.username}
                                  </span>
                                  <span className="text-[9px] font-mono block text-slate-500">
                                    ID: {item.id}
                                  </span>
                                </div>
                              </td>

                              <td className="py-3.5">
                                <span
                                  className={`inline-block px-2.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-widest ${
                                    item.role === "admin"
                                      ? "bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/30"
                                      : "bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/30"
                                  }`}
                                >
                                  {item.role}
                                </span>
                              </td>

                              <td className="py-3.5 text-center">
                                <button
                                  onClick={() => handleDeleteUser(item)}
                                  className="text-slate-500 hover:text-rose-500 p-1.5 rounded hover:bg-rose-50 dark:hover:bg-rose-950/15 transition-colors cursor-pointer animate-none"
                                  title="Decommission credential record"
                                >
                                  <UserX size={15} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <div className="p-4 bg-amber-550/5 dark:bg-black border border-slate-200 dark:border-[#c19253]/20 rounded-lg flex items-start gap-3 mt-4 text-[10px] text-slate-500 dark:text-slate-400">
                    <AlertTriangle
                      className="text-amber-500 flex-shrink-0 mt-0.5"
                      size={14}
                    />
                    <div className="leading-relaxed font-mono">
                      <span>
                        Operational Alert: Self-termination or termination of
                        the final primary system administrator is
                        programmatically locked out to prevent fatal workspace
                        locks.
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
