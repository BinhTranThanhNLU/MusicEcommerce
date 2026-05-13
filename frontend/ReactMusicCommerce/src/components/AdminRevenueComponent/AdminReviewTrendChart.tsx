import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { AdminReviewTrendPointDTO } from "../../responsemodel/AdminReviewDashboardDTO";

interface Props {
  data: AdminReviewTrendPointDTO[];
}

const AdminReviewTrendChart = ({ data }: Props) => {
  const chartData = data.map((point) => ({
    label: point.label,
    reviewCount: point.reviewCount ?? 0,
    averageRating: point.averageRating ?? 0,
  }));

  return (
    <div className="card border-0 shadow-sm rounded-4 h-100">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-start gap-3 mb-4">
          <div>
            <h5 className="fw-bold mb-1">Xu hướng đánh giá</h5>
            <p className="text-muted mb-0 small">
              Theo dõi số lượng đánh giá và điểm trung bình theo từng mốc thời gian.
            </p>
          </div>
          <span className="badge rounded-pill text-bg-light border text-secondary">
            Review trend
          </span>
        </div>

        <div style={{ width: "100%", height: 320 }}>
          <ResponsiveContainer>
            <LineChart data={chartData} margin={{ top: 10, right: 16, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
                dy={10}
              />
              <YAxis
                yAxisId="left"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
                allowDecimals={false}
                width={48}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[0, 5]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
                width={48}
              />
              <Tooltip
                formatter={(value: number, name: string) => {
                  if (name === "averageRating") {
                    return [Number(value).toFixed(1), "Điểm trung bình"];
                  }

                  return [new Intl.NumberFormat("vi-VN").format(Number(value ?? 0)), "Số lượng đánh giá"];
                }}
                contentStyle={{
                  borderRadius: "14px",
                  border: "none",
                  boxShadow: "0 12px 32px rgba(15, 23, 42, 0.12)",
                }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="reviewCount"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ r: 4, fill: "#2563eb", strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 6 }}
                name="reviewCount"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="averageRating"
                stroke="#f59e0b"
                strokeWidth={3}
                dot={{ r: 4, fill: "#f59e0b", strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 6 }}
                name="averageRating"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminReviewTrendChart;