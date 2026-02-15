'use client'

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface SensorCardProps {
  label: string
  value: number | string
  unit: string
  icon: LucideIcon
  trend?: 'up' | 'down' | 'stable'
  status?: 'normal' | 'warning' | 'critical'
  min?: number
  max?: number
  currentValue?: number
}

export function SensorCard({
  label,
  value,
  unit,
  icon: Icon,
  status = 'normal',
  min,
  max,
  currentValue,
}: SensorCardProps) {
  const statusColors = {
    normal: 'text-emerald-400',
    warning: 'text-amber-400',
    critical: 'text-red-400',
  }

  const statusBg = {
    normal: 'bg-emerald-400/10 border-emerald-400/20',
    warning: 'bg-amber-400/10 border-amber-400/20',
    critical: 'bg-red-400/10 border-red-400/20',
  }

  // Calculate bar fill percentage
  let fillPercent = 50
  if (min !== undefined && max !== undefined && currentValue !== undefined) {
    fillPercent = Math.max(0, Math.min(100, ((currentValue - min) / (max - min)) * 100))
  }

  return (
    <Card className="border-border bg-card">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground">{label}</span>
            <div className="flex items-baseline gap-1">
              <span className={cn('font-mono text-2xl font-bold', statusColors[status])}>
                {value}
              </span>
              <span className="text-xs text-muted-foreground">{unit}</span>
            </div>
          </div>
          <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg border', statusBg[status])}>
            <Icon className={cn('h-4 w-4', statusColors[status])} />
          </div>
        </div>

        {/* Range bar */}
        {min !== undefined && max !== undefined && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{min}{unit}</span>
              <span>{max}{unit}</span>
            </div>
            <div className="mt-1 h-1.5 rounded-full bg-secondary">
              <div
                className={cn('h-full rounded-full transition-all duration-500', {
                  'bg-emerald-400': status === 'normal',
                  'bg-amber-400': status === 'warning',
                  'bg-red-400': status === 'critical',
                })}
                style={{ width: `${fillPercent}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
