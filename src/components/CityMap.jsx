import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import L from "leaflet";
import { Circle, MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from "react-leaflet";
import { Crosshair, LocateFixed, MapPinned, SatelliteDish } from "lucide-react";
import { cityCenter, incidents, routeLines } from "../data/trafficData.jsx";
 
const markerClass = {
  danger: "marker-danger",
  warning: "marker-warning",
  success: "marker-success",
  primary: "marker-primary",
};
 
const trafficRouteColors = ["#16A34A", "#F59E0B", "#DC2626"];
 
function makeMarker(severity) {
  return L.divIcon({
    className: "",
    html: `<div class="radar-marker ${markerClass[severity]}"><span class="radar-core"></span></div>`,
    iconSize: [42, 42],
    iconAnchor: [21, 21],
    popupAnchor: [0, -18],
  });
}
 
function CityMap({ activePage }) {
  const icons = useMemo(
    () =>
      incidents.reduce((acc, incident) => {
        acc[incident.id] = makeMarker(incident.severity);
        return acc;
      }, {}),
    []
  );
 
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="map-frame relative h-full overflow-hidden border border-[var(--border)] bg-[var(--card)] shadow-neon"
    >
      <MapContainer
        center={cityCenter}
        zoom={12}
        scrollWheelZoom
        dragging
        doubleClickZoom
        touchZoom
        zoomControl
        attributionControl={false}
      >
        <MapInteractionGuard />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {routeLines.map((route, index) => (
          <Polyline
            key={route.id}
            className="route-dash"
            pathOptions={{ color: trafficRouteColors[index] || route.tone, weight: 5, opacity: activePage === "Command Center" ? 0.58 : 0.86 }}
            positions={route.points}
          />
        ))}
        {incidents.map((incident) => (
          <Marker key={incident.id} position={incident.position} icon={icons[incident.id]}>
            <Popup>
              <div className="min-w-[180px]">
                <div className="text-xs font-semibold text-[var(--accent)]">{incident.id}</div>
                <div className="mt-1 text-base font-bold text-[var(--text)]">{incident.title}</div>
                <div className="mt-1 text-sm text-[var(--muted)]">{incident.zone}</div>
                <div className="mt-2 flex justify-between text-xs font-semibold text-[var(--muted-strong)]">
                  <span>ETA {incident.eta}</span>
                  <span>{incident.confidence}</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        <Circle center={cityCenter} radius={4200} pathOptions={{ color: "#16A34A", weight: 1, fillColor: "#16A34A", fillOpacity: 0.055 }} />
        <Circle center={[28.6271, 77.2412]} radius={1900} pathOptions={{ color: "#DC2626", weight: 2, fillColor: "#DC2626", fillOpacity: 0.12 }} />
        <Circle center={[28.5912, 77.1626]} radius={2300} pathOptions={{ color: "#F59E0B", weight: 2, fillColor: "#F59E0B", fillOpacity: 0.1 }} />
      </MapContainer>
 
      <div className="pointer-events-none absolute left-4 top-4 z-[470] flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--card)]/95 px-4 py-3 shadow-neon backdrop-blur">
        <MapPinned className="h-5 w-5 text-[var(--accent)]" />
        <div>
          <div className="text-sm font-bold text-[var(--text)]">Live Traffic Map</div>
          <div className="text-xs font-medium text-[var(--muted)]">12,481 sensors • 742 signal nodes • 38 active missions</div>
        </div>
      </div>
 
      <div className="pointer-events-none absolute right-4 top-4 z-[470] grid gap-2">
        <MapChip icon={LocateFixed} label="GPS Lock" value="± 0.7m" />
        <MapChip icon={SatelliteDish} label="Drone Mesh" value="7 Live" />
        <MapChip icon={Crosshair} label="Critical Zone" value="Sector 04" />
      </div>
 
      <div className="pointer-events-none absolute bottom-4 left-1/2 z-[470] flex -translate-x-1/2 items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--card)]/95 px-4 py-2 shadow-neon backdrop-blur">
        <span className="status-dot bg-[var(--success)]" />
        <span className="text-xs font-semibold text-[var(--muted-strong)]">
          Traffic overlay active • {activePage}
        </span>
      </div>
    </motion.div>
  );
}
 
function MapInteractionGuard() {
  const map = useMap();
 
  useEffect(() => {
    const container = map.getContainer();
    L.DomEvent.disableScrollPropagation(container);
    L.DomEvent.disableClickPropagation(container);
    container.style.touchAction = "pan-x pan-y";
 
    const stopWheelPropagation = (event) => {
      event.stopPropagation();
    };
 
    container.addEventListener("wheel", stopWheelPropagation, { passive: false });
 
    return () => {
      container.removeEventListener("wheel", stopWheelPropagation);
    };
  }, [map]);
 
  return null;
}
 
function MapChip({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-[var(--border)] bg-[var(--card)]/95 px-3 py-2 shadow-neon backdrop-blur">
      <div className="flex items-center gap-2 text-xs font-medium text-[var(--muted)]">
        <Icon className="h-3.5 w-3.5 text-[var(--accent)]" />
        {label}
      </div>
      <span className="text-xs font-bold text-[var(--text)]">{value}</span>
    </div>
  );
}
 
export default CityMap;