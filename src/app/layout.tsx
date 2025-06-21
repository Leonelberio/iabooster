import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "IA Booster - Optimisez votre entreprise avec l'IA",
  description:
    "Découvrez comment l'intelligence artificielle peut transformer votre entreprise. Diagnostic personnalisé et recommandations d'outils IA adaptés à vos besoins.",
  keywords:
    "IA, intelligence artificielle, entreprise, optimisation, productivité, diagnostic",
  authors: [{ name: "IA Booster" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#3b82f6",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className="min-h-screen bg-gray-50">
        <Header />
        <main className="flex-1">{children}</main>

        {/* Footer minimal */}
        <footer className="border-t border-gray-100 bg-white mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">IA</span>
                </div>
                <span className="font-bold text-gray-900">IA Booster</span>
              </div>
              <p className="text-gray-600 mb-6">
                Optimisez votre entreprise avec l'intelligence artificielle
              </p>
              <div className="flex justify-center space-x-8 text-sm">
                <a
                  href="#"
                  className="text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Confidentialité
                </a>
                <a
                  href="#"
                  className="text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Conditions
                </a>
                <a
                  href="mailto:contact@iabooster.com"
                  className="text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Contact
                </a>
              </div>
              <p className="text-gray-400 text-xs mt-8">
                © 2024 IA Booster. Tous droits réservés.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
