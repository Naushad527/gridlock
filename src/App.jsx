import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Ambulance,
  BarChart3,
  Bell,
  Bot,
  BrainCircuit,
  ChevronLeft,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Command,
  FileText,
  Home,
  LockKeyhole,
  Menu,
  Moon,
  Radio,
  RadioTower,
  Route,
  Search,
  Settings,
  ShieldCheck,
  Siren,
  Sun,
  TrafficCone,
  TrendingUp,
  Truck,
  UserCircle,
  Users,
} from "lucide-react";
import { BrowserRouter, Navigate, NavLink, Route as RouterRoute, Routes, useLocation } from "react-router-dom";
import CityMap from "./components/CityMap.jsx";
import {
  ActiveEventsPanel,
  BottomTimelinePanel,
  CopilotDock,
  DiversionPlannerPanel,
  EventSimulatorPanel,
  ResourceCommandPanel,
  RiskFeedPanel,
  SystemTelemetryPanel,
} from "./components/CommandPanels.jsx";
 
const health = [
  { label: "AI Core", value: "Synced", icon: BrainCircuit, tone: "text-[var(--success)]" },
  { label: "Safety Grid", value: "Operational", icon: ShieldCheck, tone: "text-[var(--accent)]" },
  { label: "Response", value: "Ready", icon: Radio, tone: "text-[var(--warning)]" },
];
 
const navigationSections = [
  {
    label: "Main Navigation",
    items: [
      { label: "Command Center", path: "/command-center", icon: Home },
      { label: "AI Traffic Copilot", path: "/traffic-copilot", icon: Bot },
      { label: "Diversion Planner", path: "/diversion-planner", icon: Route },
      { label: "Resource Command", path: "/resource-command", icon: Truck },
      { label: "Event Simulator", path: "/event-simulator", icon: RadioTower },
    ],
  },
  {
    label: "Operations",
    items: [
      { label: "Live Traffic", path: "/live-traffic", icon: TrafficCone },
      { label: "Incident Management", path: "/incident-management", icon: Siren },
      { label: "Emergency Routing", path: "/emergency-routing", icon: Ambulance },
      { label: "Dispatch Center", path: "/dispatch-center", icon: Radio },
    ],
  },
  {
    label: "Analytics",
    items: [
      { label: "Traffic Analytics", path: "/traffic-analytics", icon: TrendingUp },
      { label: "Reports", path: "/reports", icon: FileText },
      { label: "Predictions", path: "/predictions", icon: BarChart3 },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Settings", path: "/settings", icon: Settings },
      { label: "User Management", path: "/user-management", icon: Users },
      { label: "Audit Logs", path: "/audit-logs", icon: ClipboardList },
    ],
  },
];
 
const routeTitles = navigationSections
  .flatMap((section) => section.items)
  .reduce((acc, item) => {
    acc[item.path] = item.label;
    return acc;
  }, {});
 
function getInitialTheme() {
  if (typeof window === "undefined") return "light";
 
  const savedTheme = window.localStorage.getItem("gridlock-theme");
  if (savedTheme === "light" || savedTheme === "dark") return savedTheme;
 
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
 
function App() {
  const [theme, setTheme] = useState(getInitialTheme);
 
  useEffect(() => {
    document.documentElement.classList.remove("theme-light", "theme-dark");
    document.documentElement.classList.add(`theme-${theme}`);
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem("gridlock-theme", theme);
  }, [theme]);
 
  const toggleTheme = () => setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"));
 
  return (
    <BrowserRouter>
      <AppShell theme={theme} toggleTheme={toggleTheme} />
    </BrowserRouter>
  );
}
 
function AppShell({ theme, toggleTheme }) {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [now, setNow] = useState(new Date());
  const location = useLocation();
  const currentTitle = routeTitles[location.pathname] || "Command Center";
 
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);
 
  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);
 
  return (
    <main className="app-shell min-h-screen w-full">
      <div className="flex min-h-screen">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} drawerOpen={drawerOpen} />
 
        {drawerOpen && (
          <button
            aria-label="Close navigation drawer"
            className="fixed inset-0 z-30 bg-black/40 lg:hidden"
            onClick={() => setDrawerOpen(false)}
          />
        )}
 
        <div className="min-w-0 flex-1">
          <TopHeader
            currentTitle={currentTitle}
            now={now}
            theme={theme}
            toggleTheme={toggleTheme}
            openDrawer={() => setDrawerOpen(true)}
          />
 
          <section className="mx-auto w-full max-w-[1800px] p-4 lg:p-6">
            <Routes>
              <RouterRoute path="/" element={<Navigate to="/command-center" replace />} />
              <RouterRoute path="/command-center" element={<CommandCenterPage />} />
              <RouterRoute path="/traffic-copilot" element={<CopilotPage />} />
              <RouterRoute path="/diversion-planner" element={<DiversionPage />} />
              <RouterRoute path="/resource-command" element={<ResourcePage />} />
              <RouterRoute path="/event-simulator" element={<SimulatorPage />} />
              <RouterRoute path="/live-traffic" element={<LiveTrafficPage />} />
              <RouterRoute path="/incident-management" element={<IncidentPage />} />
              <RouterRoute path="/emergency-routing" element={<EmergencyRoutingPage />} />
              <RouterRoute path="/dispatch-center" element={<DispatchPage />} />
              <RouterRoute path="/traffic-analytics" element={<AnalyticsPage />} />
              <RouterRoute path="/reports" element={<ReportsPage />} />
              <RouterRoute path="/predictions" element={<PredictionsPage />} />
              <RouterRoute path="/settings" element={<SettingsPage />} />
              <RouterRoute path="/user-management" element={<UserManagementPage />} />
              <RouterRoute path="/audit-logs" element={<AuditLogsPage />} />
              <RouterRoute path="*" element={<Navigate to="/command-center" replace />} />
            </Routes>
          </section>
        </div>
      </div>
    </main>
  );
}
 
