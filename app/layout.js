import './globals.css'

export const metadata = {
  title: 'Personal Finance Manager',
  description: 'Track your income, expenses, and manage your finances efficiently',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
