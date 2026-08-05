import type { Metadata, Viewport } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { AuthProvider } from '@/providers/auth-provider'
import { CartProvider } from '@/context/CartContext'

/**
 * Root layout — wraps every page in the application.
 * Sets up: fonts, metadata, viewport, providers.
 */

export const metadata: Metadata = {
  title: {
    default: 'AuditAI — AI-Powered Website Intelligence Platform',
    template: '%s | AuditAI by Yample Labs',
  },
  description:
    'AuditAI transforms complex website audits into clear business decisions. Analyze performance, SEO, accessibility, security, and get AI-powered business intelligence reports — in minutes.',
  keywords: [
    'website audit',
    'AI website analysis',
    'SEO audit',
    'performance audit',
    'accessibility audit',
    'website intelligence',
    'Lighthouse',
    'PageSpeed',
    'AI reports',
    'agency tools',
    'web audit tool',
  ],
  authors: [{ name: 'Yample Labs', url: 'https://yamplelabs.com' }],
  creator: 'Yample Labs',
  publisher: 'Yample Labs',
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
    url: 'https://auditai.yamplelabs.com',
    siteName: 'AuditAI',
    title: 'AuditAI — AI-Powered Website Intelligence Platform',
    description:
      'Transform website audits into business intelligence. Performance, SEO, Accessibility, Security — analyzed by AI.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AuditAI Dashboard Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@yamplabs',
    creator: '@yamplabs',
    title: 'AuditAI — AI-Powered Website Intelligence Platform',
    description:
      'Transform website audits into business intelligence. Performance, SEO, Accessibility, Security — analyzed by AI.',
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
  themeColor: '#09090B',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        {/* Skip navigation link for keyboard users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-brand focus:text-white focus:rounded-md focus:text-sm focus:font-medium"
        >
          Skip to main content
        </a>

        <AuthProvider><CartProvider>{children}</CartProvider></AuthProvider>
      </body>
    </html>
  )
}
