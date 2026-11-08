// Cloudinary serves only the pixels needed for each viewport, in an automatic format.
export function optimizedImage(src: string, width: number): string {
  if (!/^https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\//.test(src)) return src;
  return src.replace(
    '/image/upload/',
    `/image/upload/f_auto,q_auto,c_limit,w_${Math.round(width)}/`,
  );
}

export function responsiveImage(src: string, widths = [400, 640, 960, 1440]): string | undefined {
  if (optimizedImage(src, 400) === src) return undefined;
  return widths.map((width) => `${optimizedImage(src, width)} ${width}w`).join(', ');
}
