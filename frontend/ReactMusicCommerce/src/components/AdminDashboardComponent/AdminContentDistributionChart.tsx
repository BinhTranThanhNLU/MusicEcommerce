import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { AdminContentDistributionDTO } from "../../responsemodel/AdminDashboardOverviewDTO";

interface Props {
  data: AdminContentDistributionDTO[];
}

const COLORS = ["#2563eb", "#10b981", "#f97316", "#8b5cf6", "#ef4444", "#14b8a6"];

const AdminContentDistributionChart = ({ data }: Props) => {
  return (
    <div className="card border-0 shadow-sm rounded-4 h-100 admin-chart-card">
      <div className="card-body p-4 d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start gap-3 mb-4">
          <div>
            <h5 className="fw-bold mb-1">Phân bổ nội dung</h5>
            <p className="text-muted mb-0 small">
              Tỷ lệ giữa các cấp độ sản phẩm đang có trên hệ thống.
            </p>
          </div>
          <span className="badge rounded-pill text-bg-light border text-secondary">
            Content mix
          </span>
        </div>

        <div style={{ width: "100%", height: 320 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="contentType"
                cx="50%"
                cy="50%"
                innerRadius={72}
                outerRadius={112}
                paddingAngle={4}
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`${entry.contentType}-${index}`} fill={COLORS[index % COLORS.length]} />
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

export default AdminContentDistributionChart;