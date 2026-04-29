from repository.sales_repo import SalesRepository
from typing import List, Optional
from pathlib import Path

import os, joblib

class SalesService:
    def __init__(self, repo: SalesRepository):
        self.repo = repo

        self.base_path = Path(__file__).resolve().parent.parent

        self.model_path = os.path.join(self.base_path.parent, "ml", "model", "best_model.joblib")
        self.scaler_path = os.path.join(self.base_path.parent, "ml", "model", "scaler.joblib")
        self.encoder_path = os.path.join(self.base_path.parent, "ml", "model", "label_encoder.joblib")

        self.model = None
        self.scaler = None
        self.label_encoder = None
        
        self._load_artifacts()

    def checkSeedIsValid(self):
        data = self.repo.get_all()
        if data:
            return False
        return True

    def get_all_sales(self):
        return self.repo.get_all()

    def _load_artifacts(self):
        print(self.model_path)
        print(self.scaler_path)
        print(self.encoder_path)

        if (os.path.exists(self.model_path) and 
            os.path.exists(self.scaler_path) and 
            os.path.exists(self.encoder_path)):
            
           
            self.model = joblib.load(self.model_path)
            self.scaler = joblib.load(self.scaler_path)
            self.label_encoder = joblib.load(self.encoder_path)
            print(" Service ML: Model successfully loaded into memory.")
        else:
            print("Service ML: Failed to load model. .joblib file not found.")      

    def is_model_ready(self) -> bool:
        return self.model is not None

    def prediksi(self, jumlah_penjualan: int, harga: int, diskon: int) -> str:
        if not self.is_model_ready():
            raise RuntimeError("Model ML belum diload atau tidak tersedia.")
        
        data = [[jumlah_penjualan, harga, diskon]]
        
        data_scaled = self.scaler.transform(data)
        
        prediksi_angka = self.model.predict(data_scaled)
        
        hasil_teks = self.label_encoder.inverse_transform(prediksi_angka)[0]

        return hasil_teks