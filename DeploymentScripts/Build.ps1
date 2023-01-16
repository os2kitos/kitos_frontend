param(
  [Parameter(Mandatory = $true)][string]$environment
)

Write-Host "Building angular app for environment: $environment"

$ErrorActionPreference = 'Stop'

yarn
yarn build --configuration $environment --base-href /ui/
