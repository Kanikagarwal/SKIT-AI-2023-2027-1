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

    def enhance_handwriting(self, image: np.ndarray) -> np.ndarray:
        """Enhance image contrast and stroke sharpness specifically for handwriting OCR.

        Uses CLAHE, bilateral filtering, morphological closing, and unsharp masking.

        Args:
            image: Input image (grayscale or BGR NumPy array).

        Returns:
            Enhanced grayscale image optimized for handwriting recognition.
        """
        # 1. Convert to grayscale if image is in color (BGR)
        if len(image.shape) == 3:
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        else:
            gray = image.copy()

        # 2. Apply CLAHE for local contrast enhancement on faint pen strokes
        clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
        enhanced = clahe.apply(gray)

        # 3. Apply bilateral filtering to reduce noise while preserving sharp edges
        filtered = cv2.bilateralFilter(
            enhanced, d=9, sigmaColor=75, sigmaSpace=75
        )

        # 4. Perform morphological closing to reconnect broken/faint pen strokes
        kernel_close = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2, 2))
        closed = cv2.morphologyEx(filtered, cv2.MORPH_CLOSE, kernel_close)

        # 5. Apply 3x3 unsharp mask kernel to sharpen character boundaries
        kernel = np.array([
            [-1, -1, -1],
            [-1, 11, -1],  # High center weight (11) for strong edge definition
            [-1, -1, -1],
        ])
        sharpened = cv2.filter2D(closed, -1, kernel)

        return sharpened

    def binarize(self, image: np.ndarray, for_handwriting: bool = True) -> np.ndarray:
        """Apply adaptive Gaussian thresholding to separate text from background.

        Args:
            image: Input image (grayscale or BGR NumPy array).
            for_handwriting: If True, uses a larger neighborhood block size (15)
                and higher constant offset (C=10) optimized for handwriting.

        Returns:
            Binarized black-and-white image as a NumPy array.
        """
        # 1. Convert to grayscale if image is in color (BGR)
        if len(image.shape) == 3:
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        else:
            gray = image.copy()

        # 2. Apply adaptive Gaussian binarization based on text type
        if for_handwriting:
            # Larger neighborhood context (blockSize=15) and threshold offset (C=10)
            binary = cv2.adaptiveThreshold(
                gray,
                255,
                cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                cv2.THRESH_BINARY,
                blockSize=15,
                C=10,
            )
        else:
            # Standard parameters (blockSize=11, C=2) for uniform printed text
            binary = cv2.adaptiveThreshold(
                gray,
                255,
                cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                cv2.THRESH_BINARY,
                11,
                2,
            )

        return binary

    def denoise(self, image: np.ndarray, preserve_detail: bool = True) -> np.ndarray:
        """Remove image noise while optionally preserving fine handwriting details.

        Args:
            image: Input image as a NumPy array.
            preserve_detail: If True, uses Non-Local Means denoising for handwriting.
                If False, applies median blur and morphological opening for typed text.

        Returns:
            Denoised image as a NumPy array.
        """
        if preserve_detail:
            # Gentle Non-Local Means denoising - preserves thin pen stroke details
            denoised = cv2.fastNlMeansDenoising(
                image, None, h=10, templateWindowSize=7, searchWindowSize=21
            )
            return denoised

        # Aggressive denoising for typed/printed text (median blur + opening)
        denoised = cv2.medianBlur(image, 3)
        kernel = np.ones((2, 2), np.uint8)
        denoised = cv2.morphologyEx(denoised, cv2.MORPH_OPEN, kernel)
        return denoised

    def stitch_images(self, images: List[np.ndarray]) -> np.ndarray:
        """Vertically stitch multiple page images into one continuous image stream.

        Args:
            images: List of page images as NumPy arrays.

        Returns:
            Single vertically concatenated NumPy array image.

        Raises:
            ValueError: If the input images list is empty.
        """
        if len(images) == 0:
            raise ValueError("No images to stitch")

        if len(images) == 1:
            return images[0]

        # 1. Standardize all page widths to match the first image's width
        target_width = images[0].shape[1]
        resized_images: List[np.ndarray] = []

        for img in images:
            if img.shape[1] != target_width:
                h, w = img.shape[:2]
                ratio = target_width / float(w)
                new_h = int(h * ratio)
                img = cv2.resize(img, (target_width, new_h))
            resized_images.append(img)

        # 2. Vertically stack (concatenate) all pages into a single image
        stitched = np.vstack(resized_images)

        return stitched

    def process(
        self,
        image_paths: List[Union[str, Path]],
        handwriting_mode: bool = True,
        return_intermediate: bool = False,
    ) -> Union[np.ndarray, Tuple[np.ndarray, Dict[str, Any]]]:
        """Execute the complete end-to-end image preprocessing pipeline.

        Args:
            image_paths: List of file paths to input page images.
            handwriting_mode: If True, applies CLAHE, morphological closing,
                and detail-preserving denoising for handwriting.
            return_intermediate: If True, returns a tuple of (final_image,
                intermediate_dict) for visual debugging.

        Returns:
            Preprocessed image as a NumPy array, or (final_image, intermediate_dict)
            if return_intermediate is True.
        """
        # 1. Load images from file paths
        images = self.load_images(image_paths)

        intermediate = {} if return_intermediate else None

        # 2. Resize each image to target width while preserving aspect ratio
        resized = [self.resize_image(img) for img in images]
        if return_intermediate:
            intermediate['resized'] = resized.copy()

        # 3. Deskew each image to straighten page tilt angle
        if self.enable_deskew:
            deskewed = [self.deskew(img) for img in resized]
            if return_intermediate:
                intermediate['deskewed'] = deskewed.copy()
        else:
            deskewed = resized

        # 4. Vertically stitch multi-page images into one continuous scroll
        stitched = self.stitch_images(deskewed)
        if return_intermediate:
            intermediate['stitched'] = stitched.copy()

        # 5. Convert stitched image to grayscale
        if len(stitched.shape) == 3:
            gray = cv2.cvtColor(stitched, cv2.COLOR_BGR2GRAY)
        else:
            gray = stitched

        # 6. Apply handwriting contrast enhancement and denoising
        if handwriting_mode:
            enhanced = self.enhance_handwriting(gray)
            if return_intermediate:
                intermediate['enhanced'] = enhanced.copy()

            # Gentle Non-Local Means denoising to preserve thin pen strokes
            denoised = self.denoise(enhanced, preserve_detail=True)
        else:
            # Standard aggressive median blur denoising for typed text
            denoised = self.denoise(gray, preserve_detail=False)

        if return_intermediate:
            intermediate['denoised'] = denoised.copy()

        # 7. Output selection
        # Returns enhanced grayscale image (TrOCR handles binarization internally)
        final = denoised

        if return_intermediate:
            return final, intermediate
        return final