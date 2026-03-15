import cv2, pytesseract, re, os, imutils, sys
import numpy as np

pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

OUT_DIR = "processing_logs"
os.makedirs(OUT_DIR, exist_ok=True)

def scan_simple(image_path):
    img = cv2.imread(image_path)
    if img is None:
        print("ID:Not Found|NAME:Image Not Found")
        return

    # 1. Resize and grayscale
    img = imutils.resize(img, width=1500)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # 2. Contrast Boost
    # push the grey background closer to white while keeping text black
    clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(12,12))
    gray = clahe.apply(gray)

    # 3. Bilateral filter is better here than Median because it keeps the sharp edges of letters
    denoised = cv2.bilateralFilter(gray, 9, 75, 75)

    # 4. adaptive thesholding to get a clean binary image
    thresh = cv2.adaptiveThreshold(denoised, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, 15, 15)

    # 5. Clean up the salt n pepper noise"
    kernel = np.ones((2,2), np.uint8)
    thresh = cv2.dilate(thresh, kernel, iterations=1)
    
    cv2.imwrite(f"{OUT_DIR}/view.jpg", thresh)

    # 2. Feature extractions (OCR)
    d = pytesseract.image_to_data(thresh, output_type=pytesseract.Output.DICT, config='--psm 6')
    
    # Create list of words with their vertical (Y) positions
    words = []
    for i in range(len(d['text'])):
        if int(d['conf'][i]) > 30: # Only keep confident reads
            words.append((d['text'][i].strip(), d['top'][i]))

    # 3. Spatial mapping
    # Find the 8-digit Student ID first
    student_id = "Not Found"
    id_y = 0
    for word, y in words:
        if re.match(r'^\d{8}$', word):
            student_id = word
            id_y = y
            break
    
    # list of common words to ignore
    blacklist = ["DEGREE", "CEGREE", "SCIENCE", "BACHELOR", "MAYNOOTH", 
                "UNIVERSITY", "DATE", "CARD", "ID", "VALID", "PHOTO", 
                "NAME", "OF", "BIRTH", "UNTIL", "IRELAND", "STUDENT", "SCENCE", 
                "BACHELOROF", "SCIENCEDEGREE"]

    # Search for the name nearby the ID using the y coordinate
    name_list = []
    if id_y > 0:
        for word, y_pos in words:
            # Look in a "Search Zone" 150 pixels below the ID
            is_nearby = id_y < y_pos < (id_y + 150)
            # Clean the word, remove symbols and make them all uppercase
            clean_word = "".join(filter(str.isalpha, word.upper()))
            if is_nearby and clean_word not in blacklist and len(clean_word) > 2:
                name_list.append(clean_word)

    final_name = " ".join(name_list[:5]) if name_list else "Not Found"

    # 4. final outputs
    print(f"ID:{student_id}|NAME:{final_name}")

    # use for manual testing with uploaded image
if __name__ == "__main__":
    image_file = sys.argv[1] if len(sys.argv) > 1 else "test_card.jpg"
    scan_simple(image_file)