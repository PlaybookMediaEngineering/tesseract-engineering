"use client";

import { useRouter } from "next/navigation";
import { deleteEvent } from "@/actions/delete-event";
import {
  ChevronDownIcon,
  CircleIcon,
  PlusIcon,
  StarIcon,
} from "@radix-ui/react-icons";
import { format } from "date-fns";
import { BellIcon, BellOffIcon, TrashIcon } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@saasfly/ui/badge";
import { Button } from "@saasfly/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Separator } from "@saasfly/ui/separator";

export function UsersCard({ channelDetails }) {
  const router = useRouter();

  const handleDelete = async (eventId) => {
    try {
      await deleteEvent(eventId);
      toast.success("The event has been deleted successfully.");
      router.refresh();
    } catch (error) {
      toast.error("There was an error deleting the event.");
      console.error("Error deleting event:", error);
    }
  };

  return (
    <div>
      <Button>asdasdasd</Button>
    </div>
  );
}
