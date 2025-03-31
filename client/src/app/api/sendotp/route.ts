import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
    try {
        const { to, subject, text } = await req.json();

        if (!to || !subject || !text) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail', // Change if needed
            auth: {
                user: process.env.EMAIL_USER as string, // Your email
                pass: process.env.EMAIL_PASS as string, // App password
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER as string,
            to,
            subject,
            text,
        });

        return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { error: 'Email could not be sent', details: error.message },
            { status: 500 }
        );
    }
}
