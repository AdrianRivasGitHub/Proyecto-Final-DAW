import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Filter, Clock, Star, MapPin, ChefHat } from "lucide-react"
import recetaService from '../../services/recetaService';
import categoriaService from "@/services/categoriaService"
import regionService from "@/services/regionService"
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'

const ListaRecetas = () => {
  const [recetas, setRecetas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [regiones, setRegiones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategoria, setFilterCategoria] = useState("all");
  const [filterRegion, setFilterRegion] = useState("all");
  //const [filtro, setFiltro] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDificultades, setSelectedDificultades] = useState([]);
  const [tiemposSeleccionados, setTiemposSeleccionados] = useState([]);
  const [aplicarFiltros, setAplicarFiltros] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [categoriaInput, setCategoriaInput] = useState("all");
  const [regionInput, setRegionInput] = useState("all");
  const [dificultadesInput, setDificultadesInput] = useState([]);
  const [tiemposInput, setTiemposInput] = useState([]);
  const RECETAS_POR_PAGINA = 9;
  const navigate = useNavigate();
  const location = useLocation();
  const apiUrlBase = import.meta.env.VITE_API_BASE_URL.replace('/api', '');

  useEffect(() => {
    fetchRecetas();
    fetchCategorias();
    fetchRegiones();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search') || "";
    const categoriaParam = params.get('categoria') || "all";
    const regionParam = params.get('region') || "all";
    if (searchParam) {
      setSearchInput(searchParam);
      setSearchTerm(searchParam);
    }
    if (categoriaParam && categoriaParam !== "all") {
      setCategoriaInput(categoriaParam);
      setFilterCategoria(categoriaParam);
    }
    if (regionParam && regionParam !== "all") {
      setRegionInput(regionParam);
      setFilterRegion(regionParam);
    }
  }, [location.search]);

  const fetchRecetas = async () => {
    setIsLoading(true);
    try {
      setError(null); // Limpiar el mensaje de error
      const response = await recetaService.getRecetas();
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
      const response = await categoriaService.getCategorias();
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
      const response = await regionService.getRegiones();
      setRegiones(response.data);
      console.log('Respuesta de la API:', response.data);
    } catch (error) {
      console.error('Error al cargar regiones:', error);
      setError('No se pudieron cargar las regiones. Inténtalo de nuevo más tarde.');
    }
    setIsLoading(false);
  };

  const handleAplicarFiltros = () => {
    setSearchTerm(searchInput);
    setFilterCategoria(categoriaInput);
    setFilterRegion(regionInput);
    setSelectedDificultades(dificultadesInput);
    setTiemposSeleccionados(tiemposInput);
    setCurrentPage(1);
  };

  const handleResetFiltros = () => {
    setSearchInput("");
    setCategoriaInput("all");
    setRegionInput("all");
    setDificultadesInput([]);
    setTiemposInput([]);
    setSearchTerm("");
    setFilterCategoria("all");
    setFilterRegion("all");
    setSelectedDificultades([]);
    setTiemposSeleccionados([]);
    setCurrentPage(1);
  };

  const filtrarRecetas = (recipes) => {
    return recipes.filter((receta) => {
      const matchesSearch = receta.nombre.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategoria = filterCategoria === "all" || receta.categoria.nombre === filterCategoria;
      const matchesRegion = filterRegion === "all" || receta.region.nombre === filterRegion;
      const matchesDificultad = selectedDificultades.length === 0 || selectedDificultades.includes(receta.dificultad);
      const matchesTiempo = tiemposSeleccionados.length === 0 || tiemposSeleccionados.includes(Number(receta.tiempo));
      return matchesSearch && matchesCategoria && matchesRegion && matchesDificultad && matchesTiempo;
    });
  };  

  const recetasFiltradas = filtrarRecetas(recetas);
  const totalPages = Math.ceil(recetasFiltradas.length / RECETAS_POR_PAGINA);
  const recetasPaginadas = recetasFiltradas.slice(
    (currentPage - 1) * RECETAS_POR_PAGINA,
    currentPage * RECETAS_POR_PAGINA
  );

  useEffect(() => {
    if (aplicarFiltros) setAplicarFiltros(false);
  }, [aplicarFiltros]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Explorar Recetas</h1>
          <p className="text-gray-600">Descubre recetas únicas de la gastronomía peruana</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filtros Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Filtros
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Buscador */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Buscar</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input 
                      placeholder="Nombre de receta..." 
                      className="pl-10"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                    />
                  </div>
                </div>

                {/* Categoria */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Categoría</label>
                  <Select value={categoriaInput} onValueChange={setCategoriaInput}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas las categorías" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las categorías</SelectItem>
                      {categorias.map((categoria) => (
                        <SelectItem key={categoria.id_categoria} value={categoria.nombre}>
                          {categoria.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Region */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Región</label>
                  <Select value={regionInput} onValueChange={setRegionInput}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas las regiones" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las regiones</SelectItem>
                      {regiones.map((region) => (
                        <SelectItem key={region.id_region} value={region.nombre}>
                          {region.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Dificultad */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Dificultad</label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="facil" checked={dificultadesInput.includes("Fácil")} onCheckedChange={() => setDificultadesInput((prev) => prev.includes("Fácil") ? prev.filter((dif) => dif !== "Fácil") : [...prev, "Fácil"])} />
                      <label htmlFor="facil" className="text-sm">
                        Fácil
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="intermedio" checked={dificultadesInput.includes("Media")} onCheckedChange={() => setDificultadesInput((prev) => prev.includes("Media") ? prev.filter((dif) => dif !== "Media") : [...prev, "Media"])} />
                      <label htmlFor="intermedio" className="text-sm">
                        Media
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="dificil" checked={dificultadesInput.includes("Difícil")} onCheckedChange={() => setDificultadesInput((prev) => prev.includes("Difícil") ? prev.filter((dif) => dif !== "Difícil") : [...prev, "Difícil"])} />
                      <label htmlFor="dificil" className="text-sm">
                        Difícil
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="experta" checked={dificultadesInput.includes("Experta")} onCheckedChange={() => setDificultadesInput((prev) => prev.includes("Experta") ? prev.filter((dif) => dif !== "Experta") : [...prev, "Experta"])} />
                      <label htmlFor="experta" className="text-sm">
                        Experta
                      </label>
                    </div>                    
                  </div>
                </div>

                {/* Tiempo de preparación */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Tiempo de preparación</label>
                  <div className="space-y-2">
                    {[15, 30, 45, 60].map((t) => (
                      <div key={t} className="flex items-center space-x-2">
                        <Checkbox
                          id={`tiempo-${t}`}
                          checked={tiemposInput.includes(t)}
                          onCheckedChange={() => setTiemposInput((prev) => prev.includes(t) ? prev.filter((ti) => ti !== t) : [...prev, t])}
                        />
                        <label htmlFor={`tiempo-${t}`} className="text-sm">
                          {t} min
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Opciones Dietéticas */}
                {/* <div>
                  <label className="text-sm font-medium mb-2 block">Opciones Dietéticas</label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="vegano" />
                      <label htmlFor="vegano" className="text-sm">
                        Vegano
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="vegetariano" />
                      <label htmlFor="vegetariano" className="text-sm">
                        Vegetariano
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="sin-gluten" />
                      <label htmlFor="sin-gluten" className="text-sm">
                        Sin Gluten
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="sin-lactosa" />
                      <label htmlFor="sin-lactosa" className="text-sm">
                        Sin Lactosa
                      </label>
                    </div>
                  </div>
                </div> */}

                <Button className="w-full bg-orange-600 hover:bg-orange-700" onClick={handleAplicarFiltros}>Aplicar Filtros</Button>
                <Button className="w-full mt-2" variant="outline" onClick={handleResetFiltros}>Restablecer Filtros</Button>
              </CardContent>
            </Card>
          </div>

          {/* Resultados */}
          <div className="lg:col-span-3">
            {/* Ordenar*/}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">Mostrando {recetasPaginadas.length} de {recetas.length} recetas</p>
              {/* <div className="flex items-center space-x-4">
                <Select defaultValue="popular">
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Más Populares</SelectItem>
                    <SelectItem value="recent">Más Recientes</SelectItem>
                    <SelectItem value="rating">Mejor Calificadas</SelectItem>
                    <SelectItem value="time">Tiempo de Preparación</SelectItem>
                  </SelectContent>
                </Select>
              </div> */}
            </div>

            {/* Spinner de carga */}
            {isLoading ? (
              <div className="flex justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
              </div>
            ) : recetasPaginadas.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <p>No se encontraron recetas con los filtros seleccionados.</p>
              </div>
            ) : (
              <>
                {/* Receta Grid */}
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {recetasPaginadas.map((receta) => (
                    <div key={receta.id_receta} onClick={() => navigate(`/recetas/${receta.id_receta}`)} className="cursor-pointer">
                      <Card className="overflow-hidden hover:shadow-lg transition-shadow pt-0">
                        <div className="relative">
                          <img
                            src={`${apiUrlBase}${receta.imagen_url}` || "/placeholder.svg"}
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
                          <CardTitle className="text-lg">{receta.nombre}</CardTitle>
                          <CardDescription className="text-sm">{receta.descripcion}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {receta.tiempo ? `${receta.tiempo} min` : "30 min"}
                            </div>
                            <div className="flex items-center">
                              <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                              {receta.rating || "4.5"}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1 mb-3">
                            <Badge variant="outline" className="text-xs">
                              {receta.dificultad || "Media"}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {receta.categoria.nombre}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {receta.subcategorias_receta.map((sub) =>
                              sub.subcategoria && sub.subcategoria.nombre ? (
                                <Badge key={sub.id} variant="secondary" className="text-xs">
                                  {sub.subcategoria.nombre}
                                </Badge>
                              ) : null
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>

                {/* Paginacion */}
                <div className="flex justify-center mt-12">
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                      Anterior
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <Button
                        key={i + 1}
                        variant="outline"
                        className={currentPage === i + 1 ? "bg-orange-600 text-white" : ""}
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </Button>
                    ))}
                    <Button variant="outline" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
                      Siguiente
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ListaRecetas;
