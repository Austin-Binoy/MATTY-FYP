# FYP ID Scanner Web App

A Node.js + Python attendance scanner that reads student ID cards using OCR and stores logs in MongoDB.

---

## Features

- Webcam capture from browser
- OCR extraction of Student ID and Name
- Manual verification before save
- Role-based log views (`admin` and `csc-trial`)
- Date filtering, PDF export, and record deletion

---

## Tech Stack

- Node.js / Express
- Python
- OpenCV
- pytesseract + Tesseract OCR
- MongoDB

---

## Setup Instructions

### 0) Requirements

- Node.js (LTS)
- Python 3.10+
- Tesseract OCR (Windows)
- MongoDB URI

### 1) Open project folder

```powershell
cd MATTY-FYP
```

### 2) Install Node packages

```powershell
npm install
```

### 3) Create and activate Python virtual environment

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

### 4) Install Python packages

```powershell
pip install -r requirements.txt
```

### 5) Add environment variables

Create `.env` in the `MATTY-FYP` folder:

```env
MONGO_URI=your_mongodb_connection_string_here
```

### 6) Verify Tesseract path

Check this line in `py_engine/id_scanner_v1.py` and update it if needed:

```python
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
```

### 7) Start the server

```powershell
npm start
```

Or:

```powershell
node server.js
```

### 8) Open the app

Open:

```txt
http://localhost:3000
```

---

## Login Credentials (Current Demo Build)

- `admin` / `admin123`
- `csc-trial` / `trial123`

---

## How to Use

1. Log in.
2. Scan an ID card.
3. Verify the detected student ID and name.
4. Tick the consent checkbox.
5. Submit the record.
6. Open Logs to filter, export PDF, or delete a record.

---

## API Routes

- `POST /scan`
- `POST /save-student`
- `GET /get-data?collection=<role>`
- `DELETE /delete-student`

---

## Project Files

- `server.js` - Express server and API routes
- `db.js` - MongoDB save, fetch, and delete logic
- `py_engine/id_scanner_v1.py` - OCR processing
- `public/` - frontend files

---

## Troubleshooting

- OCR fails: check Tesseract installation and Python packages.
- MongoDB fails: verify `MONGO_URI` in `.env`.
- Camera fails: allow browser camera permission.
- Python script fails: ensure `python` is available in PATH.

---

## Notes

This project stores uploaded scan images temporarily in `uploads/` and deletes them after OCR processing.
Generated OCR debug images may be written to `processing_logs/`.