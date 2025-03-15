
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { HomeIcon, Building2, ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";

interface EmpresaBreadcrumbsProps {
  nombreEmpresa?: string;
}

export function EmpresaBreadcrumbs({ nombreEmpresa }: EmpresaBreadcrumbsProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const isEditPage = location.pathname.includes("/editar");

  const handleBack = () => {
    if (isEditPage && id) {
      navigate(`/empresas/${id}`);
    } else {
      navigate("/empresas");
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-4 justify-between mb-6 mt-4">
      <Button
        variant="ghost"
        onClick={handleBack}
        className="text-teal hover:text-sage hover:bg-mint/20"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {isEditPage ? "Volver a detalles" : "Volver al listado"}
      </Button>
      
      <Breadcrumb className="hidden md:block">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => navigate("/dashboard")}>
              <HomeIcon className="h-4 w-4 mr-1" />
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => navigate("/empresas")}>
              <Building2 className="h-4 w-4 mr-1" />
              Empresas
            </BreadcrumbLink>
          </BreadcrumbItem>
          {id && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isEditPage ? (
                  <BreadcrumbLink onClick={() => navigate(`/empresas/${id}`)}>
                    {nombreEmpresa || "Detalle Empresa"}
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>
                    {nombreEmpresa || "Detalle Empresa"}
                  </BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </>
          )}
          {isEditPage && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Editar</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
