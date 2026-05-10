import { useState } from 'react';
import TopBar from './TopBar';
import Sidebar from './Sidebar';

const AppLayout = ({ children }) => {
  const [desktopSidebarCollapsed, setDesktopSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar - hidden on mobile, visible on lg */}
      <div className="hidden lg:block h-full">
        <Sidebar
          isOpen={true}
          collapsed={desktopSidebarCollapsed}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <TopBar
          desktopSidebarCollapsed={desktopSidebarCollapsed}
          onToggleDesktopSidebar={() => setDesktopSidebarCollapsed((prev) => !prev)}
        />

        {/* Content area */}
        <main className="flex-1 overflow-auto">
          <div className="container-wide py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
