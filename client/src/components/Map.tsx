/// <reference types="@types/google.maps" />

import { useEffect, useRef } from "react";
import { usePersistFn } from "@/hooks/usePersistFn";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    google?: typeof google;
  }
}

// Browser Maps keys are intentionally public credentials. Restrict this key in
// Google Cloud by HTTP referrer / Android app and only enable the required Maps APIs.
const GOOGLE_MAPS_BROWSER_KEY = import.meta.env.VITE_GOOGLE_MAPS_BROWSER_KEY;
const GOOGLE_MAPS_SCRIPT_URL = "https://maps.googleapis.com/maps/api/js";

let mapsLoadPromise: Promise<void> | null = null;

function loadMapScript(): Promise<void> {
  if (window.google?.maps) return Promise.resolve();
  if (mapsLoadPromise) return mapsLoadPromise;

  mapsLoadPromise = new Promise<void>((resolve, reject) => {
    if (!GOOGLE_MAPS_BROWSER_KEY) {
      reject(new Error("VITE_GOOGLE_MAPS_BROWSER_KEY is not configured"));
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-intelligence-dashboard-google-maps="true"]'
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener(
        "error",
        () => reject(new Error("Failed to load Google Maps script")),
        { once: true }
      );
      return;
    }

    const script = document.createElement("script");
    const params = new URLSearchParams({
      key: GOOGLE_MAPS_BROWSER_KEY,
      v: "weekly",
      libraries: "marker,places,geocoding,geometry",
    });

    script.src = `${GOOGLE_MAPS_SCRIPT_URL}?${params.toString()}`;
    script.async = true;
    script.defer = true;
    script.crossOrigin = "anonymous";
    script.dataset.intelligenceDashboardGoogleMaps = "true";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Maps script"));
    document.head.appendChild(script);
  });

  return mapsLoadPromise;
}

interface MapViewProps {
  className?: string;
  initialCenter?: google.maps.LatLngLiteral;
  initialZoom?: number;
  onMapReady?: (map: google.maps.Map) => void;
}

export function MapView({
  className,
  initialCenter = { lat: -15.793889, lng: -47.882778 },
  initialZoom = 12,
  onMapReady,
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map | null>(null);

  const init = usePersistFn(async () => {
    try {
      await loadMapScript();
    } catch (error) {
      console.error("Google Maps unavailable:", error);
      return;
    }

    if (!mapContainer.current || !window.google?.maps) return;

    map.current = new window.google.maps.Map(mapContainer.current, {
      zoom: initialZoom,
      center: initialCenter,
      mapTypeControl: true,
      fullscreenControl: true,
      zoomControl: true,
      streetViewControl: true,
    });

    onMapReady?.(map.current);
  });

  useEffect(() => {
    void init();
  }, [init]);

  return <div ref={mapContainer} className={cn("w-full h-[500px]", className)} />;
}
