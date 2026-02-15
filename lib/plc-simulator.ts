// PLC Simulator - Generates realistic batch reactor data
// Simulates OPC UA / Modbus TCP sensor readings

export interface SensorData {
  timestamp: number
  temperature: number       // Pt100 - celsius
  pressure: number          // bar
  conductivity: number      // mS/cm
  agitationSpeed: number    // RPM
  motorCurrent: number      // Ampere
  motorVoltage: number      // Volt
  vibration: number         // mm/s
  phLevel: number
  flowRate: number          // L/min
}

export interface BatchInfo {
  id: string
  recipe: string
  startTime: number
  elapsedMinutes: number
  totalMinutes: number
  phase: 'Chargement' | 'Chauffage' | 'Reaction' | 'Refroidissement' | 'Decharge'
  status: 'running' | 'completed' | 'warning' | 'critical'
  yieldPrediction: number    // %
  purityPrediction: number   // %
  riskScore: number          // 0-100
}

export interface PLCStatus {
  connected: boolean
  protocol: 'OPC UA' | 'Modbus TCP'
  address: string
  lastPoll: number
  pollRate: number // ms
  registers: number
}

export interface Alert {
  id: string
  timestamp: number
  severity: 'info' | 'warning' | 'critical'
  source: string
  message: string
  acknowledged: boolean
}

export interface MotorHealth {
  temperature: number
  currentDraw: number
  vibrationLevel: number
  bearingCondition: number  // 0-100%
  insulationResistance: number  // MOhm
  runtime: number // hours
  status: 'healthy' | 'warning' | 'critical'
}

export interface PowerSupply {
  voltage: number
  current: number
  frequency: number // Hz
  powerFactor: number
  thd: number // Total Harmonic Distortion %
  status: 'stable' | 'fluctuating' | 'critical'
}

// Generate a sine wave with noise
function sineWithNoise(base: number, amplitude: number, frequency: number, t: number, noise: number): number {
  return base + amplitude * Math.sin(frequency * t) + (Math.random() - 0.5) * noise
}

// Phase-dependent temperature profile
function getPhaseTemperature(phase: string, elapsed: number, total: number): number {
  const progress = elapsed / total
  switch (phase) {
    case 'Chargement': return sineWithNoise(25, 2, 0.1, elapsed, 1)
    case 'Chauffage': return 25 + (progress * 4) * 55 + (Math.random() - 0.5) * 3
    case 'Reaction': return sineWithNoise(78, 3, 0.05, elapsed, 2)
    case 'Refroidissement': return 80 - (progress * 2) * 50 + (Math.random() - 0.5) * 2
    case 'Decharge': return sineWithNoise(30, 1, 0.1, elapsed, 0.5)
    default: return 25
  }
}

export function generateSensorData(batch: BatchInfo): SensorData {
  const t = batch.elapsedMinutes
  const temp = getPhaseTemperature(batch.phase, t, batch.totalMinutes)

  return {
    timestamp: Date.now(),
    temperature: Math.round(temp * 10) / 10,
    pressure: Math.round(sineWithNoise(2.5, 0.5, 0.03, t, 0.2) * 100) / 100,
    conductivity: Math.round(sineWithNoise(4.2, 0.8, 0.02, t, 0.3) * 100) / 100,
    agitationSpeed: Math.round(sineWithNoise(250, 15, 0.04, t, 8)),
    motorCurrent: Math.round(sineWithNoise(12, 2, 0.06, t, 1) * 10) / 10,
    motorVoltage: Math.round(sineWithNoise(380, 5, 0.02, t, 3) * 10) / 10,
    vibration: Math.round(sineWithNoise(2.5, 0.8, 0.08, t, 0.4) * 100) / 100,
    phLevel: Math.round(sineWithNoise(7.0, 0.5, 0.01, t, 0.2) * 10) / 10,
    flowRate: batch.phase === 'Chargement' || batch.phase === 'Decharge'
      ? Math.round(sineWithNoise(15, 3, 0.05, t, 1) * 10) / 10
      : Math.round(sineWithNoise(2, 0.5, 0.05, t, 0.3) * 10) / 10,
  }
}

export function generateBatchInfo(minuteOffset: number = 0): BatchInfo {
  const totalMinutes = 180
  const elapsed = (minuteOffset % totalMinutes)
  const progress = elapsed / totalMinutes

  let phase: BatchInfo['phase']
  if (progress < 0.1) phase = 'Chargement'
  else if (progress < 0.3) phase = 'Chauffage'
  else if (progress < 0.7) phase = 'Reaction'
  else if (progress < 0.9) phase = 'Refroidissement'
  else phase = 'Decharge'

  const riskScore = Math.round(Math.max(5, Math.min(95,
    15 + Math.sin(elapsed * 0.05) * 20 + (Math.random() - 0.5) * 15
  )))

  let status: BatchInfo['status'] = 'running'
  if (riskScore > 70) status = 'critical'
  else if (riskScore > 45) status = 'warning'

  return {
    id: `BG-2026-${String(Math.floor(minuteOffset / totalMinutes) + 1).padStart(4, '0')}`,
    recipe: 'RX-Pharma-A1',
    startTime: Date.now() - elapsed * 60000,
    elapsedMinutes: elapsed,
    totalMinutes,
    phase,
    status,
    yieldPrediction: Math.round(Math.max(60, Math.min(99, 85 + Math.sin(elapsed * 0.03) * 8 + (Math.random() - 0.5) * 5)) * 10) / 10,
    purityPrediction: Math.round(Math.max(90, Math.min(99.9, 97 + Math.sin(elapsed * 0.02) * 2 + (Math.random() - 0.5) * 1)) * 10) / 10,
    riskScore,
  }
}

