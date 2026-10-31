@echo off
echo ===================================================
echo Launching GTICC MySQL 8.0 Hardened Recovery Script
echo Target: D:\GTICC1\admin\scripts\safe-mysql-recovery.ps1
echo ===================================================
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "D:\GTICC1\admin\scripts\safe-mysql-recovery.ps1"
pause
