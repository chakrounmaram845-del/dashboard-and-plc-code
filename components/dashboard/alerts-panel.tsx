'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Alert } from '@/lib/plc-simulator'
import { Bell, AlertTriangle, AlertCircle, Info, Check } from 'lucide-react'

interface AlertsPanelProps {
  alerts: Alert[]
  onAcknowledge: (id: string) => void
  compact?: boolean
}

const severityConfig = {
  critical: {
    icon: AlertCircle,
    badge: 'border-red-500/30 bg-red-500/10 text-red-400',
    dot: 'bg-red-400',
    label: 'Critique',
  },
  warning: {
    icon: AlertTriangle,
    badge: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
    dot: 'bg-amber-400',
    label: 'Attention',
  },
  info: {
    icon: Info,
    badge: 'border-primary/30 bg-primary/10 text-primary',
    dot: 'bg-primary',
    label: 'Info',
  },
}

export function AlertsPanel({ alerts, onAcknowledge, compact = false }: AlertsPanelProps) {
  const displayAlerts = compact ? alerts.slice(0, 5) : alerts

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Bell className="h-4 w-4 text-primary" />
            Alertes Systeme
          </CardTitle>
          <Badge variant="outline" className="border-border text-muted-foreground">
            {alerts.filter(a => !a.acknowledged).length} actives
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {displayAlerts.map((alert) => {
          const config = severityConfig[alert.severity]
          const Icon = config.icon
          const time = new Date(alert.timestamp)
          const timeStr = time.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

          return (
            <div
              key={alert.id}
              className={cn(
                'flex items-start gap-3 rounded-lg border border-border p-3 transition-colors',
                alert.acknowledged ? 'opacity-50' : 'bg-secondary/50'
              )}
            >
              <div className={cn('mt-0.5 h-2 w-2 flex-shrink-0 rounded-full', config.dot)} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={cn('text-xs', config.badge)}>
                    {config.label}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{alert.source}</span>
                  <span className="ml-auto text-xs font-mono text-muted-foreground">{timeStr}</span>
                </div>
                <p className="mt-1 text-xs text-foreground/80">{alert.message}</p>
              </div>
              {!alert.acknowledged && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onAcknowledge(alert.id)}
                  className="h-7 w-7 flex-shrink-0 p-0 text-muted-foreground hover:text-foreground"
                >
                  <Check className="h-3.5 w-3.5" />
                  <span className="sr-only">Acquitter</span>
                </Button>
              )}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
