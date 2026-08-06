import type { Metadata, Viewport } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { AuthProvider } from '@/providers/auth-provider'
import { CartProvider } from '@/context/CartContext'
import { GeoProvider } from '@/context/GeoContext'

/**
 * Root layout — wraps every page in the application.
 * Sets up: fonts, metadata, viewport, providers, WCAG ARIA landmarks, JSON-LD Schema markup.
 */

export const metadata: Metadata = {
  metadataBase: new URL('https://yampleauditai.vercel.app'),
  title: {
    default: 'AuditAI — AI Website Audit & Business Platform',
    template: '%s | AuditAI by Yample Labs',
  },
  description:
    'AuditAI by Yample Labs analyzes performance, SEO, security, accessibility, and business growth to turn your website into a revenue machine.',
  keywords: [
    'website audit',
    'AI website analysis',
    'SEO audit',
    'performance audit',
    'accessibility audit',
    'security audit',
    'website intelligence',
    'Lighthouse',
    'PageSpeed',
    'Yample Labs',
    'revenue machine',
  ],
  authors: [{ name: 'Yample Labs', url: 'https://yamplelabs.com' }],
  creator: 'Yample Labs',
  publisher: 'Yample Labs',
  alternates: {
    canonical: 'https://yampleauditai.vercel.app',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yampleauditai.vercel.app',
    siteName: 'AuditAI by Yample Labs',
    title: 'AuditAI — Turn Your Website Into A Revenue Machine',
    description:
      'AI-powered website audit, Core Web Vitals performance, SEO, accessibility, security, and business intelligence platform.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AuditAI Platform Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@yamplabs',
    creator: '@yamplabs',
    title: 'AuditAI — Turn Your Website Into A Revenue Machine',
    description:
      'AI-powered website audit, Core Web Vitals performance, SEO, accessibility, security, and business intelligence platform.',
    images: ['/og-image.png'],
  },
  manifest: '/site.webmanifest',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#050816',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://yampleauditai.vercel.app/#organization',
        name: 'Yample Labs',
        url: 'https://yamplelabs.com',
        logo: 'https://yampleauditai.vercel.app/og-image.png',
        sameAs: ['https://twitter.com/yamplabs'],
      },
      {
        '@type': 'SoftwareApplication',
        name: 'AuditAI',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'All',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
    ],
  }

  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-[#050816] text-white antialiased">
        {/* Skip navigation link for keyboard users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-violet-600 focus:text-white focus:rounded-md focus:text-sm focus:font-medium"
        >
          Skip to main content
        </a>

        <AuthProvider>
          <GeoProvider>
            <CartProvider>
              <main id="main-content">{children}</main>
            </CartProvider>
          </GeoProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
