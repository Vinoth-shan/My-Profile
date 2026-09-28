# Export resume designs to PDF. Usage: .\export.ps1            (all designs)
#                                    .\export.ps1 1-executive  (one design)
param([string]$Only = "")
$edge = @("C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe", "C:\Program Files\Microsoft\Edge\Application\msedge.exe") | Where-Object { Test-Path $_ } | Select-Object -First 1
$dir = $PSScriptRoot
New-Item -ItemType Directory -Force "$dir\pdf" | Out-Null
Get-ChildItem $dir -Filter "*-*.html" | Where-Object { -not $Only -or $_.BaseName -eq $Only } | ForEach-Object {
  $url = "file:///" + ($_.FullName -replace '\\', '/')
  $out = "$dir\pdf\Vinoth_S_Resume_$($_.BaseName).pdf"
  & $edge --headless=new --disable-gpu --no-pdf-header-footer --virtual-time-budget=6000 --print-to-pdf="$out" $url 2>$null | Out-Null
  "exported $out"
}
