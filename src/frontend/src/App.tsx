import { Toaster } from "@/components/ui/sonner";
import {
  Navigate,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  useNavigate,
} from "@tanstack/react-router";
import { Loader2, Shield } from "lucide-react";
import { Navbar } from "./components/Navbar";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { LandingPage } from "./pages/LandingPage";
import { ProfilePage } from "./pages/ProfilePage";
import { SavedTendersPage } from "./pages/SavedTendersPage";
import { TenderDetailPage } from "./pages/TenderDetailPage";
import { TendersPage } from "./pages/TendersPage";

// Root layout
function RootLayout() {
  const { identity, isInitializing } = useInternetIdentity();
  const isAuthenticated = !!identity;

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center navy-bg">
        <div className="flex flex-col items-center gap-4 text-white">
          <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center shadow-lg animate-pulse">
            <Shield className="w-6 h-6 text-navy" />
          </div>
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-gold" />
            <span className="text-white/70 text-sm font-medium">
              Loading TenderSmart...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LandingPage />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="py-4 border-t border-border bg-card">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-xs">
            © {new Date().getFullYear()} TenderSmart Portal. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              className="text-primary hover:underline font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

function IndexRedirect() {
  const { identity, isInitializing } = useInternetIdentity();
  const navigate = useNavigate();
  if (!isInitializing && identity) {
    void navigate({ to: "/tenders" });
  }
  return null;
}

// Route definitions
const rootRoute = createRootRoute({
  component: RootLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: IndexRedirect,
});

const tendersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tenders",
  component: TendersPage,
});

const tenderDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tenders/$id",
  component: TenderDetailPage,
});

const savedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/saved",
  component: SavedTendersPage,
});

const analyticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/analytics",
  component: AnalyticsPage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: ProfilePage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  tendersRoute,
  tenderDetailRoute,
  savedRoute,
  analyticsRoute,
  profileRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster richColors position="top-right" />
    </>
  );
}
