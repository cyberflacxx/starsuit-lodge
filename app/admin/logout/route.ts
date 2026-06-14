import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await getSupabaseServerClient();
    await supabase.auth.signOut();
  } catch {
    // Fail closed to the login page even if session cleanup hits an environment issue.
  }

  return NextResponse.redirect(new URL("/admin/login", request.url));
}
