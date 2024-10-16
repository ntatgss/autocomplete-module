"use client";

import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

export default function SignInPage() {
  const { theme } = useTheme();

  return (
    <SignIn
      forceRedirectUrl="/draft"
      appearance={{ baseTheme: theme === "dark" ? dark : undefined }}
    />
  );
}