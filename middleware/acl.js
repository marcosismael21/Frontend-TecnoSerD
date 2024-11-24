// middleware/acl.js
export default function ({ store }) {
    const roleId = store.state.auth.user.role_id // Suponiendo que este es el campo del rol en el usuario
    Vue.acl.change(String(roleId)) // Cambia el rol actual según el ID del usuario
  }
  