import sys
import json
from PIL import Image
import torch
from torchvision import transforms
import timm
import os 

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

# Load image from argument
image_path = sys.argv[1]
image = Image.open(image_path).convert('RGB')
input_tensor = transform(image).unsqueeze(0).to(device)

# Predict
with torch.no_grad():
    outputs = model(input_tensor)
    probabilities = torch.nn.functional.softmax(outputs[0], dim=0)
    
# Find the class with the highest probability
max_idx = torch.argmax(probabilities).item()
predicted_class = class_names[max_idx]
max_percentage = float(probabilities[max_idx] * 100)

# Prepare JSON with single float for percentage
print(json.dumps({
    "predicted_class": predicted_class,
    "percentages": max_percentage
}))