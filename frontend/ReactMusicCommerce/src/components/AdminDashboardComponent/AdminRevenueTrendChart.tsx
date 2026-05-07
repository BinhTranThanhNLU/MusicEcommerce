import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { AdminRevenuePointDTO } from "../../responsemodel/AdminDashboardOverviewDTO";

interface Props {
  data: AdminRevenuePointDTO[];
}

const formatMoney = (value: number) =>
  new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(value) + " ₫";

const AdminRevenueTrendChart = ({ data }: Props) => {
  return (
    <div className="card border-0 shadow-sm rounded-4 h-100 admin-chart-card">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-start gap-3 mb-4">
          <div>
            <h5 className="fw-bold mb-1">Biểu đồ đường doanh thu</h5>
            <p className="text-muted mb-0 small">
              Biến động dòng tiền toàn hệ thống theo từng mốc thời gian.
            </p>
          </div>
          <span className="badge rounded-pill text-bg-light border text-secondary">
            Revenue trend
          </span>
        </div>

        <div style={{ width: "100%", height: 320 }}>
          <ResponsiveContainer>
            <LineChart data={data} margin={{ top: 10, right: 16, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="adminRevenueStroke" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#2563eb" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
                tickFormatter={(value) => `${Math.round(Number(value) / 1000000)}tr`}
                width={48}
              />
              <Tooltip
                formatter={(value: number) => [formatMoney(value), "Doanh thu"]}
                labelStyle={{ color: "#0f172a", fontWeight: 600 }}
                contentStyle={{
                  borderRadius: "14px",
                  border: "none",
                  boxShadow: "0 12px 32px rgba(15, 23, 42, 0.12)",
                }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="url(#adminRevenueStroke)"
                strokeWidth={3}
                dot={{ r: 4, fill: "#fff", strokeWidth: 2 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminRevenueTrendChart;