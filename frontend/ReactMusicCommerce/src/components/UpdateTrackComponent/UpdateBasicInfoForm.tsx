import React from "react";
import type { UpdateAudioTrackRequest } from "../../../requestmodel/UpdateAudioTrackRequest";

interface Props {
  form: UpdateAudioTrackRequest;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
}

const UpdateBasicInfoForm: React.FC<Props> = ({ form, handleChange }) => {
  return (
    <div className="card border-0 shadow-sm rounded-4 mb-4 artist-focus-card">
      <div className="card-body p-4">
        <h5 className="fw-bold mb-4">Thông tin cơ bản</h5>
        <div className="mb-3">
          <label className="form-label fw-medium">Tên tác phẩm</label>
          <input
            className="form-control"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Nhập tên tác phẩm"
          />
        </div>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label fw-medium">Loại âm thanh</label>
            <input
              className="form-control"
              name="audioType"
              value={form.audioType}
              onChange={handleChange}
              placeholder="Ví dụ: WAV, MP3"
            />
          </div>
          <div className="col-md-3">
            <label className="form-label fw-medium">Thời lượng (giây)</label>
            <input
              className="form-control"
              name="duration"
              type="number"
              min="0"
              value={form.duration ?? ""}
              onChange={handleChange}
              placeholder="240"
            />
          </div>
          <div className="col-md-3">
            <label className="form-label fw-medium">Trạng thái</label>
            <select
              className="form-select"
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Revision">Revision</option>
            </select>
          </div>
        </div>
        <div className="mt-3">
          <label className="form-label fw-medium">Mô tả</label>
          <textarea
            className="form-control"
            name="description"
            rows={4}
            value={form.description}
            onChange={handleChange}
            placeholder="Nhập mô tả tác phẩm"
          />
        </div>
        <div className="mt-3">
          <label className="form-label fw-medium">Lời bài hát</label>
          <textarea
            className="form-control"
            name="lyrics"
            rows={6}
            value={form.lyrics}
            onChange={handleChange}
            placeholder="Nhập lời bài hát"
          />
        </div>
      </div>
    </div>
  );
};

export default UpdateBasicInfoForm;
