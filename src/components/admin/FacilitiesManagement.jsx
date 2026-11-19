import { useState, useMemo } from "react";
import {
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  Clock,
  MapPin,
  CheckCircle2,
  Wrench,
  Search,
  Eye,
  LayoutGrid,
  List,
  RefreshCw,
  X,
} from "lucide-react";

const INITIAL_FACILITIES = [
  {
    id: 1,
    title: "Oceanfront Infinity Pool & Cabanas",
    category: "POOL & BEACH",
    hours: "06:30 AM – 09:30 PM",
    location: "Main Coastal Deck",
    status: "OPEN",
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=85",
    description:
      "Heated horizon-edge saltwater infinity pool overlooking the Indian Ocean with private butler-serviced cabanas.",
    highlights: ["Saltwater Infinity Edge", "Private Butler Cabanas", "Sunset Pool Bar"],
  },
  {
    id: 2,
    title: "Serenity Ayurveda & Holistic Spa",
    category: "SPA & WELLNESS",
    hours: "08:00 AM – 08:00 PM",
    location: "Tropical Garden Sanctuary",
    status: "OPEN",
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1000&q=85",
    description:
      "Signature Ceylon herbal rituals, aromatherapy massages, hydrotherapy suites, and ocean-view yoga pavilions.",
    highlights: ["Ceylon Herbal Rituals", "Hydrotherapy Suites", "Ocean Yoga Deck"],
  },
  {
    id: 3,
    title: "The Azure Fine Dining & Sunset Lounge",
    category: "FINE DINING",
    hours: "07:00 AM – 11:00 PM",
    location: "West Cliff Terrace",
    status: "OPEN",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=85",
    description:
      "Award-winning coastal gastronomy featuring fresh Indian Ocean seafood, curated wine cellar, and artisanal cocktails.",
    highlights: ["Oceanfront Terrace", "Sommelier Wine Cellar", "Chef Tasting Menu"],
  },
  {
    id: 4,
    title: "Elite Fitness & Ocean Wellness Studio",
    category: "FITNESS",
    hours: "24 Hours (Keycard Access)",
    location: "Wellness Wing, Level 2",
    status: "OPEN",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=85",
    description:
      "State-of-the-art Technogym equipment, personal trainers, private steam rooms, and recovery ice baths.",
    highlights: ["24/7 Keycard Access", "Personal Trainers", "Steam & Ice Recovery"],
  },
  {
    id: 5,
    title: "Private Beach Club & Water Sports",
    category: "RECREATION",
    hours: "07:00 AM – 06:30 PM",
    location: "Serenity Private Cove",
    status: "OPEN",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=85",
    description:
      "Exclusive golden-sand beach access, sunset yacht charters, snorkeling excursions, and paddleboarding.",
    highlights: ["Private Cove Access", "Sunset Yacht Charters", "Guided Snorkeling"],
  },
  {
    id: 6,
    title: "Grand Ballroom & VIP Chauffeur Concierge",
    category: "EVENTS & VIP",
    hours: "24/7 Dedicated Service",
    location: "Grand Lobby Pavilion",
    status: "OPEN",
    image:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1000&q=85",
    description:
      "Bespoke beachfront weddings, executive boardrooms, luxury airport transfers, and helicopter charter arrangements.",
    highlights: ["Beachfront Weddings", "Executive Boardrooms", "VIP Chauffeur Fleet"],
  },
];

const CATEGORIES = [
  "ALL",
  "POOL & BEACH",
  "SPA & WELLNESS",
  "FINE DINING",
  "FITNESS",
  "RECREATION",
  "EVENTS & VIP",
];

