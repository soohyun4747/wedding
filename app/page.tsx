'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import Gallery from '@/app/components/Gallery';
import NaverMap from '@/app/components/NaverMap';

const accounts = [
	{
		role: '신랑 혼주',
		name: '최명섭',
		bank: '국민은행',
		number: '743802-01-000416',
	},
	{
		role: '신랑',
		name: '최광은',
		bank: '국민은행',
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

interface ScheduleItem {
	time: string;
	description: string;
}

const LeafFall = () => {
	const leaves = useMemo(
		() =>
			Array.from({ length: 10 }, (_, index) => ({
				id: index,
				left: Math.random() * 100,
				delay: Math.random() * 5,
				duration: 10 + Math.random() * 10,
				size: 10 + Math.random() * 12,
			})),
		[]
	);

	return (
		<div className='pointer-events-none fixed inset-0 z-[10] overflow-hidden'>
			{leaves.map((leaf) => (
				<span
					key={leaf.id}
					className='leaf'
					style={{
						left: `${leaf.left}%`,
						animationDuration: `${leaf.duration}s`,
						animationDelay: `${leaf.delay}s`,
						fontSize: `${leaf.size}px`,
					}}>
					🌸
				</span>
			))}
		</div>
	);
};

export default function Home() {
	const [showContent, setShowContent] = useState(false);
	const [daysLeft, setDaysLeft] = useState(0);
	const [isPlaying, setIsPlaying] = useState(true);

	const audioRef = useRef<HTMLAudioElement | null>(null);

	// 🔊 배경 음악 준비 (public/music/wedding-song.mp3 기준)
	useEffect(() => {
		// Next.js에서 브라우저 환경 체크
		if (typeof window === 'undefined') return;

		const audio = new Audio('/music/wedding.mp3');
		audio.loop = true; // 계속 반복 재생
		audioRef.current = audio;

		// 🔊 자동 재생 시도
		const tryPlay = async () => {
			try {
				await audio.play();
				setIsPlaying(true);
			} catch (e) {
				console.log(e);

				console.warn(
					'자동 재생이 제한되었어요. 사용자 인터랙션 후 재생됩니다.'
				);
				setIsPlaying(false);
			}
		};

		tryPlay();

		return () => {
			audio.pause();
			audioRef.current = null;
		};
	}, []);

	const naverMapLink =
		'https://map.naver.com/p/search/%EC%95%84%ED%8E%A0%EA%B0%80%EB%AA%A8%20%EB%B0%98%ED%8F%AC';
	const naverClientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID || '';

	const weddingDate = new Date('2026-03-02T12:30:00');

	const calendar = useMemo(() => {
		const year = weddingDate.getFullYear();
		const month = weddingDate.getMonth();
		const startDay = new Date(year, month, 1).getDay();
		const daysInMonth = new Date(year, month + 1, 0).getDate();
		const cells: (number | null)[] = [
			...Array.from({ length: startDay }, () => null),
			...Array.from({ length: daysInMonth }, (_, index) => index + 1),
		];
		while (cells.length % 7 !== 0) {
			cells.push(null);
		}
		return {
			label: `${year}년 ${month + 1}월`,
			cells,
		};
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
	}, []);

	const handleToggleMusic = async () => {
		if (!audioRef.current) return;

		try {
			if (isPlaying) {
				audioRef.current.pause();
				setIsPlaying(false);
			} else {
				await audioRef.current.play();
				setIsPlaying(true);
			}
		} catch (e) {
			console.error('음악 재생 실패:', e);
			alert('음악을 재생할 수 없습니다. 다시 시도해주세요.');
		}
	};

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
		<div className='min-h-screen bg-gray-50 relative overflow-hidden'>
			<div className='relative z-10'>
				{/* 커버 이미지 */}
				<div className='relative h-screen flex justify-center overflow-hidden pb-16'>
					<Image
						src='/images/IMG_3485.jpg'
						alt='Wedding Cover'
						fill
						className='object-cover'
						priority
					/>
					<div className='absolute inset-0 bg-black bg-opacity-20'></div>
					<div
						className={`relative z-10 text-center transition-all duration-1000 ${
							showContent
								? 'opacity-100 translate-y-16'
								: 'opacity-0 translate-y-24'
						}`}>
						<p className='text-sm tracking-[0.3em] text-white mb-4 drop-shadow-lg'>
							WEDDING INVITATION
						</p>
						<div className='space-y-2'>
							<h1 className='text-4xl font-serif text-white drop-shadow-lg'>
								광은 <span className='text-transparent'>a</span>{' '}
								수현
							</h1>
						</div>
						<div className='mt-8 space-y-1'>
							<p className='text-white drop-shadow-lg'>
								2026. 3. 2. MON
							</p>
							<p className='text-white drop-shadow-lg'>
								PM 12:30
							</p>
						</div>
                                                <div className='mt-12'>
                                                        <div className='flex flex-col items-center gap-2 text-white animate-bounce'>
                                                                <span className='text-sm tracking-[0.2em]'>SCROLL</span>
                                                                <div className='w-8 h-8 rounded-full border border-white flex items-center justify-center'>
                                                                        ↓
                                                                </div>
                                                        </div>
                                                </div>
					</div>
				</div>

				{/* 초대 메시지 */}
				<div className='px-6 py-16 bg-white'>
					<div className='max-w-md mx-auto text-center'>
						<p className='text-gray-700 leading-loose whitespace-pre-line text-[15px]'>
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
				<div className='px-6 py-12 bg-gray-50'>
					<div className='max-w-md mx-auto space-y-6'>
						<div className='bg-white rounded-2xl shadow-md p-8 text-center'>
							<p className='text-sm text-gray-500 mb-4'>
								{calendar.label}
							</p>
							<div className='grid grid-cols-7 gap-2 text-xs text-gray-500 mb-2'>
								{['일', '월', '화', '수', '목', '금', '토'].map(
									(day) => (
										<div key={day}>{day}</div>
									)
								)}
							</div>
							<div className='grid grid-cols-7 gap-2 text-sm'>
								{calendar.cells.map((cell, index) => {
									const isWeddingDay =
										cell === weddingDate.getDate();
									return (
										<div
											key={`${cell}-${index}`}
											className={`h-10 flex items-center justify-center rounded-lg ${
												isWeddingDay
													? 'bg-rose-100 text-rose-700 font-semibold'
													: cell
													? 'bg-gray-50 text-gray-700'
													: ''
											}`}>
											{cell}
										</div>
									);
								})}
							</div>
						</div>
						<div className='bg-white rounded-2xl shadow-md p-8 text-center'>
							<p className='text-gray-600 mb-3 text-sm'>
								우리의 결혼식이
							</p>
							<div className='text-5xl font-bold text-gray-800 mb-2'>
								D-{daysLeft}
							</div>
							<p className='text-gray-500 text-sm'>남았습니다</p>
						</div>
					</div>
				</div>

				{/* 신랑 신부 소개 */}
				<div className='px-6 py-16 bg-white'>
					<div className='max-w-md mx-auto'>
						<div className='grid grid-cols-2 gap-6 text-center'>
							<div>
								<div className='w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 overflow-hidden relative'>
									<Image
										src='/images/groom.jpg'
										alt='Groom'
										fill
										className='object-cover'
									/>
								</div>
								<p className='text-sm text-gray-500 mb-1'>
									GROOM
								</p>
								<p className='text-xl font-medium text-gray-800 mb-3'>
									최광은
								</p>
								<div className='text-xs text-gray-600 space-y-1'>
									<p>최명섭 · 김은실의 장남</p>
								</div>
							</div>

							<div>
								<div className='w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 overflow-hidden relative'>
									<Image
										src='/images/bride.jpg'
										alt='Bride'
										fill
										className='object-cover'
									/>
								</div>
								<p className='text-sm text-gray-500 mb-1'>
									BRIDE
								</p>
								<p className='text-xl font-medium text-gray-800 mb-3'>
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
				<div className='px-6 py-16 bg-gray-50'>
					<div className='max-w-md mx-auto'>
						<h2 className='text-2xl font-serif text-center mb-8 text-gray-800'>
							예식 안내
						</h2>
						<div className='bg-white rounded-2xl shadow-sm p-6 space-y-4'>
							<div className='flex items-start gap-4'>
								<div className='text-2xl'>📅</div>
								<div className='flex-1'>
									<p className='text-sm text-gray-500 mb-1'>
										날짜
									</p>
									<p className='text-gray-800'>
										2026년 3월 2일 월요일
									</p>
								</div>
							</div>
							<div className='flex items-start gap-4'>
								<div className='text-2xl'>⏰</div>
								<div className='flex-1'>
									<p className='text-sm text-gray-500 mb-1'>
										시간
									</p>
									<p className='text-gray-800'>
										오후 12시 30분
									</p>
								</div>
							</div>
							<div className='flex items-start gap-4'>
								<div className='text-2xl'>📍</div>
								<div className='flex-1'>
									<p className='text-sm text-gray-500 mb-1'>
										장소
									</p>
									<p className='text-gray-800 font-medium'>
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
						<h2 className='text-2xl font-serif text-center mb-4 text-gray-800'>
							마음 전하실 곳
						</h2>
						<p className='text-center text-sm text-gray-500 mb-8'>
							혼주와 신랑·신부의 계좌번호를 복사하실 수 있습니다.
						</p>
						<div className='space-y-3'>
							{accounts.map((account, index) => (
								<div
									key={`${account.name}-${index}`}
									className='flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 shadow-sm'>
									<div>
										<p className='text-xs text-gray-500'>
											{account.role}
										</p>
										<p className='text-sm font-medium text-gray-800'>
											{account.name}
										</p>
										<p className='text-xs text-gray-600'>
											{account.bank} {account.number}
										</p>
									</div>
									<button
										onClick={() =>
											handleCopy(account.number)
										}
										className='text-sm text-gray-800 bg-white border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-100 transition-colors'>
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
						<h2 className='text-2xl font-serif text-center mb-4 text-gray-800'>
							우리의 이야기
						</h2>
						<p className='text-center text-sm text-gray-500 mb-8'>
							함께한 소중한 순간들
						</p>
						<Gallery />
					</div>
				</div>

				{/* 오시는 길 */}
				<div className='px-6 pt-16 pb-8 bg-gray-50'>
					<div className='max-w-md mx-auto'>
						<h2 className='text-2xl font-serif text-center mb-8 text-gray-800'>
							오시는 길
						</h2>

						<NaverMap
							clientId={naverClientId}
							address='서울 서초구 반포대로 235'
							placeName='아펠가모 반포'
							mapLink={naverMapLink}
						/>

						<div className='bg-white rounded-2xl shadow-sm p-6 space-y-5'>
							<div>
								<p className='font-medium text-gray-800 mb-2 flex items-center gap-2'>
									🚇 대중교통
								</p>
								<p className='text-sm text-gray-600 leading-relaxed'>
									고속터미널역 5번 출구에서 약 도보 5분
								</p>
							</div>
							<div>
								<p className='font-medium text-gray-800 mb-2 flex items-center gap-2'>
									🚌 전세 버스
								</p>
								<p className='text-sm text-gray-600 leading-relaxed'>
									대전 세계로교회에서 오전 9시 출발, 오후 3시
									회차
								</p>
							</div>
							<div>
								<p className='font-medium text-gray-800 mb-2 flex items-center gap-2'>
									🚗 주차
								</p>
								<p className='text-sm text-gray-600 leading-relaxed'>
									건물 지하 무료주차 (예식 당일 2시간 무료)
								</p>
							</div>
						</div>
					</div>
				</div>

				<p className='text-sm text-gray-600 leading-relaxed text-center pb-[36px]'>
					* 화환은 반입이 안되오니 참고해주시면 감사하겠습니다.
				</p>

				{/* 푸터 */}
				<div className='px-6 py-16 bg-gray-800 text-white text-center'>
					<div className='max-w-md mx-auto space-y-4'>
						<p className='text-sm'>THANK YOU</p>
						<div className='text-3xl'>🌸</div>
						<div className='space-y-1'>
							<p className='text-sm text-gray-400'>2026. 3. 2</p>
						</div>
					</div>
				</div>

				{/* 플로팅 버튼 */}
				<div className='fixed bottom-6 right-6 z-50 flex flex-col gap-3'>
					<button
						onClick={handleToggleMusic}
						className='w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform'>
						{isPlaying ? '🔇' : '🎵'}
					</button>
					<button
						onClick={() =>
							window.scrollTo({ top: 0, behavior: 'smooth' })
						}
						className='w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform'>
						⬆️
					</button>
				</div>
			</div>
			<LeafFall />
		</div>
	);
}
