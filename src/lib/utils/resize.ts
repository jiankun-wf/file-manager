export function resizeImage(
  url: string,
  imgTarget: HTMLImageElement,
  limitWidth: number,
  limitHeight: number
) {
  const img = new Image();
  img.onload = function () {
    const width = img.width;
    const height = img.height;
    if (width > limitWidth || height > limitHeight) {
      const ratio = limitWidth / limitHeight;
      if (width > height) {
        imgTarget.width = limitWidth;
        imgTarget.height = limitWidth / ratio;
      } else {
        imgTarget.height = limitHeight;
        imgTarget.width = limitHeight * ratio;
      }
    } else {
      imgTarget.width = width;
      imgTarget.height = height;
    }
  };

  img.src = url;
}
