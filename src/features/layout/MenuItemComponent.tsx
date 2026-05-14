import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ChevronDown, type LucideIcon } from "lucide-react";

export type MenuItem = {
  id: string;
  path?: string;
  labelKey: string;
  icon?: string;
  children?: MenuItem[];
  level?: number;
  end?: boolean;
};

type MenuItemProps = {
  item: MenuItem;
  collapsed: boolean;
  iconMap: Record<string, LucideIcon>;
};

export function MenuItemComponent({
  item,
  collapsed,
  iconMap,
}: MenuItemProps) {
  const { t } = useTranslation("layout");
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const IconComponent = item.icon ? iconMap[item.icon] : null;
  const level = item.level || 1;

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const hasActiveDescendant = (menuItem: MenuItem, pathname: string): boolean => {
    if (!menuItem.children?.length) {
      return false;
    }

    return menuItem.children.some((child) => {
      if (child.path === pathname) {
        return true;
      }
      return hasActiveDescendant(child, pathname);
    });
  };

  // Items with children: render as a toggle button (no navigation)
  if (hasChildren) {
    const isActiveParent = hasActiveDescendant(item, location.pathname);

    return (
      <div className={`sidebar-link-wrapper sidebar-link-wrapper--level-${level}`}>
        <button
          type="button"
          className={`sidebar-link sidebar-link--level-${level} ${isActiveParent ? "is-active" : ""}`}
          onClick={handleToggle}
          aria-expanded={isOpen}
          title={collapsed ? t(item.labelKey) : undefined}
        >
          {IconComponent && level === 1 && (
            <span className="sidebar-link__icon" aria-hidden="true">
              <IconComponent size={16} aria-hidden="true" />
            </span>
          )}
          {!collapsed && (
            <span className="sidebar-link__label">{t(item.labelKey)}</span>
          )}
          {!collapsed && (
            <span className={`sidebar-link__chevron ${isOpen ? "is-open" : ""}`}>
              <ChevronDown size={14} aria-hidden="true" />
            </span>
          )}
        </button>
        {isOpen && !collapsed && (
          <div className="sidebar-link-submenu">
            {item.children?.map((child) => (
              <MenuItemComponent
                key={child.id}
                item={child}
                collapsed={collapsed}
                iconMap={iconMap}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Leaf item: render as NavLink
  return (
    <div
      className={`sidebar-link-wrapper sidebar-link-wrapper--level-${level}`}
    >
      <NavLink
        to={item.path ?? "#"}
        end={item.end ?? true}
        className={({ isActive }) =>
          `sidebar-link sidebar-link--level-${level} ${isActive ? "is-active" : ""}`
        }
        title={collapsed ? t(item.labelKey) : undefined}
      >
        {IconComponent && level === 1 && (
          <span className="sidebar-link__icon" aria-hidden="true">
            <IconComponent size={16} aria-hidden="true" />
          </span>
        )}
        {!collapsed && (
          <span className="sidebar-link__label">{t(item.labelKey)}</span>
        )}
      </NavLink>
    </div>
  );
}
