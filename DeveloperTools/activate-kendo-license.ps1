param (
    [Parameter(Mandatory=$true)]
    [string]$LicenseKey
)

# Set the environment variable
$Env:TELERIK_LICENSE = $LicenseKey

#Change to the parent directory
Set-Location ..

# Run the activation command
Write-Host "Activating Telerik license..."
yarn run kendo-ui-license activate
