import api from '..';

// get all streams
export const fetchNotification = async (
  page?: string | number,
  limit?: string | number,
) => {
  const { data } = await api.get(`/notifications?page=${page}&limit=${limit}`);
  return data;
};
