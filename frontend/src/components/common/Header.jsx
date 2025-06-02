import { ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ChefHat className="h-8 w-8 text-orange-600" />
            <h1 className="text-2xl font-bold text-gray-900">Recetas</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-orange-600 font-medium">
              Inicio
            </Link>
            <Link to="/explorar" className="text-gray-700 hover:text-orange-600 font-medium">
              Explorar
            </Link>
            <Link to="/que-cocino" className="text-gray-700 hover:text-orange-600 font-medium">
              ¿Qué cocino hoy?
            </Link>
            <Link to="/blog" className="text-gray-700 hover:text-orange-600 font-medium">
              Blog
            </Link>
          </nav>
          <div className="flex items-center space-x-3">
            <Button variant="outline" asChild>
              <Link to="/login">Iniciar Sesión</Link>
            </Button>
            <Button className="bg-orange-600 hover:bg-orange-700" asChild>
              <Link to="/registro">Registrarse</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}