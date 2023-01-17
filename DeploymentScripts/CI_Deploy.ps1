param(
  [Parameter(Mandatory = $true)][string]$environment
)

$ErrorActionPreference = "Stop"

#TODO - probably should provide the right path in stead! and when we create the packages we must include the scripts
$deployment_packages_dir = Resolve-Path "$PSScriptRoot\..\deployment_packages\$environment"
# $computerName = "https://172.26.15.248:8172/msdeploy.axd";
$computerName = "https://kitos-dev.strongminds.dk:8172/msdeploy.axd";
$username = "EC2AMAZ-9C9VU76\WDeployAdmin";
$password = "ymjfcAvfTLHQQMXRoYeaYaGUKnhYPmXgdQdcV3wTXhCZUGsNY4EGc6XzG8QvvhkH";
#TODO: Get params for
# env
#   - then load from aws
#   - Load the right env
#   - use the user and password
& "C:\Program Files (x86)\IIS\Microsoft Web Deploy V3\msdeploy.exe" `
  -verb:sync `
  -disableLink:AppPoolExtension `
  -disableLink:ContentExtension `
  -disableLink:CertificateExtension `
  -source:dirPath="$deployment_packages_dir" `
  -allowUntrusted `
  -dest:dirPath="`"C:\inetpub\kitos-frontend`",computerName=`"$computerName`",userName=`"$username`",password=`"$password`",authtype=`"Basic`",includeAcls=`"False`""
