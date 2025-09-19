// Simple keys for static queries
export const TODOS = ['todos'];

// Parameterized keys for queries needing variables
export const user = (userId: string | number) => ['user', userId];
export const post = (postId: string | number) => ['post', postId];
