import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE + "/api/",
  withCredentials: true,
});

export const getMaterias = () => api.get("materias/");
export const getClases = () => api.get("clases/");
export const getEncuestas = () => api.get("encuestas/");
export const marcarAsistencia = (claseId) => api.post("asistencias/marcar", { clase_id: claseId });
export const votarEncuesta = (encuestaId, opcion) => api.post("votar", { encuesta_id: encuestaId, opcion });

export const googleLogin = async (credential) =>
  api.post("auth/google", { credential });
