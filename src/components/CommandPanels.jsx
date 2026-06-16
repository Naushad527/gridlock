import { motion } from "framer-motion";
import {
  Activity,
  Ambulance,
  ArrowRight,
  BadgeAlert,
  Bot,
  CarFront,
  CheckCircle2,
  ChevronRight,
  CircleGauge,
  Clock4,
  Cpu,
  Crosshair,
  MapPinned,
  RadioTower,
  Route,
  Send,
  ShieldAlert,
  Siren,
  SlidersHorizontal,
  Sparkles,
  Target,
  TrafficCone,
  Truck,
  UsersRound,
  Zap,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  activeEvents,
  alerts,
  copilotMessages,
  diversionPlans,
  incidents,
  personnel,
  resources,
  riskFeed,
  simulatorScenarios,
  systemNodes,
  timeline,
  trafficSeries,
} from "../data/trafficData.jsx";
 
const panelVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.22, delay, ease: "easeOut" },
  }),
};
 
const tone = {
  primary: {
    text: "text-[var(--accent)]",
    bg: "bg-[var(--accent-soft)]",
    border: "border-[var(--accent-border)]",
    shadow: "",
    dot: "bg-[var(--accent)]",
  },
  warning: {
    text: "text-[var(--warning)]",
    bg: "bg-[var(--warning-soft)]",
    border: "border-[var(--warning)]/25",
    shadow: "",
    dot: "bg-[var(--warning)]",
  },
  danger: {
    text: "text-[var(--danger)]",
    bg: "bg-[var(--danger-soft)]",
    border: "border-[var(--danger)]/25",
    shadow: "",
    dot: "bg-[var(--danger)]",
  },
  success: {
    text: "text-[var(--success)]",
    bg: "bg-[var(--success-soft)]",
    border: "border-[var(--success)]/25",
    shadow: "",
    dot: "bg-[var(--success)]",
  },
};
 
function CommandPanel({ children, className = "", delay = 0 }) {
  return (
    <motion.div
      custom={delay}
      initial="hidden"
      animate="visible"
      variants={panelVariants}
      className={`glass-panel relative overflow-hidden rounded-xl ${className}`}
    >
      {children}
    </motion.div>
  );
}
 
function PanelTitle({ icon: Icon, title, eyebrow, action }) {
  return (
    <div className="mb-3 flex items-start justify-between gap-3">
      <div>
        <div className="mb-1 flex items-center gap-2">
          <Icon className="h-4 w-4 text-[var(--accent)]" />
          <span className="text-xs font-semibold text-[var(--muted)]">{eyebrow}</span>
        </div>
        <h2 className="text-base font-bold text-[var(--text)]">{title}</h2>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
 
function ToneDot({ toneName = "primary" }) {
  return <span className={`status-dot ${tone[toneName].dot}`} />;
}
 
function MetricCard({ label, value, delta, toneName = "primary" }) {
  return (
    <div className={`relative overflow-hidden rounded-lg border ${tone[toneName].border} ${tone[toneName].bg} p-3 ${tone[toneName].shadow}`}>
      <div className="metric-strip absolute inset-y-0 w-1/2 opacity-40" />
      <div className="relative flex items-center justify-between">
        <div>
          <div className="text-xs font-medium text-[var(--muted)]">{label}</div>
          <div className="mt-1 text-2xl font-bold text-[var(--text)]">{value}</div>
        </div>
        <div className={`rounded-md border px-2 py-1 text-xs font-semibold ${tone[toneName].border} ${tone[toneName].text}`}>
          {delta}
        </div>
      </div>
    </div>
  );
}
 
function MiniTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
 
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-xs shadow-neon">
      <div className="font-bold text-[var(--accent)]">{label}</div>
      {payload.map((item) => (
        <div key={item.name} className="flex justify-between gap-4 text-[var(--muted-strong)]">
          <span>{item.name}</span>
          <span className="font-bold">{item.value}</span>
        </div>
      ))}
    </div>
  );
}
 
