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