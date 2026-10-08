import os
import cv2
import fitz

from preprocessing import ImagePreprocessor
from line_segmentation import LineSegmenter


# ---------------------------------------------------------
# PATHS
# ---------------------------------------------------------

PDF_DIR = (
    "C:/Users/Lenovo/Desktop/EvalAI/"
    "ai-module/data"
)

OUTPUT_DIR = (
    "C:/Users/Lenovo/Desktop/EvalAI/"
    "ai-module/data/outputs/exam_test"
)


# ---------------------------------------------------------
# MAIN
# ---------------------------------------------------------

def main():

    print("=" * 70)
    print("EXAM PDF → PREPROCESSING → TEXT REGION SEGMENTATION")
    print("=" * 70)

    os.makedirs(
        OUTPUT_DIR,
        exist_ok=True
    )

    # -----------------------------------------------------
    # Find all PDFs inside data/
    # -----------------------------------------------------

    pdf_files = sorted(
        [
            file_name
            for file_name in os.listdir(PDF_DIR)
            if file_name.lower().endswith(".pdf")
        ]
    )

    if not pdf_files:

        print("\nNo PDF files found.")
        print(
            f"Checked: {PDF_DIR}"
        )

        return

    print(
        f"\nFound {len(pdf_files)} PDF(s)."
    )

    # -----------------------------------------------------
    # EXISTING PREPROCESSING
    # -----------------------------------------------------

    preprocessor = ImagePreprocessor(
        target_width=1200,
        enable_deskew=True
    )

    # -----------------------------------------------------
    # MORPHOLOGY-BASED SEGMENTATION
    # -----------------------------------------------------

    segmenter = LineSegmenter(
        min_line_height=15,
        padding=5
    )

    total_pages = 0
    total_regions = 0

    # -----------------------------------------------------
    # PROCESS EVERY PDF
    # -----------------------------------------------------

    for pdf_number, pdf_name in enumerate(
        pdf_files,
        start=1
    ):

        pdf_path = os.path.join(
            PDF_DIR,
            pdf_name
        )

        student_name = os.path.splitext(
            pdf_name
        )[0]

        student_output_dir = os.path.join(
            OUTPUT_DIR,
            student_name
        )

        os.makedirs(
            student_output_dir,
            exist_ok=True
        )

        print("\n" + "=" * 70)

        print(
            f"[{pdf_number}/{len(pdf_files)}] "
            f"{pdf_name}"
        )

        print("=" * 70)

        # -------------------------------------------------
        # OPEN PDF
        # -------------------------------------------------

        doc = fitz.open(
            pdf_path
        )

        print(
            f"Pages: {len(doc)}"
        )

        # -------------------------------------------------
        # PROCESS EVERY PAGE
        # -------------------------------------------------

        for page_index in range(
            len(doc)
        ):

            page_number = page_index + 1

            print(
                f"\n  → Processing page "
                f"{page_number}"
            )

            page = doc[page_index]

            # ---------------------------------------------
            # PDF PAGE → GRAYSCALE IMAGE
            # ---------------------------------------------

            pix = page.get_pixmap(
                dpi=300,
                colorspace=fitz.csGRAY
            )

            page_image_path = os.path.join(
                student_output_dir,
                f"page_{page_number:02d}.png"
            )

            pix.save(
                page_image_path
            )

            # ---------------------------------------------
            # PREPROCESSING
            # ---------------------------------------------

            cleaned_page = preprocessor.process(
                [page_image_path],
                handwriting_mode=True
            )

            preprocessed_path = os.path.join(
                student_output_dir,
                (
                    f"page_{page_number:02d}_"
                    f"preprocessed.png"
                )
            )

            cv2.imwrite(
                preprocessed_path,
                cleaned_page
            )

            # ---------------------------------------------
            # LINE / TEXT REGION SEGMENTATION
            #
            # Ruled-line removal is disabled.
            # ---------------------------------------------

            bboxes, segmented_page = segmenter.process(
                cleaned_page,
                remove_lines=False
            )

            print(
                f"     Detected "
                f"{len(bboxes)} text region(s)"
            )

            # ---------------------------------------------
            # SEGMENTATION OVERLAY
            # ---------------------------------------------

            overlay_path = os.path.join(
                student_output_dir,
                (
                    f"page_{page_number:02d}_"
                    f"overlay.png"
                )
            )

            segmenter.draw_visual_overlay(
                segmented_page,
                bboxes,
                output_path=overlay_path
            )

            # ---------------------------------------------
            # TEXT REGION CROPS
            # ---------------------------------------------

            region_crops = segmenter.crop_lines(
                segmented_page,
                bboxes
            )

            for region_number, crop in enumerate(
                region_crops,
                start=1
            ):

                crop_path = os.path.join(
                    student_output_dir,
                    (
                        f"page_{page_number:02d}_"
                        f"region_{region_number:02d}.png"
                    )
                )

                cv2.imwrite(
                    crop_path,
                    crop
                )

            total_pages += 1
            total_regions += len(
                region_crops
            )

        doc.close()

    # -----------------------------------------------------
    # SUMMARY
    # -----------------------------------------------------

    print("\n" + "=" * 70)
    print("PROCESSING COMPLETED")
    print("=" * 70)

    print(
        f"PDFs processed  : "
        f"{len(pdf_files)}"
    )

    print(
        f"Pages processed : "
        f"{total_pages}"
    )

    print(
        f"Regions detected: "
        f"{total_regions}"
    )

    print("\nResults:")
    print(
        OUTPUT_DIR
    )


if __name__ == "__main__":
    main()