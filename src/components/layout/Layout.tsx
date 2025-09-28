import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'
import { cn } from '@/lib/utils'

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="min-h-screen flex flex-col w-full bg-background">
      <Navbar onMenuClick={toggleSidebar} showMenuButton />
      
      <div className="flex flex-1 w-full">
        <aside className={cn(
          "hidden lg:block transition-all duration-300",
          sidebarOpen ? "w-64" : "w-16"
        )}>
          <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
        </aside>
        
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}