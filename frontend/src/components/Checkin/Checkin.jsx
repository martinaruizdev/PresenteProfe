import { useEffect, useState } from "react";
import { marcarAsistencia } from "../../api/api";
import { useSearchParams } from "react-router-dom";

export default function Checkin() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("Verificando asistencia...");
  const clase_id = searchParams.get("clase_id");
  const token = searchParams.get("token");

  useEffect(() => {
    const marcar = async () => {
      try {
        await marcarAsistencia(clase_id, token); 
        setStatus("✅ Asistencia registrada correctamente.");
      } catch (err) {
        console.error(err);
        setStatus("❌ Error al registrar asistencia.");
      }
    };
    if (clase_id && token) marcar();
  }, [clase_id, token]);

  return (
    <div className="p-8 text-center">
      <h1>{status}</h1>
    </div>
  );
}
