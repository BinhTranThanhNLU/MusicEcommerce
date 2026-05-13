import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { AdminReviewDistributionPointDTO } from "../../responsemodel/AdminReviewDashboardDTO";

interface Props {
  data: AdminReviewDistributionPointDTO[];
}

const COLORS = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

const AdminReviewDistributionChart = ({ data }: Props) => {
  const chartData = data.map((item) => ({
    name: item.label ?? `${item.rating ?? ""} sao`,
    value: item.count,
    percentage: item.percentage ?? 0,
  }));

  return (
    <div className="card border-0 shadow-sm rounded-4 h-100">
      <div className="card-body p-4 d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start gap-3 mb-4">
          <div>
            <h5 className="fw-bold mb-1">Phân bố đánh giá</h5>
            <p className="text-muted mb-0 small">
              Cơ cấu số lượng đánh giá theo từng mức sao.
            </p>
          </div>
          <span className="badge rounded-pill text-bg-light border text-secondary">
            Rating mix
          </span>
        </div>

        <div style={{ width: "100%", height: 320 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={72}
                outerRadius={112}
                paddingAngle={4}
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [
                  new Intl.NumberFormat("vi-VN").format(Number(value ?? 0)),
                  "Số lượng",
                ]}
                contentStyle={{
                  borderRadius: "14px",
                  border: "none",
                  boxShadow: "0 12px 32px rgba(15, 23, 42, 0.12)",
                }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminReviewDistributionChart;