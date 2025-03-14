
import { Layout } from "@/components/layout/Layout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Building2, FileText, Globe, MapPin, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MaestroCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
}

const MaestroCard = ({ title, description, icon, path }: MaestroCardProps) => {
  const navigate = useNavigate();
  
  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => navigate(path)}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
};

const MaestrosIndexPage = () => {
  const maestros = [
    {
      title: "Sectores",
      description: "Administrar sectores para clasificación de empresas",
      icon: <Building2 className="h-5 w-5" />,
      path: "/maestros/sectores",
    },
    {
      title: "Tipos de Servicios",
      description: "Administrar tipos de servicios que se ofrecen",
      icon: <FileText className="h-5 w-5" />,
      path: "/maestros/tipos-servicios",
    },
    {
      title: "Países",
      description: "Administrar catálogo de países",
      icon: <Globe className="h-5 w-5" />,
      path: "/maestros/paises",
    },
    {
      title: "Ciudades",
      description: "Administrar catálogo de ciudades por país",
      icon: <MapPin className="h-5 w-5" />,
      path: "/maestros/ciudades",
    },
    {
      title: "Orígenes de Cliente",
      description: "Administrar orígenes de captación de clientes",
      icon: <UserPlus className="h-5 w-5" />,
      path: "/maestros/origenes-cliente",
    },
  ];

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Datos Maestros</h1>
        <p className="text-muted-foreground mb-8">
          Administre los datos maestros que se utilizan en todo el sistema.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {maestros.map((maestro, index) => (
            <MaestroCard
              key={index}
              title={maestro.title}
              description={maestro.description}
              icon={maestro.icon}
              path={maestro.path}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default MaestrosIndexPage;
