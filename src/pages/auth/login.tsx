
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, LogIn, User, Key } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Por favor ingresa tu email y contraseña");
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (isSignUp) {
        // Handle sign up
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              nombre,
              apellido,
              username: email.split('@')[0],
            },
          },
        });

        if (error) throw error;

        toast.success("Cuenta creada exitosamente. Por favor inicia sesión.");
        setIsSignUp(false);
      } else {
        // Handle login
        await login(email, password, rememberMe);
        toast.success("¡Bienvenido al sistema!");
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error("Error de autenticación:", error);
      toast.error(error.message || "Error al procesar la solicitud");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSignUp = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-teal to-sage p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-white/10 backdrop-blur-md rounded-full mb-4">
            <LogIn className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white/80">Bienvenido a Smart CRM</h1>
          <p className="text-white/70 mt-1">
            {isSignUp ? "Crea una cuenta para continuar" : "Inicia sesión para continuar"}
          </p>
        </div>

        <Card className="backdrop-blur-md bg-white/10 border-white/20 shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-white">
              {isSignUp ? "Crear Cuenta" : "Iniciar Sesión"}
            </CardTitle>
            <CardDescription className="text-center text-white/70">
              {isSignUp
                ? "Ingresa tus datos para registrarte"
                : "Ingresa tus credenciales para acceder"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="nombre" className="text-white">Nombre</Label>
                    <Input
                      id="nombre"
                      type="text"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      placeholder="Tu nombre"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 hover:bg-white/20 focus:bg-white/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apellido" className="text-white">Apellido</Label>
                    <Input
                      id="apellido"
                      type="text"
                      value={apellido}
                      onChange={(e) => setApellido(e.target.value)}
                      placeholder="Tu apellido"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 hover:bg-white/20 focus:bg-white/20"
                    />
                  </div>
                </>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <User className="h-5 w-5 text-white/60" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tucorreo@ejemplo.com"
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 hover:bg-white/20 focus:bg-white/20"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Contraseña</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Key className="h-5 w-5 text-white/60" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña"
                    className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 hover:bg-white/20 focus:bg-white/20"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-white/60 hover:text-white"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              {!isSignUp && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember-me"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(!!checked)}
                    className="data-[state=checked]:bg-white/80 data-[state=checked]:text-gray-800 border-white/50"
                  />
                  <Label htmlFor="remember-me" className="text-sm text-white cursor-pointer hover:underline">
                    Recordarme
                  </Label>
                </div>
              )}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-md transition-all hover:scale-105"
              >
                {isLoading ? (
                  <span className="flex items-center gap-1">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                    {isSignUp ? "Registrando..." : "Iniciando..."}
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <LogIn className="h-4 w-4" />
                    {isSignUp ? "Registrarse" : "Iniciar Sesión"}
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 text-center">
            <div
              onClick={toggleSignUp}
              className="text-white/70 text-sm hover:text-white transition-colors cursor-pointer"
            >
              {isSignUp
                ? "¿Ya tienes una cuenta? Inicia sesión"
                : "¿No tienes cuenta? Regístrate"}
            </div>
            {!isSignUp && (
              <div className="text-white/70 text-sm hover:text-white transition-colors cursor-pointer">
                ¿Olvidaste tu contraseña?
              </div>
            )}
          </CardFooter>
        </Card>
        
        <div className="text-center mt-8 text-white/60 text-sm">
          © {new Date().getFullYear()} Branzon Tech. Todos los derechos reservados.
        </div>
      </div>
    </div>
  );
};

export default Login;
