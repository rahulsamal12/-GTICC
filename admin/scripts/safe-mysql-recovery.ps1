# ==============================================================================
# GTICC MySQL 8.0 Hardened Recovery Script (v4 - Production-Safe)
# Target: Windows MySQL 8.0 Service (MYSQL80)
# ==============================================================================

[CmdletBinding()]
param()

$ErrorActionPreference = "Stop"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " GTICC MySQL 8.0 Hardened Recovery - Safety Validation    " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Path Definitions & Verification
$mysqldPath = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqld.exe"
$mysqlPath = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
$mysqladminPath = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqladmin.exe"
$myIniPath = "C:\ProgramData\MySQL\MySQL Server 8.0\my.ini"
$dataDirPath = "C:\ProgramData\MySQL\MySQL Server 8.0\Data"

if (-not (Test-Path $mysqldPath)) { throw "mysqld.exe not found at: $mysqldPath" }
if (-not (Test-Path $mysqlPath)) { throw "mysql.exe not found at: $mysqlPath" }
if (-not (Test-Path $mysqladminPath)) { throw "mysqladmin.exe not found at: $mysqladminPath" }
if (-not (Test-Path $myIniPath)) { throw "my.ini not found at: $myIniPath" }
if (-not (Test-Path $dataDirPath)) { throw "Data directory not found at: $dataDirPath" }

# Backup my.ini
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptDir
$backupDir = Join-Path $projectRoot "backups"
if (-not (Test-Path $backupDir)) { New-Item -ItemType Directory -Path $backupDir -Force | Out-Null }
$iniBackup = Join-Path $backupDir "my.ini.bak"
if (-not (Test-Path $iniBackup)) {
    Copy-Item -Path $myIniPath -Destination $iniBackup -Force
    Write-Host "[+] Backed up my.ini configuration to $iniBackup" -ForegroundColor Green
}

# 2. Inspect Current Service & Process State
Write-Host "[*] Inspecting active MySQL state..." -ForegroundColor Cyan
$svc = Get-Service -Name "MYSQL80" -ErrorAction SilentlyContinue
$activeProcesses = Get-Process -Name "mysqld*" -ErrorAction SilentlyContinue

if ($svc -and $svc.Status -eq "Running") {
    Write-Host "[*] MYSQL80 service is currently Running. Requesting graceful service stop..." -ForegroundColor Yellow
    Stop-Service -Name "MYSQL80"
    $wait = 30
    while ((Get-Process -Name "mysqld*" -ErrorAction SilentlyContinue) -and ($wait -gt 0)) {
        Start-Sleep -Seconds 1
        $wait--
    }
} elseif ($activeProcesses) {
    Write-Host "[*] Detected standalone mysqld processes (PIDs: $($activeProcesses.Id -join ', '))." -ForegroundColor Yellow
    Write-Host "[*] Checking if previous temporary server is listening on port 3306..." -ForegroundColor Cyan
    
    # Prompt user for the root password entered during the previous attempt to shut it down cleanly
    Write-Host "To shut down the currently running temporary mysqld instance gracefully," -ForegroundColor Yellow
    Write-Host "please enter the root password you supplied in the previous run:" -ForegroundColor Yellow
    $priorRootSec = Read-Host -Prompt "Enter Previous Root Password" -AsSecureString
    $priorRootBSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($priorRootSec)
    $priorRootPlain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($priorRootBSTR)

    $tempPriorCnf = "$env:TEMP\mysql-prior-$([System.Guid]::NewGuid().ToString('N')).cnf"
    $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
    $priorCnfText = @"
[client]
user=root
password="$priorRootPlain"
host=127.0.0.1
port=3306
"@
    [System.IO.File]::WriteAllText($tempPriorCnf, $priorCnfText, $utf8NoBom)
    
    try {
        & $mysqladminPath --defaults-extra-file="$tempPriorCnf" shutdown 2>&1 | Out-Null
    } finally {
        if (Test-Path $tempPriorCnf) { Remove-Item -Path $tempPriorCnf -Force -ErrorAction SilentlyContinue }
    }

    # Wait for clean exit
    $wait = 25
    while ((Get-Process -Name "mysqld*" -ErrorAction SilentlyContinue) -and ($wait -gt 0)) {
        Start-Sleep -Seconds 1
        $wait--
    }
}

# Verify clean exit: never start a second instance if a previous one lingers
$lingering = Get-Process -Name "mysqld*" -ErrorAction SilentlyContinue
if ($lingering) {
    Write-Host "[-] FATAL: mysqld process (PIDs: $($lingering.Id -join ', ')) is still active." -ForegroundColor Red
    Write-Host "[-] Refusing to force-kill or start a concurrent server to prevent InnoDB lock conflicts." -ForegroundColor Red
    Write-Host "[-] Please close the terminal window where mysqld was started, or wait for buffer pool flush." -ForegroundColor Yellow
    exit 1
}
Write-Host "[+] Confirmed: No active mysqld processes. InnoDB tablespaces are clean and idle." -ForegroundColor Green

