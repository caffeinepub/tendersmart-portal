import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  Briefcase,
  Building2,
  CheckCircle2,
  Clock,
  IndianRupee,
  Loader2,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useUpdateUserProfile, useUserProfile } from "../hooks/useQueries";

const INDUSTRIES = [
  "IT",
  "Construction",
  "Healthcare",
  "Education",
  "Infrastructure",
  "Finance",
  "Defence",
  "Agriculture",
  "Manufacturing",
  "Consulting",
  "Other",
];

const TURNOVER_OPTIONS = [
  "Below ₹1 Crore",
  "₹1 - 5 Crore",
  "₹5 - 25 Crore",
  "₹25 - 100 Crore",
  "₹100 - 500 Crore",
  "Above ₹500 Crore",
];

function getCompletionScore(profile: {
  name: string;
  company: string;
  industry: string;
  turnover: string;
  experience: string;
}): number {
  const fields = [
    profile.name,
    profile.company,
    profile.industry,
    profile.turnover,
    profile.experience,
  ];
  const filled = fields.filter((f) => f && f.trim() !== "").length;
  return Math.round((filled / fields.length) * 100);
}

export function ProfilePage() {
  const { data: profile, isLoading } = useUserProfile();
  const { identity } = useInternetIdentity();
  const updateMutation = useUpdateUserProfile();

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [industry, setIndustry] = useState("");
  const [turnover, setTurnover] = useState("");
  const [experience, setExperience] = useState("");
  const [saved, setSaved] = useState(false);

  // Populate form when profile loads
  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setCompany(profile.company || "");
      setIndustry(profile.industry || "");
      setTurnover(profile.turnover || "");
      setExperience(profile.experience ? profile.experience.toString() : "");
    }
  }, [profile]);

  const completionScore = getCompletionScore({
    name,
    company,
    industry,
    turnover,
    experience,
  });
  const principal = identity?.getPrincipal().toString();
  const shortPrincipal = principal
    ? `${principal.slice(0, 10)}...${principal.slice(-8)}`
    : "";

  const handleSave = () => {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!company.trim()) {
      toast.error("Company name is required");
      return;
    }

    const exp = experience
      ? BigInt(Math.max(0, Number.parseInt(experience) || 0))
      : BigInt(0);

    updateMutation.mutate(
      {
        name: name.trim(),
        company: company.trim(),
        industry,
        turnover,
        experience: exp,
      },
      {
        onSuccess: () => {
          toast.success("Profile updated successfully");
          setSaved(true);
          setTimeout(() => setSaved(false), 3000);
        },
        onError: () => {
          toast.error("Failed to update profile");
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="navy-bg border-b border-white/10 py-6">
          <div className="container mx-auto px-4">
            <Skeleton className="h-8 w-40 bg-white/10" />
          </div>
        </div>
        <div className="container mx-auto px-4 py-6 max-w-2xl">
          <div className="space-y-4">
            {["p0", "p1", "p2", "p3", "p4"].map((key) => (
              <Skeleton key={key} className="h-12 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="navy-bg border-b border-white/10 py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gold/20 border border-gold/30 flex items-center justify-center">
              <User className="w-5 h-5 text-gold" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-white">
                My Profile
              </h1>
              <p className="text-white/55 text-sm">
                Manage your company and preferences
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Completion card */}
        <Card className="mb-5 shadow-card border-border/60">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold">Profile Completion</span>
              <Badge
                className={`text-xs font-bold ${
                  completionScore === 100
                    ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                    : completionScore >= 60
                      ? "bg-amber-100 text-amber-800 border-amber-200"
                      : "bg-red-100 text-red-800 border-red-200"
                }`}
              >
                {completionScore}%
              </Badge>
            </div>
            <Progress value={completionScore} className="h-2" />
            {completionScore < 100 && (
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
                <AlertCircle className="w-3 h-3" />
                Complete your profile to get accurate relevance and fit scores.
              </p>
            )}
            {completionScore === 100 && (
              <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3" />
                Your profile is complete. You'll get personalized AI scores for
                all tenders.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Identity */}
        <Card className="mb-5 shadow-card bg-muted/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">Internet Identity</p>
                <p className="text-xs font-mono text-muted-foreground">
                  {shortPrincipal}
                </p>
              </div>
              <Badge
                variant="outline"
                className="ml-auto text-xs text-emerald-700 border-emerald-200 bg-emerald-50"
              >
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Authenticated
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Form */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              Company Information
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              This information is used to compute your relevance and fit scores
              for tenders.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Name */}
            <div className="space-y-1.5">
              <Label
                htmlFor="name"
                className="text-sm font-medium flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5 text-muted-foreground" />
                Full Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g. Rajesh Kumar"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-9 text-sm"
              />
            </div>

            {/* Company */}
            <div className="space-y-1.5">
              <Label
                htmlFor="company"
                className="text-sm font-medium flex items-center gap-1.5"
              >
                <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                Company Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="company"
                placeholder="e.g. Sharma Infrastructure Pvt. Ltd."
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="h-9 text-sm"
              />
            </div>

            <Separator />

            {/* Industry */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-muted-foreground" />
                Industry / Sector
              </Label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Select your industry..." />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRIES.map((ind) => (
                    <SelectItem key={ind} value={ind} className="text-sm">
                      {ind}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-[10px] text-muted-foreground">
                Used to compute your relevance score for each tender.
              </p>
            </div>

            {/* Turnover */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium flex items-center gap-1.5">
                <IndianRupee className="w-3.5 h-3.5 text-muted-foreground" />
                Annual Turnover
              </Label>
              <Select value={turnover} onValueChange={setTurnover}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Select annual turnover range..." />
                </SelectTrigger>
                <SelectContent>
                  {TURNOVER_OPTIONS.map((t) => (
                    <SelectItem key={t} value={t} className="text-sm">
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Experience */}
            <div className="space-y-1.5">
              <Label
                htmlFor="experience"
                className="text-sm font-medium flex items-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                Years of Experience
              </Label>
              <Input
                id="experience"
                type="number"
                min="0"
                max="100"
                placeholder="e.g. 8"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="h-9 text-sm"
              />
              <p className="text-[10px] text-muted-foreground">
                Used to calculate your company fit score for tender eligibility.
              </p>
            </div>

            <Separator />

            <Button
              onClick={handleSave}
              disabled={updateMutation.isPending}
              className="w-full h-9 bg-navy hover:bg-navy-light text-white font-medium text-sm"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : saved ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-300" />
                  Saved Successfully!
                </>
              ) : (
                "Save Profile"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Saved tenders count */}
        {profile && profile.savedTenders.length > 0 && (
          <Card className="mt-4 shadow-card bg-primary/5 border-primary/15">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">Saved Tenders</p>
                <p className="text-xs text-muted-foreground">
                  You have {profile.savedTenders.length} tender
                  {profile.savedTenders.length !== 1 ? "s" : ""} bookmarked.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
