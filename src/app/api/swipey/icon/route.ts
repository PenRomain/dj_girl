"use server";

import axios from "axios";
import { NextResponse } from "next/server";

const SWIPEY = "https://ud824.com/v2/icons/coin.svg";

export async function GET() {
  try {
    const result = await axios.get(SWIPEY);

    return NextResponse.json(await result.data, { status: result.status });
  } catch (e) {
    console.log(
      "%csrc/app/api/swipey/icon/route.ts:12 e",
      "color: #007acc;",
      e,
    );
  }
  return NextResponse.json({ status: 501 });
}
