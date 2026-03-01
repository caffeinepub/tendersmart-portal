import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertTriangle,
  BarChart3,
  Building2,
  CheckCircle2,
  FileText,
  Tag,
  TrendingUp,
} from "lucide-react";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAnalytics, useTenders } from "../hooks/useQueries";
import { daysRemaining } from "../utils/scoring";

const RISK_COLORS = {
  HIGH: "#dc2626",
  MEDIUM: "#d97706",
  LOW: "#16a34a",
};

const PIE_COLORS = [
  "#1e3a6e",
  "#2563eb",
  "#7c3aed",
  "#db2777",
  "#ea580c",
  "#d97706",
  "#16a34a",
  "#0891b2",
  "#6d28d9",
  "#b45309",
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; fill: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-lg text-xs">
        <p className="font-semibold text-foreground mb-0.5">{label}</p>
        {payload.map((p) => (
          <p key={p.name} style={{ color: p.fill }} className="font-medium">
            {p.value} tenders
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export function AnalyticsPage() {
  const { data: analytics, isLoading } = useAnalytics();
  const { data: tenders } = useTenders();

  const urgentCount = useMemo(() => {
    if (!tenders) return 0;
    return tenders.filter(
      (t) => daysRemaining(t.deadline) <= 7 && daysRemaining(t.deadline) > 0,
    ).length;
  }, [tenders]);

  const deptData = useMemo(() => {
    if (!analytics) return [];
    return analytics.departmentCounts
      .map(([dept, count]) => ({ name: dept, value: Number(count) }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [analytics]);

  const catData = useMemo(() => {
    if (!analytics) return [];
    return analytics.categoryCounts
      .map(([cat, count]) => ({ name: cat, value: Number(count) }))
      .sort((a, b) => b.value - a.value);
  }, [analytics]);

  const riskData = [
    {
      name: "HIGH",
      value: analytics ? Number(analytics.highRiskCount) : 0,
      fill: RISK_COLORS.HIGH,
    },
    {
      name: "MEDIUM",
      value: analytics ? Number(analytics.mediumRiskCount) : 0,
      fill: RISK_COLORS.MEDIUM,
    },
    {
      name: "LOW",
      value: analytics ? Number(analytics.lowRiskCount) : 0,
      fill: RISK_COLORS.LOW,
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="navy-bg border-b border-white/10 py-6">
          <div className="container mx-auto px-4">
            <Skeleton className="h-8 w-48 bg-white/10" />
          </div>
        </div>
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {["a0", "a1", "a2", "a3"].map((key) => (
              <Skeleton key={key} className="h-24 rounded-lg" />
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {["b0", "b1", "b2"].map((key) => (
              <Skeleton key={key} className="h-72 rounded-lg" />
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
              <BarChart3 className="w-5 h-5 text-gold" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-white">
                Analytics Dashboard
              </h1>
              <p className="text-white/55 text-sm">
                Tender trends and market insights
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-primary" />
                </div>
              </div>
              <div className="font-display text-2xl font-bold navy-text">
                {analytics
                  ? Number(analytics.totalTenders).toLocaleString()
                  : "—"}
              </div>
              <div className="text-xs text-muted-foreground font-medium mt-0.5">
                Total Tenders
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-red-100">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                </div>
              </div>
              <div className="font-display text-2xl font-bold text-red-600">
                {analytics
                  ? Number(analytics.highRiskCount).toLocaleString()
                  : "—"}
              </div>
              <div className="text-xs text-muted-foreground font-medium mt-0.5">
                High Risk
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-amber-100">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                </div>
              </div>
              <div className="font-display text-2xl font-bold text-amber-600">
                {analytics
                  ? Number(analytics.mediumRiskCount).toLocaleString()
                  : "—"}
              </div>
              <div className="text-xs text-muted-foreground font-medium mt-0.5">
                Medium Risk
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-emerald-100">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
              </div>
              <div className="font-display text-2xl font-bold text-emerald-600">
                {analytics
                  ? Number(analytics.lowRiskCount).toLocaleString()
                  : "—"}
              </div>
              <div className="text-xs text-muted-foreground font-medium mt-0.5">
                Low Risk
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Secondary stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="shadow-card border-amber-100 bg-amber-50/40">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <div className="font-display text-xl font-bold text-amber-700">
                  {urgentCount}
                </div>
                <div className="text-xs text-amber-600/80 font-medium">
                  Closing in 7 days
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="font-display text-xl font-bold navy-text">
                  {deptData.length}
                </div>
                <div className="text-xs text-muted-foreground font-medium">
                  Active Departments
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts row */}
        <div className="grid lg:grid-cols-3 gap-5">
          {/* Department bar chart */}
          <Card className="lg:col-span-2 shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                Tenders by Department
              </CardTitle>
            </CardHeader>
            <CardContent>
              {deptData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart
                    data={deptData}
                    layout="vertical"
                    margin={{ left: 8, right: 16, top: 4, bottom: 4 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      horizontal={false}
                      stroke="oklch(0.88 0.015 258)"
                    />
                    <XAxis
                      type="number"
                      tick={{ fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      dataKey="name"
                      type="category"
                      width={120}
                      tick={{ fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="value"
                      radius={[0, 4, 4, 0]}
                      fill="oklch(0.26 0.07 258)"
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-72 flex items-center justify-center text-muted-foreground text-sm">
                  No department data available
                </div>
              )}
            </CardContent>
          </Card>

          {/* Risk distribution */}
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-muted-foreground" />
                Risk Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={riskData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {riskData.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0];
                        return (
                          <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-lg text-xs">
                            <p
                              className="font-semibold"
                              style={{ color: d.payload.fill }}
                            >
                              {d.name}
                            </p>
                            <p className="text-foreground">
                              {String(d.value)} tenders
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {riskData.map((d) => (
                  <div
                    key={d.name}
                    className="flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-1.5">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: d.fill }}
                      />
                      <span className="text-muted-foreground">
                        {d.name} Risk
                      </span>
                    </div>
                    <span className="font-semibold" style={{ color: d.fill }}>
                      {d.value}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category pie chart */}
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Tag className="w-4 h-4 text-muted-foreground" />
              Tenders by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            {catData.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4 items-center">
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={catData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {catData.map((entry, index) => (
                        <Cell
                          key={entry.name}
                          fill={PIE_COLORS[index % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const d = payload[0];
                          return (
                            <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-lg text-xs">
                              <p className="font-semibold text-foreground">
                                {d.name}
                              </p>
                              <p className="text-muted-foreground">
                                {String(d.value)} tenders
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-1.5">
                  {catData.map((d, index) => (
                    <div
                      key={d.name}
                      className="flex items-center gap-1.5 text-xs"
                    >
                      <div
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor:
                            PIE_COLORS[index % PIE_COLORS.length],
                        }}
                      />
                      <span className="text-muted-foreground truncate">
                        {d.name}
                      </span>
                      <span className="font-semibold text-foreground ml-auto">
                        {d.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
                No category data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
