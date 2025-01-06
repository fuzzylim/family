import './globals.css'
import { Inter } from 'next/font/google'
import { VercelToolbar } from '@vercel/toolbar/next'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Shared Calendar App',
  description: 'A modern shared calendar application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <VercelToolbar />
      </body>
    </html>
  )
}

