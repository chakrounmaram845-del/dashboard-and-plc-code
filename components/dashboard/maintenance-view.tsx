'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import type { MotorHealth, PowerSupply } from '@/lib/plc-simulator'
import { Wrench, Clock, AlertTriangle, CheckCircle2, Calendar } from 'lucide-react'

interface MaintenanceViewProps {
  motor: MotorHealth
  power: PowerSupply
}

interface MaintenanceItem {
  id: string
  component: string
  type: 'preventive' | 'predictive' | 'corrective'
  priority: 'low' | 'medium' | 'high'
  dueIn: string
  condition: number
  description: string
}

export function MaintenanceView({ motor, power }: MaintenanceViewProps) {
  const items: MaintenanceItem[] = [
    {
      id: 'M-001',
      component: 'Roulement Moteur',
      type: 'predictive',
      priority: motor.bearingCondition < 75 ? 'high' : motor.bearingCondition < 85 ? 'medium' : 'low',
      dueIn: motor.bearingCondition < 75 ? '< 48h' : motor.bearingCondition < 85 ? '1-2 semaines' : '1 mois',
      condition: motor.bearingCondition,
      description: `Condition actuelle: ${motor.bearingCondition}% - Analyse vibratoire: ${motor.vibrationLevel} mm/s`,
    },
    {
      id: 'M-002',
      component: 'Bobine Moteur',
      type: 'predictive',
      priority: motor.temperature > 65 ? 'high' : motor.temperature > 55 ? 'medium' : 'low',
      dueIn: motor.temperature > 65 ? '< 24h' : '2 semaines',
      condition: Math.max(0, Math.round(100 - (motor.temperature - 40) * 2)),
      description: `Temperature bobine: ${motor.temperature}C - Resistance isolation: ${motor.insulationResistance} MOhm`,
    },
    {
      id: 'M-003',
      component: 'Alimentation Electrique',
      type: power.status === 'critical' ? 'corrective' : 'preventive',
      priority: power.status === 'critical' ? 'high' : power.status === 'fluctuating' ? 'medium' : 'low',
      dueIn: power.status === 'critical' ? 'Immediat' : '3 mois',
      condition: power.status === 'stable' ? 95 : power.status === 'fluctuating' ? 70 : 40,
      description: `Tension: ${power.voltage}V / THD: ${power.thd}% / PF: ${power.powerFactor}`,
    },
    {
      id: 'M-004',
      component: 'Capteur Pt100',
      type: 'preventive',
      priority: 'low',
      dueIn: '3 mois',
      condition: 92,
      description: 'Calibration preventive planifiee - Derniere calibration: il y a 2 mois',
    },
    {
      id: 'M-005',
      component: 'Joint Reacteur',
      type: 'preventive',
      priority: 'medium',
      dueIn: '2 semaines',
      condition: 78,
      description: 'Inspection visuelle requise - 2456h de fonctionnement depuis dernier remplacement',
    },
    {
      id: 'M-006',
      component: 'Vanne de Decharge',
      type: 'preventive',
      priority: 'low',
      dueIn: '1 mois',
      condition: 88,
      description: 'Test operationnel planifie - Fonctionnement nominal',
    },
  ]

  const priorityConfig = {
    high: { label: 'Haute', class: 'border-red-500/30 bg-red-500/10 text-red-400' },
    medium: { label: 'Moyenne', class: 'border-amber-500/30 bg-amber-500/10 text-amber-400' },
    low: { label: 'Basse', class: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' },
  }

  const typeConfig = {
    preventive: { label: 'Preventive', class: 'border-primary/30 bg-primary/10 text-primary' },
    predictive: { label: 'Predictive (IA)', class: 'border-primary/30 bg-primary/10 text-primary' },
    corrective: { label: 'Corrective', class: 'border-red-500/30 bg-red-500/10 text-red-400' },
  }

  const highPriority = items.filter(i => i.priority === 'high').length
  const mediumPriority = items.filter(i => i.priority === 'medium').length

  return (
    <div className="flex flex-col gap-4">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Wrench className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Actions Totales</p>
              <p className="font-mono text-xl font-bold text-foreground">{items.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Priorite Haute</p>
              <p className="font-mono text-xl font-bold text-red-400">{highPriority}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
              <Clock className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Priorite Moyenne</p>
              <p className="font-mono text-xl font-bold text-amber-400">{mediumPriority}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Etat General</p>
              <p className="font-mono text-xl font-bold text-emerald-400">
                {highPriority === 0 ? 'Bon' : 'Attention'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Maintenance items */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Calendar className="h-4 w-4 text-primary" />
            Plan de Maintenance Predictive
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {items.map((item) => {
            const pConfig = priorityConfig[item.priority]
            const tConfig = typeConfig[item.type]

            return (
              <div
                key={item.id}
                className={cn(
                  'rounded-lg border border-border p-4 transition-colors hover:bg-secondary/30',
                  item.priority === 'high' && 'border-red-500/20'
                )}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground">{item.id}</span>
                      <h4 className="text-sm font-semibold text-foreground">{item.component}</h4>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={cn('text-xs', tConfig.class)}>
                      {tConfig.label}
                    </Badge>
                    <Badge variant="outline" className={cn('text-xs', pConfig.class)}>
                      {pConfig.label}
                    </Badge>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-4">
                  <div className="flex-1">
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Condition</span>
                      <span className={cn('font-mono font-medium', {
                        'text-emerald-400': item.condition >= 80,
                        'text-amber-400': item.condition >= 60 && item.condition < 80,
                        'text-red-400': item.condition < 60,
                      })}>
                        {item.condition}%
                      </span>
                    </div>
                    <Progress value={item.condition} className="h-1.5" />
                  </div>
                  <div className="flex items-center gap-1.5 rounded-md border border-border bg-secondary px-2.5 py-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs font-medium text-foreground">{item.dueIn}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
