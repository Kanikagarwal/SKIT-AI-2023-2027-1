import cv2
import numpy as np
from typing import List, Tuple, Optional


class LineSegmenter:
"""
Layout Analyzer & Line Segmentation Module.


Handles background notebook line removal, line boundary detection
via horizontal projection profiling, bounding box extraction, and
visual overlay generation.
"""

def __init__(self, min_line_height: int = 15, padding: int = 5):
    """
    Args:
        min_line_height: Minimum pixel height for a valid text line.
        padding: Pixel padding added around bounding boxes.
    """
    self.min_line_height = min_line_height
    self.padding = padding

def remove_ruled_lines(
    self,
    gray_img: np.ndarray,
    line_thickness_range: Tuple[int, int] = (1, 4),
    min_line_length: int = 100
) -> np.ndarray:
    """Removes horizontal background notebook lines while preserving text."""
    result = gray_img.copy()

    # 1. Detect horizontal lines using morphological opening
        horizontal_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (min_line_length, 1))
        detected_lines = cv2.morphologyEx(result, cv2.MORPH_OPEN, horizontal_kernel, iterations=2)

        # 2. Find contours and filter by thickness
        contours, _ = cv2.findContours(detected_lines, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        lines_removed = 0

        for contour in contours:
            x, y, w, h = cv2.boundingRect(contour)
            is_horizontal = w > min_line_length
            is_thin = line_thickness_range[0] <= h <= line_thickness_range[1]

            if is_horizontal and is_thin:
                cv2.rectangle(result, (x, y), (x + w, y + h), (255, 255, 255), -1)
                lines_removed += 1

        print(f"   ✅ Removed {lines_removed} ruled lines")
        return result