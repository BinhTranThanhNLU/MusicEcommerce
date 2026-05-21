from flask import Flask, request, jsonify
from transformers import AutoTokenizer, AutoModel
import torch

app = Flask(__name__)

# Tải mô hình AI Bách Khoa (Chỉ tải 1 lần đầu tiên)
model_name = "bkai-foundation-models/vietnamese-bi-encoder"
print("Đang khởi động AI, vui lòng đợi vài phút để tải model...")

tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModel.from_pretrained(model_name)

print("✅ Server AI đã sẵn sàng! Chạy tại http://localhost:5000")

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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)