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
cd 02_Web_Application
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

### 4) Install Python packages from `requirements.txt`

```powershell
pip install -r requirements.txt
```

### 5) Add environment variables

Create `.env` in `02_Web_Application`:

```env
MONGO_URI=your_mongodb_connection_string_here
```

### 6) Verify Tesseract path

In `py_engine/id_scanner_v1.py`, update this if needed:

```python
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
```

### 7) Start server

```powershell
node server.js
```

### 8) Open app

`http://localhost:3000`

---

## Login Credentials (Current)

- `admin` / `admin123`
- `csc-trial` / `trial123`

---

## How to Use

1. Log in.
2. Scan ID card.
3. Verify detected ID and name.
4. Tick consent checkbox.
5. Submit record.
6. Open Logs to filter, export PDF, or delete record.

---

## API Routes

- `POST /scan`
- `POST /save-student`
- `GET /get-data?collection=<role>`
- `DELETE /delete-student`

---

## Using `requirements.txt`

- Install exact Python dependencies:

```powershell
pip install -r requirements.txt
```

- Update the file after dependency changes:

```powershell
pip freeze > requirements.txt
```

---

## Troubleshooting (Quick)

- OCR fails: check Tesseract install/path and Python packages.
- Mongo fails: verify `MONGO_URI` in `.env`.
- Camera fails: allow browser camera permission.

