import { NextResponse } from "next/server";
import connectDB from "@/db/mongodb";
import Email from "@/models/Email";

export async function GET() {
  return NextResponse.json({ message: "Email already exist" }, { status: 500 });
}

export async function POST(req: Request) {
  await connectDB();

  try {
    const email = await req.json();
    if (!email) {
      return new NextResponse("Missing field", { status: 400 });
    }

    const checkEmail = await Email.findOne({ email: email });

    if (checkEmail) {
      return NextResponse.json(
        { message: "Email already exist" },
        { status: 500 }
      );
    }

    const newEmail = new Email({ email });
    return NextResponse.json(await newEmail.save(), { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
