import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { RevenuePieModel } from "../../models/RevenuePieModel";

interface Props {
  data?: RevenuePieModel[];
}

const formatVND = (value: number) =>
  new Intl.NumberFormat("vi-VN").format(value) + " ₫";

const LicenseDistributionChart: React.FC<Props> = ({ data }) => {
  return (
    <div className="card border-0 shadow-sm rounded-4 h-100 p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold mb-0">Cơ cấu Giấy phép</h5>
      </div>
      <div style={{ width: "100%", height: 300 }}>
        {data && data.length > 0 ? (
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="45%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: "10px",
                  border: "none",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                }}
                formatter={(value: number) => [formatVND(value), "Doanh thu"]}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="d-flex h-100 justify-content-center align-items-center text-muted">
            Chưa có dữ liệu giao dịch
          </div>
        )}
      </div>
    </div>
  );
};

export default LicenseDistributionChart;
