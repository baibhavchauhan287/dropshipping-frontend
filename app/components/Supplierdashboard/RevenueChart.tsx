"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

const data = [
  { name: "Jan", revenue: 400 },
  { name: "Feb", revenue: 800 },
  { name: "Mar", revenue: 600 },
  { name: "Apr", revenue: 1200 },
];

export default function RevenueChart() {

  return (

    <div className="bg-white p-6 rounded-xl shadow-lg">

      <h2 className="font-semibold mb-4 text-lg">
        Revenue Overview
      </h2>

      <ResponsiveContainer width="100%" height={300}>

        <LineChart data={data}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="name" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#6366f1"
            strokeWidth={4}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>

  );
}