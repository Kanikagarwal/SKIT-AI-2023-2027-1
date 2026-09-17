from test_dataset import load_iam_dataset
from preprocessing import preprocess_image
import matplotlib.pyplot as plt


if __name__ == "__main__":
    ds = load_iam_dataset()

    sample = ds["train"][0]

    original_image = sample["image"]
    processed_image = preprocess_image(original_image)

    print("Text:", sample["text"])
    print("Original size:", original_image.size)
    print("Processed size:", processed_image.size)

    plt.figure(figsize=(12, 5))

    plt.subplot(2, 1, 1)
    plt.imshow(original_image, cmap="gray")
    plt.title("Original Image")
    plt.axis("off")

    plt.subplot(2, 1, 2)
    plt.imshow(processed_image, cmap="gray")
    plt.title("Preprocessed Image")
    plt.axis("off")

    plt.tight_layout()
    plt.show()