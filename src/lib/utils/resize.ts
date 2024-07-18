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
    // 256 * 256
    // 96 116
    if (width > limitWidth || height > limitHeight) {
      const ratio = height > width ? width / height : height / width;

      if (width > height) {
        imgTarget.width = limitWidth;
        imgTarget.height = limitWidth * ratio;
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
