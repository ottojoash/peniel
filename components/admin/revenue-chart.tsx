"use client"

import { useEffect, useState } from "react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

// Mock data for the revenue chart
const generateRevenueData = () => {
  const data = []
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

  for (let i = 1; i <= daysInMonth; i++) {
    // Generate some random revenue data
    const revenue = Math.floor(Math.random() * 1000) + 500

    data.push({
      date: `${i}`,
      revenue: revenue,
    })
  }

  return data
}

export default function RevenueChart() {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    // Initialize with empty data first
    setData([])
    // Then set the actual data in a separate tick
    const timer = setTimeout(() => {
      setData(generateRevenueData())
    }, 0)

    return () => clearTimeout(timer)
  }, [])

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip formatter={(value: number) => [`$${value}`, "Revenue"]} labelFormatter={(label) => `Day ${label}`} />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="hsl(22, 65%, 57%)"
          strokeWidth={2}
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

