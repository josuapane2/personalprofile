/** Encode path segments for URLs with spaces/special chars */
export function assetUrl(path: string): string {
  return path
    .split("/")
    .map((segment, index) => (index === 0 ? segment : encodeURIComponent(segment)))
    .join("/");
}
