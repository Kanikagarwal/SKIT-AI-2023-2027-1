import cv2
import numpy as np
from typing import List, Union


class ImagePreprocessor:
    """
    Preprocesses handwritten exam photos for line segmentation and OCR.
    Preserves fine handwriting strokes while reducing background noise.
    """

    def __init__(
        self,
        target_width: int = 1200,
        enable_deskew: bool = True
    ):
        self.target_width = target_width
        self.enable_deskew = enable_deskew

    def resize_aspect_ratio(self, img: np.ndarray) -> np.ndarray:
        """Resize image to target width while preserving aspect ratio."""

        h, w = img.shape[:2]

        if w == self.target_width:
            return img

        scaling_factor = self.target_width / float(w)
        new_h = int(h * scaling_factor)

        return cv2.resize(
            img,
            (self.target_width, new_h),
            interpolation=cv2.INTER_AREA
        )

    def deskew(self, gray_img: np.ndarray) -> np.ndarray:
        """Straighten slightly tilted pages."""

        coords = np.column_stack(
            np.where(gray_img < 200)
        )

        if len(coords) == 0:
            return gray_img

        angle = cv2.minAreaRect(coords)[-1]

        if angle < -45:
            angle = -(90 + angle)
        else:
            angle = -angle

        # Ignore very small or suspiciously large angles
        if abs(angle) < 0.5 or abs(angle) > 15.0:
            return gray_img

        h, w = gray_img.shape[:2]
        center = (w // 2, h // 2)

        M = cv2.getRotationMatrix2D(
            center,
            angle,
            1.0
        )

        return cv2.warpAffine(
            gray_img,
            M,
            (w, h),
            flags=cv2.INTER_CUBIC,
            borderMode=cv2.BORDER_REPLICATE
        )

    def process_single_image(
        self,
        img_input: Union[str, np.ndarray]
    ) -> np.ndarray:
        """Run preprocessing on a single image."""

        # 1. Load image
        if isinstance(img_input, str):

            img = cv2.imread(
                img_input,
                cv2.IMREAD_GRAYSCALE
            )

            if img is None:
                raise FileNotFoundError(
                    f"Could not load image at path: {img_input}"
                )

        else:

            if len(img_input.shape) == 3:
                img = cv2.cvtColor(
                    img_input,
                    cv2.COLOR_BGR2GRAY
                )
            else:
                img = img_input.copy()

        # 2. Resize
        resized = self.resize_aspect_ratio(img)

        # 3. Deskew
        if self.enable_deskew:
            deskewed = self.deskew(resized)
        else:
            deskewed = resized

        # 4. Gentle local contrast enhancement
        clahe = cv2.createCLAHE(
            clipLimit=1.5,
            tileGridSize=(8, 8)
        )

        enhanced = clahe.apply(deskewed)

        # 5. Gentle noise reduction
        denoised = cv2.bilateralFilter(
            enhanced,
            d=5,
            sigmaColor=50,
            sigmaSpace=50
        )

        return denoised

    def process(
        self,
        image_inputs: List[Union[str, np.ndarray]],
        handwriting_mode: bool = True
    ) -> np.ndarray:
        """Main preprocessing interface."""

        return self.process_single_image(image_inputs[0])