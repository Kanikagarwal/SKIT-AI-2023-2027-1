from datasets import load_dataset


def load_iam_dataset():
   
    dataset = load_dataset("Teklia/IAM-line")

    return dataset


if __name__ == "__main__":
    ds = load_iam_dataset()

    print("Dataset loaded successfully!")
    print(ds)

    print("\nTrain samples:", len(ds["train"]))
    print("Validation samples:", len(ds["validation"]))
    print("Test samples:", len(ds["test"]))

    sample = ds["train"][0]

    print("\nSample:")
    print("Text:", sample["text"])
    print("Image size:", sample["image"].size)