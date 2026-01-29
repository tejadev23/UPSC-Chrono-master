import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'UPSC Chrono-Master',
  description: 'Exam time-discipline practice for UPSC aspirants',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-pastel-gradient text-text-primary">
        <main className="min-h-screen flex flex-col items-center justify-center p-6">
          <div className="w-full max-w-md">
            {children}
          </div>
        </main>
      </body>
    </html>
  )
}
