import sql from "@/app/api/utils/sql";

export async function GET() {
  try {
    const pendingOfficials = await sql`
      SELECT id, name, email, created_at 
      FROM users 
      WHERE role = 'pending_official'
      ORDER BY created_at DESC
    `;

    return Response.json({
      pendingOfficials,
      count: pendingOfficials.length,
    });
  } catch (error) {
    console.error("Error fetching pending officials:", error);
    return Response.json(
      { error: "Failed to fetch pending officials" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return Response.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Reject (delete) pending official account
    const result = await sql`
      DELETE FROM users 
      WHERE id = ${userId} AND role = 'pending_official'
      RETURNING id, email
    `;

    if (result.length === 0) {
      return Response.json(
        { error: "User not found or not in pending status" },
        { status: 404 }
      );
    }

    // TODO: Send rejection email notification to user
    
    return Response.json({
      success: true,
      message: "Official request rejected",
      user: result[0],
    });
  } catch (error) {
    console.error("Error rejecting official:", error);
    return Response.json(
      { error: "Failed to reject official" },
      { status: 500 }
    );
  }
}
