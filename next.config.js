/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		unoptimized: true,
	},
	output: 'export', // static export
	distDir: 'build', // .next 대신 build 폴더로 SSR 빌드 저장
	outDir: 'dist', // export 결과물을 dist 폴더에 생성
};

module.exports = nextConfig;
