export function Footer() {
  const companyLinks = [
    { label: "About Us", href: "#" },
    { label: "How It Works", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Contact", href: "#" },
  ];

  const featuresLinks = [
    { label: "Document Analysis", href: "#" },
    { label: "Risk Assessment", href: "#" },
    { label: "AI-Powered Insights", href: "#" },
    { label: "Plain Language Translation", href: "#" },
    { label: "Contract Review", href: "#" },
  ];

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="grid lg:grid-cols-2 gap-8 mb">
          {/* Company Logo and Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Legality Logo"
                className="h-8 w-8 object-contain"
              />
              <div>
                <h3 className="text-xl font-bold text-black">Legality</h3>
                <p className="text-sm text-gray-600">
                  AI-Powered Legal Analysis
                </p>
              </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Transform complex legal documents into clear, actionable insights
              with our advanced AI technology. Make informed decisions with
              confidence.
            </p>
          </div>

          {/* Company Links */}
          <div className="grid lg:grid-cols-2 gap-4 mb-12">
            <div>
              <h4 className="text-lg font-semibold text-black mb-6">Company</h4>
              <ul className="space-y-3">
                {companyLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-gray-600 hover:text-black transition-colors text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Features Links */}
            <div>
              <h4 className="text-lg font-semibold text-black mb-6">
                Features
              </h4>
              <ul className="space-y-3">
                {featuresLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-gray-600 hover:text-black transition-colors text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">
              © 2025 Legality. All rights reserved.
            </p>
            <p className="text-sm text-gray-600">
              Empowering legal understanding through AI
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
