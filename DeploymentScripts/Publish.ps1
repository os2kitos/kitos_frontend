param(
    [Parameter(Mandatory = $true)][string]$environment
)

$ErrorActionPreference = 'Stop'

Write-Host "PUBLISH: $environment"

.$PSScriptRoot\Build.ps1 -environment $environment
Copy-Item "$PSScriptRoot\..\dist\kitos-web" -Destination "$deployment_packages_dir\$environment" -Recurse