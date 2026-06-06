"use client";

import React, { useEffect, useRef, useState } from "react";
import Script from "next/script";
import styles from "./LocationSection.module.css";
import { MapPin, ExternalLink } from "lucide-react";
import { Button } from "../../common/Button/Button";

interface NaverMapProps {
  addressRoad: string;
}

export const NaverMap = ({ addressRoad }: NaverMapProps) => {
  const mapElement = useRef<HTMLDivElement>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  
  const clientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;

  // 진주시 신안로 161 (이현동 29-29) 숙이네국수 대략적 위경도: 35.1982, 128.0709
  const LAT = 35.198224;
  const LNG = 128.070942;

  useEffect(() => {
    if (!scriptLoaded || !clientId || mapError || !mapElement.current) return;

    try {
      const { naver } = window as any;
      if (!naver || !naver.maps) {
        setMapError(true);
        return;
      }

      const mapOptions = {
        center: new naver.maps.LatLng(LAT, LNG),
        zoom: 16,
        zoomControl: true,
        mapTypeControl: false,
      };

      const map = new naver.maps.Map(mapElement.current, mapOptions);

      new naver.maps.Marker({
        position: new naver.maps.LatLng(LAT, LNG),
        map: map,
        title: "숙이네국수",
      });
    } catch (e) {
      console.error("Naver map init error:", e);
      setMapError(true);
    }
  }, [scriptLoaded, clientId, mapError]);

  const handleExternalLink = () => {
    // 네이버 지도 검색 바로가기
    const encodedQuery = encodeURIComponent(addressRoad + " 숙이네국수");
    window.open(`https://map.naver.com/v5/search/${encodedQuery}`, "_blank", "noopener,noreferrer");
  };

  // API Client ID가 없거나 로드 에러인 경우 아름다운 Fallback 렌더링
  if (!clientId || mapError) {
    return (
      <div className={styles.fallbackMap}>
        <MapPin size={40} className={styles.fallbackIcon} />
        <h4 className={styles.fallbackTitle}>지도 불러오기 안내</h4>
        <p className={styles.fallbackDesc}>
          네이버 지도 API 키가 등록되지 않았거나 통신 장애로 지도를 불러올 수 없습니다. 아래 길찾기 버튼을 누르시면 네이버 지도로 즉시 이동합니다.
        </p>
        <Button variant="primary" onClick={handleExternalLink}>
          네이버 지도에서 길찾기
          <ExternalLink size={16} style={{ marginLeft: "8px" }} />
        </Button>
      </div>
    );
  }

  return (
    <>
      <Script
        src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${clientId}`}
        onLoad={() => setScriptLoaded(true)}
        onError={() => setMapError(true)}
        strategy="lazyOnload"
      />
      <div ref={mapElement} className={styles.naverMap} />
    </>
  );
};
export default NaverMap;
