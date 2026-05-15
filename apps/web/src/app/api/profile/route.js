import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;
    const rows =
      await sql`SELECT id, name, email, image, role FROM auth_users WHERE id = ${userId} LIMIT 1`;
    const user = rows?.[0] || null;
    return Response.json({ user });
  } catch (err) {
    console.error("GET /api/profile error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;
    const body = await request.json();
    const { role } = body || {};

    const allowedRoles = ["resident", "official"];
    if (!role || !allowedRoles.includes(role)) {
      return Response.json({ error: "Invalid role" }, { status: 400 });
    }

    const result = await sql`
      UPDATE auth_users SET role = ${role} WHERE id = ${userId}
      RETURNING id, name, email, image, role
    `;
    const updated = result?.[0] || null;
    return Response.json({ user: updated });
  } catch (err) {
    console.error("PUT /api/profile error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
