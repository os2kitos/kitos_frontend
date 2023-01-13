Write-Host "Testing angular app"

$ErrorActionPreference = 'Stop'

yarn
yarn e2e:ci
if ( -not $? ) { throw "Failed e2e tests" }
