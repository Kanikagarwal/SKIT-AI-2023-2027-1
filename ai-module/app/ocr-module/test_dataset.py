from datasets import load_dataset

print("Loading IAM-line dataset...")

ds = load_dataset("Teklia/IAM-line")

print("\nDataset:")
print(ds)

print("\nColumns:")
print(ds["train"].column_names)

print("\nFirst sample:")
sample = ds["train"][0]

print("Text:", sample["text"])
print("Image:", sample["image"])
print("Image size:", sample["image"].size)