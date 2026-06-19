import { useMemo, useState } from "react";
import { AlertTriangle, FileText, LocateFixed, MapPin, Send } from "lucide-react";
import csvText from "../data/rawdata/Astram event data_anonymized - Astram event data_anonymizedb40ac87.csv?raw";

const reasonCategories = [
  "Heavy Congestion",
  "Emergency Route Blockage",
  "Public Event Risk",
  "VIP Movement Conflict",
  "Accident Prone Area",
  "Hospital Access Impact",
  "Peak Hour Sensitivity",
];

function parseCSV(text) {
  const rows = [];
  let row = [];
  let value = "";
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"' && next === '"') {
      value += '"';
      i++;
    } else if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === "," && !insideQuotes) {
      row.push(value);
      value = "";
    } else if ((char === "\n" || char === "\r") && !insideQuotes) {
      if (value || row.length) {
        row.push(value);
        rows.push(row);
      }
      row = [];
      value = "";
      if (char === "\r" && next === "\n") i++;
    } else {
      value += char;
    }
  }

  if (value || row.length) {
    row.push(value);
    rows.push(row);
  }

  return rows;
}

function buildLocationsFromCSV() {
  const rows = parseCSV(csvText);
  const headers = rows[0].map((h) => h.trim());

  const latIndex = headers.indexOf("latitude");
  const lngIndex = headers.indexOf("longitude");
  const addressIndex = headers.indexOf("address");

  const locationMap = new Map();

  rows.slice(1).forEach((row, index) => {
    const lat = Number(row[latIndex]);
    const lng = Number(row[lngIndex]);
    const address = row[addressIndex]?.trim();

    if (!address || Number.isNaN(lat) || Number.isNaN(lng)) return;

    const shortName = address.split(",").slice(0, 2).join(",").trim();
    const key = shortName.toLowerCase();

    if (!locationMap.has(key)) {
      locationMap.set(key, {
        id: `location-${index}`,
        name: shortName,
        fullAddress: address,
        lat,
        lng,
        radius: 200,
      });
    }
  });

  return Array.from(locationMap.values());
}

const bangaloreLocations = buildLocationsFromCSV();

function getRadius(count) {
  if (count >= 5) return 300;
  return 200;
}

