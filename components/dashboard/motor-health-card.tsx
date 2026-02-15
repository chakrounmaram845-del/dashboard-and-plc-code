'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { MotorHealth, PowerSupply } from '@/lib/plc-simulator'
import { Cog, Zap, Thermometer, Activity, Gauge, Timer } from 'lucide-react'

interface MotorHealthCardProps {
  motor: MotorHealth
  power: PowerSupply
}

function StatusDot({ status }: { status: string }) {
  return (
    <span
      className={cn('inline-block h-2 w-2 rounded-full', {
        'bg-emerald-400': status === 'healthy' || status === 'stable',
        'bg-amber-400': status === 'warning' || status === 'fluctuating',
        'bg-red-400': status === 'critical',
      })}
    />
  )
}

function MetricRow({ icon: Icon, label, value, unit, status }: {
  icon: typeof Cog
  label: string
  value: string | number
  unit: string
  status?: 'normal' | 'warning' | 'critical'
}) {
  const colorClass = status === 'critical' ? 'text-red-400' : status === 'warning' ? 'text-amber-400' : 'text-foreground'
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <span className={cn('font-mono text-sm font-medium', colorClass)}>
        {value} <span className="text-xs text-muted-foreground">{unit}</span>
      </span>
    </div>
  )
}

export function MotorHealthCard({ motor, power }: MotorHealthCardProps) {
  const motorStatusLabel = motor.status === 'healthy' ? 'Sain' : motor.status === 'warning' ? 'Surveillance' : 'Critique'
  const powerStatusLabel = power.status === 'stable' ? 'Stable' : power.status === 'fluctuating' ? 'Fluctuant' : 'Critique'

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {/* Motor Section */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Cog className="h-4 w-4 text-primary" />
              Moteur Agitation
            </CardTitle>
            <div className="flex items-center gap-1.5">
              <StatusDot status={motor.status} />
              <Badge variant="outline" className={cn('text-xs', {
                'border-emerald-500/30 text-emerald-400': motor.status === 'healthy',
                'border-amber-500/30 text-amber-400': motor.status === 'warning',
                'border-red-500/30 text-red-400': motor.status === 'critical',
              })}>
                {motorStatusLabel}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            <MetricRow
              icon={Thermometer}
              label="Temperature Bobine"
              value={motor.temperature}
              unit="C"
              status={motor.temperature > 70 ? 'critical' : motor.temperature > 60 ? 'warning' : 'normal'}
            />
            <MetricRow
              icon={Zap}
              label="Courant Absorbe"
              value={motor.currentDraw}
              unit="A"
              status={motor.currentDraw > 15 ? 'warning' : 'normal'}
            />
            <MetricRow
              icon={Activity}
              label="Vibration"
              value={motor.vibrationLevel}
              unit="mm/s"
              status={motor.vibrationLevel > 4 ? 'critical' : motor.vibrationLevel > 3 ? 'warning' : 'normal'}
            />
            <MetricRow
              icon={Gauge}
              label="Etat Roulement"
              value={motor.bearingCondition}
              unit="%"
              status={motor.bearingCondition < 70 ? 'critical' : motor.bearingCondition < 80 ? 'warning' : 'normal'}
            />
            <MetricRow
              icon={Zap}
              label="Resistance Isolation"
              value={motor.insulationResistance}
              unit="MOhm"
            />
            <MetricRow
              icon={Timer}
              label="Heures Fonctionnement"
              value={motor.runtime}
              unit="h"
            />
          </div>
        </CardContent>
      </Card>

      {/* Power Supply Section */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Zap className="h-4 w-4 text-amber-400" />
              Alimentation Electrique
            </CardTitle>
            <div className="flex items-center gap-1.5">
              <StatusDot status={power.status} />
              <Badge variant="outline" className={cn('text-xs', {
                'border-emerald-500/30 text-emerald-400': power.status === 'stable',
                'border-amber-500/30 text-amber-400': power.status === 'fluctuating',
                'border-red-500/30 text-red-400': power.status === 'critical',
              })}>
                {powerStatusLabel}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            <MetricRow
              icon={Zap}
              label="Tension"
              value={power.voltage}
              unit="V"
              status={power.voltage < 370 || power.voltage > 390 ? 'warning' : 'normal'}
            />
            <MetricRow
              icon={Activity}
              label="Courant"
              value={power.current}
              unit="A"
            />
            <MetricRow
              icon={Gauge}
              label="Frequence"
              value={power.frequency}
              unit="Hz"
              status={Math.abs(power.frequency - 50) > 0.5 ? 'warning' : 'normal'}
            />
            <MetricRow
              icon={Gauge}
              label="Facteur de Puissance"
              value={power.powerFactor}
              unit=""
              status={power.powerFactor < 0.85 ? 'warning' : 'normal'}
            />
            <MetricRow
              icon={Activity}
              label="THD"
              value={power.thd}
              unit="%"
              status={power.thd > 5 ? 'warning' : 'normal'}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
