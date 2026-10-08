
from transformers import TrOCRProcessor, VisionEncoderDecoderModel
from PIL import Image


# --------------------------------------------------
# 1. Path to the handwritten line image
# --------------------------------------------------

IMAGE_PATH = (
    "C:/Users/Lenovo/Desktop/EvalAI/"
    "ai-module/data/outputs/debug_jpg/"
    "03_binary_original.png"
)


# --------------------------------------------------
# 2. Load TrOCR
# --------------------------------------------------

print("Loading TrOCR...")

processor = TrOCRProcessor.from_pretrained(
    "microsoft/trocr-base-handwritten"
)

model = VisionEncoderDecoderModel.from_pretrained(
    "microsoft/trocr-base-handwritten"
)

print("Model loaded.")


# --------------------------------------------------
# 3. Load handwritten image
# --------------------------------------------------

image = Image.open(
    IMAGE_PATH
).convert("RGB")

print("Image loaded.")
print("Image size:", image.size)


# --------------------------------------------------
# 4. Convert image into model input
# --------------------------------------------------

pixel_values = processor(
    images=image,
    return_tensors="pt"
).pixel_values


# --------------------------------------------------
# 5. Generate handwritten text
# --------------------------------------------------

generated_ids = model.generate(
    pixel_values,
    max_new_tokens=100
)


# --------------------------------------------------
# 6. Convert generated tokens to text
# --------------------------------------------------

text = processor.batch_decode(
    generated_ids,
    skip_special_tokens=True
)[0]


# --------------------------------------------------
# 7. Display result
# --------------------------------------------------

print("\n" + "=" * 60)
print("TrOCR RESULT")
print("=" * 60)

print(text)

print("=" * 60)


