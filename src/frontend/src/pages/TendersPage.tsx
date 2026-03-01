import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
  FileText,
  Filter,
  RefreshCw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { Tender } from "../backend.d";
import { TenderCard } from "../components/TenderCard";
import {
  useSaveTender,
  useSavedTenders,
  useTenders,
  useUnsaveTender,
} from "../hooks/useQueries";
import { useUserProfile } from "../hooks/useQueries";
import { computeRelevanceScore, daysRemaining } from "../utils/scoring";

const CATEGORIES = [
  "All",
  "IT",
  "Construction",
  "Healthcare",
  "Education",
  "Infrastructure",
  "Finance",
  "Defence",
  "Agriculture",
];
const RISK_LEVELS = ["All", "HIGH", "MEDIUM", "LOW"];
const DEADLINE_OPTIONS = [
  { label: "All Deadlines", value: "all" },
  { label: "Closing in 3 days", value: "3" },
  { label: "Closing in 7 days", value: "7" },
  { label: "Closing in 30 days", value: "30" },
];
const SORT_OPTIONS = [
  { label: "Deadline (Soonest)", value: "deadline" },
  { label: "Risk Level (High First)", value: "risk" },
  { label: "Relevance Score", value: "relevance" },
];

function riskSortOrder(level: string): number {
  switch (level.toUpperCase()) {
    case "HIGH":
      return 0;
    case "MEDIUM":
      return 1;
    case "LOW":
      return 2;
    default:
      return 3;
  }
}

