import { Bell, HelpCircle } from "lucide-react";

interface HeaderProps {
  title: string;
  avatarUrl: string;
  showStatus?: boolean;
  statusText?: string;
  onNotificationClick?: () => void;
}

export default function Header({
  title,
  avatarUrl,
  showStatus = false,
  statusText = "Active",
  onNotificationClick,
}: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-[#e7eeff] shadow-sm z-50 flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <div>
          <h1 className="font-semibold text-[#004ac6] text-lg leading-tight tracking-tight">
            {title}
          </h1>
          {showStatus && (
            <p className="text-xs text-[#006c49] flex items-center gap-1 mt-0.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#006c49] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#006c49]"></span>
              </span>
              {statusText}
            </p>
          )}
        </div>
      </div>
      <button
        onClick={onNotificationClick}
        className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#dee8ff] text-[#434655] transition-all active:scale-95 duration-150"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-[#004ac6]" />
      </button>
    </header>
  );
}
