import Link from "next/link";

import { Button } from "@saasfly/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@saasfly/ui/dialog";
import { Input } from "@saasfly/ui/input";
import { Label } from "@saasfly/ui/label";

export function SubmitProperty() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Submit Property</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Do you want to submit your property?</DialogTitle>
          <DialogDescription>
            Lets send this to your provider (Finn.no)
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Link href="/property" passHref>
            <Button type="submit">Save new property</Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
