from transformers import (
    ViTImageProcessor,
    RobertaTokenizer,
    VisionEncoderDecoderModel,
)


MODEL_NAME = "microsoft/trocr-base-handwritten"


class OCREngine:
    def __init__(self):
        print("Loading TrOCR model...")

        self.image_processor = ViTImageProcessor.from_pretrained(
            MODEL_NAME
        )

        self.tokenizer = RobertaTokenizer.from_pretrained(
            MODEL_NAME,
            use_fast=False
        )

        self.model = VisionEncoderDecoderModel.from_pretrained(
            MODEL_NAME
        )

        print("TrOCR model loaded successfully!")

    def predict(self, image):
        """
        Convert a handwritten image into text.
        """

        pixel_values = self.image_processor(
            images=image,
            return_tensors="pt"
        ).pixel_values

        generated_ids = self.model.generate(
    pixel_values,
    max_new_tokens=128
)

        predicted_text = self.tokenizer.batch_decode(
            generated_ids,
            skip_special_tokens=True
        )[0]

        return predicted_text