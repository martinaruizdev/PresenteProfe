import React from 'react'
import Navbar from '../Navbar/Navbar'
import Button from '../Button/Button'
import fondoImage from '../../assets/fondo.png';

const Header = () => {
  return (
    <>
    <div id='hero-header' className='min-h-screen flex flex-col items-center bg-cover bg-center' style={{ backgroundImage: `url(${fondoImage})` }}>
    <Navbar/>
    <div className='flex-1 flex flex-col justify-center items-start h-screen'>
    <h1 className='text-4xl font-bold text-dark'>Tomá <span className='text-blue-950'>lista en segundos</span> , sin papel ni estrés.</h1>
    <h2>Con PresenteProfe, tus estudiantes registran su asistencia escaneando un código QR. Simple, rápido y confiable.</h2>
    <Button>Probar Ahora</Button>
    </div>
    </div>
     </>
  )
}

export default Header