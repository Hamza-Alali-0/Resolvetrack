"use client";
import NavbarSign from "@/components/NavbarSign";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaCogs, FaWrench, FaHeadset } from 'react-icons/fa'; // Import React Icons
import Testimonials from "@/components/Testimonials";
import Apropos from "@/components/Apropos";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // If user is not authenticated, redirect to login page
  if (status === "loading") {
    return <p className="text-center text-gray-600">Loading...</p>;
  }



  return (
    <>
      <NavbarSign />

      <main>
        {/* Hero Section */}
        {/* Banner Section */}
        <section className="relative">
          {/* Image */}
          <img
            className="object-cover w-full h-96 md:h-auto"
            src="/banniere.jpg"
            alt="Banner Image"
            style={{ width: "100%", maxWidth: "100%" }}
          />
          {/* Text Over Image */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white bg-black bg-opacity-50">
            <h1 className="text-5xl font-bold mb-4">
              <span
                style={{
                  fontFamily: "YourSpecialFont",
                  fontWeight: "bold",
                  marginTop: 10,
                }}
              >
                PLASTIMA
              </span>
              <br />
              <span
                style={{
                  color: "rgb(202 138 4 / var(--tw-text-opacity))",
                  marginTop: 20,
                }}
              >
                RECLAMATIONS
              </span>
            </h1>
            <br />
            <p className="text-lg">
              Votre voix compte! <br /> Exprimez vos préoccupations et
              contribuez à l'amélioration continue de nos services.
            </p>
          </div>
        </section>

        {/* Introduction Section */}
        <section className="p-8 bg-white text-gray-800">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">À Propos de Nous</h2>
            <p className="text-lg">
              PLASTIMA Relcamations est dédié à fournir des solutions efficaces et transparentes pour gérer vos réclamations. Notre objectif est d'améliorer continuellement nos services en écoutant vos retours.
            </p>
<br />
         <Apropos/>
          </div>
        
        </section>

     {/* Section des Services */}
<section id="services" className="p-8 bg-gray-100">
  <div className="text-center mb-12">
    <h2 className="text-4xl font-bold mb-4">Nos Services</h2>
    <p className="text-lg mb-8">
      Découvrez nos services pour mieux comprendre comment nous pouvons vous aider.
    </p>
  </div>
  <div className="flex flex-wrap justify-center gap-8">
    {/* Service 1 */}
    <div className="w-full md:w-1/3 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
        <FaCogs className="w-24 h-24 mx-auto mb-4 text-gray-600" /> {/* Consulting Icon */}
        <h3 className="text-2xl font-semibold mb-2">Consulting</h3>
        <p>Fournir des conseils experts pour optimiser vos processus d'affaires.</p>
      </div>
    </div>
    {/* Service 2 */}
    <div className="w-full md:w-1/3 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
        <FaWrench className="w-24 h-24 mx-auto mb-4 text-gray-600" /> {/* Custom Solutions Icon */}
        <h3 className="text-2xl font-semibold mb-2">Solutions Personnalisées</h3>
        <p>Des solutions sur mesure pour répondre à vos besoins uniques.</p>
      </div>
    </div>
    {/* Service 3 */}
    <div className="w-full md:w-1/3 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
        <FaHeadset className="w-24 h-24 mx-auto mb-4 text-gray-600" /> {/* Support Icon */}
        <h3 className="text-2xl font-semibold mb-2">Support</h3>
        <p>Support 24/7 pour garantir le bon fonctionnement de vos opérations.</p>
      </div>
    </div>
  </div>
</section>


      
        {/* Testimonials Section */}
        <section className="p-8 bg-white text-gray-800">

        
        < Testimonials />

        </section>

        {/* Contact Section */}
        <section className="p-8 bg-gray-200 text-gray-800">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Nous Contacter</h2>
            <p className="text-lg">
              Si vous avez des questions ou besoin d'assistance, n'hésitez pas à nous contacter.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <a href="mailto:contactreclamations@plastima.ma" className="bg-yellow-500 text-black px-6 py-3 rounded-full text-lg font-semibold">
              Envoyez-nous un Email
            </a>
          </div>
        </section>
      </main>

   {/* Footer */}
<footer className="bg-blue-900 text-white py-8">
  <div className="container mx-auto text-center">
    <p className="mb-4 text-lg">© 2024 PLASTIMA Morocco. Tous droits réservés.</p>
    <p className="text-sm">
      <a href="/privacy-policy" className="underline hover:text-blue-300 transition-colors duration-300">Politique de Confidentialité</a> 
      <span className="mx-2">|</span>
      <a href="/terms-of-service" className="underline hover:text-blue-300 transition-colors duration-300">Conditions d'Utilisation</a>
    </p>
  </div>
</footer>

    </>
  );
}
