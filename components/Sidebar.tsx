import React, { useState } from 'react';

type View = 'dashboard' | 'patients' | 'vaccines';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
}

const DashboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 12a4 4 0 110-8 4 4 0 010 8z" />
  </svg>
);

const VaccineIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v4.517l1.745 1.745M12 8v4.517l1.745 1.745M12 12.517L10.255 14.26" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 4v.01M15 4v.01" />
    </svg>
);


const SyringeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 4l1.88 1.88M12 6.88L13.88 5M16 4l-1.88 1.88M17 10h.01M7 10h.01M12 11.12l-1.88 1.88m3.76 0L12 11.12m0 0V18m0 0h-2m2 0h2m-4.5 2h5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a10 10 0 11-5.083 8.657" />
    </svg>
);

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'patients', label: 'Patients', icon: <UsersIcon /> },
    { id: 'vaccines', label: 'Vaccines', icon: <VaccineIcon /> },
  ];

  return (
    <aside className={`bg-white shadow-lg transition-all duration-300 ${isExpanded ? 'w-64' : 'w-20'} hidden md:flex flex-col`}>
      <div className="flex items-center justify-center p-4 h-20 border-b">
        <SyringeIcon />
        {isExpanded && <h1 className="text-xl font-bold text-primary ml-2">VaxTrack</h1>}
      </div>
      <nav className="flex-1 px-4 py-4 space-y-2">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setView(item.id as View)}
            className={`flex items-center w-full p-3 rounded-lg transition-colors duration-200 ${
              currentView === item.id 
                ? 'bg-primary text-white shadow-md' 
                : 'text-neutral hover:bg-base-200'
            }`}
          >
            {item.icon}
            {isExpanded && <span className="ml-4 font-semibold">{item.label}</span>}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t">
          <button onClick={() => setIsExpanded(!isExpanded)} className="w-full flex items-center p-3 rounded-lg text-neutral hover:bg-base-200">
             <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-transform duration-300 ${!isExpanded && 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
             </svg>
             {isExpanded && <span className="ml-4 font-semibold">Collapse</span>}
          </button>
      </div>
    </aside>
  );
};