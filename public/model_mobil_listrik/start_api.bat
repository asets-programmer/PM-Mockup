@echo off
echo Starting Car Motion Detection API Server...
echo.

REM Check if virtual environment exists
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Install/upgrade dependencies
echo Installing dependencies...
pip install -r requirements_api.txt

REM Start API server
echo.
echo Starting API server on http://localhost:8000
echo Press Ctrl+C to stop
echo.
python api_server.py

pause

