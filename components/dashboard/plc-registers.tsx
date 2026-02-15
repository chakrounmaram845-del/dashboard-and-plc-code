'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { SensorData, PLCStatus } from '@/lib/plc-simulator'
import { Cpu, Server } from 'lucide-react'

interface PLCRegistersProps {
  sensor: SensorData | null
  plcStatus: PLCStatus
}

interface Register {
  address: string
  name: string
  value: string
  type: string
  access: 'R' | 'R/W'
}

export function PLCRegisters({ sensor, plcStatus }: PLCRegistersProps) {
  if (!sensor) return null

  const registers: Register[] = [
    { address: '40001', name: 'Temperature_PV', value: `${sensor.temperature}`, type: 'FLOAT32', access: 'R' },
    { address: '40003', name: 'Pressure_PV', value: `${sensor.pressure}`, type: 'FLOAT32', access: 'R' },
    { address: '40005', name: 'Conductivity_PV', value: `${sensor.conductivity}`, type: 'FLOAT32', access: 'R' },
    { address: '40007', name: 'Agitation_Speed', value: `${sensor.agitationSpeed}`, type: 'INT16', access: 'R' },
    { address: '40008', name: 'Motor_Current', value: `${sensor.motorCurrent}`, type: 'FLOAT32', access: 'R' },
    { address: '40010', name: 'Motor_Voltage', value: `${sensor.motorVoltage}`, type: 'FLOAT32', access: 'R' },
    { address: '40012', name: 'Vibration_RMS', value: `${sensor.vibration}`, type: 'FLOAT32', access: 'R' },
    { address: '40014', name: 'pH_Level', value: `${sensor.phLevel}`, type: 'FLOAT32', access: 'R' },
    { address: '40016', name: 'Flow_Rate', value: `${sensor.flowRate}`, type: 'FLOAT32', access: 'R' },
    { address: '40018', name: 'Temp_SP', value: '78.0', type: 'FLOAT32', access: 'R/W' },
    { address: '40020', name: 'Agitation_SP', value: '250', type: 'INT16', access: 'R/W' },
    { address: '40021', name: 'Batch_Phase', value: '3', type: 'INT16', access: 'R' },
  ]

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Cpu className="h-4 w-4 text-primary" />
            Registres PLC ({plcStatus.protocol})
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-xs border-border text-muted-foreground">
              <Server className="mr-1 h-3 w-3" />
              {plcStatus.address}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="pb-2 text-left font-medium">Adresse</th>
                <th className="pb-2 text-left font-medium">Registre</th>
                <th className="pb-2 text-right font-medium">Valeur</th>
                <th className="pb-2 text-center font-medium">Type</th>
                <th className="pb-2 text-center font-medium">Acces</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {registers.map((reg) => (
                <tr key={reg.address} className="hover:bg-secondary/50 transition-colors">
                  <td className="py-2 font-mono text-primary">{reg.address}</td>
                  <td className="py-2 font-mono text-foreground">{reg.name}</td>
                  <td className="py-2 text-right font-mono font-medium text-emerald-400">{reg.value}</td>
                  <td className="py-2 text-center">
                    <Badge variant="outline" className="border-border text-muted-foreground text-xs">
                      {reg.type}
                    </Badge>
                  </td>
                  <td className="py-2 text-center">
                    <Badge
                      variant="outline"
                      className={cn('text-xs', {
                        'border-border text-muted-foreground': reg.access === 'R',
                        'border-primary/30 text-primary': reg.access === 'R/W',
                      })}
                    >
                      {reg.access}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
