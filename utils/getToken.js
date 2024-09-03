// export const getToken = async () => {
//     const url = await getApiUrl()
//     const {
//         token
//     } = await $fetch(url + "/auth/login", {
//         method: "GET",
//         credentials: "include"
//     })
//     return token
// }

export const asyncData = async (context) => {
    return context.$axios.get('http://localhost:3010/api/v1/auth/login').then(response => {
        return response.token
        console.log(response.token)
    })
} 