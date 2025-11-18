'use client';

import { useState } from 'react';
import Image from 'next/image';

interface Photo {
  src: string;
  caption: string;
}

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<Photo | null>(null);
  
  const photos: Photo[] = [
    { src: '/images/IMG_3493.jpg', caption: '예배당에서' },
    { src: '/images/IMG_3489.jpg', caption: '운동장에서' },
    { src: '/images/IMG_3494.jpg', caption: '복도에서' },
    { src: '/images/IMG_3487.jpg', caption: '건물 앞에서' },
    { src: '/images/IMG_3491.jpg', caption: '횡단보도에서' },
    { src: '/images/IMG_3482.jpg', caption: '해변에서' },
    { src: '/images/IMG_3483.jpg', caption: '석양 바다' },
    { src: '/images/IMG_3484.jpg', caption: '바닷가 산책' },
    { src: '/images/IMG_3486.jpg', caption: '녹지 길에서' },
    { src: '/images/IMG_3490.jpg', caption: '나무 아래에서' },
    { src: '/images/IMG_3488.jpg', caption: '부케와 함께' },
    { src: '/images/IMG_3492.jpg', caption: '벤치에 앉아서' },
    { src: '/images/IMG_3478.jpg', caption: '운동장에서 촬영' },
    { src: '/images/IMG_3481.jpg', caption: '석양의 순간' },
    { src: '/images/IMG_3479.jpg', caption: '장미 한 송이' },
    { src: '/images/IMG_3477.jpg', caption: '바다와 함께' },
    { src: '/images/IMG_3480.jpg', caption: '웨딩 문구' },
  ];

  return (
    <>
      {/* 그리드 갤러리 */}
      <div className="grid grid-cols-3 gap-2">
        {photos.map((photo, idx) => (
          <div 
            key={idx}
            onClick={() => setSelectedImage(photo)}
            className="aspect-square overflow-hidden rounded-lg cursor-pointer hover:opacity-80 transition-opacity relative"
          >
            <Image 
              src={photo.src}
              alt={photo.caption}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 33vw, 20vw"
            />
          </div>
        ))}
      </div>

      {/* 라이트박스 */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-lg w-full">
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white text-3xl hover:text-gray-300"
            >
              ✕
            </button>
            <div className="bg-white rounded-2xl overflow-hidden">
              <div className="relative aspect-square">
                <Image 
                  src={selectedImage.src}
                  alt={selectedImage.caption}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 500px"
                />
              </div>
              <div className="p-6 text-center">
                <p className="text-lg font-medium text-gray-800">
                  {selectedImage.caption}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}