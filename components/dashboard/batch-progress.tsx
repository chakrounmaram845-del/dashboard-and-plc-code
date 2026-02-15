'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import type { BatchInfo } from '@/lib/plc-simulator'
import { Beaker, Clock, TrendingUp, Sparkles } from 'lucide-react'

interface BatchProgressProps {
  batch: BatchInfo
}

const phases = ['Chargement', 'Chauffage', 'Reaction', 'Refroidissement', 'Decharge'] as const

export function BatchProgress({ batch }: BatchProgressProps) {
  const progressPercent = Math.round((batch.elapsedMinutes / batch.totalMinutes) * 100)
  const remainingMin = batch.totalMinutes - batch.elapsedMinutes

  const statusConfig = {
    running: { label: 'En Cours', class: 'border-primary/30 bg-primary/10 text-primary' },
    completed: { label: 'Termine', class: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' },
    warning: { label: 'Attention', class: 'border-amber-500/30 bg-amber-500/10 text-amber-400' },
    critical: { label: 'Critique', class: 'border-red-500/30 bg-red-500/10 text-red-400' },
  }

  const config = statusConfig[batch.status]

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Beaker className="h-4 w-4 text-primary" />
            Progression Batch
          </CardTitle>
          <Badge variant="outline" className={config.class}>
            {config.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {/* Progress bar */}
        <div>
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{batch.id}</span>
            <span className="font-mono font-medium text-foreground">{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        {/* Phase indicators */}
        <div className="flex gap-1">
          {phases.map((phase) => (
            <div
              key={phase}
              className={cn(
                'flex-1 rounded py-1.5 text-center text-xs font-medium transition-colors',
                phase === batch.phase
                  ? 'bg-primary/20 text-primary'
                  : phases.indexOf(phase) < phases.indexOf(batch.phase)
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'bg-secondary text-muted-foreground'
              )}
            >
              {phase.slice(0, 4)}.
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center rounded-lg border border-border bg-secondary p-2">
            <Clock className="mb-1 h-3.5 w-3.5 text-muted-foreground" />
            <span className="font-mono text-sm font-bold text-foreground">{Math.round(remainingMin)}m</span>
            <span className="text-xs text-muted-foreground">Restant</span>
          </div>
          <div className="flex flex-col items-center rounded-lg border border-border bg-secondary p-2">
            <TrendingUp className="mb-1 h-3.5 w-3.5 text-emerald-400" />
            <span className="font-mono text-sm font-bold text-emerald-400">{batch.yieldPrediction}%</span>
            <span className="text-xs text-muted-foreground">Rendement</span>
          </div>
          <div className="flex flex-col items-center rounded-lg border border-border bg-secondary p-2">
            <Sparkles className="mb-1 h-3.5 w-3.5 text-primary" />
            <span className="font-mono text-sm font-bold text-primary">{batch.purityPrediction}%</span>
            <span className="text-xs text-muted-foreground">Purete</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
