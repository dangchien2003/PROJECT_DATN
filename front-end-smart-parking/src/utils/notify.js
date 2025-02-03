export const checkNotifyViewd = (viewed) => {
  if (viewed === 0 || viewed === null || viewed === undefined) {
    return false;
  }
  return true;
};
