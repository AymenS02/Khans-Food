import {
  createHmac,
} from "crypto";

import { connectToDatabase } from "@/lib/mongodb";

import RateLimit from "@/models/RateLimit";

interface RateLimitInput {
  scope: string;
  identifier: string;
  limit: number;
  windowMs: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
}

export async function checkRateLimit({
  scope,
  identifier,
  limit,
  windowMs,
}: RateLimitInput): Promise<RateLimitResult> {
  if (limit <= 0) {
    throw new Error(
      "Rate limit must be greater than zero."
    );
  }

  if (windowMs <= 0) {
    throw new Error(
      "Rate limit window must be greater than zero."
    );
  }

  await connectToDatabase();

  const now =
    new Date();

  const nextResetAt =
    new Date(
      now.getTime() +
        windowMs
    );

  /*
   * Never store the raw identifier.
   *
   * For an IP-based limiter this means
   * MongoDB stores an HMAC rather than
   * the customer's actual IP address.
   */
  const hashedIdentifier =
    hashIdentifier(
      identifier
    );

  const key =
    `${scope}:${hashedIdentifier}`;

  /*
   * Atomic update.
   *
   * If the current window expired:
   *   count → 1
   *   resetAt → new window
   *
   * Otherwise:
   *   count → count + 1
   *
   * Doing this atomically matters because
   * two requests could arrive at exactly
   * the same time.
   */
  const rateLimit =
    await RateLimit.findOneAndUpdate(
      {
        key,
      },

      [
        {
          $set: {
            count: {
              $cond: [
                {
                  $lte: [
                    {
                      $ifNull: [
                        "$resetAt",
                        new Date(0),
                      ],
                    },

                    now,
                  ],
                },

                1,

                {
                  $add: [
                    {
                      $ifNull: [
                        "$count",
                        0,
                      ],
                    },

                    1,
                  ],
                },
              ],
            },

            resetAt: {
              $cond: [
                {
                  $lte: [
                    {
                      $ifNull: [
                        "$resetAt",
                        new Date(0),
                      ],
                    },

                    now,
                  ],
                },

                nextResetAt,

                "$resetAt",
              ],
            },

            key,
          },
        },
      ],

      {
        new: true,
        upsert: true,

        /*
         * Required by Mongoose 9 when
         * using an aggregation pipeline
         * array as the update argument.
         */
        updatePipeline: true,
      }
    ).lean();

  if (!rateLimit) {
    throw new Error(
      "Unable to evaluate rate limit."
    );
  }

  const allowed =
    rateLimit.count <=
    limit;

  return {
    allowed,

    remaining:
      Math.max(
        0,
        limit -
          rateLimit.count
      ),

    resetAt:
      rateLimit.resetAt,
  };
}

function hashIdentifier(
  identifier: string
) {
  const secret =
    process.env
      .RATE_LIMIT_SECRET;

  if (!secret) {
    throw new Error(
      "Missing RATE_LIMIT_SECRET."
    );
  }

  return createHmac(
    "sha256",
    secret
  )
    .update(identifier)
    .digest("hex");
}