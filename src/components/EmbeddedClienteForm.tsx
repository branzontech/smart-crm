
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NuevoClienteOriginal from "@/pages/clientes/nuevo";

interface EmbeddedClienteFormProps {
  isEmbedded?: boolean;
  onClienteCreated?: (cliente: { id: number; nombre: string }) => void;
}

// This is a wrapper component to adapt the NuevoCliente component for embedded use
const NuevoCliente = ({ isEmbedded = false, onClienteCreated }: EmbeddedClienteFormProps) => {
  const navigate = useNavigate();
  
  // Handle the submission of the form when used in embedded mode
  const handleSubmitSuccess = (cliente: { id: number, nombre: string }) => {
    if (isEmbedded && onClienteCreated) {
      onClienteCreated(cliente);
    } else {
      // Default behavior when not embedded
      navigate("/clientes");
    }
  };
  
  return (
    <NuevoClienteOriginal 
      isEmbedded={isEmbedded}
      onClienteCreated={handleSubmitSuccess}
    />
  );
};

export default NuevoCliente;
