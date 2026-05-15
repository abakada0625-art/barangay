import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const mine = searchParams.get("mine");

    const session = await auth();
    const userId = session?.user?.id;

    let rows;
    if (mine && userId) {
      if (status) {
        rows = await sql`
          SELECT * FROM reports
          WHERE auth_reporter_id = ${userId} AND status = ${status}
          ORDER BY created_at DESC
        `;
      } else {
        rows = await sql`
          SELECT * FROM reports
          WHERE auth_reporter_id = ${userId}
          ORDER BY created_at DESC
        `;
      }
    } else if (status) {
      rows =
        await sql`SELECT * FROM reports WHERE status = ${status} ORDER BY created_at DESC`;
    } else {
      rows = await sql`SELECT * FROM reports ORDER BY created_at DESC`;
    }
    return Response.json({ reports: rows });
  } catch (err) {
    console.error("GET /api/reports error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const {
      title,
      description,
      category,
      location,
      address,
      image_url,
      reporter_name,
    } = body;
    if (!title || !category || !location) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }
    const result = await sql`
      INSERT INTO reports (title, description, category, location, address, image_url, auth_reporter_id, reporter_name, status)
      VALUES (${title}, ${description || null}, ${category}, ${location}, ${address || null}, ${image_url || null}, ${session.user.id}, ${reporter_name || null}, 'pending')
      RETURNING *
    `;
    return Response.json({ report: result[0] }, { status: 201 });
  } catch (err) {
    console.error("POST /api/reports error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
