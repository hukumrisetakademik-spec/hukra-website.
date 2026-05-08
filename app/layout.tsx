import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'HUKRA — Hukum dan Riset Akademika',
  description: 'Platform berita dan opini hukum dari mahasiswa Fakultas Syariah UIN Palangka Raya.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <style>{`
          *{box-sizing:border-box}
          body{font-family:'DM Sans',system-ui,sans-serif;background:#F0F2F5;margin:0}
          h1,h2,h3,h4,h5,h6{font-family:'Playfair Display',Georgia,serif}
          a{text-decoration:none;color:inherit}
          img{max-width:100%}
          .container{max-width:1200px;margin:0 auto;padding:0 24px}
          .grid-2{display:grid;grid-template-columns:1fr 1fr;gap:24px}
          .grid-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px}
          @media(max-width:768px){.grid-2,.grid-3{grid-template-columns:1fr}.hide-mobile{display:none!important}}
        `}</style>
      </head>
      <body>
        <Navbar />
        <main style={{ minHeight: '100vh' }}>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
