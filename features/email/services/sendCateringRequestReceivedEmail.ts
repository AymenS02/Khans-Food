import { Types } from "mongoose";

import { connectToDatabase } from "@/lib/mongodb";

import {
  getResendClient,
  getResendFromEmail,
} from "@/lib/resend";

import CateringRequest from "@/models/CateringRequest";

interface SendCateringRequestReceivedEmailInput {
  requestId: string;

  recipientEmail: string;

  customerName: string;

  eventDate: Date;

  guestCount: number;

  selectionType:
    | "package"
    | "custom";
}

export async function sendCateringRequestReceivedEmail({
  requestId,
  recipientEmail,
  customerName,
  eventDate,
  guestCount,
  selectionType,
}: SendCateringRequestReceivedEmailInput) {
  /*
   * ==========================================
   * 1. VALIDATE REQUEST
   * ==========================================
   */

  if (
    !Types.ObjectId.isValid(
      requestId
    )
  ) {
    throw new Error(
      "Invalid catering request ID."
    );
  }

  if (
    !recipientEmail.trim()
  ) {
    throw new Error(
      "Catering request does not have an email address."
    );
  }

  await connectToDatabase();

  /*
   * ==========================================
   * 2. CHECK IF ALREADY SENT
   * ==========================================
   */

  const request =
    await CateringRequest.findById(
      requestId
    )
      .select(
        "requestReceivedEmailSentAt"
      )
      .lean();

  if (!request) {
    throw new Error(
      "Catering request not found."
    );
  }

  if (
    request.requestReceivedEmailSentAt
  ) {
    return;
  }

  /*
   * ==========================================
   * 3. FORMAT DISPLAY VALUES
   * ==========================================
   */

  const safeName =
    customerName.trim() ||
    "Customer";

  const requestNumber =
    requestId.slice(-8);

  const formattedEventDate =
    new Intl.DateTimeFormat(
      "en-CA",
      {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    ).format(
      eventDate
    );

  const requestType =
    selectionType ===
    "package"
      ? "Catering Package"
      : "Custom Catering";

  /*
   * ==========================================
   * 4. SEND
   * ==========================================
   */

  const resend =
    getResendClient();

  const from =
    getResendFromEmail();

  const {
    error,
  } =
    await resend.emails.send(
      {
        from,

        to: [
          recipientEmail,
        ],

        subject:
          `Khans Food Catering Request #${requestNumber}`,

        html: `
          <!DOCTYPE html>

          <html>
            <body
              style="
                margin: 0;
                padding: 0;
                background: #f6f6f6;
                font-family: Arial, sans-serif;
                color: #222222;
              "
            >
              <div
                style="
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 32px 16px;
                "
              >
                <div
                  style="
                    background: #ffffff;
                    border-radius: 16px;
                    padding: 32px;
                  "
                >
                  <p
                    style="
                      margin: 0;
                      font-size: 13px;
                      font-weight: bold;
                      text-transform: uppercase;
                      letter-spacing: 1px;
                    "
                  >
                    Khans Food
                  </p>

                  <h1
                    style="
                      margin: 12px 0 0;
                      font-size: 28px;
                    "
                  >
                    Catering request received
                  </h1>

                  <p
                    style="
                      margin: 16px 0 0;
                      color: #555555;
                      line-height: 1.6;
                    "
                  >
                    Hi ${escapeHtml(
                      safeName
                    )},
                    we&apos;ve received your
                    catering request.
                  </p>

                  <p
                    style="
                      margin: 12px 0 0;
                      color: #555555;
                      line-height: 1.6;
                    "
                  >
                    Our team will review your
                    request before confirming
                    pricing and availability.
                    No payment is required yet.
                  </p>

                  <div
                    style="
                      margin-top: 24px;
                      padding: 18px;
                      background: #f6f6f6;
                      border-radius: 12px;
                    "
                  >
                    <table
                      width="100%"
                      cellpadding="0"
                      cellspacing="0"
                    >
                      <tr>
                        <td
                          style="
                            padding: 6px 0;
                            color: #666666;
                          "
                        >
                          Request
                        </td>

                        <td
                          align="right"
                          style="
                            padding: 6px 0;
                            font-weight: bold;
                          "
                        >
                          #${escapeHtml(
                            requestNumber
                          )}
                        </td>
                      </tr>

                      <tr>
                        <td
                          style="
                            padding: 6px 0;
                            color: #666666;
                          "
                        >
                          Type
                        </td>

                        <td
                          align="right"
                          style="
                            padding: 6px 0;
                            font-weight: bold;
                          "
                        >
                          ${escapeHtml(
                            requestType
                          )}
                        </td>
                      </tr>

                      <tr>
                        <td
                          style="
                            padding: 6px 0;
                            color: #666666;
                          "
                        >
                          Event
                        </td>

                        <td
                          align="right"
                          style="
                            padding: 6px 0;
                            font-weight: bold;
                          "
                        >
                          ${escapeHtml(
                            formattedEventDate
                          )}
                        </td>
                      </tr>

                      <tr>
                        <td
                          style="
                            padding: 6px 0;
                            color: #666666;
                          "
                        >
                          Guests
                        </td>

                        <td
                          align="right"
                          style="
                            padding: 6px 0;
                            font-weight: bold;
                          "
                        >
                          ${guestCount}
                        </td>
                      </tr>

                      <tr>
                        <td
                          style="
                            padding: 6px 0;
                            color: #666666;
                          "
                        >
                          Status
                        </td>

                        <td
                          align="right"
                          style="
                            padding: 6px 0;
                            font-weight: bold;
                          "
                        >
                          Submitted
                        </td>
                      </tr>
                    </table>
                  </div>

                  <h2
                    style="
                      margin: 28px 0 0;
                      font-size: 19px;
                    "
                  >
                    What happens next?
                  </h2>

                  <p
                    style="
                      margin: 10px 0 0;
                      color: #555555;
                      line-height: 1.6;
                    "
                  >
                    Khans Food will review your
                    request. If it can be
                    accommodated, you&apos;ll
                    receive your quote and
                    payment instructions after
                    approval.
                  </p>

                  <p
                    style="
                      margin: 28px 0 0;
                      color: #777777;
                      font-size: 13px;
                      line-height: 1.6;
                    "
                  >
                    Keep request
                    #${escapeHtml(
                      requestNumber
                    )}
                    for your records.
                  </p>
                </div>
              </div>
            </body>
          </html>
        `,
      },

      {
        idempotencyKey:
          `catering-request-received/${requestId}`,
      }
    );

  if (error) {
    throw new Error(
      `Unable to send catering request confirmation email: ${error.message}`
    );
  }

  /*
   * ==========================================
   * 5. MARK SENT
   * ==========================================
   */

  await CateringRequest.updateOne(
    {
      _id:
        requestId,

      $or: [
        {
          requestReceivedEmailSentAt: {
            $exists:
              false,
          },
        },

        {
          requestReceivedEmailSentAt:
            null,
        },
      ],
    },

    {
      $set: {
        requestReceivedEmailSentAt:
          new Date(),
      },
    }
  );
}

function escapeHtml(
  value: string
) {
  return value
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );
}