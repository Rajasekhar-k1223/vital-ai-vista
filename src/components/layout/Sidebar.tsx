import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { 
  Home, 
  Users, 
  Calendar, 
  FileText, 
  Activity, 
  Pill, 
  Shield, 
  Brain, 
  Building, 
  UserCog,
  Stethoscope,
  ClipboardList,
  HeartHandshake,
  Syringe,
  Target,
  Scan,
  CreditCard,
  BookOpen,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/components/AuthContext'
import { UserRole } from '@/lib/auth'

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  roles: UserRole[]
  badge?: string
}

const navigationItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    roles: ['super_admin', 'org_admin', 'practitioner', 'patient']
  },
  {
    title: 'Organizations',
    href: '/organizations',
    icon: Building,
    roles: ['super_admin']
  },
  {
    title: 'User Management',
    href: '/users',
    icon: UserCog,
    roles: ['super_admin', 'org_admin']
  },
  {
    title: 'Patients',
    href: '/patients',
    icon: Users,
    roles: ['super_admin', 'org_admin', 'practitioner']
  },
  {
    title: 'Practitioners',
    href: '/practitioners',
    icon: Stethoscope,
    roles: ['super_admin', 'org_admin']
  },
  {
    title: 'Appointments',
    href: '/appointments',
    icon: Calendar,
    roles: ['super_admin', 'org_admin', 'practitioner', 'patient']
  },
  {
    title: 'Encounters',
    href: '/encounters',
    icon: ClipboardList,
    roles: ['super_admin', 'org_admin', 'practitioner', 'patient']
  },
  {
    title: 'Observations',
    href: '/observations',
    icon: Activity,
    roles: ['super_admin', 'org_admin', 'practitioner', 'patient']
  },
  {
    title: 'Medications',
    href: '/medications',
    icon: Pill,
    roles: ['super_admin', 'org_admin', 'practitioner', 'patient']
  },
  {
    title: 'Immunizations',
    href: '/immunizations',
    icon: Syringe,
    roles: ['super_admin', 'org_admin', 'practitioner', 'patient']
  },
  {
    title: 'Care Plans',
    href: '/care-plans',
    icon: Target,
    roles: ['super_admin', 'org_admin', 'practitioner', 'patient']
  },
  {
    title: 'Diagnostics',
    href: '/diagnostics',
    icon: Scan,
    roles: ['super_admin', 'org_admin', 'practitioner', 'patient']
  },
  {
    title: 'AI Intelligence',
    href: '/ai-hub',
    icon: Brain,
    roles: ['super_admin', 'org_admin', 'practitioner'],
    badge: 'AI'
  },
  {
    title: 'Billing',
    href: '/billing',
    icon: CreditCard,
    roles: ['super_admin', 'org_admin']
  },
  {
    title: 'Consent',
    href: '/consent',
    icon: Shield,
    roles: ['super_admin', 'org_admin', 'practitioner', 'patient']
  },
  {
    title: 'Terminology',
    href: '/terminology',
    icon: BookOpen,
    roles: ['super_admin', 'org_admin']
  }
]

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const { user } = useAuth()
  const location = useLocation()

  const filteredItems = navigationItems.filter(item => 
    user && item.roles.includes(user.role)
  )

  return (
    <div className={cn(
      "bg-card border-r border-border h-full flex flex-col transition-all duration-300",
      isOpen ? "w-64" : "w-16"
    )}>
      {/* Toggle Button */}
      <div className="p-4 flex justify-end">
        <Button variant="ghost" size="icon" onClick={onToggle}>
          {isOpen ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </div>

      <Separator />

      {/* Navigation Items */}
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1 py-2">
          {filteredItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.href

            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {isOpen && (
                  <>
                    <span className="flex-1">{item.title}</span>
                    {item.badge && (
                      <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            )
          })}
        </div>
      </ScrollArea>

      {/* User Role Indicator */}
      {isOpen && user && (
        <>
          <Separator />
          <div className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                <HeartHandshake className="h-4 w-4 text-secondary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.organizationName}</p>
                <p className="text-xs text-muted-foreground">Healthcare Excellence</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}