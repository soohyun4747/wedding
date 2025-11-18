'use client';

import { useEffect, useRef, useState } from 'react';

declare global {
        interface Window {
                naver: any;
        }
}

interface NaverMapProps {
        clientId: string;
        address: string;
        placeName: string;
        mapLink: string;
}

export default function NaverMap({ clientId, address, placeName, mapLink }: NaverMapProps) {
        const mapElementRef = useRef<HTMLDivElement | null>(null);
        const [loadError, setLoadError] = useState<string | null>(null);

        useEffect(() => {
                if (!clientId) {
                        setLoadError('네이버 지도 클라이언트 ID가 설정되지 않았습니다.');
                        return;
                }

                if (typeof window === 'undefined') return;

                const initializeMap = () => {
                        if (!mapElementRef.current || !window.naver?.maps) return;

                        const map = new window.naver.maps.Map(mapElementRef.current, {
                                center: new window.naver.maps.LatLng(37.5665, 126.978),
                                zoom: 16,
                        });

                        window.naver.maps.Service.geocode(
                                { query: address },
                                (status: string, response: any) => {
                                        if (status !== window.naver.maps.Service.Status.OK) {
                                                setLoadError('지도를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.');
                                                return;
                                        }

                                        const result = response.v2.addresses?.[0];
                                        if (!result) {
                                                setLoadError('주소를 찾을 수 없습니다.');
                                                return;
                                        }

                                        const location = new window.naver.maps.LatLng(Number(result.y), Number(result.x));
                                        map.setCenter(location);

                                        const marker = new window.naver.maps.Marker({
                                                position: location,
                                                map,
                                        });

                                        const infoWindow = new window.naver.maps.InfoWindow({
                                                content: `
                                                        <div style="padding:8px 12px; font-size:13px; line-height:1.5;">
                                                                <div style="font-weight:600; margin-bottom:4px;">${placeName}</div>
                                                                <div style="color:#4b5563;">${address}</div>
                                                        </div>
                                                `,
                                        });
                                        infoWindow.open(map, marker);
                                }
                        );
                };

                if (window.naver?.maps) {
                        initializeMap();
                        return;
                }

                const existingScript = document.getElementById('naver-map-script');
                if (existingScript) {
                        existingScript.addEventListener('load', initializeMap);
                        return () => {
                                existingScript.removeEventListener('load', initializeMap);
                        };
                }

                const script = document.createElement('script');
                script.id = 'naver-map-script';
                script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${clientId}&submodules=geocoder`;
                script.async = true;
                script.onload = initializeMap;
                script.onerror = () => setLoadError('네이버 지도 스크립트를 불러오지 못했습니다.');
                document.head.appendChild(script);

                return () => {
                        script.onload = null;
                        script.onerror = null;
                };
        }, [clientId, address, placeName]);

        if (loadError) {
            return (
                <div className='bg-white rounded-2xl shadow-sm p-6 text-center text-sm text-red-600'>
                        {loadError}
                </div>
            );
        }

        return (
                <div className='space-y-3 mb-6'>
                        <div ref={mapElementRef} className='bg-white rounded-2xl shadow-sm h-64' />
                        <button
                                onClick={() => window.open(mapLink, '_blank')}
                                className='w-full py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition-colors'
                        >
                                네이버 지도에서 길찾기
                        </button>
                </div>
        );
}
