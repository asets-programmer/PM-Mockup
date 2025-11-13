@echo off
echo Starting Car Motion Detection...
echo.

REM Check if model file exists, if not, it will be downloaded automatically
python car_motion_detector.py --source 0

pause

