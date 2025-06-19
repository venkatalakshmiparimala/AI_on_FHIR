import './globals.css'
import { Inter } from 'next/font/google'
export const dir = (lng) => {
  return ['ar', 'he', 'fa'].includes(lng) ? 'rtl' : 'ltr';
};
import { languages } from '../../next-i18next.config'

export const metadata = {
  title: 'FHIR i18n',
  description: 'FHIR project with i18n support',
}

export function generateStaticParams() {
  return languages.map((lng) => ({ lng }))
}

export default function RootLayout({ children, params }) {
  return (
    <html lang={params.lng} dir={dir(params.lng)}>
      <body>
        {children}
      </body>
    </html>
  )
}
