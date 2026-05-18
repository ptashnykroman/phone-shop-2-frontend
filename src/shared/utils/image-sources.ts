const ALLOWED_IMAGE_PROTOCOLS = new Set(["http:", "https:"]);

export function isValidImageSrc(value: string | null | undefined): value is string {
  if (!value) {
    return false;
  }

  const trimmedValue = value.trim();
  if (!trimmedValue) {
    return false;
  }

  if (trimmedValue.startsWith("/")) {
    return true;
  }

  try {
    const url = new URL(trimmedValue);
    return ALLOWED_IMAGE_PROTOCOLS.has(url.protocol);
  } catch {
    return false;
  }
}

export function getValidImageSources(images: string[] | null | undefined): string[] {
  if (!images?.length) {
    return [];
  }

  return images
    .map((image) => image.trim())
    .filter((image): image is string => isValidImageSrc(image));
}
