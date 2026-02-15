'use client'

import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Cpu,
  Activity,
  BarChart3,
  Bell,
  Settings,
  Zap,
  Shield,
} from 'lucide-react'

interface SidebarNavProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const navItems = [
  { id: 'overview', label: 'Vue Generale', icon: LayoutDashboard },
  { id: 'plc', label: 'PLC / Capteurs', icon: Cpu },
  { id: 'motor', label: 'Moteur & Alim', icon: Zap },
  { id: 'batch', label: 'Batch Analytics', icon: BarChart3 },
  { id: 'alerts', label: 'Alertes', icon: Bell },
  { id: 'maintenance', label: 'Maintenance', icon: Activity },
]

export function SidebarNav({ activeTab, onTabChange }: SidebarNavProps) {
  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border bg-card">
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-border px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <Shield className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-tight text-foreground">BatchGuardian</h1>
          <p className="text-xs text-muted-foreground">by Bin-Nova</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Monitoring
        </p>
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-border px-3 py-4">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
          <Settings className="h-4 w-4" />
          Configuration
        </button>
      </div>
    </aside>
  )
}
