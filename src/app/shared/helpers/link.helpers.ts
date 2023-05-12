export function validateUrl(url?: string): boolean {
  if (!url) return false;

  const regexp = /(^https?):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/])$)?/;
  return regexp.test(url.toLowerCase());
}

export function validateExternalReferenceUrl(externalRef?: string): boolean {
  if (!externalRef) return false;

  if (validateUrl(externalRef)) {
    return true;
  } else {
    const regexp = /^(kmdsageraabn|kmdedhvis|sbsyslauncher):.*/;
    return regexp.test(externalRef.toLowerCase());
  }
}
