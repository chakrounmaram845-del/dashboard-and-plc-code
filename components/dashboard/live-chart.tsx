'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts'
import type { SensorData } from '@/lib/plc-simulator'
import type { LucideIcon } from 'lucide-react'

interface LiveChartProps {
  data: SensorData[]
  dataKey: keyof SensorData
  label: string
  unit: string
  color: string
  icon: LucideIcon
  type?: 'line' | 'area'
}

export function LiveChart({ data, dataKey, label, unit, color, icon: Icon, type = 'area' }: LiveChartProps) {
  const chartData = data.map((d, i) => ({
    index: i,
    value: d[dataKey] as number,
  }))

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Icon className="h-4 w-4" style={{ color }} />
          {label}
          <span className="ml-auto font-mono text-xs text-muted-foreground">{unit}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            {type === 'area' ? (
              <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 16%)" />
                <XAxis
                  dataKey="index"
                  tick={{ fontSize: 10, fill: 'hsl(215, 20%, 55%)' }}
                  axisLine={{ stroke: 'hsl(222, 30%, 16%)' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: 'hsl(215, 20%, 55%)' }}
                  axisLine={{ stroke: 'hsl(222, 30%, 16%)' }}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(222, 47%, 8%)',
                    border: '1px solid hsl(222, 30%, 16%)',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: 'hsl(210, 40%, 96%)',
                  }}
                  formatter={(value: number) => [`${value} ${unit}`, label]}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={color}
                  strokeWidth={2}
                  fill={`url(#gradient-${dataKey})`}
                  dot={false}
                  animationDuration={300}
                />
              </AreaChart>
            ) : (
              <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 16%)" />
                <XAxis
                  dataKey="index"
                  tick={{ fontSize: 10, fill: 'hsl(215, 20%, 55%)' }}
                  axisLine={{ stroke: 'hsl(222, 30%, 16%)' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: 'hsl(215, 20%, 55%)' }}
                  axisLine={{ stroke: 'hsl(222, 30%, 16%)' }}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(222, 47%, 8%)',
                    border: '1px solid hsl(222, 30%, 16%)',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: 'hsl(210, 40%, 96%)',
                  }}
                  formatter={(value: number) => [`${value} ${unit}`, label]}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={color}
                  strokeWidth={2}
                  dot={false}
                  animationDuration={300}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
