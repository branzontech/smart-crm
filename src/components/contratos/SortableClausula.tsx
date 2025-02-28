
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ClausulaItem } from "./ClausulaItem";
import { Clausula } from "@/types/contrato";

interface SortableClausulaProps {
  clausula: Clausula;
  onUpdate: (id: string, contenido: string) => void;
  onRemove: (id: string) => void;
}

export const SortableClausula = ({ 
  clausula, 
  onUpdate, 
  onRemove 
}: SortableClausulaProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: clausula.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    marginBottom: "1rem"
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="cursor-grab">
      <ClausulaItem 
        clausula={clausula} 
        onUpdate={onUpdate}
        onRemove={onRemove}
      />
    </div>
  );
};
