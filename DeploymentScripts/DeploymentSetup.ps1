# Load helper
.$PSScriptRoot\AwsApi.ps1

Function Load-Environment-Secrets-From-Aws([String] $envName) {
  Write-Host "Loading environment configuration from SSM"

  $parameters = Get-SSM-Parameters -environmentName "$envName"

  $Env:MsDeployUserName = $parameters["MsDeployUserName"]
  $Env:MsDeployPassword = $parameters["MsDeployPassword"]
  $Env:MsDeployUrl = $parameters["MsDeployUrl"]

  Write-Host "Finished loading environment configuration from SSM"
}

Function Setup-Environment([String] $environmentName) {
  Write-Host "Configuring Deployment Environment $environmentName"

  if (-Not (Test-Path 'env:AwsAccessKeyId')) {
    throw "Error: Remember to set the AwsAccessKeyId input before starting the build"
  }
  if (-Not (Test-Path 'env:AwsSecretAccessKey')) {
    throw "Error: Remember to set the AwsSecretAccessKey input before starting the build"
  }

  $Env:MigrationsFolder = Resolve-Path "$PSScriptRoot\..\DataAccessApp"

  switch ( $environmentName ) {
    "integration" {
      $Env:DeploymentBundleName = "production"
      break;
    }
    "dev" {
      $Env:DeploymentBundleName = "dev"
      break;
    }
    "staging" {
      $Env:DeploymentBundleName = "production"
      break;
    }
    "production" {
      $Env:DeploymentBundleName = "production"
      break;
    }
    default { Throw "Error: Unknown environment provided: $environmentName" }
  }

  Configure-Aws -accessKeyId "$Env:AwsAccessKeyId" -secretAccessKey "$Env:AwsSecretAccessKey"
  Load-Environment-Secrets-From-Aws -envName "$environmentName" -loadTcHangfireConnectionString $loadTcHangfireConnectionString -loadTestUsers $loadTestUsers

  Write-Host "Finished configuring $environmentName"
}
