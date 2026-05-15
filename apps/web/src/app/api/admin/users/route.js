import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const [me] =
      await sql`SELECT role FROM auth_users WHERE id = ${session.user.id}`;
    if (me?.role !== "admin") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }
    const users =
      await sql`SELECT id, name, email, role, "emailVerified" FROM auth_users ORDER BY role, name`;
    return Response.json({ users });
  } catch (err) {
    console.error("GET /api/admin/users error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const [me] =
      await sql`SELECT role FROM auth_users WHERE id = ${session.user.id}`;
    if (me?.role !== "admin") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }
    const { userId, role } = await request.json();
    const allowedRoles = ["resident", "official", "admin"];
    if (!userId || !allowedRoles.includes(role)) {
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }
    const result = await sql`
      UPDATE auth_users SET role = ${role} WHERE id = ${userId}
      RETURNING id, name, email, role
    `;
    return Response.json({ user: result?.[0] });
  } catch (err) {
    console.error("PATCH /api/admin/users error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
