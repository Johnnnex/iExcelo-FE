'use client';

import { Geist } from 'next/font/google';
import './globals.css';
import { Header, Footer, AOSInit } from '@/components/organisms';

export const geistSans = Geist({
	variable: '--font-geist-sans',
	weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
	subsets: ['latin'],
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<AOSInit />
			<body className={`${geistSans.className} antialiased`}>
				<Header />
				{children}
				<Footer />
			</body>
		</html>
	);
}
