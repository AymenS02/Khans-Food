import { Types } from "mongoose";

import { connectToDatabase } from "@/lib/mongodb";

import {
  getResendClient,
  getResendFromEmail,
} from "@/lib/resend";

import Order from "@/models/Order";

export async function sendRegularOrderConfirmationEmail(
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
      "Invalid order ID."
    );
  }

  await connectToDatabase();

  /*
   * ==========================================
   * 2. LOAD REGULAR ORDER
   * ==========================================
   */

  const order =
    await Order.findOne({
      _id: orderId,

      orderType:
        "regular",
    })
      .select(
        [
          "firstName",
          "lastName",
          "email",
          "items",
          "pickupDate",
          "pickupTime",
          "subtotal",
          "tax",
          "total",
          "paymentStatus",
          "orderConfirmationEmailSentAt",
        ].join(" ")
      );

  if (!order) {
    /*
     * Catering orders will eventually have
     * their own email flow.
     */
    return;
  }

  /*
   * ==========================================
   * 3. PAYMENT MUST BE AUTHORITATIVE
   * ==========================================
   */

  if (
    order.paymentStatus !==
    "paid"
  ) {
    throw new Error(
      "Cannot send confirmation email for an unpaid order."
    );
  }

  /*
   * ==========================================
   * 4. DON'T SEND AGAIN
   * ==========================================
   */

  if (
    order.orderConfirmationEmailSentAt
  ) {
    return;
  }

  /*
   * ==========================================
   * 5. REQUIRED CUSTOMER INFORMATION
   * ==========================================
   */

  if (!order.email) {
    throw new Error(
      "Order does not have a customer email address."
    );
  }

  if (
    !order.pickupDate ||
    !order.pickupTime
  ) {
    throw new Error(
      "Regular order is missing pickup information."
    );
  }

  /*
   * ==========================================
   * 6. FORMAT ORDER INFORMATION
   * ==========================================
   */

  const customerName =
    order.firstName ||
    "Customer";

  const pickupDate =
    formatPickupDate(
      order.pickupDate
    );

  const itemsHtml =
    order.items
      .map(
        (item) => {
          const itemTotal =
            item.price *
            item.quantity;

          return `
            <tr>
              <td style="
                padding: 10px 0;
                border-bottom: 1px solid #eeeeee;
              ">
                ${escapeHtml(item.name)}
                <br />
                <span style="
                  color: #666666;
                  font-size: 13px;
                ">
                  Qty ${item.quantity}
                </span>
              </td>

              <td
                align="right"
                style="
                  padding: 10px 0;
                  border-bottom: 1px solid #eeeeee;
                  white-space: nowrap;
                "
              >
                ${formatMoney(itemTotal)}
              </td>
            </tr>
          `;
        }
      )
      .join("");

  /*
   * ==========================================
   * 7. SEND EMAIL
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
          `Khans Food Order Confirmation #${order._id
            .toString()
            .slice(-8)}`,

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
                    Order confirmed
                  </h1>

                  <p
                    style="
                      margin: 16px 0 0;
                      line-height: 1.6;
                      color: #555555;
                    "
                  >
                    Hi ${escapeHtml(customerName)},
                    your payment was successful and
                    your pickup order has been confirmed.
                  </p>

                  <div
                    style="
                      margin-top: 24px;
                      padding: 18px;
                      background: #f6f6f6;
                      border-radius: 12px;
                    "
                  >
                    <strong>
                      Pickup
                    </strong>

                    <p
                      style="
                        margin: 8px 0 0;
                        line-height: 1.6;
                      "
                    >
                      ${escapeHtml(pickupDate)}
                      <br />
                      ${escapeHtml(order.pickupTime)}
                    </p>
                  </div>

                  <h2
                    style="
                      margin: 28px 0 12px;
                      font-size: 20px;
                    "
                  >
                    Your Order
                  </h2>

                  <table
                    width="100%"
                    cellpadding="0"
                    cellspacing="0"
                  >
                    ${itemsHtml}
                  </table>

                  <div
                    style="
                      margin-top: 20px;
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
                            padding: 5px 0;
                            color: #666666;
                          "
                        >
                          Subtotal
                        </td>

                        <td
                          align="right"
                          style="
                            padding: 5px 0;
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
                            padding: 5px 0;
                            color: #666666;
                          "
                        >
                          Tax
                        </td>

                        <td
                          align="right"
                          style="
                            padding: 5px 0;
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
                            padding-top: 12px;
                            font-size: 18px;
                            font-weight: bold;
                            border-top: 1px solid #eeeeee;
                          "
                        >
                          Total
                        </td>

                        <td
                          align="right"
                          style="
                            padding-top: 12px;
                            font-size: 18px;
                            font-weight: bold;
                            border-top: 1px solid #eeeeee;
                          "
                        >
                          ${formatMoney(
                            order.total
                          )}
                        </td>
                      </tr>
                    </table>
                  </div>

                  <p
                    style="
                      margin: 28px 0 0;
                      font-size: 13px;
                      line-height: 1.6;
                      color: #777777;
                    "
                  >
                    Order #
                    ${order._id
                      .toString()
                      .slice(-8)}
                  </p>
                </div>
              </div>
            </body>
          </html>
        `,
      },

      /*
       * Resend will recognize retries using
       * the same order-specific key.
       */
      {
        idempotencyKey:
          `regular-order-confirmation/${order._id.toString()}`,
      }
    );

  if (error) {
    throw new Error(
      `Unable to send order confirmation email: ${error.message}`
    );
  }

  /*
   * ==========================================
   * 8. MARK EMAIL SENT
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
 * FORMAT MONEY
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
 * FORMAT PICKUP DATE
 * ============================================
 */

function formatPickupDate(
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
 *
 * Customer/menu values are inserted into raw
 * HTML, so escape them first.
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