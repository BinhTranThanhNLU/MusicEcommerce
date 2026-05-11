import React from "react";

interface Props {
  formData: any;
  handleFormChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  errors: { [key: string]: string };
}

const BasicInfoForm: React.FC<Props> = ({
  formData,
  handleFormChange,
  errors,
}) => {
  const getMinutes = (totalSeconds: number) =>
    Math.floor((totalSeconds || 0) / 60);
  const getSeconds = (totalSeconds: number) => (totalSeconds || 0) % 60;

  return (
    <div className="card border-0 shadow-sm rounded-4 mb-4">
      <div className="card-body p-4">
        <h5 className="fw-bold mb-4">Thông tin Tác phẩm</h5>

        <div className="mb-3">
          <label className="form-label fw-medium">
            Tên bài hát <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleFormChange}
            className={`form-control ${errors.title ? "is-invalid" : ""}`}
            placeholder="Nhập tên bài hát..."
          />
          {errors.title && (
            <div className="invalid-feedback d-block">
              <i className="bi bi-exclamation-circle me-1"></i>
              {errors.title}
            </div>
          )}
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label fw-medium">
              Định dạng âm thanh <span className="text-danger">*</span>
            </label>
            <select
              name="audioType"
              value={formData.audioType}
              onChange={handleFormChange}
              className="form-select"
            >
              <option value="Full-song">Full-song</option>
              <option value="Instrumental">Instrumental</option>
              <option value="Short-audio">Short-audio</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label fw-medium">
              Thời lượng (giây) <span className="text-danger">*</span>
            </label>
            <div className="d-flex align-items-center gap-2">
              <div className="input-group">
                <input
                  type="number"
                  className={`form-control ${errors.duration ? "is-invalid" : ""}`}
                  placeholder="00"
                  min="0"
                  value={getMinutes(formData.duration) || ""}
                  onChange={(e) => {
                    const m = parseInt(e.target.value) || 0;
                    const s = getSeconds(formData.duration);
                    // Tự động gom thành tổng số giây ném vào hàm chung
                    handleFormChange({
                      target: {
                        name: "duration",
                        value: (m * 60 + s).toString(),
                      },
                    } as any);
                  }}
                />
                <span className="input-group-text bg-light text-muted">
                  phút
                </span>
              </div>

              <span className="fw-bold">:</span>

              <div className="input-group">
                <input
                  type="number"
                  className={`form-control ${errors.duration ? "is-invalid" : ""}`}
                  placeholder="00"
                  min="0"
                  max="59"
                  value={getSeconds(formData.duration) || ""}
                  onChange={(e) => {
                    let s = parseInt(e.target.value) || 0;
                    if (s > 59) s = 59; // Chặn không cho nhập quá 59 giây
                    const m = getMinutes(formData.duration);

                    handleFormChange({
                      target: {
                        name: "duration",
                        value: (m * 60 + s).toString(),
                      },
                    } as any);
                  }}
                />
                <span className="input-group-text bg-light text-muted">
                  giây
                </span>
              </div>
            </div>

            {errors.duration && (
              <div className="invalid-feedback d-block">
                <i className="bi bi-exclamation-circle me-1"></i>
                {errors.duration}
              </div>
            )}
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label fw-medium">
              Nghệ sĩ thể hiện <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              name="authorName"
              value={formData.authorName}
              onChange={handleFormChange}
              className={`form-control ${errors.authorName ? "is-invalid" : ""}`}
              placeholder="Tên tác giả/nghệ sĩ..."
            />
            {errors.authorName && (
              <div className="invalid-feedback d-block">
                <i className="bi bi-exclamation-circle me-1"></i>
                {errors.authorName}
              </div>
            )}
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label fw-medium">Mô tả</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleFormChange}
            className="form-control"
            rows={3}
            placeholder="Mô tả chi tiết về bài hát..."
          ></textarea>
        </div>

        <div className="mb-3">
          <label className="form-label fw-medium">Lời bài hát (Lyrics)</label>
          <textarea
            name="lyrics"
            value={formData.lyrics}
            onChange={handleFormChange}
            className="form-control"
            rows={4}
            placeholder="Nhập lời bài hát để hỗ trợ người dùng tìm kiếm theo lời..."
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoForm;
