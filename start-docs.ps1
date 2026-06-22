$log = "G:\DevProjects\Blueprint AI Stack\.vitepress-dev.log"
$p = Start-Process -FilePath "node.exe" `
    -ArgumentList "node_modules\vitepress\bin\vitepress.js","dev","docs" `
    -WorkingDirectory "G:\DevProjects\Blueprint AI Stack" `
    -NoNewWindow -PassThru -RedirectStandardOutput $log `
    -RedirectStandardError "$log.err"
Start-Sleep -Seconds 5
$content = Get-Content $log -Tail 3
if ($content -match "localhost:5173") {
    Write-Host "VitePress OK sur http://localhost:5173 (PID: $($p.Id))" -ForegroundColor Green
} else {
    Write-Host "Verifie le log: $log" -ForegroundColor Yellow
    $content
}
