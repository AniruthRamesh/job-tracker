import './globals.css'

export const metadata = {
  title: 'Job Application Tracker',
  description: 'Track and manage your job applications',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
