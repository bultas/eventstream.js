const KEY = "eventStream";

export const connectStream = (storage) => {
  const stream = getStream(storage);
  if (stream == null) {
    return initStream(storage);
  }

  return storage;
};

export const initStream = (storage) => {
  return replaceStream(storage, []);
};

export const getStream = (storage) => {
  const value = storage.getItem(KEY);
  return value === null ? null : JSON.parse(value);
};

export const replaceStream = (storage, value) => {
  storage.setItem(KEY, JSON.stringify(value));
  return storage;
};

export const addEvent = (storage, { data, metadata, type }) => {
  if (data == undefined || metadata == undefined || type == undefined) {
    console.warn("invalid payload");
    return storage;
  }

  const updatedStream = [
    ...getStream(storage),
    {
      data,
      metadata,
      type,
    },
  ];

  return replaceStream(storage, updatedStream);
};
