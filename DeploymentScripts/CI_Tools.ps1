# Stop on first error
$ErrorActionPreference = "Stop"

Function PurgeDir($dir) {
  if (Test-Path -Path $dir) {
    Remove-Item $dir\* -Recurse -Force
    Remove-Item $dir
  }
}

Function CreateEmptyDir($dir) {
  PurgeDir($dir);
  New-Item $dir -Type Directory
}
