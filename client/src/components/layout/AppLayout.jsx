import TopBar from './TopBar';
import Sidebar from './Sidebar';

const AppLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar - hidden on mobile, visible on lg */}
      <div className="hidden lg:block">
        <Sidebar isOpen={true} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <TopBar />

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