function Sidebar({ collapsed, setCollapsed, drawerOpen }) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex border-r border-[var(--border)] bg-[var(--surface)] transition-all duration-200 lg:sticky ${
        drawerOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      } ${collapsed ? "lg:w-[72px]" : "lg:w-[260px]"} w-[260px]`}
    >
      <div className="flex min-h-0 w-full flex-col">
        <div className={`flex h-16 items-center border-b border-[var(--border)] ${collapsed ? "justify-center px-2" : "gap-3 px-4"}`}>
          {!collapsed && (
            <>
              <div className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-[var(--accent)] text-white">
                <Command className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-base font-extrabold tracking-tight text-[var(--text)]">GRIDLOCK AI</div>
                <div className="truncate text-xs font-medium text-[var(--muted)]">Smart City Platform</div>
              </div>
            </>
          )}
          <button
            onClick={() => setCollapsed((value) => !value)}
            className="hidden h-10 w-10 flex-none place-items-center rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--muted-strong)] transition hover:bg-[var(--card-subtle)] lg:grid"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <Menu className="h-5 w-5" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>
 
        <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-4" aria-label="Primary navigation">
          {navigationSections.map((section) => (
            <div key={section.label} className="mb-5">
              {!collapsed && (
                <div className="mb-2 px-2 text-[11px] font-bold uppercase tracking-wide text-[var(--muted)]">
                  {section.label}
                </div>
              )}
              <div className="space-y-1">
                {section.items.map((item) => (
                  <SidebarLink key={item.path} item={item} collapsed={collapsed} />
                ))}
              </div>
            </div>
          ))}
        </nav>
 
        <div className="border-t border-[var(--border)] p-3">
          <div className={`rounded-lg bg-[var(--card-subtle)] p-2 text-xs text-[var(--muted)] ${collapsed ? "text-center" : ""}`}>
            {collapsed ? "Live" : "Operator workspace synced"}
          </div>
        </div>
      </div>
    </aside>
  );
}
 
function SidebarLink({ item, collapsed }) {
  return (
    <NavLink
      to={item.path}
      title={collapsed ? item.label : undefined}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
          isActive
            ? "bg-[var(--accent-soft)] text-[var(--accent)]"
            : "text-[var(--muted-strong)] hover:bg-[var(--card-subtle)] hover:text-[var(--text)]"
        } ${collapsed ? "justify-center" : ""}`
      }
    >
      <item.icon className="h-5 w-5 flex-none" />
      {!collapsed && <span className="truncate">{item.label}</span>}
    </NavLink>
  );
}
 
