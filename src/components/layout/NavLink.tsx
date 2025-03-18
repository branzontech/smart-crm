
import React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { NavLinkProps } from "./types/navbar.types";

export const NavLink = ({ 
  item, 
  isExpanded, 
  isActive, 
  onClick, 
  openSubmenu, 
  toggleSubmenu 
}: NavLinkProps) => {
  const location = window.location;
  
  return (
    <div className="relative">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() =>
                item.subItems
                  ? toggleSubmenu(item.path)
                  : onClick()
              }
              className={cn(
                "w-full flex items-center p-3 rounded-lg text-white hover:bg-mint/20 transition-all duration-200 ease-in-out transform hover:translate-x-1",
                isActive && "bg-mint/30",
                !isExpanded && "justify-center"
              )}
            >
              {React.createElement(item.icon, {
                className: cn(
                  "h-5 w-5 min-w-[1.25rem] transition-transform duration-200",
                  isActive && "scale-110"
                )
              })}
              {isExpanded && (
                <>
                  <span className="ml-3 text-sm whitespace-nowrap">
                    {item.label}
                  </span>
                  {item.subItems && (
                    <ChevronDown
                      className={cn(
                        "ml-auto h-4 w-4 transition-transform duration-300 ease-in-out",
                        openSubmenu === item.path && "rotate-180"
                      )}
                    />
                  )}
                </>
              )}
            </button>
          </TooltipTrigger>
          {!isExpanded && (
            <TooltipContent
              side="right"
              className="bg-teal text-white animate-in fade-in-50 zoom-in-95"
            >
              {item.label}
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>

      {item.subItems && openSubmenu === item.path && isExpanded && (
        <div className="ml-8 mt-2 space-y-2 overflow-hidden">
          {item.subItems.map((subItem, index) => (
            <button
              key={subItem.path}
              onClick={() => onClick()}
              className={cn(
                "w-full text-left p-2 text-sm text-white/80 hover:text-white hover:bg-mint/20 rounded-md transition-all duration-200 ease-in-out transform hover:translate-x-1",
                location.pathname === subItem.path && "bg-mint/30",
                "animate-in fade-in-50 slide-in-from-left-2",
                "data-[state=open]:animate-in",
                "data-[state=closed]:animate-out",
                "data-[state=closed]:fade-out-0",
                "data-[state=open]:fade-in-0",
                "data-[state=closed]:zoom-out-95",
                "data-[state=open]:zoom-in-95"
              )}
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {subItem.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
