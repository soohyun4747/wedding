'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import Gallery from '@/app/components/Gallery';

export default function Home() {
	const [showContent, setShowContent] = useState(false);
	const [daysLeft, setDaysLeft] = useState(0);
        const [isPlaying, setIsPlaying] = useState(false);
        const audioRef = useRef<HTMLAudioElement | null>(null);

	const accounts = [
		{
			role: '신랑 혼주',
			name: '최명섭',
			bank: '농협',
			number: '743802-01-000416',
		},
		{
			role: '신랑',
			name: '최광은',
			bank: '우리은행',
			number: '940302-00-470325',
		},
		{
			role: '신부 혼주',
			name: '정외영',
			bank: '우리은행',
			number: '424-08-166007',
		},
		{
			role: '신부',
			name: '정수현',
			bank: '우리은행',
			number: '1002-356-005148',
		},
	];

	const naverMapLink =
		'https://map.naver.com/p/search/%EC%95%84%ED%8E%A0%EA%B0%80%EB%AA%A8%20%EB%B0%98%ED%8F%AC';

        const weddingDate = useMemo(() => new Date('2026-03-02T12:30:00'), []);

        const calendarMatrix = useMemo(() => {
                const monthStart = new Date(weddingDate.getFullYear(), weddingDate.getMonth(), 1);
                const monthEnd = new Date(weddingDate.getFullYear(), weddingDate.getMonth() + 1, 0);
                const startDay = monthStart.getDay();
                const daysInMonth = monthEnd.getDate();

                const matrix: (number | null)[][] = [];
                let dayCounter = 1 - startDay;

                while (dayCounter <= daysInMonth) {
                        const week: (number | null)[] = [];
                        for (let i = 0; i < 7; i += 1) {
                                if (dayCounter > 0 && dayCounter <= daysInMonth) {
                                        week.push(dayCounter);
                                } else {
                                        week.push(null);
                                }
                                dayCounter += 1;
                        }
                        matrix.push(week);
                }

                return matrix;
        }, [weddingDate]);

	useEffect(() => {
		setTimeout(() => setShowContent(true), 100);

		const calculateDays = () => {
			const today = new Date();
			const difference = weddingDate.getTime() - today.getTime();
			const days = Math.ceil(difference / (1000 * 60 * 60 * 24));
			setDaysLeft(days);
		};

                calculateDays();

                const audio = new Audio('/audio/serene-note.wav');
                audio.loop = true;
                audio.volume = 0.35;
                audioRef.current = audio;

                return () => {
                        audio.pause();
                };
        }, [weddingDate]);

        useEffect(() => {
                if (!audioRef.current) return;

                if (isPlaying) {
                        audioRef.current
                                .play()
                                .catch((err) => console.error('Audio play failed', err));
                } else {
                        audioRef.current.pause();
                }
        }, [isPlaying]);

	const handleCopy = async (number: string) => {
		try {
			await navigator.clipboard.writeText(number);
			alert('계좌번호가 복사되었습니다.');
		} catch (err) {
			console.error('Copy failed', err);
			alert('복사에 실패했어요. 다시 시도해주세요.');
		}
	};

	return (
                <div className='min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-50 text-gray-800'>
                        {/* 커버 이미지 */}
                        <div className='relative h-screen flex justify-center overflow-hidden pb-20'>
                                <Image
                                        src='/images/IMG_3485.jpg'
                                        alt='Wedding Cover'
					fill
					className='object-cover'
					priority
				/>
                                <div className='absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-black/60'></div>
                                <div
                                        className={`relative z-10 text-center transition-all duration-1000 ${
                                                showContent
                                                        ? 'opacity-100 translate-y-16'
                                                        : 'opacity-0 translate-y-24'
                                        }`}>
                                        <p className='text-sm tracking-[0.3em] text-emerald-100 mb-4 drop-shadow-lg uppercase'>
                                                WEDDING INVITATION
                                        </p>
                                        <div className='space-y-2 animate-soft-float'>
                                                <h1 className='text-4xl font-serif text-white drop-shadow-lg'>
                                                        광은 <span className='text-2xl mx-2'>&</span> 수현
                                                </h1>
                                        </div>
                                        <div className='mt-8 space-y-1'>
                                                <p className='text-white drop-shadow-lg'>
                                                        2026. 3. 2. MON
                                                </p>
                                                <p className='text-white drop-shadow-lg'>PM 12:30</p>
                                        </div>
                                        <div className='mt-12'>
                                                <div className='w-px h-12 bg-emerald-100 mx-auto animate-bounce opacity-80'></div>
                                        </div>
                                </div>
                        </div>

                        {/* 초대 메시지 */}
                        <div className='px-6 py-16 bg-white/70 backdrop-blur-sm'>
                                <div className='max-w-md mx-auto text-center'>
                                        <p className='text-gray-700 leading-loose whitespace-pre-line text-[15px] animate-fade-in'>
                                                {`평생을 함께 하고픈
사랑하는 사람을 만났습니다.

저희 두 사람이
사랑과 믿음으로
한 가정을 이루는 첫 걸음,

그 자리에 오셔서
축복해 주시면 감사하겠습니다.`}
                                        </p>
                                </div>
                        </div>

                        {/* D-Day */}
                        <div className='px-6 py-16 bg-gradient-to-b from-emerald-50/60 via-white to-emerald-50/60'>
                                <div className='max-w-md mx-auto bg-white rounded-3xl shadow-xl p-8 text-center border border-emerald-100 animate-soft-rise'>
                                        <p className='text-emerald-600 mb-3 text-sm tracking-wide'>
                                                우리의 결혼식이
                                        </p>
                                        <div className='text-5xl font-bold text-emerald-800 mb-2 drop-shadow-sm'>
                                                D-{daysLeft}
                                        </div>
                                        <p className='text-gray-500 text-sm mb-8'>남았습니다</p>

                                        <div className='bg-emerald-50 rounded-2xl p-4 shadow-inner'>
                                                <div className='grid grid-cols-7 text-xs font-medium text-emerald-700 mb-3'>
                                                        {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => (
                                                                <div key={day} className='text-center'>
                                                                        {day}
                                                                </div>
                                                        ))}
                                                </div>
                                                <div className='space-y-2'>
                                                        {calendarMatrix.map((week, index) => (
                                                                <div key={`week-${index}`} className='grid grid-cols-7 gap-1 text-sm'>
                                                                        {week.map((date, idx) => {
                                                                                const isWeddingDay = date === weddingDate.getDate();
                                                                                return (
                                                                                        <div
                                                                                                key={`day-${index}-${idx}`}
                                                                                                className={`h-10 flex items-center justify-center rounded-xl transition-all duration-300 ${
                                                                                                        isWeddingDay
                                                                                                                ? 'bg-emerald-500 text-white font-semibold shadow-md animate-pulse-soft'
                                                                                                                : date
                                                                                                                ? 'bg-white text-emerald-800 shadow-sm'
                                                                                                                : 'text-gray-300'
                                                                                                }`}>
                                                                                                {date ?? ''}
                                                                                        </div>
                                                                                );
                                                                        })}
                                                                </div>
                                                        ))}
                                                </div>
                                                <p className='mt-4 text-xs text-emerald-700 flex items-center justify-center gap-2'>
                                                        <span className='inline-block h-2 w-2 rounded-full bg-emerald-500 animate-glow'></span>
                                                        3월 2일, 가장 특별한 날을 달력에 표시했어요.
                                                </p>
                                        </div>
                                </div>
                        </div>

			{/* 신랑 신부 소개 */}
                        <div className='px-6 py-16 bg-white'>
                                <div className='max-w-md mx-auto'>
                                        <div className='grid grid-cols-2 gap-6 text-center'>
                                                <div className='rounded-2xl border border-emerald-100 bg-gradient-to-b from-white to-emerald-50/40 shadow-sm p-6 transition-transform duration-500 hover:-translate-y-1 hover:shadow-lg'>
                                                        <div className='w-20 h-20 bg-emerald-100 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl animate-soft-float'>
                                                                🤵
                                                        </div>
                                                        <p className='text-sm text-emerald-600 mb-1 tracking-wide'>GROOM</p>
                                                        <p className='text-xl font-semibold text-gray-900 mb-3'>
                                                                최광은
                                                        </p>
                                                        <div className='text-xs text-gray-600 space-y-1'>
                                                                <p>최명섭 · 김은실의 장남</p>
                                                        </div>
                                                </div>

                                                <div className='rounded-2xl border border-emerald-100 bg-gradient-to-b from-white to-emerald-50/40 shadow-sm p-6 transition-transform duration-500 hover:-translate-y-1 hover:shadow-lg'>
                                                        <div className='w-20 h-20 bg-emerald-100 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl animate-soft-float'>
                                                                👰
                                                        </div>
                                                        <p className='text-sm text-emerald-600 mb-1 tracking-wide'>BRIDE</p>
                                                        <p className='text-xl font-semibold text-gray-900 mb-3'>
                                                                정수현
                                                        </p>
                                                        <div className='text-xs text-gray-600 space-y-1'>
                                                                <p>정외영 · 송미연의 장녀</p>
                                                        </div>
                                                </div>
                                        </div>
                                </div>
                        </div>

			{/* 예식 정보 */}
                        <div className='px-6 py-16 bg-gradient-to-b from-white to-emerald-50/60'>
                                <div className='max-w-md mx-auto'>
                                        <h2 className='text-2xl font-serif text-center mb-8 text-emerald-800 animate-fade-in'>
                                                예식 안내
                                        </h2>
                                        <div className='bg-white rounded-3xl shadow-lg p-6 space-y-4 border border-emerald-100'>
                                                <div className='flex items-start gap-4'>
                                                        <div className='text-2xl'>📅</div>
                                                        <div className='flex-1 text-left'>
                                                                <p className='text-sm text-emerald-600 mb-1'>
                                                                        날짜
                                                                </p>
                                                                <p className='text-gray-800 font-medium'>
                                                                        2026년 3월 2일 월요일
                                                                </p>
                                                        </div>
                                                </div>
                                                <div className='flex items-start gap-4'>
                                                        <div className='text-2xl'>⏰</div>
                                                        <div className='flex-1 text-left'>
                                                                <p className='text-sm text-emerald-600 mb-1'>
                                                                        시간
                                                                </p>
                                                                <p className='text-gray-800 font-medium'>오후 12시 30분</p>
                                                        </div>
                                                </div>
                                                <div className='flex items-start gap-4'>
                                                        <div className='text-2xl'>📍</div>
                                                        <div className='flex-1 text-left'>
                                                                <p className='text-sm text-emerald-600 mb-1'>
                                                                        장소
                                                                </p>
                                                                <p className='text-gray-800 font-semibold'>
                                                                        아펠가모 반포 LL층
                                                                </p>
                                                                <p className='text-sm text-gray-500 mt-1'>
                                                                        서울 서초구 반포대로 235
                                                                </p>
                                                        </div>
                                                </div>
                                        </div>
                                </div>
                        </div>

			{/* 마음 전하실 곳 */}
                        <div className='px-6 py-16 bg-white'>
                                <div className='max-w-md mx-auto'>
                                        <h2 className='text-2xl font-serif text-center mb-4 text-emerald-800'>
                                                마음 전하실 곳
                                        </h2>
                                        <p className='text-center text-sm text-gray-600 mb-8'>
                                                혼주와 신랑·신부의 계좌번호를 복사하실 수 있습니다.
                                        </p>
                                        <div className='space-y-3'>
                                                {accounts.map((account, index) => (
                                                        <div
                                                                key={`${account.name}-${index}`}
                                                                className='flex items-center justify-between bg-emerald-50/60 border border-emerald-100 rounded-xl px-4 py-3 shadow-sm hover:-translate-y-0.5 transition-all duration-300'>
                                                                <div>
                                                                        <p className='text-xs text-emerald-600'>
                                                                                {account.role}
                                                                        </p>
                                                                        <p className='text-sm font-semibold text-gray-900'>
                                                                                {account.name}
                                                                        </p>
                                                                        <p className='text-xs text-gray-700'>
                                                                                {account.bank} {account.number}
                                                                        </p>
                                                                </div>
                                                                <button
                                                                        onClick={() => handleCopy(account.number)}
                                                                        className='text-sm text-emerald-800 bg-white border border-emerald-100 rounded-lg px-3 py-2 hover:bg-emerald-50 transition-colors shadow-sm'>
                                                                        복사하기
                                                                </button>
                                                        </div>
                                                ))}
                                        </div>
				</div>
			</div>

			{/* 갤러리 */}
                        <div className='px-6 py-16 bg-white'>
                                <div className='max-w-md mx-auto'>
                                        <h2 className='text-2xl font-serif text-center mb-4 text-emerald-800'>
                                                우리의 이야기
                                        </h2>
                                        <p className='text-center text-sm text-gray-600 mb-8'>
                                                함께한 소중한 순간들
                                        </p>
                                        <Gallery />
				</div>
			</div>

			{/* 오시는 길 */}
                        <div className='px-6 py-16 bg-gradient-to-b from-emerald-50/50 via-white to-emerald-50/50'>
                                <div className='max-w-md mx-auto'>
                                        <h2 className='text-2xl font-serif text-center mb-8 text-emerald-800'>
                                                오시는 길
                                        </h2>

                                        <div className='bg-emerald-100 rounded-2xl h-64 mb-6 overflow-hidden shadow-inner'>
                                                <iframe
                                                        title='네이버 지도'
                                                        src='https://map.naver.com/v5/entry/place/11609482?c=14129783.1012107,4517407.3607136,15,0,0,0,dh&placePath=%2Fhome'
                                                        className='w-full h-full border-0'
                                                        allowFullScreen></iframe>
                                        </div>

                                        <button
                                                onClick={() => window.open(naverMapLink, '_blank')}
                                                className='w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl mb-6 hover:shadow-lg transition-all duration-300'>
                                                네이버 지도에서 길찾기
                                        </button>

                                        <div className='bg-white rounded-2xl shadow-lg p-6 space-y-5 border border-emerald-100'>
                                                <div>
                                                        <p className='font-semibold text-emerald-800 mb-2 flex items-center gap-2'>
                                                                🚇 대중교통
                                                        </p>
                                                        <p className='text-sm text-gray-700 leading-relaxed'>
                                                                고속터미널역 5번 출구에서 약 도보 5분
                                                        </p>
                                                </div>
                                                <div>
                                                        <p className='font-semibold text-emerald-800 mb-2 flex items-center gap-2'>
                                                                🚌 전세 버스
                                                        </p>
                                                        <p className='text-sm text-gray-700 leading-relaxed'>
                                                                대전 세계로교회에서 오전 9시 출발, 오후 3시 회차
                                                        </p>
                                                </div>
                                                <div>
                                                        <p className='font-semibold text-emerald-800 mb-2 flex items-center gap-2'>
                                                                🚗 주차
                                                        </p>
                                                        <p className='text-sm text-gray-700 leading-relaxed'>
                                                                건물 지하 무료주차 (예식 당일 2시간 무료)
                                                        </p>
                                                </div>
                                        </div>
                                </div>
                        </div>

			{/* 푸터 */}
                        <div className='px-6 py-16 bg-gradient-to-b from-emerald-900 to-emerald-700 text-white text-center'>
                                <div className='max-w-md mx-auto space-y-4'>
                                        <p className='text-sm tracking-[0.3em] text-emerald-100'>THANK YOU</p>
                                        <div className='text-3xl animate-glow'>💐</div>
                                        <div className='space-y-1'>
                                                <p className='text-lg font-semibold'>광은 & 수현</p>
                                                <p className='text-sm text-emerald-200'>2026. 3. 2</p>
                                        </div>
                                </div>
                        </div>

                        {/* 플로팅 버튼 */}
                        <div className='fixed bottom-6 right-6 z-50 flex flex-col gap-3'>
                                <button
                                        onClick={() => setIsPlaying(!isPlaying)}
                                        className='w-14 h-14 bg-white/90 backdrop-blur-md border border-emerald-100 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform text-2xl'>
                                        {isPlaying ? '🔇' : '🎵'}
                                </button>
                                <button
                                        onClick={() =>
                                                window.scrollTo({ top: 0, behavior: 'smooth' })
                                        }
                                        className='w-14 h-14 bg-white/90 backdrop-blur-md border border-emerald-100 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform'>
                                        ⬆️
                                </button>
                        </div>
		</div>
	);
}
