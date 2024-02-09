import { APISimpleLinkDTO } from "src/app/api/v2"

export interface SimpleLink {
  name?: string,
  url?: string
}

export const mapSimpleLink = (apiSimpleLinkDto?: APISimpleLinkDTO) => {
  return { name: apiSimpleLinkDto?.name, url: apiSimpleLinkDto?.url }
}
