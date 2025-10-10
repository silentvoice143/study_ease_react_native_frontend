// Simple keys for static queries
export const TODOS = ['todos'];

// Parameterized keys for queries needing variables
export const user = (userId: string | number) => ['user', userId];
export const post = (postId: string | number) => ['post', postId];

export const subjects = (
  streamId: string | number,
  semester: string | number,
) => ['subjects', { streamId, semester }];

export const notes = (subjectId: string | number) => ['notes', { subjectId }];
export const pyq = (subjectId: string | number) => ['pyq', { subjectId }];

export const streams = (streamId: string | number) => ['streams', { streamId }];

export const notifications = (
  page: number,
  limit: number,
  filters?: Record<string, any>, // optional filters
  sort?: string, // optional sort order
) => ['notifications', { page, limit, filters, sort }];