function TopHeader({ currentTitle, now, theme, toggleTheme, openDrawer }) {
  return (
    <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--surface)]/95 px-4 py-3 shadow-sm backdrop-blur lg:px-6">
      <div className="mx-auto flex max-w-[1800px] flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={openDrawer}
            className="grid h-10 w-10 place-items-center rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--muted-strong)] lg:hidden"
            aria-label="Open navigation drawer"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[var(--text)]">{currentTitle}</h1>
            <p className="text-sm text-[var(--muted)]">Delhi NCR Smart City Traffic Operations</p>
          </div>
        </div>
 
        <div className="flex flex-1 justify-center">
          <label className="hidden w-full max-w-md items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--muted)] md:flex">
            <Search className="h-4 w-4" />
            <span className="sr-only">Global search</span>
            <input
              className="w-full bg-transparent text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none"
              placeholder="Search incidents, corridors, units..."
            />
          </label>
        </div>
 
        <div className="flex flex-wrap items-center justify-end gap-2">
          <StatusPill icon={Radio} label="System" value="Operational" tone="text-[var(--success)]" />
          <StatusPill icon={Clock3} label="IST" value={now.toLocaleTimeString("en-IN")} tone="text-[var(--accent)]" />
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--card-subtle)]"
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            {theme === "light" ? "Dark" : "Light"}
          </button>
          <button className="grid h-10 w-10 place-items-center rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--muted-strong)] transition hover:bg-[var(--card-subtle)]" aria-label="Notifications">
            <Bell className="h-4 w-4" />
          </button>
          <button className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--card-subtle)]">
            <UserCircle className="h-4 w-4 text-[var(--muted)]" />
            Operator
          </button>
        </div>
      </div>
    </header>
  );
}
 
function StatusPill({ icon: Icon, label, value, tone }) {
  return (
    <div className="hidden rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 sm:block">
      <div className="flex items-center gap-2">
        <Icon className={`h-4 w-4 ${tone}`} />
        <span className="text-[11px] font-semibold text-[var(--muted)]">{label}</span>
      </div>
      <div className={`mt-0.5 text-sm font-bold ${tone}`}>{value}</div>
    </div>
  );
}
 
function PageTransition({ children }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="space-y-5">
      {children}
    </motion.div>
  );
}
 
function ThreeColumnWorkspace({ left, right, bottom, mapPage = "Command Center", title, description, highlights = [] }) {
  return (
    <PageTransition>
      {title && <WorkspaceBanner title={title} description={description} highlights={highlights} />}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[300px_minmax(0,1fr)_320px]">
        <div className="flex flex-col gap-5 xl:order-1">{left}</div>
        <div className="min-h-[560px] xl:order-2">
          <CityMap activePage={mapPage} />
        </div>
        <div className="flex flex-col gap-5 xl:order-3">{right}</div>
      </div>
      {bottom}
    </PageTransition>
  );
}
 
