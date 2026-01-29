import './globals.css';
import { CartProvider } from '@/context/CartContext';
import QueryProvider from '@/providers/QueryProvider';

export const metadata = {
  title: 'RW-KIOSCO | Productos de Rubén',
  description: 'Hacé tu pedido online y recibilo por WhatsApp. ¡Los mejores precios de San Martín!',
  openGraph: {
    title: 'RW-KIOSCO | Menú Digital',
    description: 'Panchos a la masa, promociones y extras de kiosco.',
    url: 'https://www.rwkiosco.com/',
    siteName: 'RW-KIOSCO',
    images: [
      {
        url: '/preview.png', 
        width: 1200,
        height: 630,
        alt: 'RW-KIOSCO | Kiosco Digital de Rubén',
      },
    ],
    locale: 'es_AR',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <QueryProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </QueryProvider>
      </body>
    </html>
  );
}