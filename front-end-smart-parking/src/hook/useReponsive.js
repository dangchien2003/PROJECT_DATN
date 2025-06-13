import { useState, useEffect } from 'react';

const getScreenKey = (width) => {
  if (width < 576) return 'xs';
  if (width >= 576 && width < 768) return 'sm';
  if (width >= 768 && width < 992) return 'md';
  if (width >= 992 && width < 1200) return 'lg';
  if (width >= 1200 && width < 1600) return 'xl';
  return 'xxl';
};

const useResponsiveKey = () => {
  const [info, setInfo] = useState({
    width: window.innerWidth,
    key: getScreenKey(window.innerWidth),
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const key = getScreenKey(width);
      setInfo({ width, key });
    };

    window.addEventListener('resize', handleResize);

    // cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return info;
};

export default useResponsiveKey;
