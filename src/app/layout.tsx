import './globals.css'
import Link from 'next/link'

export const metadata = {
  title: 'Unibookstore',
  description: 'A Bookstore Application',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="text-gray-900 font-bold text-xl">
              <Link href="/"> </Link>
            </div>
            <nav>
              <ul className="flex space-x-8">
                <li>
                  <Link href="/" className="text-gray-800 hover:text-blue-600 transition-colors duration-200">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/admin" className="text-gray-800 hover:text-blue-600 transition-colors duration-200">
                    Admin
                  </Link>
                </li>
                <li>
                  <Link
                    href="/procurement"
                    className="text-gray-800 hover:text-blue-600 transition-colors duration-200">
                    Procurement
                  </Link>
                </li>
                <li>
                  <Link
                    href="/publisher"
                    className="text-gray-800 hover:text-blue-600 transition-colors duration-200">
                    Publisher
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        <main className="flex-grow max-w-7xl mx-auto w-full py-8 px-4">
          {children}
        </main>

        <footer className="bg-white border-t border-gray-200 py-4 mt-auto">
          <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Unibookstore - by rahmi^^
          </div>
        </footer>
      </body>
    </html>
  )
}