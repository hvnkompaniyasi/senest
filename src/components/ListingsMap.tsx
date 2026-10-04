"use client";
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Image from "next/image";

export interface MapListing {
  id: string;
  title: string;
  price: string;
  lat: number;
  lng: number;
  image: string;
  isPremium: boolean;
}

export default function ListingsMap({ listings }: { listings: MapListing[] }) {
  const divRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!divRef.current || mapRef.current) return;
    const map = L.map(divRef.current, { zoomControl: false }).setView([41.31, 69.24], 6);
    L.control.zoom({ position: "bottomright" }).addTo(map);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap",
      maxZoom: 18,
    }).addTo(map);
    layerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer) return;
    layer.clearLayers();
    const bounds: [number, number][] = [];
    listings.forEach((l) => {
      bounds.push([l.lat, l.lng]);
      const icon = L.divIcon({
        className: "",
        html: `<span class="price-pin ${l.isPremium ? "price-pin-vip" : ""}">${l.price}</span>`,
        iconSize: [0, 0],
      });
      const marker = L.marker([l.lat, l.lng], { icon }).addTo(layer);
      marker.bindPopup(
        `<div style="min-width:180px">
          <img src="${l.image}" alt="" style="width:100%;height:100px;object-fit:cover;border-radius:10px" />
          <p style="margin:8px 0 4px;font-weight:800;font-size:13px">${l.title}</p>
          <a href="/listing/${l.id}" style="color:#0A7C4E;font-weight:700;font-size:12px">E'lonni ko'rish →</a>
        </div>`
      );
    });
    if (bounds.length > 0) map.fitBounds(L.latLngBounds(bounds), { padding: [40, 40] });
  }, [listings]);

  return <div ref={divRef} className="h-[60vh] sm:h-[65vh] w-full rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(10,124,78,0.12)] z-0" />;
}
