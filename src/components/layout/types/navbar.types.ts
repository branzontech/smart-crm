
import { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  icon: LucideIcon;
  path: string;
  subItems?: { label: string; path: string }[];
}

export interface NavLinkProps {
  item: NavItem;
  isExpanded: boolean;
  isActive: boolean;
  onClick: () => void;
  openSubmenu: string | null;
  toggleSubmenu: (path: string) => void;
}
