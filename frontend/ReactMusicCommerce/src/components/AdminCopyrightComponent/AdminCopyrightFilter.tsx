import { useEffect, useState } from "react";

interface Props {
  initialAudioId?: string;
  initialOwnerName?: string;
  onApply: (filters: { audioId?: number; ownerName?: string }) => void;
}

const AdminCopyrightFilter = ({
  initialAudioId,
  initialOwnerName,
  onApply,
}: Props) => {
  const [audioId, setAudioId] = useState(initialAudioId ?? "");
  const [ownerName, setOwnerName] = useState(initialOwnerName ?? "");

  useEffect(() => {
    setAudioId(initialAudioId ?? "");
    setOwnerName(initialOwnerName ?? "");
  }, [initialAudioId, initialOwnerName]);

  const handleApply = () => {
    const trimmedAudioId = audioId.trim();
    const trimmedOwnerName = ownerName.trim();

    onApply({
      audioId: trimmedAudioId ? Number(trimmedAudioId) : undefined,
      ownerName: trimmedOwnerName || undefined,
    });
  };

  const handleReset = () => {
    setAudioId("");
    setOwnerName("");
    onApply({});
  };

  return (
    <div className="card border-0 shadow-sm rounded-4 mb-4 p-3">
      <div className="row g-3 align-items-end">
        <div className="col-md-3">
          <label className="form-label fw-semibold small text-muted text-uppercase">
            Audio ID
          </label>
          <input
            type="number"
            className="form-control form-control-sm rounded-3"
            placeholder="Nhập ID bài hát"
            value={audioId}
            onChange={(e) => setAudioId(e.target.value)}
          />
        </div>
        <div className="col-md-5">
          <label className="form-label fw-semibold small text-muted text-uppercase">
            Chủ sở hữu
          </label>
          <input
            type="text"
            className="form-control form-control-sm rounded-3"
            placeholder="Tìm theo tên chủ sở hữu"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
          />
        </div>
        <div className="col-md-4 d-flex gap-2">
          <button type="button" className="btn btn-primary btn-sm px-4" onClick={handleApply}>
            <i className="bi bi-search me-1"></i> Tìm kiếm
          </button>
          <button type="button" className="btn btn-light btn-sm px-4" onClick={handleReset}>
            Đặt lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminCopyrightFilter;