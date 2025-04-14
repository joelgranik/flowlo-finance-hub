
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const DataEntryNav = () => {
  const location = useLocation();

  return (
    <NavigationMenu className="mb-6">
      <NavigationMenuList className="flex space-x-4 border-b w-full pb-2">
        <NavigationMenuItem>
          <Link
            to="/data-entry/bank-balance"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              location.pathname === "/data-entry/bank-balance" ? "text-primary" : "text-muted-foreground"
            )}
          >
            Bank Balance
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link
            to="/data-entry/inflows"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              location.pathname === "/data-entry/inflows" ? "text-primary" : "text-muted-foreground"
            )}
          >
            Inflows
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link
            to="/data-entry/outflows"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              location.pathname === "/data-entry/outflows" ? "text-primary" : "text-muted-foreground"
            )}
          >
            Outflows
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default DataEntryNav;
