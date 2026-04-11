"use client";

import { useState, useCallback } from "react";

interface GeolocationResult {
  loading: boolean;
  error: string | null;
  getAddress: () => Promise<string>;
  coords: { lat: number; lon: number } | null;
}

/**
 * Custom hook: GPS → Nominatim reverse geocode → human-readable address (tiếng Việt).
 *
 * Usage:
 *   const { loading, error, getAddress } = useGeolocation();
 *   const addr = await getAddress(); // "Cầu Giấy, Hà Nội"
 */
export function useGeolocation(): GeolocationResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);

  const getAddress = useCallback(async (): Promise<string> => {
    if (!navigator.geolocation) {
      const msg = "Trình duyệt không hỗ trợ định vị";
      setError(msg);
      throw new Error(msg);
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Lấy GPS coordinates
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 60000, // cache 1 phút
          }),
      );

      const { latitude: lat, longitude: lon } = position.coords;
      setCoords({ lat, lon });

      // 2. Reverse geocode qua Nominatim (free, no API key)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=vi&zoom=16`,
        {
          headers: {
            "User-Agent": "MissLost-UEH/1.0 (lost-and-found app)",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Reverse geocode thất bại");
      }

      const data = await response.json();
      const addr = data.address;

      // Ưu tiên hiển thị: road + suburb/quarter → district → city
      const parts = [
        addr.road,
        addr.suburb || addr.quarter || addr.neighbourhood,
        addr.city_district || addr.county,
        addr.city || addr.town || addr.state,
      ].filter(Boolean);

      // Lấy tối đa 3 phần để ngắn gọn
      const readable = parts.slice(0, 3).join(", ");
      return readable || data.display_name || `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
    } catch (e: unknown) {
      let msg = "Không lấy được vị trí";

      if (e instanceof GeolocationPositionError) {
        switch (e.code) {
          case e.PERMISSION_DENIED:
            msg = "Vui lòng cho phép truy cập vị trí trong cài đặt trình duyệt";
            break;
          case e.POSITION_UNAVAILABLE:
            msg = "Không thể xác định vị trí hiện tại";
            break;
          case e.TIMEOUT:
            msg = "Hết thời gian chờ định vị";
            break;
        }
      } else if (e instanceof Error) {
        msg = e.message;
      }

      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, getAddress, coords };
}
