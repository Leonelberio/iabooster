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

              {/* Contact Information */}
              <div className="mb-6 space-y-2">
                <div className="flex justify-center items-center space-x-4 text-sm">
                  <a
                    href="http://bento.me/leoneladagbe"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 transition-colors flex items-center space-x-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                    <span>Leonel Adagbe</span>
                  </a>
                  <span className="text-gray-300">|</span>
                  <a
                    href="tel:+22997147865"
                    className="text-blue-600 hover:text-blue-800 transition-colors flex items-center space-x-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <span>+229 97 14 78 65</span>
                  </a>
                </div>
              </div>

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
