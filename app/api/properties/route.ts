import { NextResponse } from "next/server";
import { loadAllProperties } from "@/lib/feeds";

export async function GET() {
  try {
    const properties = await loadAllProperties();
    return NextResponse.json(properties);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to load properties" },
      { status: 500 },
    );
  }
}
