import api from '..';

// get all streams
export const fetchSubject = async (
  streamId: string | number,
  semester: string | number,
) => {
  const response = await api.get(
    `/subjects?semester=${semester}&streamId=${streamId}`,
  );
  return response.data;
};

export const fetchSubjectNotes = async (subjectId: string | number) => {
  const response = await api.get(`/notes?subjectId=${subjectId}`);
  return response.data;
};

export const fetchSubjectPYQ = async (subjectId: string | number) => {
  const response = await api.get(`/pyqs?subjectId=${subjectId}`);
  return response.data;
};
