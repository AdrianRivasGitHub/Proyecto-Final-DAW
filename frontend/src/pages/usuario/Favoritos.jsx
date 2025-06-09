import { React, useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  LogOut,
  Settings,
  User,
  Clock,
  Users,
  ChefHat,
  Heart,
  Share2,
  Star,
  MapPin,
  ArrowLeft,
  Edit,
  Trash2,  
  Bookmark,
  MessageCircle,
  ThumbsUp,
  Calendar,
  AlertTriangle, 
} from "lucide-react"
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import recetaService from "@/services/recetaService"
import favoritoService from "@/services/favoritoService";

export default function Favoritos() {
  const [usuario, setUsuario] = useState(null);
  const [favoritos, setFavoritos] = useState([]);
  const [recetas, setRecetas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const apiUrlBase = import.meta.env.VITE_API_BASE_URL.replace('/api', '');

  useEffect(() => {
    const datosUsuarioGuardados = localStorage.getItem('usuario');
    const token = localStorage.getItem('token');

    if (datosUsuarioGuardados && token) {
      const user = JSON.parse(datosUsuarioGuardados);
      setUsuario(user);
      fetchFavoritos(user.id_usuario);
      console.log(user)
    } else {
      setIsLoading(false);
      setError("Debes iniciar sesión para ver tus favoritos.");
    }
  }, []);

  const fetchFavoritos = async (usuarioId) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await favoritoService.obtenerFavoritos(usuarioId);
      setFavoritos(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error al obtener los favoritos', error);
      setError("Error de conexión");
    } finally {
      setIsLoading(false)
    }    
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }  

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-red-50">
      <Header />
      <div className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Heart className="h-7 w-7 text-red-600" />
              Mis Recetas Favoritas
            </h1>
            <p className="text-gray-600">Aquí puedes ver y acceder rápidamente a tus recetas favoritas guardadas.</p>
          </div>
        </div>
        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-16 text-red-500">{error}</div>
        ) : favoritos.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="mx-auto h-16 w-16 text-red-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Aún no tienes recetas favoritas!</h2>
            <p className="text-gray-600 mb-4">Explora recetas y agrégalas a favoritos para verlas aquí.</p>
            <Button className="bg-orange-600 hover:bg-orange-700" asChild>
              <Link to="/recetas">Explorar Recetas</Link>
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favoritos.map((fav) => fav.receta && (
              <div key={fav.id_favorito} onClick={() => navigate(`/recetas/${fav.receta_id}`)} className="cursor-pointer">
                <Card className="overflow-hidden hover:shadow-lg transition-shadow pt-0">
                  <div className="relative">
                    <img
                      src={`${apiUrlBase}${fav.receta.imagen_url}` || "/placeholder.svg"}
                      alt={fav.receta.nombre}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                    <Badge className="absolute top-3 right-3 bg-orange-600">
                      <MapPin className="h-3 w-3 mr-1" />
                      {fav.receta.region?.nombre}
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      {fav.receta.nombre}
                      <Heart className="h-4 w-4 text-red-500" />
                    </CardTitle>
                    <CardDescription>{fav.receta.categoria?.nombre}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      {/* <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {fav.receta.tiempo ? `${fav.receta.tiempo} min` : "30 min"}
                      </div>
                      <Badge variant="outline" className="ml-2">
                        {fav.receta.created_at || "Media"}
                      </Badge> */}
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Añadido: {formatDate(fav.created_at)}
                      </div>                      
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
