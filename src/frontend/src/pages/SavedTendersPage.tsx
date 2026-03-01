import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { Bookmark, ExternalLink, FileText } from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";
import { TenderCard } from "../components/TenderCard";
import {
  useSaveTender,
  useSavedTenders,
  useTenders,
  useUnsaveTender,
} from "../hooks/useQueries";
import { useUserProfile } from "../hooks/useQueries";

export function SavedTendersPage() {
  const { data: allTenders, isLoading: tendersLoading } = useTenders();
  const { data: savedIds = [], isLoading: savedLoading } = useSavedTenders();
  const { data: profile } = useUserProfile();
  const saveMutation = useSaveTender();
  const unsaveMutation = useUnsaveTender();

  const savedSet = useMemo(
    () => new Set(savedIds.map((id) => id.toString())),
    [savedIds],
  );

  const savedTenders = useMemo(() => {
    if (!allTenders) return [];
    return allTenders.filter((t) => savedSet.has(t.id.toString()));
  }, [allTenders, savedSet]);

  const isLoading = tendersLoading || savedLoading;

  const handleSave = (id: bigint) => {
    saveMutation.mutate(id, {
      onSuccess: () => toast.success("Tender saved"),
      onError: () => toast.error("Failed to save"),
    });
  };

  const handleUnsave = (id: bigint) => {
    unsaveMutation.mutate(id, {
      onSuccess: () => toast.success("Removed from saved"),
      onError: () => toast.error("Failed to remove"),
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="navy-bg border-b border-white/10 py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gold/20 border border-gold/30 flex items-center justify-center">
              <Bookmark className="w-5 h-5 text-gold" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-white">
                Saved Tenders
              </h1>
              <p className="text-white/55 text-sm">
                {!isLoading
                  ? `${savedTenders.length} saved tender${savedTenders.length !== 1 ? "s" : ""}`
                  : "Loading..."}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Loading */}
        {isLoading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {["sk-0", "sk-1", "sk-2", "sk-3"].map((key) => (
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

        {/* Grid */}
        {!isLoading && savedTenders.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-fade-in">
            {savedTenders.map((tender) => (
              <TenderCard
                key={tender.id.toString()}
                tender={tender}
                profile={profile}
                isSaved={true}
                onSave={handleSave}
                onUnsave={handleUnsave}
                savePending={saveMutation.isPending || unsaveMutation.isPending}
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && savedTenders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-5">
              <Bookmark className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="font-display text-xl font-bold mb-2">
              No saved tenders yet
            </h3>
            <p className="text-muted-foreground text-sm mb-6 max-w-xs">
              Browse the tender dashboard and bookmark tenders you want to
              track.
            </p>
            <Link to="/tenders">
              <Button className="bg-navy hover:bg-navy-light text-white gap-2">
                <FileText className="w-4 h-4" />
                Browse Tenders
                <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
