# =====================================================================
#  Actualiza los datos de la FCF (clasificación y partidos) de cada equipo
#  ---------------------------------------------------------------------
#  Uso: clic derecho → "Ejecutar con PowerShell", o desde una terminal:
#       powershell -ExecutionPolicy Bypass -File herramientas\actualizar-fcf.ps1
#
#  Qué hace: abre en segundo plano (Chrome sin ventana) la API de la FCF de
#  cada grupo configurado en js/data.js (fcfGrupos) y guarda el resultado en
#  data/fcf/<grupId>.js. La web lee esos archivos: sube la carpeta data/ al
#  servidor después de ejecutarlo. Se puede programar con el Programador de
#  tareas de Windows para que se ejecute, por ejemplo, cada domingo por la noche.
#
#  Por qué así: la API de la FCF lleva una protección antibots que solo deja
#  pasar a navegadores reales, así que la web no puede consultarla directamente.
# =====================================================================

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$dataJs = Join-Path $root "js\data.js"
$outDir = Join-Path $root "data\fcf"
New-Item -ItemType Directory -Force $outDir | Out-Null

# Localizar Chrome o Edge
$browsers = @(
  "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
  "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe",
  "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe",
  "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe",
  "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe"
)
$chrome = $browsers | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $chrome) { Write-Host "No se ha encontrado Chrome ni Edge." -ForegroundColor Red; exit 1 }

# Leer los grupos de js/data.js (líneas con grupId: "12345")
$js = Get-Content $dataJs -Raw
$grupos = [regex]::Matches($js, 'grupId:\s*"(\d+)"') | ForEach-Object { $_.Groups[1].Value } | Select-Object -Unique
if (-not $grupos) { Write-Host "No hay grupos configurados en js/data.js (fcfGrupos)." -ForegroundColor Yellow; exit 0 }

function Get-Json($url) {
  $tmp = [System.IO.Path]::GetTempFileName()
  $p = Start-Process -FilePath $chrome -ArgumentList @("--headless=new", "--disable-gpu", "--no-first-run", "--virtual-time-budget=15000", "--dump-dom", "`"$url`"") -NoNewWindow -Wait -PassThru -RedirectStandardOutput $tmp -RedirectStandardError ([System.IO.Path]::GetTempFileName())
  $html = Get-Content $tmp -Raw -Encoding UTF8
  Remove-Item $tmp -Force
  # El navegador envuelve el JSON en <pre>...</pre>
  $m = [regex]::Match($html, '<pre[^>]*>(.*)</pre>', 'Singleline')
  if (-not $m.Success) { return $null }
  $txt = [System.Net.WebUtility]::HtmlDecode($m.Groups[1].Value).Trim()
  if ($txt -notmatch '^\s*[\{\[]') { return $null }
  return $txt
}

$stamp = (Get-Date).ToString("yyyy-MM-dd HH:mm")
foreach ($g in $grupos) {
  Write-Host "Grupo $g ..." -NoNewline
  $clas = Get-Json "https://www.fcf.cat/api/competition/classificacio?grupId=$g"
  $part = Get-Json "https://www.fcf.cat/api/competition/partidos?grupId=$g"
  if (-not $clas -or -not $part) { Write-Host " ERROR (sin datos, se mantiene el archivo anterior)" -ForegroundColor Red; continue }
  $content = "/* Datos de la FCF - grupo $g - actualizado $stamp - generado por herramientas/actualizar-fcf.ps1 */`n" +
             "window.FCF = window.FCF || {};`n" +
             "window.FCF[""$g""] = { actualizado: ""$stamp"", clasificacion: $clas, partidos: $part };`n"
  [System.IO.File]::WriteAllText((Join-Path $outDir "$g.js"), $content, (New-Object System.Text.UTF8Encoding $false))
  Write-Host " OK" -ForegroundColor Green
}
Write-Host "Listo. Sube la carpeta data/ al servidor para que la web muestre los datos nuevos."
