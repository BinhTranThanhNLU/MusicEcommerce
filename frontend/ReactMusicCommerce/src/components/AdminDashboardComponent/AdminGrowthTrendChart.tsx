import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { AdminGrowthPointDTO } from "../../responsemodel/AdminDashboardOverviewDTO";

interface Props {
  data: AdminGrowthPointDTO[];
}

const AdminGrowthTrendChart = ({ data }: Props) => {
  return (
    <div className="card border-0 shadow-sm rounded-4 h-100 admin-chart-card">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-start gap-3 mb-4">
          <div>
            <h5 className="fw-bold mb-1">Biểu đồ tăng trưởng</h5>
            <p className="text-muted mb-0 small">
              Theo dõi lượng người dùng và nghệ sĩ mới đăng ký theo thời gian.
            </p>
          </div>
          <span className="badge rounded-pill text-bg-light border text-secondary">
            Growth trend
          </span>
        </div>

        <div style={{ width: "100%", height: 320 }}>
          <ResponsiveContainer>
            <LineChart data={data} margin={{ top: 10, right: 16, left: -10, bottom: 0 }}>
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
                allowDecimals={false}
                width={48}
              />
              <Tooltip
                labelStyle={{ color: "#0f172a", fontWeight: 600 }}
                contentStyle={{
                  borderRadius: "14px",
                  border: "none",
                  boxShadow: "0 12px 32px rgba(15, 23, 42, 0.12)",
                }}
              />
              <Legend verticalAlign="top" height={28} iconType="circle" />
              <Line
                type="monotone"
                dataKey="newUsers"
                name="Người dùng mới"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ r: 4, fill: "#fff", strokeWidth: 2 }}
                activeDot={{ r: 7 }}
              />
              <Line
                type="monotone"
                dataKey="newArtists"
                name="Nghệ sĩ mới"
                stroke="#f97316"
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

export default AdminGrowthTrendChart;