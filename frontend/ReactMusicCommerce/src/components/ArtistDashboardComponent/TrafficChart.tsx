import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const data = [
  { day: "T2", streams: 400, views: 240 },
  { day: "T3", streams: 300, views: 139 },
  { day: "T4", streams: 550, views: 380 },
  { day: "T5", streams: 450, views: 290 },
  { day: "T6", streams: 700, views: 480 },
  { day: "T7", streams: 850, views: 600 },
  { day: "CN", streams: 900, views: 650 },
];

const TrafficChart = () => {
  return (
    <div className="card border-0 shadow-sm rounded-4 h-100 p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold mb-0">Lưu lượng truy cập & Lượt nghe</h5>
        <select className="form-select w-auto form-select-sm border-0 bg-light fw-medium">
          <option>7 ngày qua</option>
          <option>30 ngày qua</option>
        </select>
      </div>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorStreams" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0d6efd" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#0d6efd" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0dcaf0" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#0dcaf0" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6c757d" }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6c757d" }} />
            <Tooltip contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }} />
            <Legend verticalAlign="top" height={36} iconType="circle" />
            <Area type="monotone" dataKey="streams" name="Lượt nghe" stroke="#0d6efd" fillOpacity={1} fill="url(#colorStreams)" />
            <Area type="monotone" dataKey="views" name="Lượt xem hồ sơ" stroke="#0dcaf0" fillOpacity={1} fill="url(#colorViews)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrafficChart;