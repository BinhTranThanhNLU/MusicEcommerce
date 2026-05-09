import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { RevenueChartModel } from "../../models/RevenueChartModel";

interface Props {
  data?: RevenueChartModel[];
}

const formatVND = (value: number) =>
  new Intl.NumberFormat("vi-VN").format(value) + " ₫";

const RevenueChart: React.FC<Props> = ({ data }) => {
  // Đảo ngược mảng để tháng cũ ở bên trái, tháng mới ở bên phải
  const chartData = data ? [...data].reverse() : [];

  return (
    <div className="card border-0 shadow-sm rounded-4 h-100 p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold mb-0">Doanh thu 6 tháng qua</h5>
      </div>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
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
              tick={{ fontSize: 12, fill: "#6c757d" }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6c757d" }}
              tickFormatter={(val) =>
                val >= 1000000 ? val / 1000000 + "M" : val
              }
            />
            <Tooltip
              cursor={{ fill: "rgba(13, 110, 253, 0.05)" }}
              contentStyle={{
                borderRadius: "10px",
                border: "none",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              }}
              formatter={(value: number) => [formatVND(value), "Doanh thu"]}
            />
            <Bar
              dataKey="revenue"
              name="Doanh thu"
              fill="#0d6efd"
              radius={[6, 6, 0, 0]}
              barSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;
