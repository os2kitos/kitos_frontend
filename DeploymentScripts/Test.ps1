Write-Host "Testing angular app"

$ErrorActionPreference = 'Stop'

yarn
yarn swagger
yarn lint
yarn e2e:ci
