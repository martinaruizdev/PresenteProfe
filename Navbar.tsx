"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const navigation = [
    { name: "Interviews", href: "/interviews" },
    { name: "Careers", href: "/careers" },
    { name: "Companies", href: "/companies" },
    { name: "Manifesto", href: "/manifesto" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleTalentSignup = () => {
    router.push("/user-type");
  };

  const handleBusinessSignup = () => {
    router.push("/user-type");
  };

  return (
    <>
      <nav
        className={`
      fixed top-0 z-50 w-full
      bg-gray-100 md:bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-white/10
      transition-transform duration-300 ease-in-out
      ${isVisible ? "translate-y-0" : "-translate-y-full"}
    `}
      >
        <div className="container flex h-20 max-w-none items-center justify-between px-4 sm:px-8 md:px-20 lg:px-22 xl:px-30 2xl:px-48">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <Image src="/cross.svg" width={40} height={40} alt="close menu" />
            ) : (
              <Image
                src="/hamburger.svg"
                width={40}
                height={40}
                alt="open menu"
              />
            )}
            <span className="sr-only">
              {isOpen ? "Close Menu" : "Open Menu"}
            </span>
          </Button>
          <Link
            href="/"
            className="md:px-4 w-[100px] md:w-[130px] hidden sm:flex"
          >
            <Image src="/gray_logo.svg" width={97} height={36} alt="logo" />
          </Link>
          <div className="hidden md:flex items-center space-x-12 ml-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-white font-medium transition-colors hover:text-primary"
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-6 ml-auto">
            <Button variant="white" size="lg" onClick={handleTalentSignup}>
              Find a position
            </Button>
            <Button variant="gray" size="lg" onClick={handleBusinessSignup}>
              Start hiring
            </Button>
          </div>
        </div>
      </nav>
      <div
        className={`
      fixed top-20 left-0 right-0 z-40 md:hidden
      bg-gray-100 backdrop-blur supports-[backdrop-filter]:bg-white/10
      transition-all duration-300 ease-in-out
      ${isOpen && isVisible ? "h-[60vh] opacity-100" : "max-h-0 opacity-0"}
      ${isVisible ? "translate-y-0" : "-translate-y-full"}
      overflow-hidden  flex flex-col justify-center 
    `}
      >
        <div className="flex flex-col space-y-10 p-12">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="text-white text-2xl font-semibold text-foreground transition-colors hover:text-primary"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>

      {isOpen && isVisible && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
