"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

// Mock data for the occupancy chart
const generateOccupancyData = () => {
  const data = []
  const daysInMonth = 30

  for (let i = 1; i <= daysInMonth; i++) {
    // Generate some random occupancy data
    const occupancy = Math.floor(Math.random() * 40) + 60 // Between 60% and 100%

    data.push({
      date: `${i}`,
      occupancy: occupancy,
    })
  }

  return data
}

export default function OccupancyChart() {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    // Initialize with empty data first
    setData([])
    // Then set the actual data in a separate tick
    const timer = setTimeout(() => {
      setData(generateOccupancyData())
    }, 0)

    return () => clearTimeout(timer)
  }, [])

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip formatter={(value: number) => [`${value}%`, "Occupancy"]} labelFormatter={(label) => `Day ${label}`} />
        <Bar dataKey="occupancy" fill="hsl(22, 65%, 57%)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

