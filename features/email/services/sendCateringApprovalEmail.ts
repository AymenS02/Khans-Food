import { Types } from "mongoose";

import { connectToDatabase } from "@/lib/mongodb";

import {
  getResendClient,
  getResendFromEmail,
} from "@/lib/resend";

import { getAppUrl } from "@/lib/appUrl";

import {
  createCateringPaymentAccessToken,
} from "@/lib/orderAccessToken";

import CateringRequest from "@/models/CateringRequest";
import Order from "@/models/Order";

export async function sendCateringApprovalEmail(
  requestId: string
) {
  /*
   * ==========================================
   * 1. VALIDATE REQUEST ID
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

  await connectToDatabase();

  /*
   * ==========================================
   * 2. LOAD APPROVED REQUEST
   * ==========================================
   */

  const request =
    await CateringRequest.findOne({
      _id:
        requestId,

      status:
        "approved",
    });

  if (!request) {
    throw new Error(
      "Approved catering request not found."
    );
  }

  /*
   * ==========================================
   * 3. ALREADY SENT?
   * ==========================================
   */

  if (
    request.approvalEmailSentAt
  ) {
    return;
  }

  /*
   * ==========================================
   * 4. REQUEST MUST HAVE AN ORDER
   * ==========================================
   */

  if (!request.order) {
    throw new Error(
      "Approved catering request does not have an order."
    );
  }

  /*
   * ==========================================
   * 5. LOAD CATERING ORDER
   * ==========================================
   */

  const order =
    await Order.findOne({
      _id:
        request.order,

      orderType:
        "catering",
    })
      .select(
        [
          "customer",
          "orderType",
          "paymentStatus",
          "subtotal",
          "taxRate",
          "tax",
          "total",
          "catering",
        ].join(" ")
      )
      .lean();

  if (!order) {
    throw new Error(
      "Catering order not found."
    );
  }

  /*
   * ==========================================
   * 6. VERIFY REQUEST ↔ ORDER RELATIONSHIP
   * ==========================================
   */

  const linkedRequestId =
    order.catering?.requestId;

  if (
    !linkedRequestId ||
    linkedRequestId.toString() !==
      request._id.toString()
  ) {
    throw new Error(
      "Catering request and order relationship is invalid."
    );
  }

  /*
   * ==========================================
   * 7. CUSTOMER EMAIL
   * ==========================================
   */

  if (!request.email) {
    throw new Error(
      "Catering request does not have an email address."
    );
  }

  const customerName =
    request.firstName ||
    "Customer";

  /*
   * ==========================================
   * 8. BUILD CORRECT PAYMENT URL
   * ==========================================
   */

  const appUrl =
    getAppUrl();

  const orderId =
    order._id.toString();

  const cateringRequestId =
    request._id.toString();

  let paymentUrl:
    string;

  /*
   * A registered customer's catering order
   * has a customer ObjectId.
   *
   * A guest's order does not.
   */

  if (order.customer) {
    paymentUrl =
      `${appUrl}/account/orders/${orderId}/payment`;
  } else {
    /*
     * Guest payment requires the secure HMAC
     * token we already built.
     */

    const token =
      createCateringPaymentAccessToken(
        orderId,
        cateringRequestId
      );

    paymentUrl =
      `${appUrl}/catering/pay/${orderId}?token=${encodeURIComponent(
        token
      )}`;
  }

  /*
   * ==========================================
   * 9. FORMAT DISPLAY VALUES
   * ==========================================
   */

  const requestNumber =
    cateringRequestId.slice(
      -8
    );

  const formattedEventDate =
    formatDate(
      request.eventDate
    );

  /*
   * Use the ORDER totals here.
   *
   * Once approval creates the order, Order
   * becomes the authoritative payable amount.
   */

  const subtotal =
    order.subtotal;

  const tax =
    order.tax;

  const total =
    order.total;

  /*
   * ==========================================
   * 10. SEND EMAIL
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
          request.email,
        ],

        subject:
          `Your Khans Food Catering Request #${requestNumber} Is Approved`,

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
                    Your catering request
                    is approved
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
                    your catering request
                    has been reviewed and
                    approved.
                  </p>

                  <p
                    style="
                      margin: 12px 0 0;
                      color: #555555;
                      line-height: 1.6;
                    "
                  >
                    Your official quote is
                    ready. You can review
                    the total and continue
                    to payment using the
                    button below.
                  </p>

                  <!-- Request information -->

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
                          ${request.guestCount}
                        </td>
                      </tr>
                    </table>
                  </div>

                  <!-- Quote -->

                  <h2
                    style="
                      margin: 28px 0 12px;
                      font-size: 20px;
                    "
                  >
                    Official Quote
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
                          subtotal
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
                          tax
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
                        Total
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
                          total
                        )}
                      </td>
                    </tr>
                  </table>

                  ${
                    request.adminNotes
                      ? `
                        <div
                          style="
                            margin-top: 24px;
                            padding: 18px;
                            background: #f6f6f6;
                            border-radius: 12px;
                          "
                        >
                          <strong>
                            Message from Khans Food
                          </strong>

                          <p
                            style="
                              margin: 8px 0 0;
                              color: #555555;
                              line-height: 1.6;
                              white-space: pre-wrap;
                            "
                          >
                            ${escapeHtml(
                              request.adminNotes
                            )}
                          </p>
                        </div>
                      `
                      : ""
                  }

                  <!-- CTA -->

                  <div
                    style="
                      margin-top: 28px;
                    "
                  >
                    <a
                      href="${escapeHtml(
                        paymentUrl
                      )}"
                      style="
                        display: inline-block;
                        background: #111111;
                        color: #ffffff;
                        text-decoration: none;
                        font-weight: bold;
                        padding: 14px 22px;
                        border-radius: 10px;
                      "
                    >
                      Review &amp; Pay Catering Order
                    </a>
                  </div>

                  <p
                    style="
                      margin: 24px 0 0;
                      color: #777777;
                      font-size: 13px;
                      line-height: 1.6;
                    "
                  >
                    Your catering request
                    is approved, but payment
                    must still be completed
                    before the order is
                    considered paid.
                  </p>

                  <p
                    style="
                      margin: 12px 0 0;
                      color: #777777;
                      font-size: 13px;
                      line-height: 1.6;
                    "
                  >
                    Order #
                    ${escapeHtml(
                      orderId.slice(
                        -8
                      )
                    )}
                  </p>
                </div>
              </div>
            </body>
          </html>
        `,
      },

      {
        idempotencyKey:
          `catering-approval/${cateringRequestId}`,
      }
    );

  if (error) {
    throw new Error(
      `Unable to send catering approval email: ${error.message}`
    );
  }

  /*
   * ==========================================
   * 11. MARK EMAIL SENT
   * ==========================================
   */

  await CateringRequest.updateOne(
    {
      _id:
        request._id,

      $or: [
        {
          approvalEmailSentAt: {
            $exists:
              false,
          },
        },

        {
          approvalEmailSentAt:
            null,
        },
      ],
    },

    {
      $set: {
        approvalEmailSentAt:
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
 * HTML ESCAPE
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