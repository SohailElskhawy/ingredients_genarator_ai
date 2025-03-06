import "./globals.css";
export const metadata = {
  title: 'Ingredients Generator',
  description: 'Generate an estimated Supplement Facts table from a list of ingredients and serving size.',
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
