import sql from "@/app/api/utils/sql";

export async function GET() {
  try {
    const users = await sql`SELECT * FROM users ORDER BY role DESC`;
    return Response.json(users);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
