import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const rows = await sql`SELECT * FROM reports WHERE id = ${id}`;
    if (!rows || rows.length === 0) {
      return Response.json({ error: "Report not found" }, { status: 404 });
    }
    return Response.json({ report: rows[0] });
  } catch (err) {
    console.error("GET /api/reports/[id] error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = params;
    const body = await request.json();
    const { status, proof_image_url, official_name } = body;

    const setClauses = [];
    const values = [];

    if (status) {
      setClauses.push(`status = $${values.length + 1}`);
      values.push(status);
    }
    if (proof_image_url) {
      setClauses.push(`proof_image_url = $${values.length + 1}`);
      values.push(proof_image_url);
    }
    if (official_name) {
      setClauses.push(`official_name = $${values.length + 1}`);
      values.push(official_name);
    }
    setClauses.push(`auth_official_id = $${values.length + 1}`);
    values.push(session.user.id);
    setClauses.push(`updated_at = CURRENT_TIMESTAMP`);

    values.push(id);
    const query = `UPDATE reports SET ${setClauses.join(", ")} WHERE id = $${values.length} RETURNING *`;
    const result = await sql(query, values);

    if (!result || result.length === 0) {
      return Response.json({ error: "Report not found" }, { status: 404 });
    }
    return Response.json({ report: result[0] });
  } catch (err) {
    console.error("PATCH /api/reports/[id] error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
