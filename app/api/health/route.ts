import { checkDatabaseConnection } from "@/lib/db-health";

export const runtime = "nodejs";

export async function GET() {
  const database = await checkDatabaseConnection();

  return Response.json({
    ok: true,
    app: "Starsuit Lodges",
    database: database.ok ? "ok" : "unavailable",
    timestamp: new Date().toISOString(),
  });
}
