import prisma from "@/app/utils/db";
import { requireUser } from "@/app/utils/hooks";
import { emailClient } from "@/app/utils/mailtrap";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ invoiceId: string }>;
  }
) {
  try {
    const session = await requireUser();

    const { invoiceId } = await params;

    const invoiceData = await prisma.invoice.findUnique({
      where: {
        id: invoiceId,
        userId: session.user?.id,
      },
    });

    if (!invoiceData) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    const sender = {
      email: "hello@demomailtrap.com",
      name: "Sudharsan Velumani",
    };

    emailClient.send({
      from: sender,
      to: [{ email: "sudharsanmay10@gmail.com" }],
      template_uuid: "0925d9c9-d0b7-4fbc-b3dd-48d360e10ba6",
      template_variables: {
        first_name: invoiceData.clientName,
        company_info_name: "Invoice - Generator",
        company_info_address: "123 Champ Street",
        company_info_city: "Tiruppur",
        company_info_zip_code: "123456",
        company_info_country: "India",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to send Email reminder" },
      { status: 500 }
    );
  }
}