export default function Report() {
  const [locationSearch, setLocationSearch] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [reason, setReason] = useState(reasonCategories[0]);
  const [description, setDescription] = useState("");
  const [reports, setReports] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  const filteredLocations = useMemo(() => {
    const query = locationSearch.trim().toLowerCase();

    if (!query) return bangaloreLocations.slice(0, 25);

    return bangaloreLocations
      .filter((item) =>
        `${item.name} ${item.fullAddress}`.toLowerCase().includes(query)
      )
      .slice(0, 25);
  }, [locationSearch]);

  const fetchLiveLocation = () => {
    if (!navigator.geolocation) {
      alert("Live location is not supported in this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        alert("Location permission denied or unavailable.");
      }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedLocation) {
      alert("Please select a location.");
      return;
    }

    if (!description.trim()) {
      alert("Please enter report description.");
      return;
    }

    setReports((prevReports) => {
      const existing = prevReports.find((item) => item.id === selectedLocation.id);

      if (existing) {
        return prevReports.map((item) => {
          if (item.id !== selectedLocation.id) return item;

          const newCount = item.count + 1;

          return {
            ...item,
            count: newCount,
            radius: getRadius(newCount),
            latestReason: reason,
            latestDescription: description,
          };
        });
      }

      return [
        {
          ...selectedLocation,
          count: 1,
          radius: 200,
          latestReason: reason,
          latestDescription: description,
        },
        ...prevReports,
      ];
    });

    setDescription("");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_500px]">
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-neon">
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-2 text-[var(--accent)]">
            <AlertTriangle className="h-5 w-5" />
            <span className="text-sm font-semibold">
              Citizen Traffic Restriction Report
            </span>
          </div>

          <h1 className="text-2xl font-extrabold text-[var(--text)]">
            Report Event Restricted Location
          </h1>

          <p className="mt-2 text-sm text-[var(--muted)]">
            Search Bangalore dataset locations and report areas where public events
            should be restricted.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-[var(--text)]">
              Search Bangalore Location
            </label>

            <div className="relative">
              <input
                value={locationSearch}
                onChange={(e) => {
                  setLocationSearch(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                placeholder="Search road, junction, area..."
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--card-subtle)] px-4 py-3 text-[var(--text)] outline-none"
              />

              {showDropdown && (
                <div className="absolute z-30 mt-2 max-h-72 w-full overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-neon">
                  {filteredLocations.length === 0 ? (
                    <div className="p-4 text-sm text-[var(--muted)]">
                      No matching location found.
                    </div>
                  ) : (
                    filteredLocations.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setSelectedLocation(item);
                          setLocationSearch(item.name);
                          setShowDropdown(false);
                        }}
                        className="block w-full border-b border-[var(--border)] px-4 py-3 text-left hover:bg-[var(--card-subtle)]"
                      >
                        <div className="font-bold text-[var(--text)]">
                          {item.name}
                        </div>
                        <div className="text-xs text-[var(--muted)]">
                          {item.fullAddress}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {selectedLocation && (
            <div className="grid gap-3 rounded-xl border border-[var(--border)] bg-[var(--card-subtle)] p-4 md:grid-cols-3">
              <div>
                <p className="text-xs text-[var(--muted)]">Coverage Radius</p>
                <p className="font-bold text-[var(--text)]">
                  {selectedLocation.radius || 200}m
                </p>
              </div>

              <div>
                <p className="text-xs text-[var(--muted)]">Latitude</p>
                <p className="font-bold text-[var(--text)]">
                  {selectedLocation.lat.toFixed(6)}
                </p>
              </div>

              <div>
                <p className="text-xs text-[var(--muted)]">Longitude</p>
                <p className="font-bold text-[var(--text)]">
                  {selectedLocation.lng.toFixed(6)}
                </p>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={fetchLiveLocation}
            className="flex w-fit items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card-subtle)] px-4 py-3 font-bold text-[var(--text)]"
          >
            <LocateFixed className="h-4 w-4 text-[var(--accent)]" />
            Fetch My Live Location
          </button>

          {userLocation && (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card-subtle)] p-4">
              <p className="text-xs text-[var(--muted)]">Your Live Coordinates</p>
              <p className="font-bold text-[var(--text)]">
                {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}
              </p>
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-semibold text-[var(--text)]">
              Reason Category
            </label>

            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--card-subtle)] px-4 py-3 text-[var(--text)] outline-none"
            >
              {reasonCategories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[var(--text)]">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="5"
              placeholder="Example: This area gets congested during public events. Event permissions should be restricted here."
              className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--card-subtle)] px-4 py-3 text-[var(--text)] outline-none"
            />
          </div>

          <button
            type="submit"
            className="flex w-fit items-center gap-2 rounded-xl bg-[var(--accent)] px-5 py-3 font-bold text-white transition hover:opacity-90"
          >
            <Send className="h-4 w-4" />
            Submit Report
          </button>
        </form>
      </section>

      <aside className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-neon">
        <div className="mb-5 flex items-center gap-2">
          <FileText className="h-5 w-5 text-[var(--accent)]" />
          <div>
            <h2 className="text-lg font-extrabold text-[var(--text)]">
              Reported Locations
            </h2>
            <p className="text-xs text-[var(--muted)]">
              Same location reports increase count.
            </p>
            <p className="mt-1 text-xs font-bold text-[var(--accent)]">
              Total Reported Locations: {reports.length}
            </p>
          </div>
        </div>

        {reports.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[var(--border)] p-5 text-center text-sm text-[var(--muted)]">
            No reported locations yet.
          </div>
        ) : (
          <div className="grid gap-3">
            {[...reports].sort((a, b) => b.count - a.count).map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-[var(--border)] bg-[var(--card-subtle)] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-[var(--danger)]" />
                      <h3 className="font-bold text-[var(--text)]">
                        {item.name}
                      </h3>
                    </div>

                    <p className="mt-1 text-xs text-[var(--muted)]">
                      Radius {item.radius}m
                    </p>
                  </div>

                  <div className="rounded-lg bg-[var(--danger-soft)] px-3 py-1 text-sm font-bold text-[var(--danger)]">
                    {item.count} reports
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-lg bg-[var(--card)] p-2">
                    <p className="text-[var(--muted)]">Latitude</p>
                    <p className="font-bold text-[var(--text)]">
                      {item.lat.toFixed(6)}
                    </p>
                  </div>

                  <div className="rounded-lg bg-[var(--card)] p-2">
                    <p className="text-[var(--muted)]">Longitude</p>
                    <p className="font-bold text-[var(--text)]">
                      {item.lng.toFixed(6)}
                    </p>
                  </div>
                </div>

                <div className="mt-3 rounded-lg border border-[var(--border)] bg-[var(--card)] p-3">
                  <p className="text-xs text-[var(--muted)]">
                    Reason: {item.latestReason}
                  </p>

                  <p className="mt-2 text-sm text-[var(--muted-strong)]">
                    {item.latestDescription}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </aside>
    </div>
  );
}