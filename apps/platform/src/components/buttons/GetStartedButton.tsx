"use client";

import { useRouter } from "next/navigation";
import { useSigninModal } from "@/hooks/use-signin-modal";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { useSession } from "next-auth/react";

import { Button, buttonVariants } from "@saasfly/ui/button";
import { cn } from "@saasfly/ui/utils/cn";

export function GetStartedButton() {
  const signInModal = useSigninModal();
  const { data: session } = useSession();
  const router = useRouter();

  const handleClick = () => {
    if (!session) {
      signInModal.onOpen();
      return;
    }

    router.push("/dashboard");
  };

  return (
    <Button
      className={cn(
        buttonVariants({ size: "lg" }),
        "animate-fade-in translate-y-[-1rem] gap-1 rounded-lg text-white opacity-0 ease-in-out [--animation-delay:600ms] dark:text-black",
      )}
      onClick={handleClick}
    >
      <span>Get Started for free </span>
      <ArrowRightIcon className="ml-1 size-4 transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
    </Button>
  );
}
