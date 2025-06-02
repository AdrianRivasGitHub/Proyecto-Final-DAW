"use client"

import { useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Clock,
  Users,
  ChefHat,
  Heart,
  Share2,
  Star,
  MapPin,
  ArrowLeft,
  Bookmark,
  MessageCircle,
  ThumbsUp,
  Calendar,
} from "lucide-react"

export default function RecipeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isFavorite, setIsFavorite] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)

  // Datos simulados de la receta
  const recipe = {
    id: 1,
    title: "Ceviche Clásico Peruano",
    description:
      "El plato bandera del Perú preparado con pescado fresco del día, limón, ají limo, cebolla morada y camote. Una explosión de sabores que representa la esencia de nuestra gastronomía.",
    image: "/placeholder.svg?height=400&width=600",
    author: {
      name: "Chef María González",
      avatar: "/placeholder.svg?height=40&width=40",
      recipes: 23,
      followers: 1250,
    },
    rating: 4.8,
    reviews: 156,
    prepTime: "30 min",
    cookTime: "0 min",
    totalTime: "30 min",
    servings: 4,
    difficulty: "Intermedio",
    region: "Costa",
    category: "Plato Principal",
    tags: ["Sin Gluten", "Saludable", "Tradicional", "Pescado"],
    ingredients: [
      { item: "Pescado fresco (lenguado o corvina)", amount: "500g" },
      { item: "Limones", amount: "8-10 unidades" },
      { item: "Ají limo", amount: "2 unidades" },
      { item: "Cebolla morada", amount: "1 unidad mediana" },
      { item: "Camote", amount: "2 unidades" },
      { item: "Choclo", amount: "1 unidad" },
      { item: "Lechuga", amount: "4 hojas" },
      { item: "Sal", amount: "Al gusto" },
      { item: "Pimienta", amount: "Al gusto" },
      { item: "Culantro", amount: "2 cucharadas picado" },
    ],
    instructions: [
      {
        step: 1,
        title: "Preparar el pescado",
        description:
          "Cortar el pescado en cubos de aproximadamente 2cm. Asegúrate de que esté bien fresco y sin espinas.",
        time: "5 min",
      },
      {
        step: 2,
        title: "Exprimir los limones",
        description: "Exprimir los limones hasta obtener suficiente jugo para cubrir completamente el pescado.",
        time: "5 min",
      },
      {
        step: 3,
        title: "Marinar el pescado",
        description:
          "Colocar el pescado en un bowl y cubrir con el jugo de limón. Dejar reposar por 10-15 minutos hasta que el pescado se 'cocine' con el ácido.",
        time: "15 min",
      },
      {
        step: 4,
        title: "Preparar las verduras",
        description:
          "Cortar la cebolla en juliana fina, picar el ají limo y el culantro. Cocinar el camote y el choclo.",
        time: "10 min",
      },
      {
        step: 5,
        title: "Mezclar y servir",
        description:
          "Agregar la cebolla, ají, sal, pimienta y culantro al pescado. Mezclar suavemente y servir acompañado de camote, choclo y lechuga.",
        time: "5 min",
      },
    ],
    nutrition: {
      calories: 180,
      protein: "25g",
      carbs: "12g",
      fat: "2g",
      fiber: "3g",
    },
    tips: [
      "Usa pescado del día para mejores resultados",
      "El tiempo de marinado es crucial - no menos de 10 minutos",
      "La cebolla debe cortarse muy fina para evitar que sea muy fuerte",
      "Sirve inmediatamente después de preparar",
    ],
  }

  const comments = [
    {
      id: 1,
      user: "Ana Rodríguez",
      avatar: "/placeholder.svg?height=32&width=32",
      rating: 5,
      comment: "¡Excelente receta! Quedó exactamente como en mi restaurante favorito. Los tiempos están perfectos.",
      date: "Hace 2 días",
      likes: 12,
    },
    {
      id: 2,
      user: "Carlos Mendoza",
      avatar: "/placeholder.svg?height=32&width=32",
      rating: 4,
      comment: "Muy buena receta, solo que yo le agregué un poco más de ají porque me gusta más picante.",
      date: "Hace 1 semana",
      likes: 8,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
              <div className="flex items-center space-x-2">
                <ChefHat className="h-8 w-8 text-orange-600" />
                <Link to="/" className="text-2xl font-bold text-gray-900">
                  Sabores del Perú
                </Link>
              </div>
            </div>
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

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recipe Header */}
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className="bg-orange-600">
                  <MapPin className="h-3 w-3 mr-1" />
                  {recipe.region}
                </Badge>
                <Badge variant="outline">{recipe.category}</Badge>
                <Badge variant="outline">{recipe.difficulty}</Badge>
                {recipe.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-4">{recipe.title}</h1>
              <p className="text-lg text-gray-600 mb-6">{recipe.description}</p>

              {/* Author & Stats */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={recipe.author.avatar || "/placeholder.svg"} />
                    <AvatarFallback>MG</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{recipe.author.name}</h3>
                    <p className="text-sm text-gray-600">
                      {recipe.author.recipes} recetas • {recipe.author.followers} seguidores
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="font-semibold">{recipe.rating}</span>
                    <span className="text-gray-600 ml-1">({recipe.reviews} reseñas)</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3 mb-8">
                <Button
                  variant={isFavorite ? "default" : "outline"}
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={isFavorite ? "bg-red-600 hover:bg-red-700" : ""}
                >
                  <Heart className={`h-4 w-4 mr-2 ${isFavorite ? "fill-current" : ""}`} />
                  {isFavorite ? "En Favoritos" : "Agregar a Favoritos"}
                </Button>
                <Button variant={isBookmarked ? "default" : "outline"} onClick={() => setIsBookmarked(!isBookmarked)}>
                  <Bookmark className={`h-4 w-4 mr-2 ${isBookmarked ? "fill-current" : ""}`} />
                  Guardar
                </Button>
                <Button variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartir
                </Button>
                <Button variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Agregar al Planificador
                </Button>
              </div>
            </div>

            {/* Recipe Image */}
            <div className="rounded-lg overflow-hidden">
              <img src={recipe.image || "/placeholder.svg"} alt={recipe.title} className="w-full h-96 object-cover" />
            </div>

            {/* Recipe Info Cards */}
            <div className="grid md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Clock className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Tiempo Total</p>
                  <p className="font-semibold">{recipe.totalTime}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Users className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Porciones</p>
                  <p className="font-semibold">{recipe.servings} personas</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <ChefHat className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Dificultad</p>
                  <p className="font-semibold">{recipe.difficulty}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Star className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Calorías</p>
                  <p className="font-semibold">{recipe.nutrition.calories}</p>
                </CardContent>
              </Card>
            </div>

            {/* Ingredients */}
            <Card>
              <CardHeader>
                <CardTitle>Ingredientes</CardTitle>
                <CardDescription>Para {recipe.servings} porciones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-3">
                  {recipe.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="font-medium">{ingredient.item}</span>
                      <span className="text-orange-600 font-semibold">{ingredient.amount}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>Instrucciones</CardTitle>
                <CardDescription>Sigue estos pasos para preparar la receta</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {recipe.instructions.map((instruction, index) => (
                    <div key={index} className="flex space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-semibold">
                          {instruction.step}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-lg">{instruction.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {instruction.time}
                          </Badge>
                        </div>
                        <p className="text-gray-600">{instruction.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Comments Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Comentarios ({comments.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {comments.map((comment) => (
                    <div key={comment.id} className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <Avatar>
                          <AvatarImage src={comment.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {comment.user
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-semibold">{comment.user}</h4>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${i < comment.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500">{comment.date}</span>
                          </div>
                          <p className="text-gray-700 mb-2">{comment.comment}</p>
                          <Button variant="ghost" size="sm">
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            {comment.likes}
                          </Button>
                        </div>
                      </div>
                      <Separator />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Nutrition Info */}
            <Card>
              <CardHeader>
                <CardTitle>Información Nutricional</CardTitle>
                <CardDescription>Por porción</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Calorías</span>
                    <span className="font-semibold">{recipe.nutrition.calories}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Proteínas</span>
                    <span className="font-semibold">{recipe.nutrition.protein}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Carbohidratos</span>
                    <span className="font-semibold">{recipe.nutrition.carbs}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Grasas</span>
                    <span className="font-semibold">{recipe.nutrition.fat}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fibra</span>
                    <span className="font-semibold">{recipe.nutrition.fiber}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Consejos del Chef</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {recipe.tips.map((tip, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Related Recipes */}
            <Card>
              <CardHeader>
                <CardTitle>Recetas Relacionadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { title: "Tiradito de Pescado", time: "20 min", rating: 4.6 },
                    { title: "Leche de Tigre", time: "15 min", rating: 4.8 },
                    { title: "Ceviche Mixto", time: "35 min", rating: 4.7 },
                  ].map((related, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <img
                        src="/placeholder.svg?height=50&width=50"
                        alt={related.title}
                        className="w-12 h-12 rounded-md object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{related.title}</h4>
                        <div className="flex items-center space-x-2 text-xs text-gray-600">
                          <Clock className="h-3 w-3" />
                          <span>{related.time}</span>
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>{related.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
