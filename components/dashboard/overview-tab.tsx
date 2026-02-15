'use client'

import { SensorCard } from './sensor-card'
import { BatchProgress } from './batch-progress'
import { RiskGauge } from './risk-gauge'
import { AlertsPanel } from './alerts-panel'
import { LiveChart } from './live-chart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { SensorData, BatchInfo, Alert } from '@/lib/plc-simulator'
import {
  Thermometer,
  Gauge,
  Droplets,
  RotateCcw,
  Zap,
  Activity,
  Waves,
  FlaskConical,
} from 'lucide-react'

interface OverviewTabProps {
  currentSensor: SensorData | null
  sensorHistory: SensorData[]
  batch: BatchInfo
  alerts: Alert[]
  onAcknowledgeAlert: (id: string) => void
}

export function OverviewTab({ currentSensor, sensorHistory, batch, alerts, onAcknowledgeAlert }: OverviewTabProps) {
  if (!currentSensor) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">Initialisation des capteurs...</p>
      </div>
    )
  }

  const tempStatus = currentSensor.temperature > 85 ? 'critical' : currentSensor.temperature > 75 ? 'warning' : 'normal'
  const pressureStatus = currentSensor.pressure > 3.5 ? 'critical' : currentSensor.pressure > 3 ? 'warning' : 'normal'
  const vibrationStatus = currentSensor.vibration > 4 ? 'critical' : currentSensor.vibration > 3 ? 'warning' : 'normal'

  return (
    <div className="flex flex-col gap-4">
      {/* Risk + Batch progress row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-foreground">Score de Risque Batch</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center py-4">
            <RiskGauge value={batch.riskScore} label="Risque Echec" size="lg" />
          </CardContent>
        </Card>
        <div className="lg:col-span-2">
          <BatchProgress batch={batch} />
        </div>
      </div>

      {/* Sensor cards grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <SensorCard
          label="Temperature"
          value={currentSensor.temperature}
          unit="C"
          icon={Thermometer}
          status={tempStatus}
          min={20}
          max={100}
          currentValue={currentSensor.temperature}
        />
        <SensorCard
          label="Pression"
          value={currentSensor.pressure}
          unit="bar"
          icon={Gauge}
          status={pressureStatus}
          min={0}
          max={5}
          currentValue={currentSensor.pressure}
        />
        <SensorCard
          label="Conductivite"
          value={currentSensor.conductivity}
          unit="mS/cm"
          icon={Droplets}
          status="normal"
          min={0}
          max={10}
          currentValue={currentSensor.conductivity}
        />
        <SensorCard
          label="Vibration"
          value={currentSensor.vibration}
          unit="mm/s"
          icon={Activity}
          status={vibrationStatus}
          min={0}
          max={6}
          currentValue={currentSensor.vibration}
        />
      </div>

      {/* Live charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <LiveChart
          data={sensorHistory}
          dataKey="temperature"
          label="Temperature Reacteur"
          unit="C"
          color="hsl(199, 89%, 48%)"
          icon={Thermometer}
        />
        <LiveChart
          data={sensorHistory}
          dataKey="pressure"
          label="Pression"
          unit="bar"
          color="hsl(142, 71%, 45%)"
          icon={Gauge}
        />
      </div>

      {/* More charts + alerts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <LiveChart
          data={sensorHistory}
          dataKey="motorCurrent"
          label="Courant Moteur"
          unit="A"
          color="hsl(38, 92%, 50%)"
          icon={Zap}
          type="line"
        />
        <LiveChart
          data={sensorHistory}
          dataKey="vibration"
          label="Vibration"
          unit="mm/s"
          color="hsl(0, 72%, 51%)"
          icon={Waves}
          type="line"
        />
        <AlertsPanel alerts={alerts} onAcknowledge={onAcknowledgeAlert} compact />
      </div>
    </div>
  )
}
