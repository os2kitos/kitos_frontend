param(
  [Parameter(Mandatory = $true)][string]$environment,
  [Parameter(Mandatory = $true)][string]$publishDir
)

$ErrorActionPreference = 'Stop'
.$PSScriptRoot\CI_Tools.ps1

$publish_to = "$publishDir\$environment"

#Clean current state
PurgeDir($publish_to)

Write-Host "PUBLISH: $environment"

if ( -not $? ) { throw "Failed cleaning up package" }

.$PSScriptRoot\Build.ps1 -environment $environment
if ( -not $? ) { throw "Failed build" }

Copy-Item "$PSScriptRoot\..\dist\kitos-web" -Destination $publish_to -Recurse
if ( -not $? ) { throw "Failed copy of dist" }

Copy-Item "$PSScriptRoot\..\hosting\*" -Destination $publish_to -Recurse
if ( -not $? ) { throw "Failed copy of hosting" }