export function generateMotorHealth(): MotorHealth {
  const vibration = Math.round(sineWithNoise(2.5, 1, 0.1, Date.now() / 10000, 0.5) * 100) / 100
  let status: MotorHealth['status'] = 'healthy'
  if (vibration > 4) status = 'critical'
  else if (vibration > 3) status = 'warning'

  return {
    temperature: Math.round(sineWithNoise(55, 8, 0.05, Date.now() / 10000, 3) * 10) / 10,
    currentDraw: Math.round(sineWithNoise(12, 2, 0.06, Date.now() / 10000, 1) * 10) / 10,
    vibrationLevel: vibration,
    bearingCondition: Math.round(Math.max(60, Math.min(100, 85 + (Math.random() - 0.5) * 10))),
    insulationResistance: Math.round(sineWithNoise(150, 20, 0.02, Date.now() / 10000, 10) * 10) / 10,
    runtime: Math.round(2456 + Math.random() * 10),
    status,
  }
}

export function generatePowerSupply(): PowerSupply {
  const voltage = Math.round(sineWithNoise(380, 8, 0.03, Date.now() / 10000, 4) * 10) / 10
  let status: PowerSupply['status'] = 'stable'
  if (voltage < 360 || voltage > 400) status = 'critical'
  else if (voltage < 370 || voltage > 390) status = 'fluctuating'

  return {
    voltage,
    current: Math.round(sineWithNoise(18, 3, 0.04, Date.now() / 10000, 1.5) * 10) / 10,
    frequency: Math.round(sineWithNoise(50, 0.2, 0.02, Date.now() / 10000, 0.1) * 100) / 100,
    powerFactor: Math.round(sineWithNoise(0.92, 0.03, 0.01, Date.now() / 10000, 0.02) * 1000) / 1000,
    thd: Math.round(sineWithNoise(3.5, 1, 0.05, Date.now() / 10000, 0.5) * 10) / 10,
    status,
  }
}

export function generatePLCStatus(): PLCStatus {
  return {
    connected: Math.random() > 0.02,
    protocol: Math.random() > 0.5 ? 'OPC UA' : 'Modbus TCP',
    address: '192.168.1.100:4840',
    lastPoll: Date.now(),
    pollRate: 500,
    registers: 48,
  }
}

export function generateAlerts(count: number = 5): Alert[] {
  const messages = [
    { severity: 'critical' as const, source: 'Moteur Agitation', message: 'Vibration moteur au-dessus du seuil critique (4.2 mm/s)' },
    { severity: 'warning' as const, source: 'Alimentation', message: 'Fluctuation de tension detectee (372V - seuil: 370V)' },
    { severity: 'warning' as const, source: 'Temperature', message: 'Temperature reacteur 82.3C - proche limite haute (85C)' },
    { severity: 'info' as const, source: 'Batch', message: 'Phase Reaction demarree - Batch BG-2026-0047' },
    { severity: 'info' as const, source: 'PLC', message: 'Connexion OPC UA re-etablie apres timeout' },
    { severity: 'critical' as const, source: 'Pression', message: 'Pression reacteur 3.8 bar - seuil critique depasse (3.5 bar)' },
    { severity: 'warning' as const, source: 'Conductivite', message: 'Derive conductivite detectee - verifier reactifs' },
    { severity: 'info' as const, source: 'Maintenance', message: 'Prochaine maintenance preventive moteur dans 48h' },
  ]

  return Array.from({ length: count }, (_, i) => ({
    id: `ALR-${String(i + 1).padStart(3, '0')}`,
    timestamp: Date.now() - Math.random() * 3600000,
    ...messages[i % messages.length],
    acknowledged: Math.random() > 0.6,
  })).sort((a, b) => b.timestamp - a.timestamp)
}

// Generate historical batch data for analytics
export interface HistoricalBatch {
  id: string
  date: string
  recipe: string
  duration: number
  yield: number
  purity: number
  status: 'success' | 'partial' | 'failed'
  riskPeak: number
}

export function generateHistoricalBatches(count: number = 20): HistoricalBatch[] {
  const recipes = ['RX-Pharma-A1', 'RX-Chem-B2', 'RX-Bio-C3', 'RX-Agro-D4']
  return Array.from({ length: count }, (_, i) => {
    const yieldVal = Math.round((70 + Math.random() * 28) * 10) / 10
    const purity = Math.round((92 + Math.random() * 7.5) * 10) / 10
    let status: HistoricalBatch['status'] = 'success'
    if (yieldVal < 75) status = 'failed'
    else if (yieldVal < 85) status = 'partial'

    return {
      id: `BG-2026-${String(count - i).padStart(4, '0')}`,
      date: new Date(Date.now() - (i * 8 + Math.random() * 4) * 3600000).toISOString(),
      recipe: recipes[Math.floor(Math.random() * recipes.length)],
      duration: Math.round(150 + Math.random() * 60),
      yield: yieldVal,
      purity,
      status,
      riskPeak: Math.round(10 + Math.random() * 70),
    }
  })
}
