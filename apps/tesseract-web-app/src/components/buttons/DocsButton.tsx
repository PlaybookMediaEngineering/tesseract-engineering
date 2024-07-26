import Link from "next/link";
import { cn } from "@/lib/utils";

import { buttonVariants } from "@saasfly/ui/button";

export function DocsButton() {
  return (
    <Link
      href="https://docs.dingify.io/"
      className={cn(buttonVariants({ variant: "outline" }), "px-4")}
    >
      Explore Docs
    </Link>
  );
}
