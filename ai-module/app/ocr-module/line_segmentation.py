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