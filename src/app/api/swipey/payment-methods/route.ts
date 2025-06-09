"use server";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const SWIPEY = "https://swipey.ai/api/v1";
const EMAIL = process.env.SWIPEY_EMAIL!;
const PASS = process.env.SWIPEY_PASSWORD!;

const sw = (p: string, o: RequestInit = {}) =>
  fetch(`${SWIPEY}${p}`, { ...o, cache: "no-store" });

const split = (h: string) => {
  console.log(
    "%csrc/app/api/swipey/payment-methods/route.ts:15 h",
    "color: #007acc;",
    h,
  );
  // eslint-disable-next-line no-useless-escape
  return h.split(/,(?=\s*[0-9A-Za-z_\-]+=)/).filter(Boolean);
};

const parse = (row: string) => {
  console.log(
    "%csrc/app/api/swipey/payment-methods/route.ts:17 row",
    "color: #007acc;",
    row,
  );
  const [pair] = row.split(";", 1);
  const i = pair.indexOf("=");
  return { name: pair.slice(0, i).trim(), value: pair.slice(i + 1).trim() };
};

export async function GET() {
  const jar = await cookies();

  let access = jar.get("access_token")?.value ?? "";
  let refresh = jar.get("refresh_token")?.value ?? "";

  if (!refresh) {
    const login = await sw("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: EMAIL, password: PASS }),
    });
    if (!login.ok)
      return NextResponse.json(await login.json(), { status: login.status });

    split(login.headers.get("set-cookie") ?? "")
      .map(parse)
      .forEach((c) =>
        jar.set(c.name, c.value, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          path: "/",
        }),
      );

    refresh = jar.get("refresh_token")?.value ?? "";
  }

  if (!access) {
    const ref = await sw("/auth/refresh", {
      method: "GET",
      headers: { Cookie: `refresh_token=${refresh}` },
    });
    console.log(
      "%csrc/app/api/swipey/payment-methods/route.ts:68 ref",
      "color: #007acc;",
      ref,
    );
    if (!ref.ok)
      return NextResponse.json(ref.statusText, { status: ref.status });

    split(ref.headers.get("set-cookie") ?? "")
      .map(parse)
      .forEach((c) =>
        jar.set(c.name, c.value, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          path: "/",
        }),
      );

    access = jar.get("access_token")?.value ?? "";
  }

  if (!access)
    return NextResponse.json({ error: "no access token" }, { status: 401 });

  const pay = await sw("/payments/methods", {
    headers: {
      Authorization: `Bearer ${access}`,
      Cookie: `refresh_token=${refresh}; access_token=${access}`,
      Accept: "application/json",
    },
  });
  console.log(
    "%csrc/app/api/swipey/payment-methods/route.ts:100 pay",
    "color: #007acc;",
    pay,
  );
  return NextResponse.json(await pay.json(), { status: pay.status });
}
