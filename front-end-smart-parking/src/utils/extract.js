export function extractGoogleMapCoords(url) {
  if(!url) return null 

  // Ưu tiên tọa độ chính xác từ `/place/.../data=!4m6...!3dLAT!4dLNG`
  let match = url.match(/!3d([-+]?[0-9]*\.?[0-9]+)!4d([-+]?[0-9]*\.?[0-9]+)/);
  if (match) {
    return {
      x: parseFloat(match[1]),
      y: parseFloat(match[2])
    };
  }

  // Nếu không có thì lấy tọa độ từ `/@LAT,LNG,...`
  match = url.match(/@([-+]?[0-9]*\.?[0-9]+),([-+]?[0-9]*\.?[0-9]+)/);
  if (match) {
    return {
      x: parseFloat(match[1]),
      y: parseFloat(match[2])
    };
  }
  return null;
}

export const extractYouTubeVideoId = (input) => {
  if (!input) return null;

  try {
    const url = new URL(input);

    // Trường hợp URL dạng https://www.youtube.com/watch?v=VIDEO_ID
    if (url.hostname.includes('youtube.com') && url.pathname === '/watch') {
      return url.searchParams.get('v');
    }

    // // Trường hợp URL dạng https://www.youtube.com/embed/VIDEO_ID
    // if (url.hostname.includes('youtube.com') && url.pathname.startsWith('/embed/')) {
    //   return url.pathname.split('/embed/')[1].split(/[?/]/)[0];
    // }

    // // Có thể thêm các trường hợp khác nếu cần
  } catch (e) {
    console.error(e)
  }
  return null;
};