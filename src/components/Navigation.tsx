import { LayoutDashboard, BookOpen, Bot, CheckSquare, TrendingUp } from "lucide-react";

interface NavigationProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export default function Navigation({ currentTab, onTabChange }: NavigationProps) {
  const tabs = [
    { id: "home", label: "Home", icon: LayoutDashboard },
    { id: "path", label: "Path", icon: BookOpen },
    { id: "tutor", label: "Tutor", icon: Bot },
    { id: "quiz", label: "Quiz", icon: CheckSquare },
    { id: "stats", label: "Stats", icon: TrendingUp },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-[#c3c6d7] shadow-lg z-50 flex justify-around items-center px-4 pb-2">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center transition-all duration-200 active:scale-90 ${
              isActive
                ? "bg-[#6cf8bb] text-[#00714d] rounded-full px-5 py-1.5 shadow-sm"
                : "text-[#434655] hover:text-[#004ac6]"
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : "stroke-[2]"}`} />
            <span className="text-[11px] font-semibold mt-0.5 tracking-wide">
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
