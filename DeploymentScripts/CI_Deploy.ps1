param(
  [Parameter(Mandatory = $true)][string]$environment
)

$ErrorActionPreference = "Stop"

#Load tools
.$PSScriptRoot\DeploymentSetup.ps1
Setup-Environment -environment $environment
if ($LASTEXITCODE -ne 0)	{ Throw "FAILED TO LOAD config from AWS for $environment" }

#Fetch vars from config
$deployment_packages_dir = Resolve-Path "$PSScriptRoot\..\deployment_packages\$Env:DeploymentBundleName"
$computerName = $Env:MsDeployUrl
$username = $Env:MsDeployUserName
$password = $Env:MsDeployPassword

& msdeploy `
  -verb:sync `
  -disableLink:AppPoolExtension `
  -disableLink:ContentExtension `
  -disableLink:CertificateExtension `
  -source:dirPath="$deployment_packages_dir" `
  -allowUntrusted `
  -dest:dirPath="`"C:\inetpub\kitos-frontend`",computerName=`"$computerName`",userName=`"$username`",password=`"$password`",authtype=`"Basic`",includeAcls=`"False`""
