from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np
from sklearn.preprocessing import MinMaxScaler

app = FastAPI(title="Golf Draw ML Service")

class ScoresRequest(BaseModel):
    scores: list[int]  # All user scores from DB

@app.post("/predict")
def predict_draw(data: ScoresRequest):
    scores = data.scores
    
    # 1️⃣ Count frequency of each number 1-45
    counts = np.zeros(45)
    for s in scores:
        if 1 <= s <= 45:
            counts[s-1] += 1
    
    # 2️⃣ Convert counts to probabilities (weighted)
    scaler = MinMaxScaler()
    weights = scaler.fit_transform(counts.reshape(-1,1)).flatten()
    
    # 3️⃣ Add small uniform noise to allow variety
    weights = weights + 0.05
    weights = weights / weights.sum()  # normalize
    
    # 4️⃣ Draw 5 numbers using weighted probabilities
    draw_numbers = np.random.choice(np.arange(1,46), size=5, replace=False, p=weights)
    
    return {
        "draw_numbers": draw_numbers.tolist(),
        "weights": weights.tolist()
    }