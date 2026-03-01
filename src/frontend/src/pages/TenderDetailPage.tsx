import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Brain,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock,
  FileText,
  IndianRupee,
  MapPin,
  Shield,
  Target,
  TrendingUp,
  Users,
  XCircle,
  Zap,
} from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";
import {
  useSaveTender,
  useSavedTenders,
  useTenderById,
  useTenders,
  useUnsaveTender,
} from "../hooks/useQueries";
import { useUserProfile } from "../hooks/useQueries";
import {
  computeFitScore,
  computeRelevanceScore,
  daysRemaining,
  formatDeadline,
  nsToDate,
  riskBgClass,
  scoreBarColor,
  scoreColor,
} from "../utils/scoring";

export function TenderDetailPage() {
  const params = useParams({ strict: false });
  const id = params.id as string | undefined;
  const navigate = useNavigate();

  const tenderId = id ? BigInt(id) : null;
  const { data: tender, isLoading } = useTenderById(tenderId);
  const { data: allTenders } = useTenders();
  const { data: savedIds = [] } = useSavedTenders();
  const { data: profile } = useUserProfile();
  const saveMutation = useSaveTender();
  const unsaveMutation = useUnsaveTender();

  const isSaved = useMemo(
    () => savedIds.some((sid) => sid.toString() === id),
    [savedIds, id],
  );

  const similarTenders = useMemo(() => {
    if (!tender || !allTenders) return [];
    return allTenders
      .filter((t) => t.category === tender.category && t.id !== tender.id)
      .slice(0, 4);
  }, [tender, allTenders]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Skeleton className="h-8 w-32 mb-6" />
        <Skeleton className="h-10 w-2/3 mb-4" />
        <div className="grid md:grid-cols-2 gap-4">
          {["s0", "s1", "s2", "s3", "s4", "s5"].map((key) => (
            <Skeleton key={key} className="h-24 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!tender) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="font-display text-xl font-bold mb-2">
          Tender not found
        </h2>
        <p className="text-muted-foreground mb-4">
          This tender may have been removed or the ID is invalid.
        </p>
        <Button
          onClick={() => void navigate({ to: "/tenders" })}
          variant="outline"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Tenders
        </Button>
      </div>
    );
  }

  const days = daysRemaining(tender.deadline);
  const isUrgent = days <= 3 && days > 0;
  const isClosingSoon = days <= 7 && days > 3;
  const isExpired = days <= 0;
  const relevance = computeRelevanceScore(tender, profile);
  const fit = computeFitScore(tender, profile);
  const riskClass = riskBgClass(tender.riskLevel);
  const deadline = formatDeadline(tender.deadline);
  const createdDate = nsToDate(tender.createdAt).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const handleToggleSave = () => {
    if (isSaved) {
      unsaveMutation.mutate(tender.id, {
        onSuccess: () => toast.success("Removed from saved"),
        onError: () => toast.error("Failed to unsave"),
      });
    } else {
      saveMutation.mutate(tender.id, {
        onSuccess: () => toast.success("Tender saved"),
        onError: () => toast.error("Failed to save"),
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header bar */}
      <div className="navy-bg border-b border-white/10 py-4">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-center gap-3 mb-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => void navigate({ to: "/tenders" })}
              className="text-white/70 hover:text-white hover:bg-white/10 h-8 px-2"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
            <span className="text-white/30 text-xs">/</span>
            <span className="text-white/60 text-xs">Tender Details</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap gap-1.5 mb-2">
                <Badge className="bg-white/15 text-white border-white/20 text-xs">
                  {tender.category}
                </Badge>
                <Badge className="bg-white/10 text-white/80 border-white/15 text-xs">
                  {tender.department}
                </Badge>
                {isUrgent && (
                  <Badge className="bg-destructive text-white text-xs font-bold gap-1 pulse-urgent">
                    <Zap className="w-3 h-3" /> URGENT
                  </Badge>
                )}
                {isClosingSoon && !isUrgent && (
                  <Badge className="bg-amber-500 text-white text-xs font-semibold">
                    CLOSING SOON
                  </Badge>
                )}
              </div>
              <h1 className="font-display text-xl md:text-2xl font-bold text-white leading-tight">
                {tender.name}
              </h1>
            </div>
            <Button
              onClick={handleToggleSave}
              disabled={saveMutation.isPending || unsaveMutation.isPending}
              variant="outline"
              size="sm"
              className={`flex-shrink-0 h-8 gap-1.5 text-xs ${
                isSaved
                  ? "bg-gold/20 border-gold/40 text-gold hover:bg-gold/30"
                  : "bg-white/10 border-white/20 text-white hover:bg-white/20"
              }`}
            >
              {isSaved ? (
                <>
                  <BookmarkCheck className="w-3.5 h-3.5" /> Saved
                </>
              ) : (
                <>
                  <Bookmark className="w-3.5 h-3.5" /> Save
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl py-6">
        <div className="grid lg:grid-cols-3 gap-5">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Deadline countdown */}
            <Card
              className={`border-2 ${isUrgent ? "border-destructive/40 bg-destructive/5" : isClosingSoon ? "border-amber-200 bg-amber-50/50" : "border-border"}`}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${isUrgent ? "bg-destructive/10" : isClosingSoon ? "bg-amber-100" : "bg-primary/10"}`}
                >
                  <Clock
                    className={`w-6 h-6 ${isUrgent ? "text-destructive" : isClosingSoon ? "text-amber-600" : "text-primary"}`}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span
                      className={`font-display text-2xl font-bold ${isUrgent ? "text-destructive" : isClosingSoon ? "text-amber-700" : "text-foreground"}`}
                    >
                      {isExpired
                        ? "Deadline Passed"
                        : `${days} day${days !== 1 ? "s" : ""} remaining`}
                    </span>
                    {!isExpired && (
                      <span className="text-muted-foreground text-sm">
                        until deadline
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
                    <CalendarDays className="w-3.5 h-3.5" />
                    Closes on {deadline}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  Description
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {tender.description}
                </p>
              </CardContent>
            </Card>

            {/* AI Summary */}
            <Card className="border-primary/20 bg-primary/[0.02]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Brain className="w-4 h-4 text-primary" />
                  AI Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="bg-primary/5 border border-primary/15 rounded-lg p-3">
                  <p className="text-sm leading-relaxed text-foreground">
                    {tender.summary}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Risk Analysis */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-muted-foreground" />
                    Risk Analysis
                  </CardTitle>
                  <Badge
                    className={`text-xs font-bold px-2.5 py-0.5 ${riskClass}`}
                  >
                    {tender.riskLevel} RISK
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {tender.riskReasons.length > 0 ? (
                  <ul className="space-y-1.5">
                    {tender.riskReasons.map((reason) => (
                      <li
                        key={reason}
                        className="flex items-start gap-2 text-sm"
                      >
                        <XCircle
                          className={`w-4 h-4 flex-shrink-0 mt-0.5 ${tender.riskLevel === "LOW" ? "text-emerald-500" : tender.riskLevel === "MEDIUM" ? "text-amber-500" : "text-destructive"}`}
                        />
                        <span className="text-muted-foreground">{reason}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-emerald-600">
                    <CheckCircle2 className="w-4 h-4" />
                    No major risk factors identified.
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Relevance Tags */}
            {tender.relevanceTags.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                    Relevance Tags
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-1.5">
                    {tender.relevanceTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-xs capitalize"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Similar Tenders */}
            {similarTenders.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    Similar Tenders
                    <Badge variant="outline" className="text-xs ml-1">
                      {tender.category}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {similarTenders.map((st) => {
                      const sDays = daysRemaining(st.deadline);
                      return (
                        <Link
                          key={st.id.toString()}
                          to="/tenders/$id"
                          params={{ id: st.id.toString() }}
                          className="flex items-center justify-between p-2.5 rounded-lg border border-border hover:border-primary/30 hover:bg-accent/50 transition-all group"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                              {st.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {st.department} · {st.budget}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                            <Badge
                              className={`text-[10px] ${riskBgClass(st.riskLevel)}`}
                            >
                              {st.riskLevel}
                            </Badge>
                            <span
                              className={`text-xs font-medium ${sDays <= 3 ? "text-destructive" : sDays <= 7 ? "text-amber-600" : "text-muted-foreground"}`}
                            >
                              {sDays > 0 ? `${sDays}d` : "Expired"}
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Scores */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">
                  Your Scores
                </CardTitle>
                {!profile && (
                  <p className="text-xs text-muted-foreground">
                    <Link
                      to="/profile"
                      className="text-primary hover:underline"
                    >
                      Complete your profile
                    </Link>{" "}
                    for accurate scores.
                  </p>
                )}
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                {/* Relevance */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium flex items-center gap-1.5">
                      <Brain className="w-3.5 h-3.5 text-primary" />
                      Relevance Score
                    </span>
                    <span
                      className={`text-sm font-bold ${scoreColor(relevance)}`}
                    >
                      {relevance}%
                    </span>
                  </div>
                  <div className="score-bar">
                    <div
                      className={`h-full rounded-full ${scoreBarColor(relevance)}`}
                      style={{ width: `${relevance}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {relevance >= 80
                      ? "Excellent match for your industry"
                      : relevance >= 60
                        ? "Good match for your profile"
                        : "Limited match — consider other categories"}
                  </p>
                </div>

                <Separator />

                {/* Fit */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-emerald-600" />
                      Company Fit Score
                    </span>
                    <span className={`text-sm font-bold ${scoreColor(fit)}`}>
                      {fit}%
                    </span>
                  </div>
                  <div className="score-bar">
                    <div
                      className={`h-full rounded-full ${scoreBarColor(fit)}`}
                      style={{ width: `${fit}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Based on{" "}
                    {profile
                      ? `${Number(profile.experience)} years experience`
                      : "your profile"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Details */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">
                  Tender Details
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <dl className="space-y-2.5">
                  {[
                    {
                      icon: Building2,
                      label: "Department",
                      value: tender.department,
                    },
                    { icon: MapPin, label: "Location", value: tender.location },
                    {
                      icon: IndianRupee,
                      label: "Budget",
                      value: tender.budget,
                    },
                    { icon: Shield, label: "EMD", value: tender.emd },
                    {
                      icon: Users,
                      label: "Eligibility",
                      value: tender.eligibility,
                    },
                    {
                      icon: CalendarDays,
                      label: "Published",
                      value: createdDate,
                    },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-2.5">
                      <Icon className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide block">
                          {label}
                        </span>
                        <span className="text-xs text-foreground font-medium">
                          {value}
                        </span>
                      </div>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-2">
              <Button
                onClick={handleToggleSave}
                disabled={saveMutation.isPending || unsaveMutation.isPending}
                variant={isSaved ? "outline" : "default"}
                className={`w-full h-9 gap-2 text-sm font-medium ${!isSaved ? "bg-navy hover:bg-navy-light text-white" : ""}`}
              >
                {isSaved ? (
                  <>
                    <BookmarkCheck className="w-4 h-4" /> Remove from Saved
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4" /> Save This Tender
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full h-9 text-sm"
                onClick={() => void navigate({ to: "/tenders" })}
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                Back to All Tenders
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
