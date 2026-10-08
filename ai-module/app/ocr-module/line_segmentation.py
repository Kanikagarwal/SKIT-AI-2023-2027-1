import cv2
import numpy as np
from typing import List, Tuple


class LineSegmenter:
    """
    Segments handwritten text regions from preprocessed exam pages.

    The segmentation pipeline uses:
    1. Adaptive thresholding
    2. Morphological text connection
    3. Horizontal projection
    4. Bounding-box extraction

    Ruled-line removal is optional.
    """

    def __init__(
        self,
        min_line_height: int = 15,
        padding: int = 5
    ):
        self.min_line_height = min_line_height
        self.padding = padding

    # ---------------------------------------------------------
    # RULED LINE REMOVAL
    # ---------------------------------------------------------

    def remove_ruled_lines(
        self,
        gray_img: np.ndarray
    ) -> np.ndarray:
        """
        Remove long horizontal ruled-paper lines.

        This step is optional because aggressive line removal
        can sometimes affect handwriting strokes.
        """

        binary = cv2.adaptiveThreshold(
            gray_img,
            255,
            cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
            cv2.THRESH_BINARY_INV,
            31,
            15
        )

        height, width = binary.shape

        kernel_width = max(
            100,
            int(width * 0.15)
        )

        horizontal_kernel = cv2.getStructuringElement(
            cv2.MORPH_RECT,
            (kernel_width, 1)
        )

        horizontal_lines = cv2.morphologyEx(
            binary,
            cv2.MORPH_OPEN,
            horizontal_kernel
        )

        cleaned_binary = cv2.subtract(
            binary,
            horizontal_lines
        )

        cleaned_gray = cv2.bitwise_not(
            cleaned_binary
        )

        return cleaned_gray

    # ---------------------------------------------------------
    # CREATE BINARY IMAGE
    # ---------------------------------------------------------

    def create_binary(
        self,
        gray_img: np.ndarray
    ) -> np.ndarray:
        """
        Convert grayscale image into an adaptive binary image.

        Handwriting becomes foreground (white).
        Background becomes black.
        """

        binary = cv2.adaptiveThreshold(
            gray_img,
            255,
            cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
            cv2.THRESH_BINARY_INV,
            31,
            15
        )

        return binary

    # ---------------------------------------------------------
    # CONNECT TEXT
    # ---------------------------------------------------------

    def connect_text(
        self,
        binary: np.ndarray
    ) -> np.ndarray:
        """
        Connect nearby handwriting pixels horizontally.

        A small horizontal kernel is used so that characters
        belonging to nearby words/lines can be grouped.
        """

        kernel_width = max(
            20,
            int(binary.shape[1] * 0.03)
        )

        kernel = cv2.getStructuringElement(
            cv2.MORPH_RECT,
            (kernel_width, 1)
        )

        connected = cv2.morphologyEx(
            binary,
            cv2.MORPH_CLOSE,
            kernel
        )

        return connected

    # ---------------------------------------------------------
    # FIND LINE BANDS
    # ---------------------------------------------------------

    def find_line_bands(
        self,
        binary_inv: np.ndarray
    ) -> List[Tuple[int, int]]:
        """
        Detect horizontal text regions using horizontal projection.

        Rows containing enough foreground pixels are grouped
        into candidate regions.
        """

        height, width = binary_inv.shape

        # Count foreground pixels in every row.
        horizontal_projection = np.sum(
            binary_inv > 0,
            axis=1
        )

        # Use a percentage of page width as the threshold.
        threshold = max(
            5,
            int(width * 0.01)
        )

        line_regions = []

        in_line = False
        start_y = 0

        for y in range(height):

            foreground_pixels = horizontal_projection[y]

            if foreground_pixels > threshold:

                if not in_line:
                    start_y = y
                    in_line = True

            else:

                if in_line:

                    end_y = y

                    if (
                        end_y - start_y
                        >= self.min_line_height
                    ):
                        line_regions.append(
                            (start_y, end_y)
                        )

                    in_line = False

        # Handle a region reaching the bottom.
        if in_line:

            end_y = height

            if (
                end_y - start_y
                >= self.min_line_height
            ):
                line_regions.append(
                    (start_y, end_y)
                )

        return line_regions

    # ---------------------------------------------------------
    # MERGE CLOSE BANDS
    # ---------------------------------------------------------

    def merge_close_bands(
        self,
        line_regions: List[Tuple[int, int]],
        max_gap: int = 12
    ) -> List[Tuple[int, int]]:
        """
        Merge nearby horizontal regions.

        This prevents small gaps inside the same handwritten
        answer from creating unnecessary separate regions.
        """

        if not line_regions:
            return []

        sorted_regions = sorted(
            line_regions,
            key=lambda x: x[0]
        )

        merged = [
            sorted_regions[0]
        ]

        for current_start, current_end in sorted_regions[1:]:

            previous_start, previous_end = merged[-1]

            gap = current_start - previous_end

            if gap <= max_gap:

                merged[-1] = (
                    previous_start,
                    max(
                        previous_end,
                        current_end
                    )
                )

            else:

                merged.append(
                    (current_start, current_end)
                )

        return merged

    # ---------------------------------------------------------
    # CREATE BOUNDING BOXES
    # ---------------------------------------------------------

    def create_bounding_boxes(
        self,
        gray_img: np.ndarray,
        binary_inv: np.ndarray,
        line_regions: List[Tuple[int, int]]
    ) -> List[Tuple[int, int, int, int]]:
        """
        Convert horizontal regions into bounding boxes.

        Bounding box format:
            (x, y, width, height)
        """

        height, width = gray_img.shape

        bounding_boxes = []

        for start_y, end_y in line_regions:

            band = binary_inv[
                start_y:end_y,
                :
            ]

            # Vertical projection.
            vertical_projection = np.sum(
                band > 0,
                axis=0
            )

            active_columns = np.where(
                vertical_projection > 0
            )[0]

            if len(active_columns) == 0:
                continue

            x_start = int(
                active_columns[0]
            )

            x_end = int(
                active_columns[-1]
            )

            # Add padding.
            x_start = max(
                0,
                x_start - self.padding
            )

            x_end = min(
                width - 1,
                x_end + self.padding
            )

            y_start = max(
                0,
                start_y - self.padding
            )

            y_end = min(
                height - 1,
                end_y + self.padding
            )

            box_width = x_end - x_start + 1
            box_height = y_end - y_start + 1

            bounding_boxes.append(
                (
                    x_start,
                    y_start,
                    box_width,
                    box_height
                )
            )

        return bounding_boxes

    # ---------------------------------------------------------
    # COMPLETE PROCESSING PIPELINE
    # ---------------------------------------------------------

    def process(
        self,
        gray_img: np.ndarray,
        remove_lines: bool = False
    ):
        """
        Complete segmentation pipeline.

        Parameters
        ----------
        gray_img:
            Preprocessed grayscale page.

        remove_lines:
            If True, perform ruled-line removal before
            segmentation.

        Returns
        -------
        bounding_boxes:
            Detected text-region bounding boxes.

        working_image:
            Image used for segmentation.
        """

        # -----------------------------------------------------
        # Optional ruled-line removal
        # -----------------------------------------------------

        if remove_lines:

            working_image = self.remove_ruled_lines(
                gray_img
            )

        else:

            working_image = gray_img.copy()

        # -----------------------------------------------------
        # Adaptive threshold
        # -----------------------------------------------------

        binary = self.create_binary(
            working_image
        )

        # -----------------------------------------------------
        # Connect nearby handwriting
        # -----------------------------------------------------

        connected = self.connect_text(
            binary
        )

        # -----------------------------------------------------
        # Find candidate horizontal regions
        # -----------------------------------------------------

        line_regions = self.find_line_bands(
            connected
        )

        print(
            f"Before merge: "
            f"{line_regions}"
        )

        # -----------------------------------------------------
        # Merge close regions
        # -----------------------------------------------------

        merged_regions = self.merge_close_bands(
            line_regions,
            max_gap=12
        )

        print(
            f"After merge: "
            f"{merged_regions}"
        )

        # -----------------------------------------------------
        # Create bounding boxes
        # -----------------------------------------------------

        bounding_boxes = self.create_bounding_boxes(
            working_image,
            connected,
            merged_regions
        )

        print(
            f"Total lines detected: "
            f"{len(bounding_boxes)}"
        )

        return (
            bounding_boxes,
            working_image
        )

    # ---------------------------------------------------------
    # CROP REGIONS
    # ---------------------------------------------------------

    def crop_lines(
        self,
        gray_img: np.ndarray,
        bounding_boxes: List[Tuple[int, int, int, int]]
    ) -> List[np.ndarray]:
        """
        Crop detected text regions from the page.
        """

        crops = []

        for x, y, width, height in bounding_boxes:

            crop = gray_img[
                y:y + height,
                x:x + width
            ]

            if crop.size == 0:
                continue

            crops.append(
                crop
            )

        return crops

    # ---------------------------------------------------------
    # VISUAL OVERLAY
    # ---------------------------------------------------------

    def draw_visual_overlay(
        self,
        gray_img: np.ndarray,
        bounding_boxes: List[Tuple[int, int, int, int]],
        output_path: str = None
    ) -> np.ndarray:
        """
        Draw detected bounding boxes over the page.
        """

        if len(gray_img.shape) == 2:

            overlay = cv2.cvtColor(
                gray_img,
                cv2.COLOR_GRAY2BGR
            )

        else:

            overlay = gray_img.copy()

        for index, (
            x,
            y,
            width,
            height
        ) in enumerate(
            bounding_boxes,
            start=1
        ):

            cv2.rectangle(
                overlay,
                (x, y),
                (x + width, y + height),
                (0, 0, 255),
                2
            )

            cv2.putText(
                overlay,
                f"Region {index}",
                (x, max(20, y - 5)),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.5,
                (0, 0, 255),
                1,
                cv2.LINE_AA
            )

        if output_path is not None:

            cv2.imwrite(
                output_path,
                overlay
            )

        return overlay