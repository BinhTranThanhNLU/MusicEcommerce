import librosa
import numpy as np

def extract_audio_vector(file_path, n_mfcc=40):
    """
    Trích xuất vector đặc trưng âm thanh nâng cao.
    Tổng số chiều: 40 (MFCC Mean) + 40 (MFCC Std) + 12 (Chroma) = 92 chiều.
    """
    try:
        # Tải file âm thanh lên (librosa mặc định tự động chuẩn hóa tần số lấy mẫu)
        y, sr = librosa.load(file_path, sr=None)
        
        # 1. Đặc trưng Âm sắc (MFCC)
        mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=40)
        mfcc_mean = np.mean(mfcc, axis=1) # 40 số
        mfcc_std = np.std(mfcc, axis=1)   # 40 số (Bắt được sự biến thiên của giai điệu)
        
        # 2. Đặc trưng Nốt nhạc / Cao độ (Chroma)
        chroma = librosa.feature.chroma_stft(y=y, sr=sr)
        chroma_mean = np.mean(chroma, axis=1) # 12 số
        
        # 3. Nối tất cả lại thành 1 siêu vector (Super Vector)
        # 40 + 40 + 12 = 92 chiều
        audio_vector = np.concatenate((mfcc_mean, mfcc_std, chroma_mean))
        
        return audio_vector.tolist()

    except Exception as e:
        print(f"Lỗi khi xử lý librosa: {str(e)}")
        return None