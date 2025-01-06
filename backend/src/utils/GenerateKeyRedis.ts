export const generatePairKey = (key:string) => {
    const accessKey = `accessToken:${key}`
    const refreshKey = `refreshToken:${key}`
    return {accessKey,refreshKey}
}