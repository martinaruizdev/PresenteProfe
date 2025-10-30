import React from "react";
import Navbar from "../Navbar/Navbar";
import Button from "../Button/Button";
import fondoImage from "../../assets/fondo.png";
import { HiArrowNarrowRight } from "react-icons/hi";
import imgMano from "../../assets/img-mano.png";

const Header = () => {
  return (
    <>
<div
  id="hero-header"
  className="min-h-screen w-full flex flex-col bg-cover bg-center "
  style={{ backgroundImage: `url(${fondoImage})` }}
>
  <Navbar />
  <div className="flex flex-row items-center justify-center w-full h-full">
    {/* Contenedor del texto */}
    <div className="flex flex-col justify-center items-start h-full w-1/2 space-y-8 ml-24">
      <h1 className="text-5xl font-bold text-dark">
        Tomá <span className="text-blue-950">lista en segundos</span>, sin papel ni estrés.
      </h1>
      <h2>
        Con PresenteProfe, tus estudiantes registran su asistencia escaneando un código QR. Simple, rápido y confiable.
      </h2>
      <Button className="bg-teal-500 hover:bg-teal-600 text-dark font-bold py-3 px-7 rounded-2xl flex items-center justify-center">
        Probar Ahora <HiArrowNarrowRight className="ml-1" />
      </Button>
    </div>

    {/* Contenedor de la imagen */}
    <div className="flex justify-center items-center h-full w-1/2 ">
      <img
        src={imgMano}
        alt="Mano escaneando QR"
        className="w-full h-full object-cover"
      />
    </div>
  </div>
</div>
    </>
  );
};

export default Header;
