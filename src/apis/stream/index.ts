import api from '..';

// get all streams
export const fetchStreams = async (streamId?: string | number) => {
  if (streamId) {
    const { data } = await api.get(`/streams/${streamId}`);
    return data;
  }
  const { data } = await api.get(`/streams`);
  return data;
};
