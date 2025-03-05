
import { EmbeddedClienteForm } from "./EmbeddedClienteForm";

interface CreateClienteDialogProps {
  onClienteCreated: (cliente: { id: number; nombre: string }) => void;
}

export function CreateClienteDialog({ onClienteCreated }: CreateClienteDialogProps) {
  return (
    <EmbeddedClienteForm onClienteCreated={onClienteCreated} />
  );
}
