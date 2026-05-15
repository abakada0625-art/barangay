import sql from "@/app/api/utils/sql";

export async function POST(req) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return Response.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Update user role from pending_official to official
    const result = await sql`
      UPDATE users 
      SET role = 'official', email_verified = true 
      WHERE id = ${userId} AND role = 'pending_official'
      RETURNING id, email, name, role
    `;

    if (result.length === 0) {
      return Response.json(
        { error: "User not found or not in pending status" },
        { status: 404 }
      );
    }

    // TODO: Send approval email notification to user
    
    return Response.json({
      success: true,
      message: "Official approved successfully",
      user: result[0],
    });
  } catch (error) {
    console.error("Error approving official:", error);
    return Response.json(
      { error: "Failed to approve official" },
      { status: 500 }
    );
  }
}
