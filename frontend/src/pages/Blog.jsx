import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChefHat, BookOpen, Heart, Leaf, Mail, MessageCircle, Sparkles } from 'lucide-react';
import usuarioService from '@/services/usuarioService';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

export default function Blog() {
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({ nombre: '', email: '', mensaje: '' });
  const [enviado, setEnviado] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const blogPosts = [
    {
      id: 1,
      titulo: '5 Consejos para un Ceviche Perfecto',
      descripcion: 'Descubre los secretos para preparar un ceviche fresco y delicioso como un verdadero chef peruano.',
      fecha: '2025-06-01',
      categoria: 'Tips',
      icon: <ChefHat className="h-6 w-6 text-orange-600" />,
    },
    {
      id: 2,
      titulo: 'La Historia del Ají de Gallina',
      descripcion: 'Un recorrido por el origen y evolución de uno de los platos más emblemáticos de la gastronomía peruana.',
      fecha: '2025-05-28',
      categoria: 'Cultura',
      icon: <BookOpen className="h-6 w-6 text-yellow-700" />,
    },
    {
      id: 3,
      titulo: 'Recetas Saludables: Opciones Ligeras para el Verano',
      descripcion: 'Ideas frescas y nutritivas para disfrutar de la comida peruana sin descuidar la salud.',
      fecha: '2025-05-20',
      categoria: 'Salud',
      icon: <Leaf className="h-6 w-6 text-green-600" />,
    },
    {
      id: 4,
      titulo: 'Trucos para Cocinar con Quinoa',
      descripcion: 'Aprende a incorporar la quinoa en tus platos diarios con estos consejos prácticos.',
      fecha: '2025-05-10',
      categoria: 'Tips',
      icon: <Sparkles className="h-6 w-6 text-lime-600" />,
    },
  ];

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    setIsLoading(true);
    try {
      const response = await usuarioService.getUsuarios();
      setUsuarios(response.data);
      console.log(response.data);
      console.log(usuarios[0]);
    } catch (error) {
      console.error('Error al obtener los usuarios', error);
      setError("Error de conexión");
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setEnviado(true);
    setTimeout(() => setEnviado(false), 3000);
    setForm({ nombre: '', email: '', mensaje: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-red-50">
      <Header />
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-orange-700 mb-8 flex items-center justify-center gap-2">
            <BookOpen className="h-8 w-8 text-orange-600" /> Blog y Novedades
          </h1>
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {blogPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-xl transition-shadow">
                <CardHeader className="flex flex-row items-center gap-3 pb-2">
                  {post.icon}
                  <div>
                    <CardTitle className="text-lg">{post.titulo}</CardTitle>
                    <CardDescription className="text-xs text-gray-500">{post.fecha} · {post.categoria}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-gray-700">{post.descripcion}</p>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      {/* <AvatarImage src={post.avatar} alt={post.autor} /> */}
                      <AvatarFallback>{usuarios.length > 0 ? usuarios[0].nombre[0] : "?"}</AvatarFallback>
                    </Avatar>
                      {usuarios.length > 0 ? usuarios[0].nombre : "Invitado"}
                  </div>
                </CardContent>
              </Card>
            ))}
            <div className="bg-white rounded-xl shadow-lg p-8 md:col-span-2">
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2 text-orange-700">
                <Mail className="h-6 w-6 text-orange-600" /> Contáctanos
              </h2>
              <p className="mb-6 text-gray-600">¿Tienes dudas, sugerencias o quieres colaborar? ¡Escríbenos!</p>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    name="nombre"
                    placeholder="Tu nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    name="email"
                    type="email"
                    placeholder="Tu email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <Textarea
                  name="mensaje"
                  placeholder="Escribe tu mensaje..."
                  rows={4}
                  value={form.mensaje}
                  onChange={handleChange}
                  required
                />
                <Button type="submit" className="bg-orange-600 hover:bg-orange-700 w-full flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" /> Enviar Mensaje
                </Button>
                {enviado && (
                  <div className="text-green-600 text-center mt-2">¡Mensaje enviado correctamente!</div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
