import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import {
  Bookmark,
  BookmarkCheck,
  Building2,
  ChevronRight,
  Clock,
  IndianRupee,
  MapPin,
  TrendingUp,
  Zap,
} from "lucide-react";
import type { Tender, UserProfile } from "../backend.d";
import {
  computeFitScore,
  computeRelevanceScore,
  daysRemaining,
  formatDeadline,
  riskBgClass,
  scoreBarColor,
  scoreColor,
} from "../utils/scoring";

interface TenderCardProps {
  tender: Tender;
  profile: UserProfile | null | undefined;
  isSaved: boolean;
  onSave: (id: bigint) => void;
  onUnsave: (id: bigint) => void;
  savePending?: boolean;
}

export function TenderCard({
  tender,
  profile,
  isSaved,
  onSave,
  onUnsave,
  savePending,
}: TenderCardProps) {
  const days = daysRemaining(tender.deadline);
  const isUrgent = days <= 3 && days > 0;
  const isClosingSoon = days <= 7 && days > 3;
  const isExpired = days <= 0;

  const relevanceScore = computeRelevanceScore(tender, profile);
  const fitScore = computeFitScore(tender, profile);
  const riskClass = riskBgClass(tender.riskLevel);

  return (
    <Card className="group card-hover shadow-card hover:shadow-card-hover border-border/70 overflow-hidden relative">
      {/* Urgency accent line */}
      {isUrgent && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-destructive pulse-urgent" />
      )}
      {isClosingSoon && !isUrgent && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-amber-400" />
      )}

      <CardContent className="p-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap gap-1.5 mb-1.5">
              <Badge
                variant="outline"
                className="text-[10px] font-medium border-primary/20 text-primary bg-primary/5"
              >
                {tender.category}
              </Badge>
              {isUrgent && (
                <Badge className="text-[10px] font-bold bg-destructive text-white gap-1 px-1.5 py-0.5 pulse-urgent">
                  <Zap className="w-2.5 h-2.5" />
                  URGENT
                </Badge>
              )}
              {isClosingSoon && !isUrgent && (
                <Badge className="text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                  CLOSING SOON
                </Badge>
              )}
            </div>
            <h3 className="font-display font-semibold text-sm leading-snug text-foreground line-clamp-2 group-hover:text-primary transition-colors">
              {tender.name}
            </h3>
          </div>
          <button
            type="button"
            onClick={() => (isSaved ? onUnsave(tender.id) : onSave(tender.id))}
            disabled={savePending}
            className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-md hover:bg-accent transition-colors disabled:opacity-50"
            title={isSaved ? "Remove from saved" : "Save tender"}
          >
            {isSaved ? (
              <BookmarkCheck className="w-4 h-4 text-primary fill-primary" />
            ) : (
              <Bookmark className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        </div>

        {/* Meta info */}
        <div className="flex flex-col gap-1 mb-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Building2 className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{tender.department}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{tender.location}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <IndianRupee className="w-3 h-3 flex-shrink-0" />
            <span className="font-medium text-foreground/80">
              {tender.budget}
            </span>
          </div>
        </div>

        {/* Deadline */}
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium mb-3 ${
            isUrgent
              ? "bg-destructive/10 text-destructive"
              : isClosingSoon
                ? "bg-amber-50 text-amber-700"
                : isExpired
                  ? "bg-muted text-muted-foreground"
                  : "bg-primary/5 text-primary/80"
          }`}
        >
          <Clock className="w-3 h-3 flex-shrink-0" />
          {isExpired ? (
            <span>Deadline passed</span>
          ) : (
            <>
              <span>
                Closes in{" "}
                <strong>
                  {days} day{days !== 1 ? "s" : ""}
                </strong>
              </span>
              <span className="ml-auto text-[10px] font-normal opacity-70">
                {formatDeadline(tender.deadline)}
              </span>
            </>
          )}
        </div>

        {/* Scores row */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          {/* Risk */}
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-medium text-muted-foreground uppercase tracking-wide">
              Risk
            </span>
            <span
              className={`text-xs font-bold px-1.5 py-0.5 rounded-sm border text-center ${riskClass}`}
            >
              {tender.riskLevel}
            </span>
          </div>

          {/* Relevance */}
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-medium text-muted-foreground uppercase tracking-wide">
              Relevance
            </span>
            <div className="flex flex-col gap-0.5">
              <span
                className={`text-xs font-bold ${scoreColor(relevanceScore)}`}
              >
                {relevanceScore}%
              </span>
              <div className="score-bar">
                <div
                  className={`h-full rounded-full transition-all ${scoreBarColor(relevanceScore)}`}
                  style={{ width: `${relevanceScore}%` }}
                />
              </div>
            </div>
          </div>

          {/* Fit */}
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-medium text-muted-foreground uppercase tracking-wide">
              Fit Score
            </span>
            <div className="flex flex-col gap-0.5">
              <span className={`text-xs font-bold ${scoreColor(fitScore)}`}>
                {fitScore}%
              </span>
              <div className="score-bar">
                <div
                  className={`h-full rounded-full transition-all ${scoreBarColor(fitScore)}`}
                  style={{ width: `${fitScore}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <Link to="/tenders/$id" params={{ id: tender.id.toString() }}>
          <Button
            size="sm"
            className="w-full h-7 text-xs font-medium bg-navy hover:bg-navy-light text-white group/btn"
          >
            View Details
            <ChevronRight className="w-3 h-3 ml-1 group-hover/btn:translate-x-0.5 transition-transform" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
