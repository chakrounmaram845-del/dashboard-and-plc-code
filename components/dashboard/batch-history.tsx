'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { generateHistoricalBatches } from '@/lib/plc-simulator'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { BarChart3, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react'

export function BatchHistory() {
  const batches = useMemo(() => generateHistoricalBatches(20), [])

  const statusConfig = {
    success: { label: 'Reussi', icon: CheckCircle2, class: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' },
    partial: { label: 'Partiel', icon: AlertTriangle, class: 'border-amber-500/30 bg-amber-500/10 text-amber-400' },
    failed: { label: 'Echoue', icon: XCircle, class: 'border-red-500/30 bg-red-500/10 text-red-400' },
  }

  const chartData = batches.slice(0, 12).reverse().map(b => ({
    name: b.id.slice(-4),
    yield: b.yield,
    purity: b.purity,
    status: b.status,
  }))

  const stats = {
    total: batches.length,
    success: batches.filter(b => b.status === 'success').length,
    partial: batches.filter(b => b.status === 'partial').length,
    failed: batches.filter(b => b.status === 'failed').length,
    avgYield: Math.round(batches.reduce((acc, b) => acc + b.yield, 0) / batches.length * 10) / 10,
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <Card className="border-border bg-card">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground">Total Batches</p>
            <p className="font-mono text-2xl font-bold text-foreground">{stats.total}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground">Reussis</p>
            <p className="font-mono text-2xl font-bold text-emerald-400">{stats.success}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground">Partiels</p>
            <p className="font-mono text-2xl font-bold text-amber-400">{stats.partial}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground">Echoues</p>
            <p className="font-mono text-2xl font-bold text-red-400">{stats.failed}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground">Rendement Moy.</p>
            <p className="font-mono text-2xl font-bold text-primary">{stats.avgYield}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <BarChart3 className="h-4 w-4 text-primary" />
            Rendement par Batch (12 derniers)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 16%)" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: 'hsl(215, 20%, 55%)' }}
                  axisLine={{ stroke: 'hsl(222, 30%, 16%)' }}
                  tickLine={false}
                />
                <YAxis
                  domain={[60, 100]}
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
                  formatter={(value: number) => [`${value}%`, 'Rendement']}
                />
                <Bar dataKey="yield" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.status === 'success'
                          ? 'hsl(142, 71%, 45%)'
                          : entry.status === 'partial'
                            ? 'hsl(38, 92%, 50%)'
                            : 'hsl(0, 72%, 51%)'
                      }
                      opacity={0.8}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-foreground">
            Historique Detaille
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="pb-2 text-left font-medium">Batch ID</th>
                  <th className="pb-2 text-left font-medium">Recette</th>
                  <th className="pb-2 text-right font-medium">Duree (min)</th>
                  <th className="pb-2 text-right font-medium">Rendement</th>
                  <th className="pb-2 text-right font-medium">Purete</th>
                  <th className="pb-2 text-right font-medium">Risque Max</th>
                  <th className="pb-2 text-center font-medium">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {batches.map((batch) => {
                  const config = statusConfig[batch.status]
                  return (
                    <tr key={batch.id} className="hover:bg-secondary/50 transition-colors">
                      <td className="py-2.5 font-mono text-primary">{batch.id}</td>
                      <td className="py-2.5 text-foreground">{batch.recipe}</td>
                      <td className="py-2.5 text-right font-mono text-foreground">{batch.duration}</td>
                      <td className={cn('py-2.5 text-right font-mono font-medium', {
                        'text-emerald-400': batch.yield >= 85,
                        'text-amber-400': batch.yield >= 75 && batch.yield < 85,
                        'text-red-400': batch.yield < 75,
                      })}>
                        {batch.yield}%
                      </td>
                      <td className="py-2.5 text-right font-mono text-foreground">{batch.purity}%</td>
                      <td className={cn('py-2.5 text-right font-mono', {
                        'text-emerald-400': batch.riskPeak <= 30,
                        'text-amber-400': batch.riskPeak <= 60,
                        'text-red-400': batch.riskPeak > 60,
                      })}>
                        {batch.riskPeak}
                      </td>
                      <td className="py-2.5 text-center">
                        <Badge variant="outline" className={cn('text-xs', config.class)}>
                          {config.label}
                        </Badge>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
