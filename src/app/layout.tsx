import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

const monument = localFont({
    src: '../fonts/MonumentExtended-Regular.otf',
    variable: '--font-monument',
    weight: '100 900',
})
const monaSans = localFont({
    src: '../fonts/Mona-Sans.woff',
    variable: '--font-mona-sans',
    weight: '100 900',
})

export const metadata: Metadata = {
    title: 'Rebirth of Humanity',
    description: 'A dystopian sci-fi adventure game',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang='en'>
            <body className={`${monument.variable} ${monaSans.variable} antialiased`}>{children}</body>
        </html>
    )
}
