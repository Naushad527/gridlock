import {
  Ambulance,
  BadgeAlert,
  Bot,
  CarFront,
  Construction,
  Cpu,
  Crosshair,
  Flame,
  RadioTower,
  Route,
  ShieldAlert,
  Siren,
  TrafficCone,
  UsersRound,
  Zap,
} from "lucide-react";
 
export const pages = [
  "Command Center",
  "Event Simulator",
  "Diversion Planner",
  "Resource Command",
  "AI Traffic Copilot",
];
 
export const cityCenter = [28.6139, 77.209];
 
export const incidents = [
  {
    id: "DL-CENTRAL-081",
    title: "Signal cascade failure",
    zone: "ITO Junction",
    severity: "danger",
    eta: "03:12",
    confidence: "97%",
    position: [28.6271, 77.2412],
    icon: ShieldAlert,
  },
  {
    id: "NDLS-EXP-404",
    title: "Expressway pile-up risk",
    zone: "Ring Road North",
    severity: "warning",
    eta: "07:45",
    confidence: "86%",
    position: [28.6532, 77.2269],
    icon: CarFront,
  },
  {
    id: "AIRPORT-OPS-229",
    title: "VIP corridor pressure",
    zone: "Dhaula Kuan",
    severity: "primary",
    eta: "11:20",
    confidence: "91%",
    position: [28.5912, 77.1626],
    icon: Crosshair,
  },
  {
    id: "AIIMS-MED-772",
    title: "Ambulance green wave",
    zone: "AIIMS Flyover",
    severity: "success",
    eta: "02:18",
    confidence: "99%",
    position: [28.5672, 77.209],
    icon: Ambulance,
  },
  {
    id: "PRAGATI-CIV-118",
    title: "Barricade breach warning",
    zone: "Pragati Maidan",
    severity: "danger",
    eta: "05:02",
    confidence: "93%",
    position: [28.6181, 77.2454],
    icon: TrafficCone,
  },
];
 
export const activeEvents = [
  { label: "Critical incidents", value: 17, delta: "+4", tone: "danger" },
  { label: "AI mitigations live", value: 42, delta: "+12", tone: "primary" },
  { label: "Signals under control", value: 318, delta: "98%", tone: "success" },
];
 
export const alerts = [
  { time: "14:04:12", text: "Convoy corridor conflict detected near India Gate", tone: "danger" },
  { time: "14:03:48", text: "AI rerouted 2,480 vehicles from Ring Road", tone: "primary" },
  { time: "14:03:10", text: "Ambulance path cleared across 11 intersections", tone: "success" },
  { time: "14:02:37", text: "Fog density rising across arterial cameras", tone: "warning" },
];
 
export const riskFeed = [
  { sector: "Sector 04", risk: 91, text: "Protest spillover risk", tone: "danger" },
  { sector: "Sector 11", risk: 78, text: "Airport surge in 13 min", tone: "warning" },
  { sector: "Sector 22", risk: 44, text: "Signal drift stabilizing", tone: "success" },
];
 
export const resources = [
  { name: "Rapid response bikes", available: 23, deployed: 15, icon: Zap, tone: "primary" },
  { name: "Tow units", available: 12, deployed: 8, icon: Construction, tone: "warning" },
  { name: "Medical emergency", available: 9, deployed: 6, icon: Ambulance, tone: "success" },
  { name: "Traffic command teams", available: 34, deployed: 28, icon: UsersRound, tone: "primary" },
];
 
export const timeline = [
  { time: "14:01", event: "AI declared RED GRID around ITO", impact: "High", tone: "danger" },
  { time: "14:05", event: "Barricades dispatched to Gate 7", impact: "Med", tone: "warning" },
  { time: "14:08", event: "Green-wave opens for trauma unit", impact: "High", tone: "success" },
  { time: "14:12", event: "Diversion plan ALPHA-9 executes", impact: "Low", tone: "primary" },
  { time: "14:16", event: "Drone relay syncs with command mesh", impact: "Med", tone: "primary" },
];
 
export const trafficSeries = [
  { t: "14:00", load: 72, ai: 47, incident: 28 },
  { t: "14:05", load: 84, ai: 55, incident: 42 },
  { t: "14:10", load: 79, ai: 64, incident: 36 },
  { t: "14:15", load: 94, ai: 73, incident: 51 },
  { t: "14:20", load: 88, ai: 81, incident: 44 },
  { t: "14:25", load: 76, ai: 86, incident: 29 },
];
 
export const routeLines = [
  {
    id: "alpha",
    tone: "#00E5FF",
    points: [
      [28.6532, 77.2269],
      [28.645, 77.216],
      [28.631, 77.2],
      [28.612, 77.194],
      [28.5912, 77.1626],
    ],
  },
  {
    id: "bravo",
    tone: "#F59E0B",
    points: [
      [28.6271, 77.2412],
      [28.616, 77.235],
      [28.604, 77.23],
      [28.586, 77.22],
      [28.5672, 77.209],
    ],
  },
  {
    id: "charlie",
    tone: "#22C55E",
    points: [
      [28.6181, 77.2454],
      [28.609, 77.256],
      [28.598, 77.251],
      [28.588, 77.239],
      [28.578, 77.231],
    ],
  },
];
 
export const simulatorScenarios = [
  { name: "Stadium Exit Surge", severity: "89%", icon: RadioTower, detail: "72K spectators leaving in staggered waves" },
  { name: "Monsoon Flood Choke", severity: "76%", icon: Flame, detail: "Underpass waterlogging with bus reroute load" },
  { name: "Convoy Lockdown", severity: "94%", icon: Siren, detail: "12-min protected corridor through CBD" },
];
 
export const diversionPlans = [
  { id: "ALPHA-9", saving: "18 min", load: "32%", streets: "Ring Road → Mathura Rd → Aurobindo", tone: "primary" },
  { id: "BRAVO-3", saving: "11 min", load: "21%", streets: "ITO → Tilak Marg → Mandi House", tone: "warning" },
  { id: "OMEGA-7", saving: "24 min", load: "44%", streets: "DND → Lodhi → Africa Ave", tone: "success" },
];
 
export const personnel = [
  { unit: "Tactical Signal Cell", count: 18, status: "Coordinating 84 lights", tone: "primary" },
  { unit: "Barricade Wing", count: 42, status: "Locking priority intersections", tone: "warning" },
  { unit: "Emergency Medical Grid", count: 11, status: "Green corridors armed", tone: "success" },
  { unit: "Drone Recon", count: 7, status: "Overwatch above CBD", tone: "primary" },
];
 
export const copilotMessages = [
  { role: "operator", text: "Why is ITO turning red?" },
  {
    role: "ai",
    text: "3 converging events: signal drift, protest spillover, and bus bunching. Recommend ALPHA-9 diversion plus 4-cycle green wave eastbound.",
  },
  { role: "operator", text: "Can we protect the ambulance route?" },
  {
    role: "ai",
    text: "Yes. Clearing 11 intersections now. Predicted arrival improves from 14:17 to 14:09 with 99% confidence.",
  },
];
 
export const systemNodes = [
  { label: "Camera mesh", value: "12,481", icon: Cpu, tone: "primary" },
  { label: "AI confidence", value: "97.4%", icon: Bot, tone: "success" },
  { label: "Threat posture", value: "AMBER", icon: BadgeAlert, tone: "warning" },
  { label: "City grid load", value: "82%", icon: Route, tone: "danger" },
];