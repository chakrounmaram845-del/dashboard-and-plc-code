'use client'

import { useState } from 'react'
import { usePLCData } from '@/hooks/use-plc-data'
import { SidebarNav } from '@/components/dashboard/sidebar-nav'
import { HeaderBar } from '@/components/dashboard/header-bar'
import { OverviewTab } from '@/components/dashboard/overview-tab'
import { PLCTab } from '@/components/dashboard/plc-tab'
import { MotorHealthCard } from '@/components/dashboard/motor-health-card'
import { AlertsPanel } from '@/components/dashboard/alerts-panel'
import { BatchHistory } from '@/components/dashboard/batch-history'
import { MaintenanceView } from '@/components/dashboard/maintenance-view'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const {
    currentSensor,
    sensorHistory,
    batch,
    plcStatus,
    alerts,
    motorHealth,
    powerSupply,
    acknowledgeAlert,
  } = usePLCData(2000)

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <OverviewTab
            currentSensor={currentSensor}
            sensorHistory={sensorHistory}
            batch={batch}
            alerts={alerts}
            onAcknowledgeAlert={acknowledgeAlert}
          />
        )
      case 'plc':
        return (
          <PLCTab
            currentSensor={currentSensor}
            sensorHistory={sensorHistory}
            plcStatus={plcStatus}
          />
        )
      case 'motor':
        return <MotorHealthCard motor={motorHealth} power={powerSupply} />
      case 'batch':
        return <BatchHistory />
      case 'alerts':
        return <AlertsPanel alerts={alerts} onAcknowledge={acknowledgeAlert} />
      case 'maintenance':
        return <MaintenanceView motor={motorHealth} power={powerSupply} />
      default:
        return null
    }
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setSidebarOpen(false)
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <SidebarNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarNav activeTab={activeTab} onTabChange={handleTabChange} />
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile header with menu button */}
        <div className="flex items-center lg:hidden border-b border-border bg-card px-4 py-2">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="mr-2 text-foreground">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
          </Sheet>
          <span className="text-sm font-semibold text-foreground">BatchGuardian</span>
        </div>

        <HeaderBar plcStatus={plcStatus} batch={batch} />

        <ScrollArea className="flex-1">
          <main className="p-4 lg:p-6">
            {renderContent()}
          </main>
        </ScrollArea>
      </div>
    </div>
  )
}
