"use client"

import "leaflet/dist/leaflet.css"

import { MapContainer, TileLayer, Polyline, CircleMarker, Popup } from "react-leaflet"

type RoutePoint = {
  label: string
  lat: number
  lon: number
  kind: "start" | "current" | "destination"
}

export function WarsawRouteMap({
  height = 320,
  eta,
}: {
  height?: number
  eta?: string
}) {
  const points: RoutePoint[] = [
    { label: "Start (Wola)", lat: 52.2404, lon: 20.9449, kind: "start" },
    { label: "Aktualnie (Śródmieście)", lat: 52.2197, lon: 21.0222, kind: "current" },
    { label: "Cel (Mokotów)", lat: 52.2002, lon: 21.0221, kind: "destination" },
  ]

  const polyline: [number, number][] = points.map((p) => [p.lat, p.lon])
  const center: [number, number] = [52.2197, 21.0122]

  const markerColor = (kind: RoutePoint["kind"]) => {
    switch (kind) {
      case "start":
        return "#f59e0b"
      case "current":
        return "#2563eb"
      case "destination":
        return "#22c55e"
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">OpenStreetMap • podgląd orientacyjny</p>
        {eta ? <p className="text-xs text-muted-foreground">ETA: {eta}</p> : null}
      </div>

      <div className="overflow-hidden rounded-lg border bg-background">
        <div style={{ height }}>
          <MapContainer
            center={center}
            zoom={12}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Polyline positions={polyline} pathOptions={{ color: "#3b82f6", weight: 4 }} />

            {points.map((p) => (
              <CircleMarker
                key={p.label}
                center={[p.lat, p.lon]}
                radius={p.kind === "current" ? 9 : 7}
                pathOptions={{ color: markerColor(p.kind), fillColor: markerColor(p.kind), fillOpacity: 0.9 }}
              >
                <Popup>
                  <div className="text-sm">
                    <p className="font-medium">{p.label}</p>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
      </div>

      <div className="grid gap-1 text-sm text-muted-foreground">
        <p><span className="font-medium text-foreground">Start:</span> Wola</p>
        <p><span className="font-medium text-foreground">Aktualnie:</span> Śródmieście</p>
        <p><span className="font-medium text-foreground">Cel:</span> Mokotów</p>
      </div>
    </div>
  )
}
