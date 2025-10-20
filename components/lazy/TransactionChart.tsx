'use client'

import { useEffect, useRef } from 'react'

interface TransactionChartProps {
  transactions: any[]
}

export default function TransactionChart({ transactions }: TransactionChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || transactions.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size (lighter for better performance)
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Chart dimensions
    const padding = 20
    const chartWidth = canvas.offsetWidth - padding * 2
    const chartHeight = canvas.offsetHeight - padding * 2

    // Prepare data (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return date.toISOString().split('T')[0]
    }).reverse()

    const dailyAmounts = last7Days.map(date => {
      return transactions
        .filter(tx => tx.date.includes(date.split('-')[2]) || tx.date.includes('اليوم') || tx.date.includes('أمس'))
        .reduce((sum, tx) => sum + tx.amount, 0)
    })

    const maxAmount = Math.max(...dailyAmounts, 1)

    // Draw axes
    ctx.strokeStyle = '#374151'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, chartHeight + padding)
    ctx.lineTo(chartWidth + padding, chartHeight + padding)
    ctx.stroke()

    // Draw bars
    const barWidth = chartWidth / 7
    dailyAmounts.forEach((amount: number, index: number) => {
      const barHeight = (amount / maxAmount) * chartHeight
      const x = padding + index * barWidth + barWidth * 0.1
      const y = chartHeight + padding - barHeight

      // Bar color based on amount
      const intensity = amount / maxAmount
      const r = Math.floor(0 + intensity * 195) // 0 to 195
      const g = Math.floor(195 + intensity * 60) // 195 to 255
      const b = Math.floor(138 + intensity * 117) // 138 to 255

      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
      ctx.fillRect(x, y, barWidth * 0.8, barHeight)

      // Amount label
      if (amount > 0) {
        ctx.fillStyle = '#ffffff'
        ctx.font = '10px Arial'
        ctx.textAlign = 'center'
        ctx.fillText(amount.toFixed(0), x + barWidth * 0.4, y - 5)
      }
    })

    // Draw day labels
    ctx.fillStyle = '#9CA3AF'
    ctx.font = '10px Arial'
    ctx.textAlign = 'center'
    last7Days.forEach((date: string, index: number) => {
      const dayName = new Date(date).toLocaleDateString('ar-SA', { weekday: 'short' })
      const x = padding + index * barWidth + barWidth * 0.5
      ctx.fillText(dayName, x, chartHeight + padding + 15)
    })

  }, [transactions])

  if (transactions.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-gray-400 text-2xl">📊</span>
          </div>
          <p className="text-gray-400">لا توجد بيانات للعرض</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-64">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ maxHeight: '256px' }}
      />
    </div>
  )
}
