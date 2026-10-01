from pathlib import Path
from typing import List, Union
import cv2
import numpy as np


class ImagePreprocessor:
    """Preprocessor for handwritten exam images."""

    def __init__(self, target_width: int = 1200, enable_deskew: bool = True) -> None:
        """Initialize the preprocessor.

        Args:
            target_width: Target width for resizing images.
            enable_deskew: Whether to apply deskewing.
        """
        self.target_width = target_width
        self.enable_deskew = enable_deskew

    def load_images(self, image_paths: List[Union[str, Path]]) -> List[np.ndarray]:
        """Load images from file paths.

        Args:
            image_paths: List of file paths to load.

        Returns:
            List of loaded images as NumPy arrays (BGR format).

        Raises:
            ValueError: If any image fails to load or does not exist.
        """
        images: List[np.ndarray] = []
        for path in image_paths:
           
            path_str = str(Path(path))
            img = cv2.imread(path_str)
            if img is None:
                raise ValueError(f"Failed to load image: {path}")
            images.append(img)
        return images

    def resize_image(self, image: np.ndarray) -> np.ndarray:
        """Resize image to target width while maintaining aspect ratio.

        Args:
            image: Input image as a NumPy array.

        Returns:
            Resized image as a NumPy array.
        """
        h, w = image.shape[:2]
        if w != self.target_width:
            ratio = self.target_width / float(w)
            new_h = int(h * ratio)
            image = cv2.resize(
                image, (self.target_width, new_h), interpolation=cv2.INTER_CUBIC
            )
        return image

    def deskew(self, image: np.ndarray) -> np.ndarray:
        """Deskew image using minimum area bounding box on foreground text pixels.

        Args:
            image: Input image (grayscale or BGR).

        Returns:
            Deskewed image aligned straight.
        """
        # 1. Convert to grayscale if image is in color (BGR)
        if len(image.shape) == 3:
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        else:
            gray = image.copy()

        # 2. Binarize image to separate ink pixels from paper background
        _, binary = cv2.threshold(
            gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU
        )

        # 3. Get pixel coordinates of all foreground text (white pixels)
        coords = np.column_stack(np.where(binary > 0))

        if len(coords) == 0:
            return image

        # 4. Calculate tilt angle using a minimum area bounding rectangle
        angle = cv2.minAreaRect(coords)[-1]

        # Normalize the rotation angle
        if angle < -45:
            angle = -(90 + angle)
        else:
            angle = -angle

        # 5. Rotate image to straighten text if tilt is greater than 0.5 degrees
        if abs(angle) > 0.5:
            h, w = image.shape[:2]
            center = (w // 2, h // 2)
            M = cv2.getRotationMatrix2D(center, angle, 1.0)
            image = cv2.warpAffine(
                image,
                M,
                (w, h),
                flags=cv2.INTER_CUBIC,
                borderMode=cv2.BORDER_REPLICATE,
            )

        return image