export function TendersPage() {
  const { data: tenders, isLoading, refetch, isFetching } = useTenders();
  const { data: savedIds = [] } = useSavedTenders();
  const { data: profile } = useUserProfile();
  const saveMutation = useSaveTender();
  const unsaveMutation = useUnsaveTender();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [department, setDepartment] = useState("All");
  const [location, setLocation] = useState("All");
  const [riskLevel, setRiskLevel] = useState("All");
  const [deadline, setDeadline] = useState("all");
  const [sortBy, setSortBy] = useState("deadline");
  const [showFilters, setShowFilters] = useState(false);

  const savedSet = useMemo(
    () => new Set(savedIds.map((id) => id.toString())),
    [savedIds],
  );

  const departments = useMemo(() => {
    if (!tenders) return ["All"];
    const depts = [...new Set(tenders.map((t) => t.department))].sort();
    return ["All", ...depts];
  }, [tenders]);

  const locations = useMemo(() => {
    if (!tenders) return ["All"];
    const locs = [...new Set(tenders.map((t) => t.location))].sort();
    return ["All", ...locs];
  }, [tenders]);

  const filtered = useMemo<Tender[]>(() => {
    if (!tenders) return [];
    return tenders
      .filter((t) => {
        const q = search.toLowerCase();
        const matchSearch =
          !q ||
          t.name.toLowerCase().includes(q) ||
          t.department.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q);
        const matchCat = category === "All" || t.category === category;
        const matchDept = department === "All" || t.department === department;
        const matchLoc = location === "All" || t.location === location;
        const matchRisk = riskLevel === "All" || t.riskLevel === riskLevel;
        const matchDeadline =
          deadline === "all" ||
          daysRemaining(t.deadline) <= Number.parseInt(deadline);
        return (
          matchSearch &&
          matchCat &&
          matchDept &&
          matchLoc &&
          matchRisk &&
          matchDeadline
        );
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "deadline":
            return Number(a.deadline - b.deadline);
          case "risk":
            return riskSortOrder(a.riskLevel) - riskSortOrder(b.riskLevel);
          case "relevance":
            return (
              computeRelevanceScore(b, profile) -
              computeRelevanceScore(a, profile)
            );
          default:
            return 0;
        }
      });
  }, [
    tenders,
    search,
    category,
    department,
    location,
    riskLevel,
    deadline,
    sortBy,
    profile,
  ]);

  const activeFilterCount = [
    category !== "All",
    department !== "All",
    location !== "All",
    riskLevel !== "All",
    deadline !== "all",
  ].filter(Boolean).length;

  const handleSave = (id: bigint) => {
    saveMutation.mutate(id, {
      onSuccess: () => toast.success("Tender saved"),
      onError: () => toast.error("Failed to save tender"),
    });
  };

  const handleUnsave = (id: bigint) => {
    unsaveMutation.mutate(id, {
      onSuccess: () => toast.success("Tender removed from saved"),
      onError: () => toast.error("Failed to unsave tender"),
    });
  };

  const clearFilters = () => {
    setCategory("All");
    setDepartment("All");
    setLocation("All");
    setRiskLevel("All");
    setDeadline("all");
    setSearch("");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="navy-bg border-b border-white/10 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="font-display text-2xl font-bold text-white">
                Tender Dashboard
              </h1>
              <p className="text-white/55 text-sm mt-0.5">
                {tenders
                  ? `${filtered.length} of ${tenders.length} tenders`
                  : "Loading tenders..."}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => void refetch()}
                disabled={isFetching}
                className="text-white/70 hover:text-white hover:bg-white/10 h-8"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 mr-1.5 ${isFetching ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-44 h-8 text-xs bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((o) => (
                    <SelectItem
                      key={o.value}
                      value={o.value}
                      className="text-xs"
                    >
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Search + Filter bar */}
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, department, category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-sm"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters((v) => !v)}
            className={`h-9 gap-1.5 ${showFilters || activeFilterCount > 0 ? "border-primary text-primary" : ""}`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filters
            {activeFilterCount > 0 && (
              <Badge className="h-4 w-4 p-0 flex items-center justify-center text-[9px] bg-primary text-primary-foreground ml-0.5">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="bg-card border border-border rounded-lg p-4 mb-4 animate-fade-in">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5" />
                Filters
              </span>
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  <X className="w-3 h-3" /> Clear all
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              <div>
                <span className="text-xs font-medium text-muted-foreground mb-1 block">
                  Category
                </span>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c} className="text-xs">
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <span className="text-xs font-medium text-muted-foreground mb-1 block">
                  Department
                </span>
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((d) => (
                      <SelectItem key={d} value={d} className="text-xs">
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <span className="text-xs font-medium text-muted-foreground mb-1 block">
                  Location
                </span>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((l) => (
                      <SelectItem key={l} value={l} className="text-xs">
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <span className="text-xs font-medium text-muted-foreground mb-1 block">
                  Risk Level
                </span>
                <Select value={riskLevel} onValueChange={setRiskLevel}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RISK_LEVELS.map((r) => (
                      <SelectItem key={r} value={r} className="text-xs">
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <span className="text-xs font-medium text-muted-foreground mb-1 block">
                  Deadline
                </span>
                <Select value={deadline} onValueChange={setDeadline}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DEADLINE_OPTIONS.map((d) => (
                      <SelectItem
                        key={d.value}
                        value={d.value}
                        className="text-xs"
                      >
                        {d.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Profile prompt */}
        {!isLoading && tenders && tenders.length > 0 && (
          <div className="mb-4 hidden" />
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"].map((key) => (
              <div
                key={key}
                className="bg-card rounded-lg border border-border p-4 space-y-3"
              >
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-8 w-full mt-2" />
              </div>
            ))}
          </div>
        )}

        {/* Results grid */}
        {!isLoading && filtered.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-fade-in">
            {filtered.map((tender) => (
              <TenderCard
                key={tender.id.toString()}
                tender={tender}
                profile={profile}
                isSaved={savedSet.has(tender.id.toString())}
                onSave={handleSave}
                onUnsave={handleUnsave}
                savePending={saveMutation.isPending || unsaveMutation.isPending}
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-display text-lg font-semibold mb-2">
              No tenders found
            </h3>
            <p className="text-muted-foreground text-sm mb-4 max-w-sm">
              {search || activeFilterCount > 0
                ? "Try adjusting your search or filters to find more tenders."
                : "No tenders are currently available. Check back soon."}
            </p>
            {(search || activeFilterCount > 0) && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear filters
              </Button>
            )}
            {!search && activeFilterCount === 0 && (
              <Link to="/profile">
                <Button variant="outline" size="sm" className="mt-2">
                  Complete your profile
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
