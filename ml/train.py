import os
import warnings
import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score, classification_report, f1_score
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler

# Ignore warning dari sklearn biar output terminal lebih bersih
warnings.filterwarnings("ignore")

# --- Konfigurasi ---
FEATURES = ["jumlah_penjualan", "harga", "diskon"]
TARGET = "status"
MODEL_DIR = "model"


def eda_singkat(df):
    """Cek data sekilas sebelum ditraining"""
    print("--- Cek Data ---")
    print("Missing values:\n", df.isnull().sum())
    print("\nStatistik Data:\n", df.describe().round(2))
    print("\nDistribusi Target:\n", df[TARGET].value_counts())


def siapkan_data(df):
    # Drop baris yang kosong kalau ada
    df = df.dropna(subset=FEATURES + [TARGET]).reset_index(drop=True)

    # Ubah target (Laris/Tidak) jadi angka 0 dan 1
    le = LabelEncoder()
    y = le.fit_transform(df[TARGET])

    X = df[FEATURES].values

    # Split data 80% train, 20% test (pake stratify biar rasio kelas seimbang)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # Pakai scaler karena algoritma seperti Logistic Regression butuh fitur yang distandarisasi
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    return X_train_scaled, X_test_scaled, y_train, y_test, scaler, le


def train_dan_evaluasi(X_train, X_test, y_train, y_test, le_classes):
    # Inisialisasi 3 model yang mau dicoba
    models = {
        "Logistic Regression": LogisticRegression(random_state=42, max_iter=1000),
        "Decision Tree": DecisionTreeClassifier(random_state=42, max_depth=8),
        "Random Forest": RandomForestClassifier(n_estimators=100, random_state=42)
    }

    best_model = None
    best_f1 = 0
    best_name = ""

    print("\n--- Hasil Training Model ---")
    for name, model in models.items():
        # Fit model
        model.fit(X_train, y_train)
        
        # Prediksi ke data test
        y_pred = model.predict(X_test)

        # Hitung metrik
        acc = accuracy_score(y_test, y_pred)
        f1 = f1_score(y_test, y_pred, average="weighted")

        print(f"\n[{name}]")
        print(f"Accuracy: {acc:.4f} | F1-Score: {f1:.4f}")
        
        # Cek apakah ini model terbaik sejauh ini berdasarkan F1-Score
        if f1 > best_f1:
            best_f1 = f1
            best_model = model
            best_name = name

    print(f"\n=> Model terbaik yang dipilih: {best_name} (F1: {best_f1:.4f})")
    return best_model


if __name__ == "__main__":
    file_path = "../data/sales_data.csv"
    
    try:
        print("Load dataset...")
        df = pd.read_csv(file_path)
        
        eda_singkat(df)
        
        print("\nMulai preprocessing data...")
        X_train, X_test, y_train, y_test, scaler, le = siapkan_data(df)
        
        # Train dan cari model terbaik
        best_model = train_dan_evaluasi(X_train, X_test, y_train, y_test, le.classes_)
        
        # Save model dan objek preprocessing-nya
        print("\nMenyimpan model ke folder 'model/'...")
        os.makedirs(MODEL_DIR, exist_ok=True)
        
        joblib.dump(best_model, os.path.join(MODEL_DIR, "best_model.joblib"))
        joblib.dump(scaler, os.path.join(MODEL_DIR, "scaler.joblib"))
        joblib.dump(le, os.path.join(MODEL_DIR, "label_encoder.joblib"))
        
        print("Selesai! Pipeline training sukses dieksekusi.")

    except FileNotFoundError:
        print(f"Error: File {file_path} tidak ditemukan. Cek lagi lokasinya.")