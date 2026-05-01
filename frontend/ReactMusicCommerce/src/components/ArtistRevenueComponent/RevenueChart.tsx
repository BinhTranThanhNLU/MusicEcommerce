import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Dữ liệu giả lập doanh thu 6 tháng gần nhất
const data = [
  { name: "Tháng 10", revenue: 4000000 },
  { name: "Tháng 11", revenue: 3000000 },
  { name: "Tháng 12", revenue: 5500000 },
  { name: "Tháng 1", revenue: 4500000 },
  { name: "Tháng 2", revenue: 8000000 },
  { name: "Tháng 3", revenue: 6500000 },
  { name: "Tháng 4", revenue: 10000000 },
];

const formatVND = (value: number) => {
  return new Intl.NumberFormat("vi-VN").format(value) + " ₫";
};

const RevenueChart = () => {
  return (
    <div className="card border-0 shadow-sm rounded-4 mb-4">
      <div className="card-body p-4">
        <h5 className="fw-bold mb-4">Biểu đồ doanh thu 6 tháng gần nhất</h5>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <LineChart
              data={data}
              margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#eee"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6c757d", fontSize: 12 }}
                dy={10}
              />
              <YAxis
                tickFormatter={(value) => `${value / 1000000}tr`}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6c757d", fontSize: 12 }}
                dx={-10}
              />
              <Tooltip
                formatter={(value: number) => [formatVND(value), "Doanh thu"]}
                contentStyle={{
                  borderRadius: "10px",
                  border: "none",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="var(--accent-color, #0d6efd)"
                strokeWidth={3}
                dot={{
                  r: 4,
                  fill: "var(--accent-color, #0d6efd)",
                  strokeWidth: 2,
                  stroke: "#fff",
                }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;
