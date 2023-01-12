# Stop on first error
$ErrorActionPreference = "Stop"

$deployment_packages_dir = "$PSScriptRoot\..\deployment_packages"


################################
Write-Host "CLEANING UP"
################################

if (Test-Path -Path $deployment_packages_dir) {
    Remove-Item $deployment_packages_dir\* -Recurse -Force
    Remove-Item $deployment_packages_dir
}
New-Item $deployment_packages_dir -Type Directory

###################################################
Write-Host "Building angular app all environments"
####################################################

#Make sure project passes linting before building packages
yarn
yarn lint
if ( -not $? ) { throw "Failed linting" }

#publish environment bundles
.$PSScriptRoot\Publish.ps1 -environment "development"
if ( -not $? ) { throw "Failed dev" }

.$PSScriptRoot\Publish.ps1 -environment "production"
if ( -not $? ) { throw "Failed prod" }