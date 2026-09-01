import { Types } from "mongoose";

import { connectToDatabase } from "@/lib/mongodb";

import {
  getResendClient,
  getResendFromEmail,
} from "@/lib/resend";

import Order from "@/models/Order";

export async function sendCateringPaymentConfirmationEmail(
  orderId: string
) {
  /*
   * ==========================================
   * 1. VALIDATE ORDER ID
   * ==========================================
   */

  if (
    !Types.ObjectId.isValid(
      orderId
    )
  ) {
    throw new Error(
      "Invalid catering order ID."
    );
  }

  await connectToDatabase();

  /*
   * ==========================================
   * 2. LOAD PAID CATERING ORDER
   * ==========================================
   */

  const order =
    await Order.findOne({
      _id:
        orderId,

      orderType:
        "catering",
    })
      .select(
        [
          "firstName",
          "lastName",
          "email",
          "subtotal",
          "tax",
          "total",
          "paymentStatus",
          "orderStatus",
          "catering",
          "orderConfirmationEmailSentAt",
        ].join(" ")
      );

  if (!order) {
    /*
     * This service is catering-only.
     */
    return;
  }

  /*
   * ==========================================
   * 3. PAYMENT MUST ALREADY BE CONFIRMED
   * ==========================================
   */

  if (
    order.paymentStatus !==
    "paid"
  ) {
    throw new Error(
      "Cannot send catering payment confirmation for an unpaid order."
    );
  }

  /*
   * ==========================================
   * 4. DUPLICATE PROTECTION
   * ==========================================
   */

  if (
    order.orderConfirmationEmailSentAt
  ) {
    return;
  }

  /*
   * ==========================================
   * 5. REQUIRED INFORMATION
   * ==========================================
   */

  if (!order.email) {
    throw new Error(
      "Catering order does not have a customer email address."
    );
  }

  if (
    !order.catering?.eventDate
  ) {
    throw new Error(
      "Catering order is missing its event date."
    );
  }

  const customerName =
    order.firstName ||
    "Customer";

  const orderNumber =
    order._id
      .toString()
      .slice(-8);

  const eventDate =
    formatDate(
      order.catering.eventDate
    );

  const guestCount =
    order.catering.guestCount;

  /*
   * ==========================================
   * 6. SEND EMAIL
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
          order.email,
        ],

        subject:
          `Khans Food Catering Payment Confirmed #${orderNumber}`,

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
                    Catering payment confirmed
                  </h1>

                  <p
                    style="
                      margin: 16px 0 0;
                      color: #555555;
                      line-height: 1.6;
                    "
                  >
                    Hi ${escapeHtml(
                      customerName
                    )},
                    we&apos;ve received your
                    payment for your catering
                    order.
                  </p>

                  <p
                    style="
                      margin: 12px 0 0;
                      color: #555555;
                      line-height: 1.6;
                    "
                  >
                    Your catering order is now
                    paid and confirmed.
                  </p>

                  <!-- Event -->

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
                          Order
                        </td>

                        <td
                          align="right"
                          style="
                            padding: 6px 0;
                            font-weight: bold;
                          "
                        >
                          #${escapeHtml(
                            orderNumber
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
                            eventDate
                          )}
                        </td>
                      </tr>

                      ${
                        guestCount
                          ? `
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
                          `
                          : ""
                      }

                      <tr>
                        <td
                          style="
                            padding: 6px 0;
                            color: #666666;
                          "
                        >
                          Payment
                        </td>

                        <td
                          align="right"
                          style="
                            padding: 6px 0;
                            font-weight: bold;
                          "
                        >
                          Paid
                        </td>
                      </tr>
                    </table>
                  </div>

                  <!-- Financials -->

                  <h2
                    style="
                      margin: 28px 0 12px;
                      font-size: 20px;
                    "
                  >
                    Payment Summary
                  </h2>

                  <table
                    width="100%"
                    cellpadding="0"
                    cellspacing="0"
                  >
                    <tr>
                      <td
                        style="
                          padding: 7px 0;
                          color: #666666;
                        "
                      >
                        Subtotal
                      </td>

                      <td
                        align="right"
                        style="
                          padding: 7px 0;
                        "
                      >
                        ${formatMoney(
                          order.subtotal
                        )}
                      </td>
                    </tr>

                    <tr>
                      <td
                        style="
                          padding: 7px 0;
                          color: #666666;
                        "
                      >
                        Tax
                      </td>

                      <td
                        align="right"
                        style="
                          padding: 7px 0;
                        "
                      >
                        ${formatMoney(
                          order.tax
                        )}
                      </td>
                    </tr>

                    <tr>
                      <td
                        style="
                          padding-top: 14px;
                          border-top: 1px solid #eeeeee;
                          font-size: 18px;
                          font-weight: bold;
                        "
                      >
                        Total Paid
                      </td>

                      <td
                        align="right"
                        style="
                          padding-top: 14px;
                          border-top: 1px solid #eeeeee;
                          font-size: 20px;
                          font-weight: bold;
                        "
                      >
                        ${formatMoney(
                          order.total
                        )}
                      </td>
                    </tr>
                  </table>

                  <p
                    style="
                      margin: 28px 0 0;
                      color: #555555;
                      line-height: 1.6;
                    "
                  >
                    Thank you for choosing
                    Khans Food. Our team will
                    prepare your catering order
                    for your scheduled event.
                  </p>

                  <p
                    style="
                      margin: 24px 0 0;
                      color: #777777;
                      font-size: 13px;
                      line-height: 1.6;
                    "
                  >
                    Keep order
                    #${escapeHtml(
                      orderNumber
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
          `catering-payment-confirmation/${order._id.toString()}`,
      }
    );

  if (error) {
    throw new Error(
      `Unable to send catering payment confirmation email: ${error.message}`
    );
  }

  /*
   * ==========================================
   * 7. MARK EMAIL SENT
   * ==========================================
   */

  await Order.updateOne(
    {
      _id:
        order._id,

      $or: [
        {
          orderConfirmationEmailSentAt: {
            $exists:
              false,
          },
        },

        {
          orderConfirmationEmailSentAt:
            null,
        },
      ],
    },

    {
      $set: {
        orderConfirmationEmailSentAt:
          new Date(),
      },
    }
  );
}

/*
 * ============================================
 * MONEY
 * ============================================
 */

function formatMoney(
  value: number
) {
  return new Intl.NumberFormat(
    "en-CA",
    {
      style:
        "currency",

      currency:
        "CAD",
    }
  ).format(value);
}

/*
 * ============================================
 * DATE
 * ============================================
 */

function formatDate(
  value: Date
) {
  return new Intl.DateTimeFormat(
    "en-CA",
    {
      weekday:
        "long",

      year:
        "numeric",

      month:
        "long",

      day:
        "numeric",
    }
  ).format(value);
}

/*
 * ============================================
 * HTML ESCAPING
 * ============================================
 */

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