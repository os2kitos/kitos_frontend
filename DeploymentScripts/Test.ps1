Write-Host "Testing angular app"

$ErrorActionPreference = 'Stop'

Write-Host "Installing packages"
yarn

yarn lint
if ( -not $? ) { throw "Failed linting" }

Write-Host "Running E2E tests in CI configuration"
yarn e2e:ci
if ( -not $? ) { throw "Failed running e2e tests" }
