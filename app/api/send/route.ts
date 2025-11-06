import { EmailTemplate } from "@/components/email-template/email";
import { ContactNotification } from "@/components/email-template/contact-notification";
import { Resend } from "resend";
import { NextRequest } from "next/server";
import { rateLimit, createRateLimitHeaders } from "@/lib/rate-limit";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  // Rate limiting: 5 emails per hour per IP
  const rateLimitResult = await rateLimit(request, {
    interval: 60 * 60 * 1000, // 1 hour
    uniqueTokenPerInterval: 5,
  });

  // If rate limit exceeded, return 429 error
  if (!rateLimitResult.success) {
    return Response.json(
      {
        error: "Too many requests. Please try again later.",
        limit: rateLimitResult.limit,
        remaining: rateLimitResult.remaining,
        reset: new Date(rateLimitResult.reset).toISOString(),
      },
      {
        status: 429,
        headers: createRateLimitHeaders(rateLimitResult),
      }
    );
  }

  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return Response.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Extract first name from full name
    const firstName = name.split(" ")[0];

    // Send auto-response to the person who contacted you
    const senderName = process.env.EMAIL_SENDER_NAME || "Bryan Palay";
    const senderAddress =
      process.env.EMAIL_SENDER_ADDRESS || "onboarding@resend.dev";

    console.log("Sending auto-response email to:", email);
    console.log("From:", `${senderName} <${senderAddress}>`);

    const { data: autoResponseData, error: autoResponseError } =
      await resend.emails.send({
        from: `${senderName} <${senderAddress}>`,
        to: [email],
        subject: "Thank you for reaching out!",
        react: EmailTemplate({ firstName }),
      });

    if (autoResponseError) {
      console.error("Auto-response error:", autoResponseError);
      return Response.json({ error: autoResponseError }, { status: 500 });
    }

    console.log("Auto-response sent successfully:", autoResponseData);

    // Send notification to yourself with the contact details
    console.log("Sending notification email to:", process.env.EMAIL_RECIPIENT);

    const { data: notificationData, error: notificationError } =
      await resend.emails.send({
        from: `Portfolio Contact <${senderAddress}>`,
        to: [process.env.EMAIL_RECIPIENT || "bryanpalay119@gmail.com"],
        subject: `New Portfolio Contact from ${name}`,
        react: ContactNotification({ name, email, message }),
        replyTo: email,
      });

    if (notificationError) {
      console.error("Notification error:", notificationError);
      // Still return success if auto-response worked
      return Response.json(
        {
          success: true,
          message: "Auto-response sent, but notification failed",
          data: autoResponseData,
        },
        {
          status: 200,
          headers: createRateLimitHeaders(rateLimitResult),
        }
      );
    }

    console.log("Notification sent successfully:", notificationData);

    return Response.json(
      {
        success: true,
        message: "Email sent successfully",
        data: {
          autoResponse: autoResponseData,
          notification: notificationData,
        },
      },
      {
        headers: createRateLimitHeaders(rateLimitResult),
      }
    );
  } catch (error) {
    console.error("Email error:", error);
    return Response.json(
      { error: "Failed to send email" },
      {
        status: 500,
        headers: createRateLimitHeaders(rateLimitResult),
      }
    );
  }
}
