# Stop on first error
$ErrorActionPreference = "Stop"

# Load tools
.$PSScriptRoot\CI_Tools.ps1

$deployment_packages_dir = "$PSScriptRoot\..\deployment_packages"

################################
Write-Host "CLEANING UP"
################################
CreateEmptyDir($deployment_packages_dir)
if ( -not $? ) { throw "Creating clean dir" }

###################################################
Write-Host "Building angular app all environments"
####################################################

#Make sure project passes linting before building packages
yarn

kendo-ui-license activate
if ( -not $? ) { throw "Failed activating kendo license" }

yarn lint
if ( -not $? ) { throw "Failed linting" }

#publish environment bundles
.$PSScriptRoot\Publish.ps1 -environment "dev" -publishDir $deployment_packages_dir
if ( -not $? ) { throw "Failed dev" }

.$PSScriptRoot\Publish.ps1 -environment "production" -publishDir $deployment_packages_dir
if ( -not $? ) { throw "Failed prod" }
