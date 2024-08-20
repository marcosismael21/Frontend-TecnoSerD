export const getToken = async () => {
    const url = await getApiUrl()
    const {
        token
    } = await $fetch(url + "/auth/login", {
        method: "GET",
        credentials: "include"
    })
    return token
}