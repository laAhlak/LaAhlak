'use client'

import { useEffect, useRef } from 'react'

interface BalanceChartProps {
  transactions: any[]
}

export default function BalanceChart({ transactions }: BalanceChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

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

    // Calculate balance over time (simplified)
    const balanceData = transactions.reduce((acc, tx, index) => {
      const previousBalance = acc[index - 1] || 0
      acc.push(previousBalance - tx.amount) // Subtract sent amount
      return acc
    }, [] as number[])

    if (balanceData.length === 0) {
      // Show empty state
      ctx.fillStyle = '#6B7280'
      ctx.font = '14px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('لا توجد بيانات', chartWidth / 2, chartHeight / 2)
      return
    }

    const maxBalance = Math.max(...balanceData, 0)
    const minBalance = Math.min(...balanceData, 0)
    const range = maxBalance - minBalance || 1

    // Draw line chart
    ctx.strokeStyle = '#00C38A'
    ctx.lineWidth = 3
    ctx.beginPath()

    balanceData.forEach((balance: number, index: number) => {
      const x = padding + (index / (balanceData.length - 1)) * chartWidth
      const y = padding + chartHeight - ((balance - minBalance) / range) * chartHeight

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.stroke()

    // Draw area under the curve
    ctx.fillStyle = 'rgba(0, 195, 138, 0.1)'
    ctx.beginPath()
    ctx.moveTo(padding, chartHeight + padding)
    
    balanceData.forEach((balance: number, index: number) => {
      const x = padding + (index / (balanceData.length - 1)) * chartWidth
      const y = padding + chartHeight - ((balance - minBalance) / range) * chartHeight
      ctx.lineTo(x, y)
    })
    
    ctx.lineTo(padding + chartWidth, chartHeight + padding)
    ctx.closePath()
    ctx.fill()

    // Draw data points
    ctx.fillStyle = '#00C38A'
    balanceData.forEach((balance: number, index: number) => {
      const x = padding + (index / (balanceData.length - 1)) * chartWidth
      const y = padding + chartHeight - ((balance - minBalance) / range) * chartHeight
      
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, 2 * Math.PI)
      ctx.fill()
    })

    // Draw axes
    ctx.strokeStyle = '#374151'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, chartHeight + padding)
    ctx.lineTo(chartWidth + padding, chartHeight + padding)
    ctx.stroke()

    // Draw current balance
    const currentBalance = balanceData[balanceData.length - 1] || 0
    ctx.fillStyle = '#ffffff'
    ctx.font = '12px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(`الرصيد الحالي: ${currentBalance.toFixed(2)} €`, chartWidth / 2, padding - 5)

  }, [transactions])

  return (
    <div className="h-48">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ maxHeight: '192px' }}
      />
    </div>
  )
}
