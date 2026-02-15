'use client'

import { SensorCard } from './sensor-card'
import { LiveChart } from './live-chart'
import { PLCRegisters } from './plc-registers'
import type { SensorData, PLCStatus } from '@/lib/plc-simulator'
import {
  Thermometer,
  Gauge,
  Droplets,
  RotateCcw,
  Zap,
  FlaskConical,
  Waves,
  Wind,
} from 'lucide-react'

interface PLCTabProps {
  currentSensor: SensorData | null
  sensorHistory: SensorData[]
  plcStatus: PLCStatus
}

export function PLCTab({ currentSensor, sensorHistory, plcStatus }: PLCTabProps) {
  if (!currentSensor) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">Attente de la connexion PLC...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* All sensor cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 xl:grid-cols-5">
        <SensorCard
          label="Temperature Pt100"
          value={currentSensor.temperature}
          unit="C"
          icon={Thermometer}
          status={currentSensor.temperature > 85 ? 'critical' : currentSensor.temperature > 75 ? 'warning' : 'normal'}
          min={20}
          max={100}
          currentValue={currentSensor.temperature}
        />
        <SensorCard
          label="Pression"
          value={currentSensor.pressure}
          unit="bar"
          icon={Gauge}
          status={currentSensor.pressure > 3.5 ? 'critical' : currentSensor.pressure > 3 ? 'warning' : 'normal'}
          min={0}
          max={5}
          currentValue={currentSensor.pressure}
        />
        <SensorCard
          label="Conductivite"
          value={currentSensor.conductivity}
          unit="mS/cm"
          icon={Droplets}
          min={0}
          max={10}
          currentValue={currentSensor.conductivity}
        />
        <SensorCard
          label="Agitation"
          value={currentSensor.agitationSpeed}
          unit="RPM"
          icon={RotateCcw}
          min={0}
          max={500}
          currentValue={currentSensor.agitationSpeed}
        />
        <SensorCard
          label="pH"
          value={currentSensor.phLevel}
          unit=""
          icon={FlaskConical}
          status={currentSensor.phLevel < 5 || currentSensor.phLevel > 9 ? 'warning' : 'normal'}
          min={0}
          max={14}
          currentValue={currentSensor.phLevel}
        />
        <SensorCard
          label="Courant Moteur"
          value={currentSensor.motorCurrent}
          unit="A"
          icon={Zap}
          status={currentSensor.motorCurrent > 15 ? 'warning' : 'normal'}
          min={0}
          max={25}
          currentValue={currentSensor.motorCurrent}
        />
        <SensorCard
          label="Tension Moteur"
          value={currentSensor.motorVoltage}
          unit="V"
          icon={Zap}
          status={currentSensor.motorVoltage < 370 ? 'warning' : 'normal'}
          min={350}
          max={420}
          currentValue={currentSensor.motorVoltage}
        />
        <SensorCard
          label="Vibration RMS"
          value={currentSensor.vibration}
          unit="mm/s"
          icon={Waves}
          status={currentSensor.vibration > 4 ? 'critical' : currentSensor.vibration > 3 ? 'warning' : 'normal'}
          min={0}
          max={6}
          currentValue={currentSensor.vibration}
        />
        <SensorCard
          label="Debit"
          value={currentSensor.flowRate}
          unit="L/min"
          icon={Wind}
          min={0}
          max={25}
          currentValue={currentSensor.flowRate}
        />
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <LiveChart data={sensorHistory} dataKey="temperature" label="Temperature (Pt100)" unit="C" color="hsl(199, 89%, 48%)" icon={Thermometer} />
        <LiveChart data={sensorHistory} dataKey="pressure" label="Pression" unit="bar" color="hsl(142, 71%, 45%)" icon={Gauge} />
        <LiveChart data={sensorHistory} dataKey="conductivity" label="Conductivite" unit="mS/cm" color="hsl(38, 92%, 50%)" icon={Droplets} />
        <LiveChart data={sensorHistory} dataKey="agitationSpeed" label="Vitesse Agitation" unit="RPM" color="hsl(280, 65%, 60%)" icon={RotateCcw} />
      </div>

      {/* PLC Registers */}
      <PLCRegisters sensor={currentSensor} plcStatus={plcStatus} />
    </div>
  )
}