function WorkspaceBanner({ title, description, highlights }) {
  return (
    <div className="glass-panel p-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[var(--text)]">{title}</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">{description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {highlights.map((item) => (
            <div key={item.label} className="rounded-lg border border-[var(--border)] bg-[var(--card-subtle)] px-3 py-2">
              <div className="text-[11px] font-medium text-[var(--muted)]">{item.label}</div>
              <div className={`text-sm font-bold ${item.tone || "text-[var(--text)]"}`}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
 
function ModuleActionPanel({ icon: Icon, title, eyebrow, actions }) {
  return (
    <div className="glass-panel p-4">
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4 text-[var(--accent)]" />
        <div>
          <div className="text-xs font-semibold text-[var(--muted)]">{eyebrow}</div>
          <h2 className="text-base font-bold text-[var(--text)]">{title}</h2>
        </div>
      </div>
      <div className="space-y-2">
        {actions.map((action) => (
          <div key={action.label} className="rounded-lg border border-[var(--border)] bg-[var(--card-subtle)] p-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-[var(--text)]">{action.label}</span>
              <span className={`text-sm font-bold ${action.tone || "text-[var(--accent)]"}`}>{action.value}</span>
            </div>
            <p className="mt-1 text-xs leading-5 text-[var(--muted)]">{action.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
 
function CommandCenterPage() {
  return (
    <ThreeColumnWorkspace
      mapPage="Command Center"
      title="Citywide Operations Overview"
      description="Executive view for live traffic conditions, active incidents, emergency alerts, and AI-assisted control decisions."
      highlights={[
        { label: "City load", value: "82%", tone: "text-[var(--danger)]" },
        { label: "Open missions", value: "38", tone: "text-[var(--accent)]" },
        { label: "Response SLA", value: "96%", tone: "text-[var(--success)]" },
      ]}
      left={
        <>
          <ActiveEventsPanel />
          <RiskFeedPanel />
        </>
      }
      right={
        <>
          <SystemHealthSummary />
          <ModuleActionPanel
            icon={CheckCircle2}
            eyebrow="Command Actions"
            title="Operations Checklist"
            actions={[
              { label: "Stabilize ITO Junction", value: "Priority 1", tone: "text-[var(--danger)]", detail: "Approve signal timing override and keep eastbound lanes open." },
              { label: "Monitor AI diversions", value: "Live", tone: "text-[var(--accent)]", detail: "Track route adoption across Ring Road and Mathura Road." },
              { label: "Escalation window", value: "8 min", tone: "text-[var(--warning)]", detail: "Notify senior duty officer if load remains above 85%." },
            ]}
          />
        </>
      }
      bottom={<BottomTimelinePanel />}
    />
  );
}
 
function CopilotPage() {
  return (
    <ThreeColumnWorkspace
      mapPage="AI Traffic Copilot"
      title="AI Traffic Copilot Workspace"
      description="Operational AI assistant for recommendations, confidence scores, signal plans, and congestion predictions."
      highlights={[
        { label: "AI confidence", value: "97.4%", tone: "text-[var(--success)]" },
        { label: "Signal plan", value: "Green wave", tone: "text-[var(--accent)]" },
        { label: "Risk posture", value: "Amber", tone: "text-[var(--warning)]" },
      ]}
      left={<CopilotDock />}
      right={
        <>
          <AIRecommendationSummary />
          <ModuleActionPanel
            icon={BrainCircuit}
            eyebrow="AI Decision Support"
            title="Recommended Interventions"
            actions={[
              { label: "Optimize signals", value: "11 nodes", tone: "text-[var(--accent)]", detail: "Apply four-cycle green wave between AIIMS and Safdarjung." },
              { label: "Diversion suggestion", value: "ALPHA-9", tone: "text-[var(--success)]", detail: "Expected 18 minute travel-time saving for airport corridor." },
              { label: "Prediction horizon", value: "24 min", tone: "text-[var(--warning)]", detail: "Congestion probability rises if convoy corridor is delayed." },
            ]}
          />
        </>
      }
      bottom={<BottomTimelinePanel mode="copilot" />}
    />
  );
}
 
function DiversionPage() {
  return (
    <ThreeColumnWorkspace
      mapPage="Diversion Planner"
      title="Diversion Planning Workspace"
      description="Plan alternate corridors, simulate load balancing, and approve public-facing traffic advisories."
      highlights={[
        { label: "Best route", value: "ALPHA-9", tone: "text-[var(--success)]" },
        { label: "Load shifted", value: "32%", tone: "text-[var(--accent)]" },
        { label: "Travel saved", value: "18 min", tone: "text-[var(--warning)]" },
      ]}
      left={<DiversionPlannerPanel />}
      right={
        <ModuleActionPanel
          icon={Route}
          eyebrow="Corridor Plan"
          title="Diversion Controls"
          actions={[
            { label: "Publish advisory", value: "Ready", tone: "text-[var(--success)]", detail: "Send route guidance to VMS boards and public app feeds." },
            { label: "Protect hospital lane", value: "Active", tone: "text-[var(--accent)]", detail: "Keep trauma corridor isolated from public diversions." },
            { label: "Load balance limit", value: "44%", tone: "text-[var(--warning)]", detail: "Prevent overflow into residential collector roads." },
          ]}
        />
      }
      bottom={<BottomTimelinePanel mode="diversion" />}
    />
  );
}
 
function ResourcePage() {
  return (
    <ThreeColumnWorkspace
      mapPage="Resource Command"
      title="Resource Command Workspace"
      description="Coordinate personnel, tow units, medical teams, barricades, and traffic officer deployment."
      highlights={[
        { label: "Field units", value: "57", tone: "text-[var(--accent)]" },
        { label: "Medical teams", value: "9", tone: "text-[var(--success)]" },
        { label: "Tow backlog", value: "8", tone: "text-[var(--warning)]" },
      ]}
      left={<ResourceCommandPanel />}
      right={
        <>
          <ModuleActionPanel
            icon={Truck}
            eyebrow="Deployment"
            title="Resource Allocation"
            actions={[
              { label: "Tow units to Ring Road", value: "8 active", tone: "text-[var(--warning)]", detail: "Clear stalled buses before peak traffic wave." },
              { label: "Medical grid coverage", value: "99%", tone: "text-[var(--success)]", detail: "Ambulance green corridors remain protected." },
              { label: "Officer rotation", value: "14:30", tone: "text-[var(--accent)]", detail: "Next traffic police shift handover at central command." },
            ]}
          />
          <SystemHealthSummary />
        </>
      }
      bottom={<BottomTimelinePanel mode="resources" />}
    />
  );
}
 
function SimulatorPage() {
  return (
    <ThreeColumnWorkspace
      mapPage="Event Simulator"
      title="Event Simulator Workspace"
      description="Create operational scenarios, test event traffic impact, and preview AI outcome predictions before approval."
      highlights={[
        { label: "Scenario", value: "Convoy Lockdown", tone: "text-[var(--warning)]" },
        { label: "Impact score", value: "94%", tone: "text-[var(--danger)]" },
        { label: "Runs today", value: "18", tone: "text-[var(--accent)]" },
      ]}
      left={<EventSimulatorPanel />}
      right={
        <ModuleActionPanel
          icon={RadioTower}
          eyebrow="Simulation Controls"
          title="Event Planning"
          actions={[
            { label: "Create event", value: "Ready", tone: "text-[var(--accent)]", detail: "Plan stadium exit, VIP convoy, protest, or monsoon closure scenarios." },
            { label: "Run impact model", value: "24M states", tone: "text-[var(--success)]", detail: "AI tests intersection states before dispatch approval." },
            { label: "Publish event plan", value: "Draft", tone: "text-[var(--warning)]", detail: "Convert simulation into resource and diversion plan." },
          ]}
        />
      }
      bottom={<BottomTimelinePanel mode="simulation" />}
    />
  );
}
 
function LiveTrafficPage() {
  return (
    <ThreeColumnWorkspace
      mapPage="Live Traffic"
      title="Live Traffic Monitoring"
      description="Dedicated map-first traffic view for congestion heat, signal health, live incidents, and route performance."
      highlights={[
        { label: "Smooth corridors", value: "214", tone: "text-[var(--success)]" },
        { label: "Heavy corridors", value: "17", tone: "text-[var(--warning)]" },
        { label: "Critical corridors", value: "5", tone: "text-[var(--danger)]" },
      ]}
      left={<RiskFeedPanel />}
      right={<ModuleActionPanel icon={TrafficCone} eyebrow="Live Traffic" title="Network Controls" actions={[
        { label: "Signal drift", value: "3 zones", tone: "text-[var(--warning)]", detail: "Stabilize timing plans around Central Delhi." },
        { label: "Green corridors", value: "11 open", tone: "text-[var(--success)]", detail: "Emergency and public transport lanes remain clear." },
        { label: "Camera coverage", value: "98.2%", tone: "text-[var(--accent)]", detail: "All arterial camera feeds healthy except two field units." },
      ]} />}
      bottom={<BottomTimelinePanel mode="traffic" />}
    />
  );
}
 
function IncidentPage() {
  return (
    <ThreeColumnWorkspace
      mapPage="Incident Management"
      title="Incident Management"
      description="Triage, assign, escalate, and resolve traffic incidents with dispatch logs and SLA tracking."
      highlights={[
        { label: "Open incidents", value: "17", tone: "text-[var(--danger)]" },
        { label: "Assigned", value: "14", tone: "text-[var(--accent)]" },
        { label: "SLA risk", value: "3", tone: "text-[var(--warning)]" },
      ]}
      left={
        <>
          <ActiveEventsPanel />
          <RiskFeedPanel />
        </>
      }
      right={<ModuleActionPanel icon={Siren} eyebrow="Incident Desk" title="Response Actions" actions={[
        { label: "Assign field team", value: "Needed", tone: "text-[var(--danger)]", detail: "ITO signal cascade requires officer confirmation." },
        { label: "Escalate airport surge", value: "Queued", tone: "text-[var(--warning)]", detail: "Prepare NHAI coordination if queue exceeds threshold." },
        { label: "Close resolved alert", value: "2 ready", tone: "text-[var(--success)]", detail: "Resolved green-wave and signal drift checks can be archived." },
      ]} />}
      bottom={<BottomTimelinePanel mode="incidents" />}
    />
  );
}
 
function EmergencyRoutingPage() {
  return (
    <ThreeColumnWorkspace
      mapPage="Emergency Routing"
      title="Emergency Vehicle Routing"
      description="Protect ambulance, fire, and police response paths with green-wave signal control and lane clearance."
      highlights={[
        { label: "Ambulances", value: "6 active", tone: "text-[var(--success)]" },
        { label: "Avg clearance", value: "4.2 min", tone: "text-[var(--accent)]" },
        { label: "Blocked nodes", value: "2", tone: "text-[var(--danger)]" },
      ]}
      left={<DiversionPlannerPanel />}
      right={<ModuleActionPanel icon={Ambulance} eyebrow="Emergency Routing" title="Priority Routes" actions={[
        { label: "AIIMS trauma route", value: "Protected", tone: "text-[var(--success)]", detail: "11 intersections cleared for emergency approach." },
        { label: "Fire tender corridor", value: "Standby", tone: "text-[var(--warning)]", detail: "Pre-authorize green wave near Pragati Maidan." },
        { label: "Police escort", value: "2 units", tone: "text-[var(--accent)]", detail: "Assign bikes to hold public traffic at cross streets." },
      ]} />}
      bottom={<BottomTimelinePanel mode="emergency" />}
    />
  );
}
 
function DispatchPage() {
  return (
    <ThreeColumnWorkspace
      mapPage="Dispatch Center"
      title="Dispatch Center"
      description="Coordinate live orders, unit acknowledgements, field logs, and inter-agency notifications."
      highlights={[
        { label: "Dispatch logs", value: "142", tone: "text-[var(--accent)]" },
        { label: "Awaiting ack", value: "6", tone: "text-[var(--warning)]" },
        { label: "Completed", value: "89", tone: "text-[var(--success)]" },
      ]}
      left={<ResourceCommandPanel />}
      right={<ModuleActionPanel icon={Radio} eyebrow="Dispatch Desk" title="Live Orders" actions={[
        { label: "Tow team dispatch", value: "Sent", tone: "text-[var(--success)]", detail: "Unit T-08 acknowledged Ring Road callout." },
        { label: "Barricade request", value: "Pending", tone: "text-[var(--warning)]", detail: "Pragati Maidan gate team waiting for supervisor approval." },
        { label: "Medical coordination", value: "Live", tone: "text-[var(--accent)]", detail: "Hospital receiving desk notified of ETA change." },
      ]} />}
      bottom={<BottomTimelinePanel mode="dispatch" />}
    />
  );
}
 
function AnalyticsPage() {
  return (
    <PageTransition>
      <WorkspaceBanner
        title="Traffic Analytics"
        description="Trend analysis, corridor performance, incident clustering, and citywide congestion reporting."
        highlights={[
          { label: "Prediction accuracy", value: "93%", tone: "text-[var(--success)]" },
          { label: "Peak load", value: "94%", tone: "text-[var(--danger)]" },
          { label: "AI mitigations", value: "42", tone: "text-[var(--accent)]" },
        ]}
      />
      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <div className="min-h-[520px]">
            <CityMap activePage="Traffic Analytics" />
          </div>
          <BottomTimelinePanel mode="analytics" />
        </div>
        <div className="space-y-5">
          <SystemTelemetryPanel variant="analytics" />
          <RiskFeedPanel />
        </div>
      </div>
    </PageTransition>
  );
}
 
function ReportsPage() {
  return <ReportsWorkspace />;
}
 
function PredictionsPage() {
  return (
    <ThreeColumnWorkspace
      mapPage="Predictions"
      title="Congestion Predictions"
      description="Forecast bottlenecks, event surges, and emergency route conflicts before they impact field operations."
      highlights={[
        { label: "Forecast horizon", value: "45 min", tone: "text-[var(--accent)]" },
        { label: "High-risk sectors", value: "3", tone: "text-[var(--danger)]" },
        { label: "Confidence", value: "91%", tone: "text-[var(--success)]" },
      ]}
      left={<RiskFeedPanel />}
      right={<AIRecommendationSummary />}
      bottom={<BottomTimelinePanel mode="predictions" />}
    />
  );
}
 
function SettingsPage() {
  return <ProfileAccessPage />;
}
 
function UserManagementPage() {
  return <UserManagementWorkspace />;
}
 
function AuditLogsPage() {
  return <AuditLogsWorkspace />;
}
 
function ReportsWorkspace() {
  const reports = [
    { name: "Daily Congestion Summary", owner: "Traffic Analytics Cell", status: "Ready", tone: "text-[var(--success)]" },
    { name: "Incident SLA Report", owner: "Incident Desk", status: "Review", tone: "text-[var(--warning)]" },
    { name: "Emergency Corridor Audit", owner: "Public Safety", status: "Export", tone: "text-[var(--accent)]" },
    { name: "NHAI Coordination Log", owner: "Dispatch Center", status: "Ready", tone: "text-[var(--success)]" },
  ];
 
  return (
    <PageTransition>
      <WorkspaceBanner
        title="Reports"
        description="Agency-ready traffic summaries, exports, compliance documents, and operational evidence."
        highlights={[
          { label: "Reports today", value: "18", tone: "text-[var(--accent)]" },
          { label: "Ready exports", value: "12", tone: "text-[var(--success)]" },
          { label: "Needs review", value: "3", tone: "text-[var(--warning)]" },
        ]}
      />
      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        <div className="glass-panel overflow-hidden">
          <div className="border-b border-[var(--border)] p-4">
            <h2 className="text-base font-bold text-[var(--text)]">Operational Reports</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">Downloadable records for traffic police, NHAI, and municipal review.</p>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {reports.map((report) => (
              <div key={report.name} className="grid gap-3 p-4 sm:grid-cols-[1fr_180px_100px]">
                <div>
                  <div className="text-sm font-semibold text-[var(--text)]">{report.name}</div>
                  <div className="text-xs text-[var(--muted)]">PDF, CSV and audit-safe export available</div>
                </div>
                <div className="text-sm text-[var(--muted-strong)]">{report.owner}</div>
                <div className={`text-sm font-bold ${report.tone}`}>{report.status}</div>
              </div>
            ))}
          </div>
        </div>
        <SystemHealthSummary />
      </div>
    </PageTransition>
  );
}
 
function ProfileAccessPage() {
  return (
    <PageTransition>
      <WorkspaceBanner
        title="Settings & Operator Profile"
        description="Login, profile, permissions, alert preferences, and feature access for traffic operations."
        highlights={[
          { label: "Session", value: "Secure", tone: "text-[var(--success)]" },
          { label: "Role", value: "Duty Officer", tone: "text-[var(--accent)]" },
          { label: "Feature access", value: "Full", tone: "text-[var(--success)]" },
        ]}
      />
      <div className="grid gap-5 lg:grid-cols-[420px_1fr]">
        <div className="glass-panel p-5">
          <div className="mb-4 flex items-center gap-2">
            <LockKeyhole className="h-5 w-5 text-[var(--accent)]" />
            <h2 className="text-lg font-bold text-[var(--text)]">Operator Login</h2>
          </div>
          <form className="space-y-4">
            <label className="block">
              <span className="text-sm font-semibold text-[var(--muted-strong)]">Government ID / Operator ID</span>
              <input className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--card-subtle)] px-3 py-2 text-sm text-[var(--text)] focus:outline-none" placeholder="DL-TRAFFIC-OPS-1024" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-[var(--muted-strong)]">Secure PIN</span>
              <input type="password" className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--card-subtle)] px-3 py-2 text-sm text-[var(--text)] focus:outline-none" placeholder="••••••" />
            </label>
            <button type="button" className="w-full rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-bold text-white transition hover:opacity-90">
              Sign in to Operations Workspace
            </button>
          </form>
        </div>
        <div className="grid gap-5 xl:grid-cols-2">
          <ModuleActionPanel
            icon={UserCircle}
            eyebrow="Profile"
            title="Current Operator"
            actions={[
              { label: "Name", value: "Duty Officer", tone: "text-[var(--text)]", detail: "Delhi Traffic Police Central Operations Desk." },
              { label: "Permissions", value: "Full access", tone: "text-[var(--success)]", detail: "Can plan events, approve diversions, dispatch units, and export reports." },
              { label: "Assigned zone", value: "Delhi NCR", tone: "text-[var(--accent)]", detail: "Command Center, emergency routing, analytics, and incident management enabled." },
            ]}
          />
          <ModuleActionPanel
            icon={Settings}
            eyebrow="Preferences"
            title="Traffic Feature Access"
            actions={[
              { label: "Event planning", value: "Enabled", tone: "text-[var(--success)]", detail: "Create simulations and publish approved event plans." },
              { label: "Alert threshold", value: "Amber+", tone: "text-[var(--warning)]", detail: "Notify operator for amber and red congestion events." },
              { label: "Theme preference", value: "Saved", tone: "text-[var(--accent)]", detail: "Light/dark preference persists in this browser." },
            ]}
          />
        </div>
      </div>
    </PageTransition>
  );
}
 
function UserManagementWorkspace() {
  const users = [
    { name: "Duty Officer", role: "Command Center Admin", zone: "Delhi NCR", access: "Full" },
    { name: "Incident Supervisor", role: "Incident Manager", zone: "Central Delhi", access: "Dispatch + Incidents" },
    { name: "Event Planner", role: "Simulation Operator", zone: "Citywide", access: "Events + Reports" },
    { name: "NHAI Liaison", role: "External Coordinator", zone: "Highways", access: "Read + Dispatch" },
  ];
 
  return (
    <PageTransition>
      <WorkspaceBanner
        title="User Management"
        description="Manage operator identities, agency roles, zone access, and permissions for all traffic features."
        highlights={[
          { label: "Active users", value: "64", tone: "text-[var(--accent)]" },
          { label: "Admins", value: "8", tone: "text-[var(--success)]" },
          { label: "Pending access", value: "5", tone: "text-[var(--warning)]" },
        ]}
      />
      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        <div className="glass-panel overflow-hidden">
          <div className="border-b border-[var(--border)] p-4">
            <h2 className="text-base font-bold text-[var(--text)]">Operator Directory</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">Every user maps to traffic permissions and operating zones.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="bg-[var(--card-subtle)] text-xs font-bold uppercase text-[var(--muted)]">
                <tr>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Zone</th>
                  <th className="px-4 py-3">Feature access</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {users.map((user) => (
                  <tr key={user.name}>
                    <td className="px-4 py-3 font-semibold text-[var(--text)]">{user.name}</td>
                    <td className="px-4 py-3 text-[var(--muted-strong)]">{user.role}</td>
                    <td className="px-4 py-3 text-[var(--muted-strong)]">{user.zone}</td>
                    <td className="px-4 py-3 text-[var(--accent)]">{user.access}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <ModuleActionPanel
          icon={Users}
          eyebrow="Access Control"
          title="Role Templates"
          actions={[
            { label: "Command admin", value: "All features", tone: "text-[var(--success)]", detail: "Can approve events, diversions, dispatches, and reports." },
            { label: "Field dispatcher", value: "Operations", tone: "text-[var(--accent)]", detail: "Can assign incidents and emergency response units." },
            { label: "Analyst", value: "Read + export", tone: "text-[var(--warning)]", detail: "Can review analytics and export government reports." },
          ]}
        />
      </div>
    </PageTransition>
  );
}
 
function AuditLogsWorkspace() {
  const logs = [
    { time: "17:18", actor: "Duty Officer", action: "Approved ALPHA-9 diversion", result: "Published" },
    { time: "17:12", actor: "Incident Supervisor", action: "Assigned tow unit T-08", result: "Acknowledged" },
    { time: "17:05", actor: "AI Copilot", action: "Recommended green wave", result: "Accepted" },
    { time: "16:58", actor: "Event Planner", action: "Created convoy simulation", result: "Draft" },
  ];
 
  return (
    <PageTransition>
      <WorkspaceBanner
        title="Audit Logs"
        description="Traceable record of approvals, dispatches, AI recommendations, login actions, and event plans."
        highlights={[
          { label: "Logs today", value: "312", tone: "text-[var(--accent)]" },
          { label: "Approvals", value: "44", tone: "text-[var(--success)]" },
          { label: "Review flags", value: "2", tone: "text-[var(--warning)]" },
        ]}
      />
      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        <div className="glass-panel overflow-hidden">
          <div className="border-b border-[var(--border)] p-4">
            <h2 className="text-base font-bold text-[var(--text)]">Operational Activity</h2>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {logs.map((log) => (
              <div key={`${log.time}-${log.action}`} className="grid gap-3 p-4 sm:grid-cols-[80px_180px_1fr_120px]">
                <div className="font-bold text-[var(--accent)]">{log.time}</div>
                <div className="font-semibold text-[var(--text)]">{log.actor}</div>
                <div className="text-[var(--muted-strong)]">{log.action}</div>
                <div className="font-bold text-[var(--success)]">{log.result}</div>
              </div>
            ))}
          </div>
        </div>
        <ModuleActionPanel
          icon={ClipboardList}
          eyebrow="Governance"
          title="Compliance Controls"
          actions={[
            { label: "Export audit trail", value: "Ready", tone: "text-[var(--success)]", detail: "Generate PDF/CSV record for agency review." },
            { label: "AI decision trace", value: "Enabled", tone: "text-[var(--accent)]", detail: "Every recommendation links to confidence and input signals." },
            { label: "Role change review", value: "2 open", tone: "text-[var(--warning)]", detail: "Pending user access changes need admin approval." },
          ]}
        />
      </div>
    </PageTransition>
  );
}
 
function SystemHealthSummary() {
  return (
    <div className="glass-panel p-4">
      <div className="mb-3 flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-[var(--success)]" />
        <h2 className="text-base font-bold text-[var(--text)]">Status Monitoring</h2>
      </div>
      <div className="space-y-2">
        {health.map((item) => (
          <div key={item.label} className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--card-subtle)] px-3 py-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-[var(--muted-strong)]">
              <item.icon className={`h-4 w-4 ${item.tone}`} />
              {item.label}
            </div>
            <span className={`text-sm font-bold ${item.tone}`}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
 
function AIRecommendationSummary() {
  const recommendations = useMemo(
    () => [
      { label: "Signal optimization", value: "11 intersections", tone: "text-[var(--accent)]" },
      { label: "Diversion confidence", value: "91%", tone: "text-[var(--success)]" },
      { label: "Congestion risk", value: "Amber", tone: "text-[var(--warning)]" },
    ],
    []
  );
 
  return (
    <div className="glass-panel p-4">
      <div className="mb-3 flex items-center gap-2">
        <Bot className="h-4 w-4 text-[var(--accent)]" />
        <h2 className="text-base font-bold text-[var(--text)]">AI Recommendations</h2>
      </div>
      <div className="space-y-2">
        {recommendations.map((item) => (
          <div key={item.label} className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--card-subtle)] px-3 py-2">
            <span className="text-sm font-medium text-[var(--muted-strong)]">{item.label}</span>
            <span className={`text-sm font-bold ${item.tone}`}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
 
export default App;