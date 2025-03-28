export function extractGoogleMapCoords(url) {
  const match = url.match(/\/dir\/.*?\/([-+]?[0-9]*\.?[0-9]+),([-+]?[0-9]*\.?[0-9]+)/);
  if (match) {
    const x = parseFloat(match[1]);
    const y = parseFloat(match[2]);
    return { x, y };
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
    console.log(e)
  }
  return null;
};