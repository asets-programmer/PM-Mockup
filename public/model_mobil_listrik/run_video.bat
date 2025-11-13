@echo off
echo Starting Car Motion Detection with Video File...
echo.
echo Usage: run_video.bat "path\to\video.mp4"
echo.

if "%~1"=="" (
    echo Error: Please provide video file path
    echo Example: run_video.bat "C:\videos\test.mp4"
    pause
    exit /b 1
)

python car_motion_detector.py --source "%~1"

pause

