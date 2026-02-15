'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  type SensorData,
  type BatchInfo,
  type PLCStatus,
  type Alert,
  type MotorHealth,
  type PowerSupply,
  generateSensorData,
  generateBatchInfo,
  generatePLCStatus,
  generateAlerts,
  generateMotorHealth,
  generatePowerSupply,
} from '@/lib/plc-simulator'

const HISTORY_LENGTH = 60 // 60 data points

export function usePLCData(pollRate: number = 2000) {
  const [tick, setTick] = useState(0)
  const [sensorHistory, setSensorHistory] = useState<SensorData[]>([])
  const [batch, setBatch] = useState<BatchInfo>(() => generateBatchInfo(45))
  const [plcStatus, setPLCStatus] = useState<PLCStatus>(() => generatePLCStatus())
  const [alerts, setAlerts] = useState<Alert[]>(() => generateAlerts(8))
  const [motorHealth, setMotorHealth] = useState<MotorHealth>(() => generateMotorHealth())
  const [powerSupply, setPowerSupply] = useState<PowerSupply>(() => generatePowerSupply())

  const currentSensor = sensorHistory.length > 0 ? sensorHistory[sensorHistory.length - 1] : null

  const acknowledgeAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, acknowledged: true } : a))
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setTick(prev => prev + 1)
    }, pollRate)
    return () => clearInterval(interval)
  }, [pollRate])

  useEffect(() => {
    const newBatch = generateBatchInfo(45 + tick * 0.5)
    setBatch(newBatch)

    const newSensor = generateSensorData(newBatch)
    setSensorHistory(prev => {
      const updated = [...prev, newSensor]
      return updated.slice(-HISTORY_LENGTH)
    })

    setPLCStatus(generatePLCStatus())
    setMotorHealth(generateMotorHealth())
    setPowerSupply(generatePowerSupply())

    // Occasionally add new alerts
    if (tick % 10 === 0 && tick > 0) {
      setAlerts(generateAlerts(8))
    }
  }, [tick])

  return {
    currentSensor,
    sensorHistory,
    batch,
    plcStatus,
    alerts,
    motorHealth,
    powerSupply,
    acknowledgeAlert,
  }
}
