import {
  Moon,
  Sun,
  Shield,
  FileText,
  HelpCircle,
  BookOpen,
  Lightbulb,
} from "lucide-react";
import { useTheme } from "./ui/theme-provider";
import { Button } from "./ui/button";

interface HeaderProps {
  onBackToHome?: () => void;
  showTabs?: boolean;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function Header({
  onBackToHome,
  showTabs = false,
  activeTab = "summary",
  onTabChange,
}: HeaderProps) {
  const { theme, setTheme } = useTheme();

  const tabs = [
    { id: "summary", label: "Summary", icon: FileText },
    { id: "risk", label: "Risk Assessment", icon: Shield },
    { id: "recommendations", label: "Recommendations", icon: Lightbulb },
    { id: "glossary", label: "Glossary", icon: BookOpen },
    { id: "questions", label: "Ask Questions", icon: HelpCircle },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-6xl mx-auto">
        {/* Glass navbar container with full glass effect */}
        <div className="relative backdrop-blur-xl border border-white/20 rounded-4xl shadow-2xl">
          {/* Additional glass overlay for enhanced effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-4xl"></div>

          <div className="relative px-6 py-6">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div
                className="flex items-center space-x-3 cursor-pointer"
                onClick={onBackToHome}
              >
                <img
                  src="/logo.png"
                  alt="Legality Logo"
                  className="h-6 w-6 object-contain"
                />
                <span className="text-xl font-bold text-black dark:text-white tracking-tight">
                  Legality
                </span>
              </div>

              {/* Tab Navigation - Only show when analysis is complete */}
              {showTabs && (
                <div className="hidden md:flex items-center space-x-1 p-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => onTabChange?.(tab.id)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-3xl transition-all duration-200 font-medium text-sm ${
                          isActive
                            ? "bg-yellow-500 text-black dark:text-black shadow-sm"
                            : "text-black/70 dark:text-white hover:text-black dark:hover:text-white hover:bg-white/10"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Theme Toggle Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="h-9 w-9 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200 rounded-xl"
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-black dark:text-white" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-black dark:text-white" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </div>

            {/* Mobile Tab Navigation */}
            {showTabs && (
              <div className="md:hidden mt-4 pt-4 border-t border-white/20">
                <div className="grid grid-cols-2 gap-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => onTabChange?.(tab.id)}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-xl transition-all duration-200 font-medium text-sm ${
                          isActive
                            ? "bg-white/20 text-black dark:text-white shadow-sm"
                            : "text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white hover:bg-white/10"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
