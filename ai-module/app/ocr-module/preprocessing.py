from PIL import ImageOps, ImageFilter


def preprocess_image(image):
   
    # Convert to grayscale
    image = image.convert("L")

    # Normalize contrast
    image = ImageOps.autocontrast(image)

    # Reduce small noise
    image = image.filter(ImageFilter.MedianFilter(size=3))

    return image