export function ActiveEventsPanel() {
  return (
    <CommandPanel className="flex-1 p-4" delay={0.05}>
      <PanelTitle icon={Activity} eyebrow="Mission Feed" title="Active Events" />
      <div className="grid gap-3">
        {activeEvents.map((item) => (
          <MetricCard key={item.label} label={item.label} value={item.value} delta={item.delta} toneName={item.tone} />
        ))}
      </div>
      <div className="mt-4 rounded-2xl border border-gridlock-cyan/15 bg-black/20 p-3">
        <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.24em] text-cyan-100/45">
          <Siren className="h-3.5 w-3.5 text-gridlock-red" />
          Live Alerts
        </div>
        <div className="space-y-2">
          {alerts.slice(0, 3).map((alert) => (
            <div key={alert.time} className="flex gap-2 rounded-xl border border-white/5 bg-white/[0.025] p-2">
              <ToneDot toneName={alert.tone} />
              <div>
                <div className="text-[10px] font-bold text-cyan-100/45">{alert.time}</div>
                <div className="text-xs font-semibold leading-tight text-cyan-50/80">{alert.text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </CommandPanel>
  );
}
 
export function RiskFeedPanel() {
  return (
    <CommandPanel className="p-4" delay={0.12}>
      <PanelTitle icon={ShieldAlert} eyebrow="Predictive AI" title="Risk Feed" />
      <div className="space-y-3">
        {riskFeed.map((risk) => (
          <div key={risk.sector}>
            <div className="mb-1 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ToneDot toneName={risk.tone} />
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-white">{risk.sector}</span>
              </div>
              <span className={`text-sm font-bold ${tone[risk.tone].text}`}>{risk.risk}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${risk.risk}%` }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className={`h-full rounded-full ${tone[risk.tone].dot}`}
              />
            </div>
            <div className="mt-1 text-xs text-cyan-100/60">{risk.text}</div>
          </div>
        ))}
      </div>
    </CommandPanel>
  );
}
 
export function ResourceCommandPanel({ compact = false }) {
  return (
    <CommandPanel className={`${compact ? "flex-1" : "flex-1"} p-4`} delay={0.08}>
      <PanelTitle icon={Truck} eyebrow="Allocation Matrix" title={compact ? "Resources" : "Resource Command"} />
      <div className="space-y-3">
        {resources.map((resource) => (
          <div key={resource.name} className={`rounded-2xl border ${tone[resource.tone].border} bg-white/[0.025] p-3`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <resource.icon className={`h-4 w-4 ${tone[resource.tone].text}`} />
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-white">{resource.name}</span>
              </div>
              <span className={`text-xs font-bold ${tone[resource.tone].text}`}>{resource.deployed} DEPLOYED</span>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-black/20 p-2">
                <div className="text-[10px] uppercase tracking-[0.18em] text-cyan-100/40">Available</div>
                <div className="text-xl font-bold text-white">{resource.available}</div>
              </div>
              <div className="rounded-xl bg-black/20 p-2">
                <div className="text-[10px] uppercase tracking-[0.18em] text-cyan-100/40">Field Load</div>
                <div className="text-xl font-bold text-white">{Math.round((resource.deployed / (resource.available + resource.deployed)) * 100)}%</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {!compact && (
        <div className="mt-4 grid grid-cols-2 gap-3">
          {personnel.map((item) => (
            <div key={item.unit} className="rounded-2xl border border-gridlock-cyan/15 bg-black/25 p-3">
              <div className={`text-2xl font-bold ${tone[item.tone].text}`}>{item.count}</div>
              <div className="text-xs font-bold uppercase tracking-[0.14em] text-white">{item.unit}</div>
              <div className="mt-1 text-xs text-cyan-100/50">{item.status}</div>
            </div>
          ))}
        </div>
      )}
    </CommandPanel>
  );
}
 
export function SystemTelemetryPanel({ variant = "command" }) {
  const label = {
    command: "System Health",
    simulation: "Simulation Health",
    resources: "Personnel Deployment",
    copilot: "AI Reasoning Core",
  }[variant] || "System Health";
 
  return (
    <CommandPanel className="flex-1 p-4" delay={0.16}>
      <PanelTitle icon={Cpu} eyebrow="Telemetry Stack" title={label} />
      <div className="grid gap-3">
        {systemNodes.map((node) => (
          <div key={node.label} className="rounded-2xl border border-gridlock-cyan/15 bg-white/[0.025] p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-100/45">
                <node.icon className={`h-4 w-4 ${tone[node.tone].text}`} />
                {node.label}
              </div>
              <div className={`text-lg font-bold ${tone[node.tone].text}`}>{node.value}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 h-28">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trafficSeries}>
            <defs>
              <linearGradient id="aiGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.55} />
                <stop offset="95%" stopColor="#00E5FF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="t" hide />
            <YAxis hide domain={[0, 100]} />
            <Tooltip content={<MiniTooltip />} cursor={{ stroke: "#00E5FF", strokeOpacity: 0.2 }} />
            <Area type="monotone" dataKey="ai" stroke="#00E5FF" strokeWidth={2} fill="url(#aiGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </CommandPanel>
  );
}
 
export function BottomTimelinePanel({ mode = "command" }) {
  return (
    <CommandPanel className="h-full p-4" delay={0.2}>
      <div className="grid h-full grid-cols-[1.05fr_1.2fr_1fr] gap-4">
        <div className="rounded-2xl border border-gridlock-cyan/15 bg-black/20 p-3">
          <PanelTitle icon={Clock4} eyebrow="Chronology" title="Event Timeline" />
          <div className="space-y-2">
            {timeline.map((item) => (
              <div key={`${mode}-${item.time}`} className="grid grid-cols-[48px_1fr_auto] items-center gap-2">
                <span className="text-xs font-bold text-gridlock-cyan">{item.time}</span>
                <div className="flex items-center gap-2">
                  <ToneDot toneName={item.tone} />
                  <span className="truncate text-xs font-semibold text-cyan-50/75">{item.event}</span>
                </div>
                <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${tone[item.tone].border} ${tone[item.tone].text}`}>
                  {item.impact}
                </span>
              </div>
            ))}
          </div>
        </div>
 
        <div className="rounded-2xl border border-gridlock-cyan/15 bg-black/20 p-3">
          <PanelTitle icon={CircleGauge} eyebrow="Traffic Activity" title="Load vs AI Control" />
          <ResponsiveContainer width="100%" height="72%">
            <LineChart data={trafficSeries}>
              <CartesianGrid stroke="rgba(0,229,255,0.08)" vertical={false} />
              <XAxis dataKey="t" tick={{ fill: "rgba(207,250,254,0.45)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis hide domain={[0, 100]} />
              <Tooltip content={<MiniTooltip />} cursor={{ stroke: "#00E5FF", strokeOpacity: 0.2 }} />
              <Line type="monotone" dataKey="load" name="City Load" stroke="#F59E0B" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="ai" name="AI Control" stroke="#00E5FF" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="incident" name="Incident" stroke="#EF4444" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
 
        <div className="rounded-2xl border border-gridlock-cyan/15 bg-black/20 p-3">
          <PanelTitle icon={BadgeAlert} eyebrow="Incident Feed" title="Live Dispatch" />
          <div className="space-y-2">
            {incidents.slice(0, 4).map((incident) => (
              <div key={incident.id} className="flex items-center justify-between gap-2 rounded-xl border border-white/5 bg-white/[0.025] p-2">
                <div className="flex items-center gap-2">
                  <incident.icon className={`h-4 w-4 ${tone[incident.severity].text}`} />
                  <div>
                    <div className="text-xs font-bold text-white">{incident.zone}</div>
                    <div className="text-[10px] uppercase tracking-[0.18em] text-cyan-100/45">{incident.eta} ETA</div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-gridlock-cyan/65" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </CommandPanel>
  );
}
 
export function EventSimulatorPanel() {
  return (
    <CommandPanel className="flex-1 p-4" delay={0.05}>
      <PanelTitle icon={RadioTower} eyebrow="Scenario Engine" title="Event Simulator" />
      <div className="space-y-3">
        {simulatorScenarios.map((scenario, index) => (
          <motion.div
            key={scenario.name}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.12 + index * 0.08 }}
            className="rounded-2xl border border-gridlock-cyan/20 bg-white/[0.03] p-3"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <scenario.icon className="h-5 w-5 text-gridlock-cyan" />
                <div>
                  <div className="text-sm font-bold uppercase tracking-[0.14em] text-white">{scenario.name}</div>
                  <div className="text-xs text-cyan-100/55">{scenario.detail}</div>
                </div>
              </div>
              <div className="text-xl font-bold text-gridlock-amber">{scenario.severity}</div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="mt-4 rounded-2xl border border-gridlock-red/25 bg-gridlock-red/10 p-3">
        <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-white">
          <Siren className="h-4 w-4 text-gridlock-red" />
          Stress Test Active
        </div>
        <div className="mt-2 text-xs leading-relaxed text-cyan-100/65">
          AI is running 24 million intersection-state permutations against real-time camera and signal telemetry.
        </div>
      </div>
    </CommandPanel>
  );
}
 
export function DiversionPlannerPanel() {
  return (
    <CommandPanel className="flex-1 p-4" delay={0.05}>
      <PanelTitle icon={Route} eyebrow="Autonomous Routing" title="Diversion Planner" />
      <div className="space-y-3">
        {diversionPlans.map((plan) => (
          <div key={plan.id} className={`rounded-2xl border ${tone[plan.tone].border} ${tone[plan.tone].bg} p-3`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className={`h-4 w-4 ${tone[plan.tone].text}`} />
                <span className="text-base font-bold uppercase tracking-[0.18em] text-white">{plan.id}</span>
              </div>
              <span className={`text-sm font-bold ${tone[plan.tone].text}`}>{plan.saving} SAVED</span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-cyan-100/65">
              <MapPinned className="h-3.5 w-3.5" />
              {plan.streets}
            </div>
            <div className="mt-3 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-100/45">
              <span>Load Transfer</span>
              <span>{plan.load}</span>
            </div>
          </div>
        ))}
      </div>
      <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-gridlock-cyan/40 bg-gridlock-cyan/10 px-4 py-3 text-sm font-bold uppercase tracking-[0.2em] text-gridlock-cyan transition hover:bg-gridlock-cyan/20 hover:shadow-neon">
        Commit Diversion
        <ArrowRight className="h-4 w-4" />
      </button>
    </CommandPanel>
  );
}
 
export function CopilotDock() {
  return (
    <CommandPanel className="flex-1 p-4" delay={0.05}>
      <PanelTitle icon={Bot} eyebrow="AI Traffic Copilot" title="Command Chat" />
      <div className="space-y-3">
        {copilotMessages.map((message, index) => (
          <div key={`${message.role}-${index}`} className={`rounded-2xl border p-3 ${message.role === "ai" ? "border-gridlock-cyan/25 bg-gridlock-cyan/10" : "border-white/10 bg-white/[0.035]"}`}>
            <div className="mb-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-100/45">
              {message.role === "ai" ? <Sparkles className="h-3.5 w-3.5 text-gridlock-cyan" /> : <UsersRound className="h-3.5 w-3.5 text-gridlock-amber" />}
              {message.role === "ai" ? "GRIDLOCK AI" : "Operator"}
            </div>
            <div className="text-sm font-semibold leading-relaxed text-cyan-50/80">{message.text}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-2xl border border-gridlock-cyan/20 bg-black/25 p-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-cyan-50/70">
          <span>Recommend next action</span>
          <span className="copilot-caret text-gridlock-cyan">▌</span>
        </div>
        <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-gridlock-cyan/40 bg-gridlock-cyan/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.2em] text-gridlock-cyan">
          Execute AI Plan
          <Send className="h-3.5 w-3.5" />
        </button>
      </div>
    </CommandPanel>
  );
}
 
export function TacticalControlRail() {
  return (
    <div className="flex gap-2">
      {[Crosshair, SlidersHorizontal, CheckCircle2, CarFront, TrafficCone, Ambulance, Zap].map((Icon, index) => (
        <button
          key={index}
          className="grid h-9 w-9 place-items-center rounded-xl border border-gridlock-cyan/25 bg-white/[0.035] text-gridlock-cyan transition hover:border-gridlock-cyan/70 hover:bg-gridlock-cyan/15 hover:shadow-neon"
        >
          <Icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
}
 
export default CommandPanel;