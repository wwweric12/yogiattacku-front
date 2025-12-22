export const boardKeys = {
    all: ['board'] as const,
    posts: (page: number, size: number, categories: string[]) =>
        [...boardKeys.all, 'posts', { page, size, categories }] as const,
};
