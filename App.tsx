import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Camera, MessageSquare, Menu, X, Box } from 'lucide-react';
import { AuditPage } from './pages/AuditPage';
import { ChatPage } from './pages/ChatPage';
import { Dashboard } from './pages/Dashboard';
import { AppView } from './types';

function App() {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Simple hash-based routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      switch (hash) {
        case 'audit':
          setCurrentView(AppView.AUDIT);
          break;
        case 'chat':
          setCurrentView(AppView.CHAT);
          break;
        case 'dashboard':
        default:
          setCurrentView(AppView.DASHBOARD);
          break;
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Init
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (view: AppView) => {
    setCurrentView(view);
    window.location.hash = view.toLowerCase();
    setIsSidebarOpen(false); // Close mobile sidebar on nav
  };

  const NavItem = ({ view, icon, label }: { view: AppView; icon: React.ReactNode; label: string }) => (
    <button
      onClick={() => navigate(view)}
      className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-all duration-200 ${
        currentView === view 
          ? 'bg-blue-600 text-white shadow-md' 
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed md:sticky top-0 h-screen w-64 bg-white border-r border-gray-200 z-30 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-blue-700">
              <Box size={28} strokeWidth={2.5} />
              <span className="text-xl font-bold tracking-tight">VAA<span className="text-gray-400 text-sm font-normal ml-1">v1.0</span></span>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-500">
              <X size={24} />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            <NavItem view={AppView.DASHBOARD} icon={<LayoutDashboard size={20} />} label="Dashboard" />
            <NavItem view={AppView.AUDIT} icon={<Camera size={20} />} label="New Audit" />
            <NavItem view={AppView.CHAT} icon={<MessageSquare size={20} />} label="AI Assistant" />
          </nav>

          <div className="p-4 border-t border-gray-100">
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-xs font-semibold text-blue-800 uppercase mb-1">Status</p>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-sm text-blue-900">System Online</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-auto">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2 text-blue-700">
            <Box size={24} />
            <span className="font-bold">Visual Audit Assistant</span>
          </div>
          <button onClick={() => setIsSidebarOpen(true)} className="text-gray-600 p-1">
            <Menu size={24} />
          </button>
        </header>

        {currentView === AppView.DASHBOARD && <Dashboard />}
        {currentView === AppView.AUDIT && <AuditPage />}
        {currentView === AppView.CHAT && <ChatPage />}
      </main>
    </div>
  );
}

export default App;