import os
import json
from PIL import Image
import torch
from torchvision import transforms
import timm
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
import uvicorn

# FastAPI instance
app = FastAPI()

# Model and classes
MODEL_PATH = os.path.join(os.path.dirname(__file__), "vit_skin_type_224.pth")
class_names = ['combination', 'dry', 'normal', 'oily', 'sensitive']

# Device
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# Load model
model = timm.create_model('vit_base_patch16_224', pretrained=False, num_classes=len(class_names))
model.load_state_dict(torch.load(MODEL_PATH, map_location=device))
model.to(device)
model.eval()

# Transform
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=(0.5, 0.5, 0.5), std=(0.5, 0.5, 0.5))
])


@app.post("/predict")
async def predict_skin_type(file: UploadFile = File(...)):
    try:
        # Load image
        image = Image.open(file.file).convert('RGB')
        input_tensor = transform(image).unsqueeze(0).to(device)

        # Predict
        with torch.no_grad():
            outputs = model(input_tensor)
            probabilities = torch.nn.functional.softmax(outputs[0], dim=0)
        
        # Find the class with the highest probability
        max_idx = torch.argmax(probabilities).item()
        predicted_class = class_names[max_idx]
        max_percentage = float(probabilities[max_idx] * 100)

        # Keep the JSON format exactly the same as original
        return JSONResponse(content={
            "predicted_class": predicted_class,
            "percentages": max_percentage
        })

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)


if __name__ == "__main__":
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
