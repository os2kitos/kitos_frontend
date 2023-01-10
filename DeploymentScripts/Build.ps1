param(
    [Parameter(Mandatory = $true)][string]$environment
)

Write-Host "Building angular app for environment: $environment"

$ErrorActionPreference = 'Stop'

yarn
yarn swagger
yarn build --configuration $environment
