import clienteAxios from "../config/axios";

clienteAxios.interceptors.request.use((req) => {
  if (localStorage.getItem("profile")) {
    req.headers.Authorization = `Bearer ${
      JSON.parse(localStorage.getItem("profile")).token
    }`;
  }
  return req;
});

// Auth
export const signIn = (userForm) =>
  clienteAxios.post("api/auth/login", userForm);
export const signUp = (userForm) => clienteAxios.post("api/usuarios", userForm);
export const signUpProfessional = (userForm) =>
  clienteAxios.post("api/usuarios/registro-profesional", userForm);
export const confirmAccountRequest = (token) =>
  clienteAxios.get(`api/usuarios/confirmar/${token}`);
export const googleSignIn = (accessToken) =>
  clienteAxios.post(`api/auth/google`, { token: accessToken });
export const forgotPasswordRequest = (email) =>
  clienteAxios.post("api/usuarios/olvide-password", email);
export const newPasswordRequest = ({ password, token }) =>
  clienteAxios.post(`api/usuarios/olvide-password/${token}`, { password });
export const updateInformationRequest = (userForm) =>
  clienteAxios.put("api/usuarios/actualizar-perfil", userForm);
export const updatePasswordRequest = (valueForm) =>
  clienteAxios.put("api/usuarios/cambiar-password", valueForm);

// Professional
export const updateProfileRequest = (valueForm) =>
  clienteAxios.put("api/profesional/actualizar-profesional", valueForm);
export const updateProfileRequestDashAdmin = (valueForm) =>
  clienteAxios.put(
    "api/profesional/actualizar-profesional-AdminDash",
    valueForm
  );
export const createScheduleRequest = (valueForm) =>
  clienteAxios.post("api/profesional", valueForm);

export const disponibilidadesTotales = () =>
  clienteAxios.get("api/profesional/disponibilidades-totales");
// Order
export const getAllOrdersRequest = () => clienteAxios.get("ordenes/orden");

export const createOrderRequest = (orderForm) =>
  clienteAxios.post("ordenes/orden", orderForm);
export const updateOrderRequest = (orderForm) =>
  clienteAxios.put("ordenes/updateorden", orderForm);

export const getOrderByIdRequest = (orderId) =>
  clienteAxios.get(`ordenes/getordenbyid/${orderId}`);
export const deleteOrderRequest = (orderId) =>
  clienteAxios.delete(`ordenes/orden/${orderId}`);
export const getOrdersByUserIdRequest = (userId) =>
  clienteAxios.get(`ordenes/ordenbyuserid/${userId}`);
