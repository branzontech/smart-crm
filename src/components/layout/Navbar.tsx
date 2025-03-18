
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { NavLink } from "./NavLink";
import { navigationLinks } from "./navData";

export const Navbar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const expandTimeoutRef = useRef<number | null>(null);
  const collapseTimeoutRef = useRef<number | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const handleMouseEnter = () => {
    if (isMobile) return;
    
    if (collapseTimeoutRef.current !== null) {
      window.clearTimeout(collapseTimeoutRef.current);
      collapseTimeoutRef.current = null;
    }
    
    expandTimeoutRef.current = window.setTimeout(() => {
      setIsExpanded(true);
    }, 300);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    
    if (expandTimeoutRef.current !== null) {
      window.clearTimeout(expandTimeoutRef.current);
      expandTimeoutRef.current = null;
    }
    
    collapseTimeoutRef.current = window.setTimeout(() => {
      setIsExpanded(false);
    }, 500);
  };

  useEffect(() => {
    return () => {
      if (expandTimeoutRef.current !== null) {
        window.clearTimeout(expandTimeoutRef.current);
      }
      if (collapseTimeoutRef.current !== null) {
        window.clearTimeout(collapseTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Update CSS variable for sidebar width
    document.documentElement.style.setProperty(
      '--sidebar-width', 
      isExpanded ? '16rem' : '5rem'
    );
    
    if (isMobile) {
      setIsExpanded(false);
    }
    
    // Properly handle main container class
    const mainContainer = document.querySelector('.main-container');
    if (mainContainer) {
      if (isExpanded) {
        mainContainer.classList.add('expanded');
      } else {
        mainContainer.classList.remove('expanded');
      }
    }
    
    // Update header position
    const header = document.querySelector('header > div');
    if (header) {
      header.classList.remove('ml-20', 'ml-64');
      header.classList.add(isExpanded ? 'ml-64' : 'ml-20');
    }
  }, [isExpanded, isMobile]);

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setIsExpanded(false);
    }
  };

  const toggleSubmenu = (path: string) => {
    setOpenSubmenu(openSubmenu === path ? null : path);
  };

  const handleToggleClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <aside
      ref={sidebarRef}
      className={cn(
        "fixed top-0 left-0 h-screen bg-gradient-to-b from-teal to-sage shadow-lg transition-all duration-300 ease-in-out flex flex-col z-20",
        isExpanded ? "w-64" : "w-20",
        "scrollbar-custom"
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        onClick={handleToggleClick}
        className="absolute -right-3 top-6 p-1.5 bg-teal rounded-full shadow-lg hover:bg-sage transition-all duration-300 ease-in-out transform hover:scale-110 z-30"
      >
        {isExpanded ? (
          <ChevronLeft className="h-4 w-4 text-white" />
        ) : (
          <ChevronRight className="h-4 w-4 text-white" />
        )}
      </button>

      <div 
        className={cn(
          "p-4 space-y-4 overflow-y-auto h-full pt-[calc(var(--header-height)+1rem)]",
          !isExpanded && "scrollbar-hidden"
        )}
      >
        {navigationLinks.map((item) => (
          <NavLink 
            key={item.path}
            item={item}
            isExpanded={isExpanded}
            isActive={location.pathname === item.path || 
                      (item.subItems && item.subItems.some(subItem => location.pathname === subItem.path))}
            onClick={() => handleNavigation(item.path)}
            openSubmenu={openSubmenu}
            toggleSubmenu={toggleSubmenu}
          />
        ))}
      </div>
    </aside>
  );
};
