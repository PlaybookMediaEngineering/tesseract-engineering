import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  Home,
  LineChart,
  Package,
  Package2,
  PanelLeft,
  PlusCircle,
  Search,
  Settings,
  ShoppingCart,
  Upload,
  Users2,
} from "lucide-react";

import { Badge } from "@saasfly/ui/badge";
import { Button } from "@saasfly/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@saasfly/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@saasfly/ui/dropdown-menu";
import { Input } from "@saasfly/ui/input";
import { Label } from "@saasfly/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@saasfly/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@saasfly/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@saasfly/ui/table";
import { Textarea } from "@saasfly/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@saasfly/ui/tooltip";

import { UserChartActivity } from "./UserChartActivity";
import UserEmailCard from "./UserEmailCard";
import { UserGridActivity } from "./UserGridActivity";
import { UserPowerCard } from "./UserPowerCard";
import UsersDashboardTable from "./UsersDashboardTable";

export function UserMainSection({ customerDetails }) {
  console.log(customerDetails);
  return (
    <div className="">
      <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <UsersDashboardTable customerDetails={customerDetails} />
          <UserChartActivity />
        </div>
        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
          <UserPowerCard customerDetails={customerDetails} />
          <UserGridActivity dings={customerDetails.events} />
          <UserEmailCard customerDetails={customerDetails} />
        </div>
      </div>
    </div>
  );
}
