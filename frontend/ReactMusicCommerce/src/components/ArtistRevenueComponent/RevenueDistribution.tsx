import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const data = [
  { name: "Cá nhân", value: 4500000, color: "#0dcaf0" },    // Màu Info
  { name: "Thương mại", value: 25500000, color: "#dc3545" }, // Màu Danger
  { name: "Độc quyền", value: 15800000, color: "#ffc107" },  // Màu Warning
];

const formatVND = (value: number) => {
  return new Intl.NumberFormat("vi-VN").format(value) + " ₫";
};

const RevenueDistribution = () => {
  return (
    <div className="card border-0 shadow-sm rounded-4 h-100">
      <div className="card-body p-4 d-flex flex-column">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="fw-bold mb-0">Cơ cấu doanh thu</h5>
          <select className="form-select form-select-sm w-auto bg-light border-0">
            <option value="all">Tất cả</option>
            <option value="this_month">Tháng này</option>
          </select>
        </div>
        
        <div style={{ width: "100%", flex: 1, minHeight: "250px" }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [formatVND(value), "Doanh thu"]} 
                contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default RevenueDistribution;