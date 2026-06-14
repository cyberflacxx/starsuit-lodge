"use client";

import { useState } from "react";
import { LoaderCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogout() {
    setIsLoading(true);
    window.location.href = "/admin/logout";
  }

  return (
    <Button type="button" variant="outline" onClick={handleLogout} disabled={isLoading}>
      {isLoading ? (
        <>
          <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
          Signing out
        </>
      ) : (
        <>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </>
      )}
    </Button>
  );
}