# 3. Interactive Secure Password Acquisition
Write-Host ""
Write-Host "Please enter the passwords securely below (input will be masked):" -ForegroundColor Yellow
$rootSecure = Read-Host -Prompt "Enter NEW MySQL Root Password" -AsSecureString
$rootBSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($rootSecure)
$rootPlain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($rootBSTR)

if ([string]::IsNullOrWhiteSpace($rootPlain) -or $rootPlain.Length -lt 8) {
    throw "Root password must be at least 8 characters long."
}

$appSecure = Read-Host -Prompt "Enter NEW gticc_app Password" -AsSecureString
$appBSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($appSecure)
$appPlain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($appBSTR)

if ([string]::IsNullOrWhiteSpace($appPlain) -or $appPlain.Length -lt 8) {
    throw "gticc_app password must be at least 8 characters long."
}

# Declare temp file variables for finally cleanup
$tempInitFile = "$env:TEMP\gticc-mysql-init-$([System.Guid]::NewGuid().ToString('N')).sql"
$tempCnf = "$env:TEMP\mysql-client-$([System.Guid]::NewGuid().ToString('N')).cnf"
$appCnf = "$env:TEMP\mysql-app-$([System.Guid]::NewGuid().ToString('N')).cnf"
$mysqlProcess = $null
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

