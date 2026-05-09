import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { TopTrackModel } from "../../models/TopTrackModel";

interface Props {
  data?: TopTrackModel[];
}

const formatVND = (value: number) =>
  new Intl.NumberFormat("vi-VN").format(value) + " ₫";

// Custom Tooltip để hiển thị cả Lượt bán và Doanh thu
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 rounded shadow-sm border border-light">
        <p className="fw-bold mb-1">{data.title}</p>
        <p className="mb-0 text-muted small">
          Lượt bán:{" "}
          <span className="text-dark fw-medium">{data.salesCount}</span>
        </p>
        <p className="mb-0 text-success small">
          Doanh thu:{" "}
          <span className="fw-medium">{formatVND(data.revenue)}</span>
        </p>
      </div>
    );
  }
  return null;
};

const TopTracksChart: React.FC<Props> = ({ data }) => {
  return (
    <div className="card border-0 shadow-sm rounded-4 h-100 p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold mb-0">Top Tác phẩm bán chạy</h5>
      </div>
      <div style={{ width: "100%", height: 300 }}>
        {data && data.length > 0 ? (
          <ResponsiveContainer>
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={false}
                stroke="#eee"
              />
              <XAxis type="number" hide />
              <YAxis
                dataKey="title"
                type="category"
                width={120}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#495057", width: 100 }}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "rgba(32, 201, 151, 0.05)" }}
              />
              <Bar dataKey="revenue" radius={[0, 4, 4, 0]} barSize={24}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === 0 ? "#20c997" : "#8be8cb"}
                  /> // Bài top 1 nổi bật hơn
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="d-flex h-100 justify-content-center align-items-center text-muted">
            Chưa có dữ liệu bài hát
          </div>
        )}
      </div>
    </div>
  );
};

export default TopTracksChart;
