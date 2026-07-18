from flask import Flask, request, jsonify
from transformers import AutoTokenizer, AutoModel
import torch
import os
from werkzeug.utils import secure_filename
from audio_processor import extract_audio_vector

app = Flask(__name__)

# --- CẤU HÌNH THƯ MỤC LƯU TẠM ---
UPLOAD_FOLDER = 'temp_uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Tải mô hình AI Bách Khoa (Chỉ tải 1 lần đầu tiên)
model_name = "bkai-foundation-models/vietnamese-bi-encoder"
print("Đang khởi động AI, vui lòng đợi vài phút để tải model...")
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModel.from_pretrained(model_name)
print("✅ Server AI đã sẵn sàng! Chạy tại http://localhost:5000")

# ==========================================
# 1. API Tìm kiếm ngữ nghĩa văn bản (Đã có)
# ==========================================
@app.route('/api/embed', methods=['POST'])
def generate_embedding():
    try:
        data = request.json
        text = data.get('inputs', '')
        
        if not text:
            return jsonify({"error": "Thiếu dữ liệu inputs"}), 400

        # Dịch câu chữ thành mảng Vector
        encoded_input = tokenizer(text, padding=True, truncation=True, return_tensors='pt')
        
        with torch.no_grad():
            model_output = model(**encoded_input)

        # Lấy ra Vector 768 chiều
        vector = model_output.last_hidden_state[:, 0, :].numpy()[0].tolist()

        return jsonify(vector)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ==========================================
# 2. API Trích xuất đặc trưng âm thanh
# ==========================================
@app.route('/api/extract-audio', methods=['POST'])
def extract_audio():
    if 'audio' not in request.files:
        return jsonify({"error": "Không tìm thấy field 'audio' trong request form-data"}), 400
    
    file = request.files['audio']
    if file.filename == '':
        return jsonify({"error": "File rỗng"}), 400

    # Bước 1: Lưu file nháp vào thư mục tạm để librosa đọc
    filename = secure_filename(file.filename)
    temp_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(temp_path)

    try:
        # Bước 2: Đẩy file nháp qua hàm xử lý
        audio_vector = extract_audio_vector(temp_path)
        
        if audio_vector is None:
             return jsonify({"error": "Không thể trích xuất đặc trưng từ file này"}), 500

        # Bước 3: Trả về kết quả cho Spring Boot
        return jsonify({
            "status": "success",
            "dimensions": len(audio_vector), # Luôn phải là 92
            "vector": audio_vector
        })
        
    finally:
        # Bước 4: Dọn rác - Khối finally đảm bảo file nháp LUÔN BỊ XÓA 
        # dù xử lý thành công hay bị crash sinh ra lỗi.
        if os.path.exists(temp_path):
            os.remove(temp_path)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)