$ErrorActionPreference = "Stop"

param(
  [string]$BackendUrl = "http://host.docker.internal:5000/"
)

$repoRoot = Split-Path -Parent $PSScriptRoot
$env:BACKEND_URL = $BackendUrl

Push-Location $repoRoot
try {
  docker compose up --build
}
finally {
  Pop-Location
}