const FacilitiesManagement = () => {
  const [facilities, setFacilities] = useState(() => {
    try {
      const saved = localStorage.getItem("serenity_facilities");
      return saved ? JSON.parse(saved) : INITIAL_FACILITIES;
    } catch {
      return INITIAL_FACILITIES;
    }
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [viewMode, setViewMode] = useState("cards"); // 'cards' | 'table'
  const [viewFacility, setViewFacility] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [editingId, setEditingId] = useState(null);
  const [newHighlight, setNewHighlight] = useState("");

  const initialForm = {
    title: "",
    category: "SPA & WELLNESS",
    hours: "08:00 AM – 09:00 PM",
    location: "Main Resort Wing",
    status: "OPEN",
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=85",
    description: "",
    highlights: ["Complimentary Towel Service", "Dedicated Concierge"],
  };
  const [formData, setFormData] = useState(initialForm);

  const saveFacilities = (next) => {
    setFacilities(next);
    localStorage.setItem("serenity_facilities", JSON.stringify(next));
  };

  const filteredFacilities = useMemo(() => {
    return facilities.filter((item) => {
      const matchesCat =
        selectedCategory === "ALL" ||
        String(item.category).toUpperCase() === selectedCategory;
      const term = searchTerm.trim().toLowerCase();
      if (!term) return matchesCat;
      return (
        matchesCat &&
        (item.title?.toLowerCase().includes(term) ||
          item.category?.toLowerCase().includes(term) ||
          item.location?.toLowerCase().includes(term) ||
          item.description?.toLowerCase().includes(term))
      );
    });
  }, [facilities, selectedCategory, searchTerm]);

  const handleOpenCreate = () => {
    setModalMode("create");
    setFormData(initialForm);
    setNewHighlight("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setModalMode("edit");
    setEditingId(item.id);
    setFormData({
      ...item,
      highlights: Array.isArray(item.highlights)
        ? item.highlights
        : ["Signature Experience", "Luxury Service"],
    });
    setNewHighlight("");
    setIsModalOpen(true);
  };

  const handleToggleStatus = (item) => {
    const nextStatus = item.status === "OPEN" ? "MAINTENANCE" : "OPEN";
    saveFacilities(
      facilities.map((f) => (f.id === item.id ? { ...f, status: nextStatus } : f))
    );
  };

  const handleAddHighlight = () => {
    const trimmed = newHighlight.trim();
    if (!trimmed) return;
    setFormData((prev) => ({
      ...prev,
      highlights: [...(prev.highlights || []), trimmed],
    }));
    setNewHighlight("");
  };

  const handleRemoveHighlight = (idx) => {
    setFormData((prev) => ({
      ...prev,
      highlights: (prev.highlights || []).filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modalMode === "create") {
      const newFacility = { ...formData, id: Date.now() };
      saveFacilities([newFacility, ...facilities]);
    } else {
      saveFacilities(
        facilities.map((f) =>
          f.id === editingId ? { ...formData, id: editingId } : f
        )
      );
    }
    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (!deleteId) return;
    saveFacilities(facilities.filter((f) => f.id !== deleteId));
    setDeleteId(null);
  };

  const totalCount = facilities.length;
  const openCount = facilities.filter((f) => f.status === "OPEN").length;
  const maintenanceCount = facilities.filter((f) => f.status !== "OPEN").length;
  const categoriesCount = new Set(facilities.map((f) => f.category)).size;

  return (
    <div
      className="facilities-management-view"
      style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "20px" }}
    >
      {/* 1. Executive KPI Summary Strip */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(215px, 1fr))",
          gap: "16px",
        }}
      >
        {[
          {
            label: "Total Resort Facilities",
            value: totalCount,
            sub: "World-class guest experiences",
            icon: Sparkles,
            iconBg: "rgba(6, 59, 50, 0.1)",
            iconColor: "#063B32",
            accent: "#063B32",
          },
          {
            label: "Open & Operational",
            value: openCount,
            sub: "Ready for hotel guests",
            icon: CheckCircle2,
            iconBg: "rgba(6, 59, 50, 0.12)",
            iconColor: "#063B32",
            accent: "#063B32",
          },
          {
            label: "Experience Categories",
            value: categoriesCount,
            sub: "Wellness, dining & leisure",
            icon: MapPin,
            iconBg: "rgba(201, 162, 75, 0.2)",
            iconColor: "#8A6414",
            accent: "#C9A24B",
          },
          {
            label: "Under Maintenance",
            value: maintenanceCount,
            sub: "Temporarily closed",
            icon: Wrench,
            iconBg: "#F9E5E2",
            iconColor: "#9E3D30",
            accent: "#9E3D30",
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <article
              key={stat.label}
              className="dashboard-card"
              style={{
                padding: "18px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "14px",
                borderTop: `3px solid ${stat.accent}`,
              }}
            >
              <div>
                <span
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "var(--color-muted)",
                    marginBottom: "4px",
                  }}
                >
                  {stat.label}
                </span>
                <strong
                  style={{
                    display: "block",
                    fontFamily: "Playfair Display, serif",
                    fontSize: "28px",
                    color: "#061C2B",
                    lineHeight: 1.1,
                  }}
                >
                  {stat.value}
                </strong>
                <small style={{ fontSize: "11px", color: "var(--color-muted)" }}>
                  {stat.sub}
                </small>
              </div>
              <div
                style={{
                  width: "46px",
                  height: "46px",
                  borderRadius: "14px",
                  background: stat.iconBg,
                  color: stat.iconColor,
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                }}
              >
                <Icon size={22} />
              </div>
            </article>
          );
        })}
      </section>

      {/* 2. Top Header, View Switcher, Category Filters & Search */}
      <section className="dashboard-card" style={{ padding: "22px 24px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "nowrap",
            gap: "16px",
            paddingBottom: "18px",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          <div style={{ flex: "1 1 auto", minWidth: 0 }}>
            <span className="panel-eyebrow">RESORT AMENITIES &amp; EXPERIENCES</span>
            <h2
              style={{
                fontFamily: "Playfair Display, serif",
                fontSize: "22px",
                color: "#061C2B",
                margin: "2px 0 4px",
              }}
            >
              Resort Facilities &amp; Experiences
            </h2>
            <p style={{ margin: 0, fontSize: "12px", color: "var(--color-muted)" }}>
              Manage resort amenities, operating hours, locations, and guest highlights.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                background: "#F7F3E8",
                padding: "4px",
                borderRadius: "10px",
                border: "1px solid var(--color-border)",
              }}
            >
              <button
                type="button"
                onClick={() => setViewMode("cards")}
                style={{
                  border: "none",
                  background: viewMode === "cards" ? "#063B32" : "transparent",
                  color: viewMode === "cards" ? "#C9A24B" : "#5B6964",
                  padding: "6px 12px",
                  borderRadius: "7px",
                  fontSize: "11px",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <LayoutGrid size={14} /> Facility Cards
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                style={{
                  border: "none",
                  background: viewMode === "table" ? "#063B32" : "transparent",
                  color: viewMode === "table" ? "#C9A24B" : "#5B6964",
                  padding: "6px 12px",
                  borderRadius: "7px",
                  fontSize: "11px",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <List size={14} /> Executive List
              </button>
            </div>

            <button
              type="button"
              onClick={() => saveFacilities(INITIAL_FACILITIES)}
              title="Reset to default luxury facilities"
              style={{
                background: "#F7F3E8",
                color: "#061C2B",
                border: "1px solid var(--color-border)",
                padding: "10px 14px",
                borderRadius: "10px",
                fontWeight: 700,
                fontSize: "12px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <RefreshCw size={14} /> Reset
            </button>

            <button
              type="button"
              onClick={handleOpenCreate}
              style={{
                background: "linear-gradient(135deg, #C9A24B, #b58d35)",
                color: "#061C2B",
                border: "none",
                padding: "10px 18px",
                borderRadius: "10px",
                fontWeight: 700,
                fontSize: "13px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 6px 16px rgba(201, 162, 75, 0.28)",
              }}
            >
              <Plus size={16} /> Add Facility
            </button>
          </div>
        </div>

        {/* Category Filter Pills & Search */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "14px",
            marginTop: "18px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              const count =
                cat === "ALL"
                  ? facilities.length
                  : facilities.filter(
                      (f) => String(f.category).toUpperCase() === cat
                    ).length;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    border: "1px solid",
                    borderColor: active ? "#063B32" : "var(--color-border)",
                    padding: "8px 14px",
                    borderRadius: "999px",
                    fontSize: "11.5px",
                    fontWeight: 700,
                    cursor: "pointer",
                    background: active ? "#063B32" : "#F7F3E8",
                    color: active ? "#C9A24B" : "#061C2B",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "7px",
                    transition: "all 0.2s ease",
                  }}
                >
                  <span>{cat === "ALL" ? "All Facilities" : cat}</span>
                  <span
                    style={{
                      fontSize: "10px",
                      padding: "1px 7px",
                      borderRadius: "999px",
                      background: active ? "#C9A24B" : "#FFFFFF",
                      color: "#061C2B",
                      fontWeight: 800,
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "#F7F3E8",
              padding: "9px 14px",
              borderRadius: "12px",
              border: "1px solid var(--color-border)",
              minWidth: "280px",
              flex: "0 1 340px",
            }}
          >
            <Search size={16} color="#5B6964" />
            <input
              type="text"
              placeholder="Search facilities by name, wing, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                border: "none",
                background: "transparent",
                outline: "none",
                fontSize: "13px",
                width: "100%",
                color: "#061C2B",
              }}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  color: "#5B6964",
                  padding: 0,
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 3. Facilities Cards Grid / Executive List */}
      {filteredFacilities.length === 0 ? (
        <div
          className="dashboard-card"
          style={{ padding: "48px", textAlign: "center", color: "var(--color-muted)" }}
        >
          No resort facilities match your filter criteria.
        </div>
      ) : viewMode === "cards" ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
            gap: "20px",
          }}
        >
          {filteredFacilities.map((item) => {
            const isOpen = item.status === "OPEN";
            const highlights = Array.isArray(item.highlights)
              ? item.highlights
              : [];

            return (
              <article
                key={item.id}
                className="dashboard-card"
                style={{
                  padding: 0,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  {/* Cover Image Header */}
                  <div
                    style={{
                      position: "relative",
                      height: "205px",
                      background: "#E8ECE9",
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(to top, rgba(6,28,43,0.82) 0%, rgba(6,28,43,0.12) 55%, rgba(6,28,43,0.35) 100%)",
                      }}
                    />

                    {/* Top Left Category Pill */}
                    <span
                      style={{
                        position: "absolute",
                        top: "14px",
                        left: "14px",
                        background: "rgba(6, 28, 43, 0.88)",
                        color: "#C9A24B",
                        padding: "5px 12px",
                        borderRadius: "999px",
                        fontSize: "10px",
                        fontWeight: 800,
                        letterSpacing: "0.8px",
                        border: "1px solid rgba(201,162,75,0.4)",
                      }}
                    >
                      {item.category}
                    </span>

                    {/* Top Right Status Pill */}
                    <span
                      style={{
                        position: "absolute",
                        top: "14px",
                        right: "14px",
                        background: isOpen ? "#063B32" : "#F9E5E2",
                        color: isOpen ? "#C9A24B" : "#9E3D30",
                        padding: "5px 12px",
                        borderRadius: "999px",
                        fontSize: "10px",
                        fontWeight: 800,
                        letterSpacing: "0.6px",
                        border: isOpen
                          ? "1px solid rgba(201,162,75,0.45)"
                          : "1px solid #F1C8C1",
                      }}
                    >
                      {item.status}
                    </span>

                    {/* Bottom Image Title Overlay */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: "12px",
                        left: "16px",
                        right: "16px",
                      }}
                    >
                      <h3
                        style={{
                          margin: 0,
                          fontFamily: "Playfair Display, serif",
                          fontSize: "20px",
                          color: "#FFFFFF",
                          fontWeight: 600,
                        }}
                      >
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div style={{ padding: "18px 20px" }}>
                    {/* Operating Hours & Location Strip */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "10px",
                        padding: "11px 14px",
                        background: "#F7F3E8",
                        borderRadius: "12px",
                        border: "1px solid var(--color-border)",
                        marginBottom: "14px",
                        fontSize: "11.5px",
                      }}
                    >
                      <div>
                        <span
                          style={{
                            display: "block",
                            fontSize: "10px",
                            fontWeight: 700,
                            color: "#5B6964",
                            textTransform: "uppercase",
                            marginBottom: "2px",
                          }}
                        >
                          Operating Hours
                        </span>
                        <strong
                          style={{
                            color: "#061C2B",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <Clock size={12} color="#C9A24B" />
                          {item.hours}
                        </strong>
                      </div>
                      <div
                        style={{
                          borderLeft: "1px solid var(--color-border)",
                          paddingLeft: "10px",
                        }}
                      >
                        <span
                          style={{
                            display: "block",
                            fontSize: "10px",
                            fontWeight: 700,
                            color: "#5B6964",
                            textTransform: "uppercase",
                            marginBottom: "2px",
                          }}
                        >
                          Resort Wing
                        </span>
                        <strong
                          style={{
                            color: "#063B32",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <MapPin size={12} color="#C9A24B" />
                          {item.location}
                        </strong>
                      </div>
                    </div>

                    <p
                      style={{
                        fontSize: "12.5px",
                        color: "#5B6964",
                        lineHeight: 1.55,
                        margin: "0 0 12px 0",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {item.description}
                    </p>

                    {highlights.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {highlights.slice(0, 3).map((hl, i) => (
                          <span
                            key={i}
                            style={{
                              fontSize: "10.5px",
                              fontWeight: 600,
                              padding: "3px 9px",
                              borderRadius: "999px",
                              background: "rgba(6, 59, 50, 0.08)",
                              color: "#063B32",
                            }}
                          >
                            ✓ {hl}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Footer */}
                <div
                  style={{
                    padding: "13px 20px",
                    borderTop: "1px solid var(--color-border)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "8px",
                    background: "#F7F3E8",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(item)}
                    className="table-action-btn"
                    style={{
                      background: "#FFFFFF",
                      borderColor: "var(--color-border)",
                      color: isOpen ? "#8A6414" : "#063B32",
                    }}
                  >
                    {isOpen ? (
                      <>
                        <Wrench size={13} /> Maintenance
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={13} /> Set Open
                      </>
                    )}
                  </button>

                  <div style={{ display: "flex", gap: "6px" }}>
                    <button
                      type="button"
                      onClick={() => setViewFacility(item)}
                      className="table-action-btn btn-view"
                    >
                      <Eye size={13} /> View
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(item)}
                      className="table-action-btn btn-approve"
                    >
                      <Edit2 size={13} /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteId(item.id)}
                      className="table-action-btn btn-reject"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        /* Spacious Executive List View */
        <section className="dashboard-card" style={{ padding: 0, overflow: "hidden" }}>
          <div className="dashboard-table-wrapper">
            <table className="dashboard-table" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th style={{ padding: "15px 22px" }}>Facility &amp; Category</th>
                  <th style={{ padding: "15px 16px" }}>Resort Wing / Location</th>
                  <th style={{ padding: "15px 16px" }}>Operating Hours</th>
                  <th style={{ padding: "15px 16px" }}>Status</th>
                  <th style={{ padding: "15px 22px", textAlign: "right" }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredFacilities.map((item) => {
                  const isOpen = item.status === "OPEN";
                  return (
                    <tr key={item.id}>
                      <td style={{ padding: "14px 22px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <img
                            src={item.image}
                            alt={item.title}
                            style={{
                              width: "64px",
                              height: "46px",
                              borderRadius: "10px",
                              objectFit: "cover",
                              border: "1px solid var(--color-border)",
                              flexShrink: 0,
                            }}
                          />
                          <div>
                            <strong
                              style={{
                                display: "block",
                                fontSize: "14px",
                                color: "#061C2B",
                              }}
                            >
                              {item.title}
                            </strong>
                            <span
                              style={{
                                fontSize: "10.5px",
                                fontWeight: 700,
                                color: "#C9A24B",
                                letterSpacing: "0.8px",
                              }}
                            >
                              {item.category}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: "14px 16px" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px",
                            fontSize: "12.5px",
                            fontWeight: 600,
                            color: "#061C2B",
                          }}
                        >
                          <MapPin size={13} color="#C9A24B" />
                          {item.location}
                        </span>
                      </td>

                      <td style={{ padding: "14px 16px" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px",
                            fontSize: "12.5px",
                            fontWeight: 600,
                            color: "#061C2B",
                          }}
                        >
                          <Clock size={13} color="#063B32" />
                          {item.hours}
                        </span>
                      </td>

                      <td style={{ padding: "14px 16px" }}>
                        <span
                          className={
                            isOpen
                              ? "dashboard-status dashboard-status-approved"
                              : "dashboard-status dashboard-status-rejected"
                          }
                        >
                          {item.status}
                        </span>
                      </td>

                      <td style={{ padding: "14px 22px" }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: "6px",
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => setViewFacility(item)}
                            className="table-action-btn btn-view"
                          >
                            <Eye size={13} /> View
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(item)}
                            className="table-action-btn btn-view"
                          >
                            {isOpen ? "Maintenance" : "Set Open"}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            className="table-action-btn btn-approve"
                          >
                            <Edit2 size={13} /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteId(item.id)}
                            className="table-action-btn btn-reject"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* VIEW FACILITY DETAILS MODAL */}
      {viewFacility && (
        <div
          className="dashboard-modal-backdrop"
          onClick={() => setViewFacility(null)}
        >
          <div
            className="dashboard-modal-card"
            style={{ maxWidth: "560px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="dashboard-modal-header">
              <div>
                <span className="panel-eyebrow">{viewFacility.category}</span>
                <h4>{viewFacility.title}</h4>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setViewFacility(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div
              style={{
                margin: "14px 0",
                height: "195px",
                borderRadius: "14px",
                overflow: "hidden",
                border: "1px solid var(--color-border)",
              }}
            >
              <img
                src={viewFacility.image}
                alt={viewFacility.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            <div className="dashboard-modal-grid">
              <div>
                <span>Operating Hours</span>
                <strong>{viewFacility.hours}</strong>
              </div>
              <div>
                <span>Location / Wing</span>
                <strong>{viewFacility.location}</strong>
              </div>
            </div>

            <p style={{ fontSize: "12.5px", color: "#5B6964", lineHeight: 1.6 }}>
              {viewFacility.description}
            </p>

            <div className="dashboard-modal-footer">
              <button
                type="button"
                className="dashboard-btn-secondary"
                onClick={() => setViewFacility(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="dashboard-btn-primary"
                onClick={() => {
                  const target = viewFacility;
                  setViewFacility(null);
                  handleOpenEdit(target);
                }}
              >
                <Edit2 size={14} /> Edit Facility
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT FACILITY MODAL */}
      {isModalOpen && (
        <div
          className="dashboard-modal-backdrop"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="dashboard-modal-card"
            style={{ maxWidth: "560px", maxHeight: "90vh", overflowY: "auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="dashboard-modal-header" style={{ marginBottom: "16px" }}>
              <div>
                <span className="panel-eyebrow">
                  {modalMode === "create" ? "NEW EXPERIENCE" : "UPDATE FACILITY"}
                </span>
                <h4>
                  {modalMode === "create"
                    ? "Add Resort Facility"
                    : "Edit Facility Details"}
                </h4>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "14px" }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#5B6964",
                    marginBottom: "4px",
                  }}
                >
                  FACILITY TITLE *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Oceanfront Infinity Pool"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: "10px",
                    border: "1px solid var(--color-border)",
                    fontSize: "13px",
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "#5B6964",
                      marginBottom: "4px",
                    }}
                  >
                    CATEGORY *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: "10px",
                      border: "1px solid var(--color-border)",
                      fontSize: "13px",
                      background: "#F7F3E8",
                    }}
                  >
                    {CATEGORIES.slice(1).map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "#5B6964",
                      marginBottom: "4px",
                    }}
                  >
                    STATUS
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: "10px",
                      border: "1px solid var(--color-border)",
                      fontSize: "13px",
                      background: "#F7F3E8",
                    }}
                  >
                    <option value="OPEN">OPEN</option>
                    <option value="MAINTENANCE">MAINTENANCE</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "#5B6964",
                      marginBottom: "4px",
                    }}
                  >
                    OPERATING HOURS
                  </label>
                  <input
                    type="text"
                    placeholder="08:00 AM – 09:00 PM"
                    value={formData.hours}
                    onChange={(e) =>
                      setFormData({ ...formData, hours: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: "10px",
                      border: "1px solid var(--color-border)",
                      fontSize: "13px",
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "#5B6964",
                      marginBottom: "4px",
                    }}
                  >
                    LOCATION / WING
                  </label>
                  <input
                    type="text"
                    placeholder="Main Coastal Deck"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: "10px",
                      border: "1px solid var(--color-border)",
                      fontSize: "13px",
                    }}
                  />
                </div>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#5B6964",
                    marginBottom: "4px",
                  }}
                >
                  COVER IMAGE URL *
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  required
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: "10px",
                    border: "1px solid var(--color-border)",
                    fontSize: "13px",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#5B6964",
                    marginBottom: "4px",
                  }}
                >
                  DESCRIPTION
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the luxury facility and guest experience..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: "10px",
                    border: "1px solid var(--color-border)",
                    fontSize: "12.5px",
                  }}
                />
              </div>

              {/* Highlights Builder */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#5B6964",
                    marginBottom: "6px",
                  }}
                >
                  KEY HIGHLIGHTS ({(formData.highlights || []).length})
                </label>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "6px",
                    marginBottom: "8px",
                  }}
                >
                  {(formData.highlights || []).map((hl, idx) => (
                    <span
                      key={idx}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                        background: "#F7F3E8",
                        border: "1px solid var(--color-border)",
                        padding: "4px 10px",
                        borderRadius: "999px",
                        fontSize: "11px",
                        fontWeight: 600,
                      }}
                    >
                      {hl}
                      <button
                        type="button"
                        onClick={() => handleRemoveHighlight(idx)}
                        style={{
                          border: "none",
                          background: "transparent",
                          color: "#9E3D30",
                          cursor: "pointer",
                          padding: 0,
                        }}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="text"
                    value={newHighlight}
                    onChange={(e) => setNewHighlight(e.target.value)}
                    placeholder="Add highlight (e.g. Private Butler Cabanas)"
                    style={{
                      flex: 1,
                      padding: "8px 12px",
                      borderRadius: "10px",
                      border: "1px solid var(--color-border)",
                      fontSize: "12px",
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddHighlight}
                    className="dashboard-btn-primary"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="dashboard-modal-footer">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="dashboard-btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="dashboard-btn-primary">
                  Save Facility
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteId && (
        <div
          className="dashboard-modal-backdrop"
          onClick={() => setDeleteId(null)}
        >
          <div
            className="dashboard-modal-card"
            style={{ maxWidth: "390px", textAlign: "center" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                background: "#F9E5E2",
                color: "#9E3D30",
                display: "grid",
                placeItems: "center",
                margin: "0 auto 14px",
              }}
            >
              <Trash2 size={22} />
            </div>
            <h4
              style={{
                margin: "0 0 8px",
                fontFamily: "Playfair Display, serif",
                fontSize: "20px",
                color: "#061C2B",
              }}
            >
              Remove Facility?
            </h4>
            <p style={{ margin: "0 0 20px", fontSize: "12.5px", color: "#5B6964" }}>
              This facility will be removed from the resort facilities showcase.
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  border: "1px solid var(--color-border)",
                  background: "#FFFFFF",
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background: "#9E3D30",
                  color: "#FFFFFF",
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacilitiesManagement;
