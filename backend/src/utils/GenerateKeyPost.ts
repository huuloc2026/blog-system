export const generateKeyPost = (key: string | number) => {
    const postKey = `Post:${key}`
    return {postKey}
}


/**
 * 
 * @param key :userId
 * @returns 
 */
export const generateSavedKeyPost = (key: string | number) => {
    const savedKey = `savedPosts:${key}`;
    return { savedKey }
}

export const generateViewdKeyPost = (key: string | number) => {
    const viewKey = `viewdPosts:${key}`;
    return { viewKey }
}

export const generateBookmarkKeyPost = (key: string | number) => {
    const BookmarkKey = `BookmarkPosts:${key}`;
    return { BookmarkKey }
}

