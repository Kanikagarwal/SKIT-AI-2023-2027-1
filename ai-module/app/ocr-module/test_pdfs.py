
from pathlib import Path

import cv2
import fitz  # PyMuPDF

from preprocessing import ImagePreprocessor


PDF_PATH = Path(
    r"C:\Users\Lenovo\Desktop\EvalAI\ai-module\app\ocr-module\data\Social_Science.pdf"
)

OUTPUT_DIR = PDF_PATH.parent / "Social_Science_processed"
RENDER_DPI = 300


def main():
    if not PDF_PATH.exists():
        raise FileNotFoundError(f"PDF not found: {PDF_PATH}")

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    preprocessor = ImagePreprocessor(
        target_width=1200,
        enable_deskew=True
    )

    pdf = fitz.open(str(PDF_PATH))

    print(f"PDF: {PDF_PATH}")
    print(f"Number of pages: {len(pdf)}")
    print(f"Output folder: {OUTPUT_DIR}")

    try:
        for page_index, page in enumerate(pdf, start=1):
            print(f"\nProcessing page {page_index}/{len(pdf)}")

            # Render PDF page at 300 DPI.
            zoom = RENDER_DPI / 72.0
            matrix = fitz.Matrix(zoom, zoom)

            pixmap = page.get_pixmap(
                matrix=matrix,
                colorspace=fitz.csGRAY,
                alpha=False
            )

            rendered_path = OUTPUT_DIR / (
                f"page_{page_index:02d}_rendered.png"
            )

            pixmap.save(str(rendered_path))

            # Apply your existing preprocessing pipeline.
            processed = preprocessor.process_single_image(
                str(rendered_path)
            )

            processed_path = OUTPUT_DIR / (
                f"page_{page_index:02d}_preprocessed.png"
            )

            if not cv2.imwrite(str(processed_path), processed):
                raise RuntimeError(
                    f"Could not save {processed_path}"
                )

            print(f"Rendered: {rendered_path.name}")
            print(
                f"Preprocessed: {processed_path.name} "
                f"({processed.shape[1]} x {processed.shape[0]})"
            )

    finally:
        pdf.close()

    print("\nPDF preprocessing completed.")
    print(f"Pages saved in: {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
