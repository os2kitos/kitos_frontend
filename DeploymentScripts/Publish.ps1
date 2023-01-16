param(
  [Parameter(Mandatory = $true)][string]$environment
)

$ErrorActionPreference = 'Stop'

Write-Host "PUBLISH: $environment"

.$PSScriptRoot\Build.ps1 -environment $environment
if ( -not $? ) { throw "Failed build" }

Copy-Item "$PSScriptRoot\..\dist\kitos-web" -Destination "$deployment_packages_dir\$environment" -Recurse
if ( -not $? ) { throw "Failed copy of dist" }

Copy-Item "$PSScriptRoot\..\hosting" -Destination "$deployment_packages_dir\$environment" -Recurse
if ( -not $? ) { throw "Failed copy of hosting" }