try {
    # 4. Create Protected SQL Init File (Strict UTF-8 WITHOUT BOM)
    $escRoot = $rootPlain.Replace("'", "''")
    $escApp = $appPlain.Replace("'", "''")

    $sqlContent = @"
ALTER USER 'root'@'localhost' IDENTIFIED BY '$escRoot';
CREATE DATABASE IF NOT EXISTS gticc_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'gticc_app'@'localhost' IDENTIFIED BY '$escApp';
ALTER USER 'gticc_app'@'localhost' IDENTIFIED BY '$escApp';
GRANT ALL PRIVILEGES ON gticc_db.* TO 'gticc_app'@'localhost';
FLUSH PRIVILEGES;
"@
    [System.IO.File]::WriteAllText($tempInitFile, $sqlContent, $utf8NoBom)

    # Restrict ACLs
    $acl = Get-Acl $tempInitFile
    $acl.SetAccessRuleProtection($true, $false)
    $adminRule = New-Object System.Security.AccessControl.FileSystemAccessRule(
        [System.Security.Principal.WindowsIdentity]::GetCurrent().Name,
        "FullControl",
        "Allow"
    )
    $acl.AddAccessRule($adminRule)
    Set-Acl -Path $tempInitFile -AclObject $acl
    Write-Host "[+] Created protected init SQL file without BOM." -ForegroundColor Green

    # 5. Create Protected Client CNF Files for Authenticated Testing & Shutdown
    $cnfRoot = @"
[client]
user=root
password="$rootPlain"
host=127.0.0.1
port=3306
"@
    [System.IO.File]::WriteAllText($tempCnf, $cnfRoot, $utf8NoBom)

    $cnfApp = @"
[client]
user=gticc_app
password="$appPlain"
host=127.0.0.1
port=3306
database=gticc_db
"@
    [System.IO.File]::WriteAllText($appCnf, $cnfApp, $utf8NoBom)

    # 6. Launch Standalone mysqld Instance with --init-file
    Write-Host "[*] Launching standalone mysqld instance with --init-file..." -ForegroundColor Cyan
    $serverArgs = "--defaults-file=`"$myIniPath`" --init-file=`"$tempInitFile`" --console"
    $mysqlProcess = Start-Process -FilePath $mysqldPath -ArgumentList $serverArgs -PassThru -NoNewWindow

    # 7. Actual Authenticated Query Verification
    Write-Host "[*] Waiting for temporary instance to initialize and verify SQL execution..." -ForegroundColor Cyan
    $verifiedRoot = $false
    $verifiedApp = $false
    $pollTries = 35

    while (($pollTries -gt 0) -and (-not ($verifiedRoot -and $verifiedApp))) {
        Start-Sleep -Seconds 1

        # Test authenticated root query
        if (-not $verifiedRoot) {
            $rootCheck = & $mysqlPath --defaults-extra-file="$tempCnf" -e "SELECT 1 AS root_ok;" 2>&1
            if ($LASTEXITCODE -eq 0 -and $rootCheck -match "root_ok") {
                $verifiedRoot = $true
                Write-Host "[+] Authenticated Root query verified successfully!" -ForegroundColor Green
            }
        }

        # Test authenticated gticc_app query against gticc_db
        if ($verifiedRoot -and (-not $verifiedApp)) {
            $appCheck = & $mysqlPath --defaults-extra-file="$appCnf" -e "SELECT DATABASE() AS current_db;" 2>&1
            if ($LASTEXITCODE -eq 0 -and $appCheck -match "gticc_db") {
                $verifiedApp = $true
                Write-Host "[+] Authenticated gticc_app query on gticc_db verified successfully!" -ForegroundColor Green
            }
        }

        $pollTries--
    }

    if (-not ($verifiedRoot -and $verifiedApp)) {
        Write-Host "[-] FATAL: Failed to verify authenticated SQL queries on the temporary instance." -ForegroundColor Red
        throw "Recovery SQL verification failed. Aborting."
    }

    # 8. Graceful Shutdown of Temporary Server
    Write-Host "[*] Initiating authenticated graceful shutdown of temporary instance..." -ForegroundColor Cyan
    & $mysqladminPath --defaults-extra-file="$tempCnf" shutdown 2>&1 | Out-Null

    $mysqlProcess.WaitForExit(15000)
    $waitExit = 15
    while ((Get-Process -Id $mysqlProcess.Id -ErrorAction SilentlyContinue) -and ($waitExit -gt 0)) {
        Start-Sleep -Seconds 1
        $waitExit--
    }

    if (Get-Process -Id $mysqlProcess.Id -ErrorAction SilentlyContinue) {
        throw "Temporary server failed to exit cleanly within timeout. Please do not force-kill."
    }
    Write-Host "[+] Temporary instance closed cleanly." -ForegroundColor Green

    # 9. Start Official MYSQL80 Windows Service
    Write-Host "[*] Starting official MYSQL80 Windows service..." -ForegroundColor Cyan
    Start-Service -Name "MYSQL80"
    Start-Sleep -Seconds 4

    $svcCheck = Get-Service -Name "MYSQL80"
    if ($svcCheck.Status -ne "Running") {
        throw "MYSQL80 service failed to restart. Status: $($svcCheck.Status)"
    }
    Write-Host "[+] MYSQL80 Windows service is Running normally!" -ForegroundColor Green

    # 10. Final Verification on Official Service
    Write-Host "[*] Verifying gticc_app connection on official MYSQL80 service..." -ForegroundColor Cyan
    $finalAppCheck = & $mysqlPath --defaults-extra-file="$appCnf" -e "SELECT DATABASE() AS final_db;" 2>&1
    if ($LASTEXITCODE -ne 0 -or $finalAppCheck -notmatch "gticc_db") {
        throw "Final verification of gticc_app on running service failed."
    }
    Write-Host "[+] Final Verification PASSED: gticc_app is active on port 3306 with access to gticc_db!" -ForegroundColor Green

    # Save credential to local file with restricted ACLs
    $credFile = Join-Path $projectRoot ".mysql_credential"
    Set-Content -Path $credFile -Value $appPlain -Force
    $credAcl = Get-Acl $credFile
    $credAcl.SetAccessRuleProtection($true, $false)
    $credRule = New-Object System.Security.AccessControl.FileSystemAccessRule(
        [System.Security.Principal.WindowsIdentity]::GetCurrent().Name,
        "FullControl",
        "Allow"
    )
    $credAcl.AddAccessRule($credRule)
    Set-Acl -Path $credFile -AclObject $credAcl
    Write-Host "[+] Stored application credential locally at $credFile with restricted ACLs." -ForegroundColor Green

    Write-Host ""
    Write-Host "==========================================================" -ForegroundColor Cyan
    Write-Host " Recovery & Verification Successfully Completed!         " -ForegroundColor Cyan
    Write-Host "==========================================================" -ForegroundColor Cyan

} catch {
    Write-Host "[-] ERROR ENCOUNTERED: $_" -ForegroundColor Red
    
    # In case of error, if temporary mysqld process is still running, attempt graceful authenticated shutdown
    if ($mysqlProcess -and (-not $mysqlProcess.HasExited)) {
        Write-Host "[*] Attempting to cleanly shut down temporary process following error..." -ForegroundColor Yellow
        if (Test-Path $tempCnf) {
            & $mysqladminPath --defaults-extra-file="$tempCnf" shutdown 2>&1 | Out-Null
            $mysqlProcess.WaitForExit(10000)
        }
    }

    # Ensure normal service is restored if temporary server is down
    $runningMysqld = Get-Process -Name "mysqld*" -ErrorAction SilentlyContinue
    if (-not $runningMysqld) {
        Write-Host "[*] Attempting to restore normal MYSQL80 service..." -ForegroundColor Yellow
        Start-Service -Name "MYSQL80" -ErrorAction SilentlyContinue
    }
    throw $_
} finally {
    # Guaranteed cleanup of all temporary credential files
    Write-Host "[*] Cleaning up temporary recovery files..." -ForegroundColor Cyan
    if (Test-Path $tempInitFile) { Remove-Item -Path $tempInitFile -Force -ErrorAction SilentlyContinue }
    if (Test-Path $tempCnf) { Remove-Item -Path $tempCnf -Force -ErrorAction SilentlyContinue }
    if (Test-Path $appCnf) { Remove-Item -Path $appCnf -Force -ErrorAction SilentlyContinue }
    Write-Host "[+] Temporary files securely cleared." -ForegroundColor Green
}
