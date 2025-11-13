import { useState } from "react";
import ClasesList from "../components/ClasesList/ClasesList";
import CrearClase from "../components/CrearClase/CrearClase";

export default function ClasesPage() {
  const [reloadFlag, setReloadFlag] = useState(false);

  const handleClaseCreada = () => setReloadFlag(!reloadFlag);

  return (
    <div className="p-4">
      <CrearClase onClaseCreada={handleClaseCreada} />
      <ClasesList reloadFlag={reloadFlag} />
    </div>
  );
}
