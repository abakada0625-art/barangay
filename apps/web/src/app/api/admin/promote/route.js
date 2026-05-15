// ⚠️ FIRST-TIME SETUP ROUTE - DELETE THIS FILE after you've created your first admin account.
// This route lets you promote ANY user to admin by their email.
// It has no auth protection by design — it's only meant for initial setup.
import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return Response.json({ error: "Email is required" }, { status: 400 });
    }
    const result = await sql`
      UPDATE auth_users SET role = 'admin' WHERE email = ${email}
      RETURNING id, name, email, role
    `;
    if (!result || result.length === 0) {
      return Response.json(
        { error: "No user found with that email" },
        { status: 404 },
      );
    }
    return Response.json({
      user: result[0],
      message: "User promoted to admin successfully",
    });
  } catch (err) {
    console.error("POST /api/admin/promote error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
