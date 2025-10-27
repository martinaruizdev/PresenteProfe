import React from 'react'

const Navbar = () => {
  return (
<nav className="flex justify-center py-6">
      <ul className="flex space-x-6 bg-white/80 backdrop-blur-md rounded-full px-8 py-3 shadow-lg">
        <li>
          <a href="#home" className="text-gray-700 hover:text-blue-500 font-medium">
            Home
          </a>
        </li>
        <li>
          <a href="#about" className="text-gray-700 hover:text-blue-500 font-medium">
            About
          </a>
        </li>
        <li>
          <a href="#services" className="text-gray-700 hover:text-blue-500 font-medium">
            Services
          </a>
        </li>
        <li>
          <a href="#contact" className="text-gray-700 hover:text-blue-500 font-medium">
            Contact
          </a>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
