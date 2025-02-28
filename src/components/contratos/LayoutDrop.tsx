
import { Box, LayoutGrid } from "lucide-react";

interface LayoutDropProps {
  mensaje: string;
}

export const LayoutDrop = ({ mensaje }: LayoutDropProps) => {
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-gray-500 h-40">
      <LayoutGrid className="h-8 w-8 mb-2" />
      <p>{mensaje}</p>
    </div>
  );
};
