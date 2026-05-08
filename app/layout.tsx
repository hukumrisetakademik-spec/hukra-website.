import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'HUKRA — Hukum dan Riset Akademika',
  description: 'Platform berita dan opini hukum Indonesia.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <style>{`
          *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
          body{font-family:'DM Sans',system-ui,sans-serif;background:#F0F2F5;margin:0;overflow-x:hidden}
          h1,h2,h3,h4,h5,h6{font-family:'Playfair Display',Georgia,serif}
          a{text-decoration:none;color:inherit}
          img{max-width:100%}
          button{font-family:'DM Sans',system-ui,sans-serif}
          
          /* Mobile utilities */
          .hide-mobile{display:block}
          .show-mobile{display:none}
          
          @media(max-width:768px){
            .hide-mobile{display:none!important}
            .show-mobile{display:block!important}
            .mobile-full{width:100%!important}
            .mobile-stack{flex-direction:column!important}
            .mobile-p{padding:16px!important}
            .mobile-grid-1{grid-template-columns:1fr!important}
          }
          
          /* Scrollbar */
          ::-webkit-scrollbar{width:4px}
          ::-webkit-scrollbar-track{background:#F1F3F5}
          ::-webkit-scrollbar-thumb{background:#ADB5BD;border-radius:2px}
        `}</style>
      </head>
      <body>
        <Navbar />
        <main style={{ minHeight:'100vh' }}>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
