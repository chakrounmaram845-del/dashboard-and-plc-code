'use client'

import { Badge } from '@/components/ui/badge'
import type { PLCStatus, BatchInfo } from '@/lib/plc-simulator'
import { Wifi, WifiOff, Clock, Radio } from 'lucide-react'

interface HeaderBarProps {
  plcStatus: PLCStatus
  batch: BatchInfo
}

export function HeaderBar({ plcStatus, batch }: HeaderBarProps) {
  const now = new Date()
  const timeStr = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  const dateStr = now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-6 py-3">
      <div className="flex items-center gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Reacteur Principal</h2>
          <p className="text-xs text-muted-foreground">Batch actif: {batch.id} - {batch.recipe}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* PLC Status */}
        <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-1.5">
          {plcStatus.connected ? (
            <Wifi className="h-3.5 w-3.5 text-emerald-400" />
          ) : (
            <WifiOff className="h-3.5 w-3.5 text-red-400" />
          )}
          <span className="text-xs font-medium text-foreground">
            {plcStatus.protocol}
          </span>
          <Badge
            variant="outline"
            className={
              plcStatus.connected
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                : 'border-red-500/30 bg-red-500/10 text-red-400'
            }
          >
            {plcStatus.connected ? 'Connecte' : 'Deconnecte'}
          </Badge>
        </div>

        {/* Poll Rate */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Radio className="h-3.5 w-3.5 text-primary" />
          <span className="font-mono">{plcStatus.pollRate}ms</span>
        </div>

        {/* Time */}
        <div className="flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-3 py-1.5">
          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
          <div className="text-right">
            <p className="text-xs font-mono font-medium text-foreground">{timeStr}</p>
            <p className="text-xs text-muted-foreground capitalize">{dateStr}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
