import type {
  CustomerCateringRequestStatus,
} from "@/actions/catering/getCustomerCateringRequests";

interface CustomerCateringStatusBadgeProps {
  status:
    CustomerCateringRequestStatus;
}

const statusLabels:
  Record<
    CustomerCateringRequestStatus,
    string
  > = {
    submitted:
      "Submitted",

    reviewing:
      "Under Review",

    approved:
      "Approved",

    rejected:
      "Rejected",

    cancelled:
      "Cancelled",
  };

export default function CustomerCateringStatusBadge({
  status,
}: CustomerCateringStatusBadgeProps) {
  return (
    <span
      className={`
        inline-flex
        rounded-full
        px-3
        py-1
        text-xs
        font-semibold
        ${
          status ===
          "approved"
            ? "bg-secondary/10 text-foreground"
            : status ===
                  "rejected" ||
                status ===
                  "cancelled"
              ? "bg-accent/10 text-accent"
              : "bg-background text-foreground/60"
        }
      `}
    >
      {
        statusLabels[
          status
        ]
      }
    </span>
  );
}