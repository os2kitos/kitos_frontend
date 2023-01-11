Write-Host "Testing angular app"

$ErrorActionPreference = 'Stop'

yarn
yarn lint
yarn e2e:ci
