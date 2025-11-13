import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE + "/api/",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getMaterias = () => api.get("materias/");
export const getClases = () => api.get("clases/");
export const getEncuestas = () => api.get("encuestas/");
export const marcarAsistencia = (claseId) => api.post("asistencias/marcar", { clase_id: claseId });
export const votarEncuesta = (encuestaId, opcion) => api.post("votar", { encuesta_id: encuestaId, opcion });
export const checkinAsistencia = (claseId, token) => api.post("asistencias/checkin/", { clase_id: claseId, token });
export const generarQR = (claseId) => api.post(`clases/${claseId}/qr/`);
export const exportarAsistencias = (claseId, formato = "csv") => window.location.href = `${process.env.REACT_APP_API_BASE}/api/clases/${claseId}/asistencias/export/?format=${formato}`;
export const crearClase = (data) => api.post("clases/", data);
export const crearMateria = (data) => api.post("materias/", data);

export const googleLogin = async (credential) =>
  api.post("auth/google", { credential });
