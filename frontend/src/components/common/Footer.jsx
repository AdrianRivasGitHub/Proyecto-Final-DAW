import { ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { NOMBRE_WEB, ANO_COPYRIGHT } from "@/constants";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <ChefHat className="h-6 w-6 text-orange-600" />
              <h4 className="text-lg font-bold">{NOMBRE_WEB}</h4>
            </div>
            <p className="text-gray-400">
              La plataforma donde puedes descubrir y compartir la gastronomía.
            </p>
          </div>
          <div>
            <h5 className="font-semibold mb-4">Explorar</h5>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/recetas" className="hover:text-white">
                  Todas las Recetas
                </Link>
              </li>
              <li>
                <Link to="/recetas" className="hover:text-white">
                  Categorías
                </Link>
              </li>
              <li>
                <Link to="/recetas" className="hover:text-white">
                  Por Regiones
                </Link>
              </li>
              {/* <li>
                <Link to="/vegano" className="hover:text-white">
                  Opciones Veganas
                </Link>
              </li> */}
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-4">Comunidad</h5>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/blog" className="hover:text-white">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-white">
                  Novedades
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-white">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-4">Síguenos</h5>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Button size="sm" variant="ghost" className="text-gray-400 hover:text-black">
                  Facebook
                </Button>
              </li>
              <li>
                <Button size="sm" variant="ghost" className="text-gray-400 hover:text-black">
                  Instagram
                </Button>
              </li>              <li>
                <Button size="sm" variant="ghost" className="text-gray-400 hover:text-black">
                  Instagram
                </Button>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {ANO_COPYRIGHT} {NOMBRE_WEB}. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}