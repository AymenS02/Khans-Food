"use server";

import { Resend } from "resend";
import { z } from "zod";

export interface ContactFormActionState {
  success: boolean;

  message: string;

  fieldErrors?: {
    name?: string[];
    email?: string[];
    phone?: string[];
    inquiryType?: string[];
    orderNumber?: string[];
    message?: string[];
  };
}

const contactFormSchema =
  z.object({
    name: z
      .string()
      .trim()
      .min(
        2,
        "Please enter your name."
      )
      .max(
        100,
        "Name is too long."
      ),

    email: z
      .string()
      .trim()
      .email(
        "Please enter a valid email address."
      )
      .max(
        254,
        "Email address is too long."
      ),

    phone: z
      .string()
      .trim()
      .max(
        30,
        "Phone number is too long."
      )
      .optional(),

    inquiryType: z.enum([
      "order",
      "catering",
      "general",
      "feedback",
    ]),

    orderNumber: z
      .string()
      .trim()
      .max(
        100,
        "Order number is too long."
      )
      .optional(),

    message: z
      .string()
      .trim()
      .min(
        10,
        "Please provide a little more detail."
      )
      .max(
        3000,
        "Message must be 3,000 characters or less."
      ),
  });

const inquiryLabels = {
  order: "Order Question",
  catering:
    "Catering Question",
  general:
    "General Question",
  feedback: "Feedback",
} as const;

export async function sendContactMessage(
  _previousState:
    ContactFormActionState,

  formData: FormData
): Promise<ContactFormActionState> {
  /*
   * ==========================================
   * 1. BOT / HONEYPOT CHECK
   * ==========================================
   *
   * Real users never see or fill this field.
   * Basic form bots frequently will.
   *
   * Return a normal success response so bots
   * are not told that they were detected.
   */

  const website =
    formData.get(
      "website"
    );

  if (
    typeof website ===
      "string" &&
    website.trim().length > 0
  ) {
    return {
      success: true,

      message:
        "Thanks! Your message has been sent.",
    };
  }

  /*
   * ==========================================
   * 2. VALIDATION
   * ==========================================
   */

  const phone =
    optionalString(
      formData.get(
        "phone"
      )
    );

  const orderNumber =
    optionalString(
      formData.get(
        "orderNumber"
      )
    );

  const parsed =
    contactFormSchema.safeParse({
      name:
        stringValue(
          formData.get(
            "name"
          )
        ),

      email:
        stringValue(
          formData.get(
            "email"
          )
        ),

      phone,

      inquiryType:
        stringValue(
          formData.get(
            "inquiryType"
          )
        ),

      orderNumber,

      message:
        stringValue(
          formData.get(
            "message"
          )
        ),
    });

  if (!parsed.success) {
    return {
      success: false,

      message:
        "Please fix the highlighted fields and try again.",

      fieldErrors:
        parsed.error.flatten()
          .fieldErrors,
    };
  }

  const data =
    parsed.data;

  /*
   * ==========================================
   * 3. EMAIL CONFIGURATION
   * ==========================================
   */

  const apiKey =
    process.env
      .RESEND_API_KEY;

  const fromEmail =
    process.env
      .RESEND_FROM_EMAIL;

  const contactToEmail =
    process.env
      .CONTACT_TO_EMAIL;

  if (
    !apiKey ||
    !fromEmail ||
    !contactToEmail
  ) {
    console.error(
      "Contact form email configuration is incomplete."
    );

    return {
      success: false,

      message:
        "We couldn't send your message right now. Please try again later.",
    };
  }

  const resend =
    new Resend(
      apiKey
    );

  const inquiryLabel =
    inquiryLabels[
      data.inquiryType
    ];

  /*
   * If RESEND_FROM_EMAIL contains only an
   * email address, give it the Khans Food
   * display name automatically.
   *
   * This also supports values already formatted
   * like:
   *
   * Khans Food <contact@example.com>
   */
  const sender =
    fromEmail.includes("<")
      ? fromEmail
      : `Khans Food <${fromEmail}>`;

  /*
   * ==========================================
   * 4. SEND
   * ==========================================
   */

  try {
    const {
      error,
    } =
      await resend.emails.send({
        from:
          sender,

        to:
          contactToEmail,

        /*
         * When you press Reply in your inbox,
         * the response goes to the customer
         * instead of your Resend sender.
         */
        replyTo:
          data.email,

        subject:
          `Khans Food Contact — ${inquiryLabel}`,

        /*
         * Plain text prevents customer-provided
         * content from being interpreted as HTML.
         */
        text: [
          "New message from the Khans Food website",
          "",
          `Inquiry: ${inquiryLabel}`,
          `Name: ${data.name}`,
          `Email: ${data.email}`,
          `Phone: ${data.phone || "Not provided"}`,
          `Order #: ${data.orderNumber || "Not provided"}`,
          "",
          "Message:",
          "----------------------------------------",
          data.message,
        ].join("\n"),
      });

    if (error) {
      console.error(
        "Resend contact email failed:",
        error
      );

      return {
        success: false,

        message:
          "We couldn't send your message right now. Please try again.",
      };
    }
  } catch (error) {
    console.error(
      "Unable to send contact form message:",
      error
    );

    return {
      success: false,

      message:
        "We couldn't send your message right now. Please try again.",
    };
  }

  /*
   * ==========================================
   * 5. SUCCESS
   * ==========================================
   */

  return {
    success: true,

    message:
      "Thanks! Your message has been sent. We'll get back to you as soon as we can.",
  };
}

function stringValue(
  value:
    FormDataEntryValue | null
) {
  return typeof value ===
    "string"
    ? value
    : "";
}

function optionalString(
  value:
    FormDataEntryValue | null
) {
  if (
    typeof value !==
    "string"
  ) {
    return undefined;
  }

  const trimmed =
    value.trim();

  return trimmed.length > 0
    ? trimmed
    : undefined;
}