export const updateObjectValue = (obj, path, value) => {
  if (path !== null && path !== undefined) {
    const keys = path.split(".");
    let current = obj;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = value;
  }
};


export const convertObjectToDataSelectBox = (data) => { 
  return Object.keys(data).map((key) => {
    const item = data[key];
    return {
      label: item.label,
      value: item.value,
    };
  });
}

export const convertDataSelectboxToObject = (data) => {
  const result = {}
  Object.keys(data).forEach((key) => {
    const item = data[key];
    result[item.value] = item;
  });
  return result;
}