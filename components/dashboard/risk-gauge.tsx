'use client'

import { cn } from '@/lib/utils'

interface RiskGaugeProps {
  value: number
  label: string
  size?: 'sm' | 'md' | 'lg'
}

function getRiskColor(value: number) {
  if (value <= 30) return { text: 'text-emerald-400', bg: 'bg-emerald-400', label: 'Faible' }
  if (value <= 60) return { text: 'text-amber-400', bg: 'bg-amber-400', label: 'Modere' }
  return { text: 'text-red-400', bg: 'bg-red-400', label: 'Eleve' }
}

export function RiskGauge({ value, label, size = 'md' }: RiskGaugeProps) {
  const risk = getRiskColor(value)
  const sizeClass = size === 'sm' ? 'h-24 w-24' : size === 'lg' ? 'h-40 w-40' : 'h-32 w-32'
  const textSize = size === 'sm' ? 'text-xl' : size === 'lg' ? 'text-4xl' : 'text-3xl'

  // SVG arc calculations
  const svgSize = size === 'sm' ? 96 : size === 'lg' ? 160 : 128
  const strokeWidth = size === 'sm' ? 6 : 8
  const radius = (svgSize - strokeWidth * 2) / 2
  const circumference = Math.PI * radius // half circle
  const progress = (value / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={cn('relative', sizeClass)}>
        <svg
          width={svgSize}
          height={svgSize / 2 + strokeWidth}
          viewBox={`0 0 ${svgSize} ${svgSize / 2 + strokeWidth}`}
          className="overflow-visible"
        >
          {/* Background arc */}
          <path
            d={`M ${strokeWidth} ${svgSize / 2} A ${radius} ${radius} 0 0 1 ${svgSize - strokeWidth} ${svgSize / 2}`}
            fill="none"
            stroke="hsl(var(--secondary))"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Progress arc */}
          <path
            d={`M ${strokeWidth} ${svgSize / 2} A ${radius} ${radius} 0 0 1 ${svgSize - strokeWidth} ${svgSize / 2}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${circumference}`}
            strokeDashoffset={circumference - progress}
            className={cn('transition-all duration-700', risk.text)}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
          <span className={cn('font-mono font-bold', textSize, risk.text)}>{value}</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className={cn('text-xs font-semibold', risk.text)}>{risk.label}</p>
      </div>
    </div>
  )
}
