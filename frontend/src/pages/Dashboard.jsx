import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Clock, Star, Wheat, MapPin, Utensils, Salad, Cake, Sailboat, Mountain, Trees, Soup } from "lucide-react"
import { Link } from "react-router-dom";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import categoriasService from '@/services/categoriaService';
import regionesService from '@/services/regionService';
import recetasService from '@/services/recetaService';

export default function HomePage() {
  const [recetas, setRecetas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [regiones, setRegiones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState('');
  const navigate = useNavigate();

  const iconosCategorias = {
    "Entrada": <Salad className="h-12 w-12 text-green-600" />,
    "Fondo": <Utensils className="h-12 w-12 text-gray-800" />,
    "Postre": <Cake className="h-12 w-12 text-pink-500" />,
    "Costa": <Sailboat className="h-12 w-12 text-blue-700" />,
    "Sierra": <Mountain className="h-12 w-12 text-yellow-600" />,
    "Selva": <Trees className="h-12 w-12 text-lime-600" />,
    "default": <Soup className="h-12 w-12 text-orange-500" />
  };

  useEffect(() => {
    fetchRecetas();
    fetchCategorias();
    fetchRegiones();
  }, []);

  const fetchRecetas = async () => {
    setIsLoading(true);
    try {
      setError(null); // Limpiar el mensaje de error
      const response = await recetasService.getRecetas();
      setRecetas(response.data);
      console.log('Respuesta de la API:', response.data);
    } catch (error) {
      console.error('Error al obtener las recetas:', error);
      setError('No se pudieron cargar las recetas. Inténtalo de nuevo más tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategorias = async () => {
    setIsLoading(true);
    try {
      setError(null); // Limpiar el mensaje de error
      const response = await categoriasService.getCategorias();
      setCategorias(response.data);
      console.log('Respuesta de la API:', response.data);
    } catch (error) {
      console.error('Error al cargar categorias:', error);
      setError('No se pudieron cargar las cateegorias. Inténtalo de nuevo más tarde.');
    } finally {
      setIsLoading(false)
    }
  };

  const fetchRegiones = async () => {
    setIsLoading(true);
    try {
      setError(null); // Limpiar el mensaje de error
      const response = await regionesService.getRegiones();
      setRegiones(response.data);
      console.log('Respuesta de la API:', response.data);
    } catch (error) {
      console.error('Error al cargar regiones:', error);
      setError('No se pudieron cargar las regiones. Inténtalo de nuevo más tarde.');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-red-50">
      <Header />

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Descubre <span className="text-orange-600">grandes</span> recetas
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Explora la variada gastronomía peruana con recetas únicas, desde la costa hasta la selva
          </p>

          {/* Quick Search */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input placeholder="Buscar por ingrediente o nombre de receta..." className="pl-10 h-12 text-lg" />
              </div>
              <Button size="lg" className="m-0.5 bg-orange-600 hover:bg-orange-700 px-8">
                Buscar
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <Badge variant="secondary" className="text-sm py-1 px-3">
              Ceviche
            </Badge>
            <Badge variant="secondary" className="text-sm py-1 px-3">
              Lomo Saltado
            </Badge>
            <Badge variant="secondary" className="text-sm py-1 px-3">
              Anticuchos
            </Badge>
            <Badge variant="secondary" className="text-sm py-1 px-3">
              Causa Limeña
            </Badge>
            <Badge variant="secondary" className="text-sm py-1 px-3">
              Pisco Sour
            </Badge>
          </div>
        </div>
      </section>

      {/* Featured Recipes */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Recetas Destacadas</h3>
            <p className="text-gray-600 text-lg">Los platos más populares de nuestra comunidad</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recetas.map((receta) => (
              <Card key={receta.id_receta} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer pt-0">
                <div className="relative">
                  <img
                    src={receta.imagen_url || "/placeholder.svg"}
                    alt={receta.nombre}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  <Badge className="absolute top-3 right-3 bg-orange-600">
                    <MapPin className="h-3 w-3 mr-1" />
                    {receta.region.nombre}
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{receta.nombre}</CardTitle>
                  <CardDescription>{receta.descripcion}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      30 min
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                      4.8
                    </div>
                  </div>
                  <Badge variant="outline" className="mt-2">
                    Intermedio
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" asChild>
              <Link href="/explorar">Ver Todas las Recetas</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categorias y Regiones*/}
      <section className="py-16 px-4 bg-gradient-to-r from-orange-100 to-red-100">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Explora por Categorías</h3>
            <p className="text-gray-600 text-lg">Encuentra lo que buscas</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categorias.map((categoria) => (
              <Card key={categoria.nombre} className="text-center hover:shadow-xl transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-1">{iconosCategorias[categoria.nombre] || iconosCategorias.default}</div>
                  <h4 className="font-semibold text-gray-800 ">{categoria.nombre}</h4>
                  {/* <p className="text-sm text-gray-600">{recetasPorCategoria.count} recetas</p> */}
                </CardContent>
              </Card>
            ))}
            {regiones.map((region) => (
              <Card key={region.nombre} className="text-center hover:shadow-xl transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-1">{iconosCategorias[region.nombre] || iconosCategorias.default}</div>
                  <h4 className="font-semibold text-gray-800">{region.nombre}</h4>
                  {/* <p className="text-sm text-gray-600">{recetasPorCategoria.count} recetas</p> */}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-orange-600 text-white">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold mb-4">¿No sabes qué cocinar hoy?</h3>
          <p className="text-xl mb-8 opacity-90">
            Ingresa los ingredientes que tienes y te sugerimos recetas perfectas
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/que-cocino">Descubrir Recetas</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
