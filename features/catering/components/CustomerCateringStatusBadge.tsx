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
        min-h-7
        items-center
        border
        px-3
        py-1
        font-sans
        text-[10px]
        font-bold
        uppercase
        tracking-[0.12em]
        ${
          status ===
          "approved"
            ? "border-secondary/30 bg-secondary/10 text-foreground"
            : status ===
                  "rejected" ||
                status ===
                  "cancelled"
              ? "border-accent/30 bg-accent/10 text-accent"
              : status ===
                  "reviewing"
                ? "border-primary/25 bg-primary/[0.06] text-primary"
                : "border-foreground/15 bg-foreground/[0.03] text-foreground/55"
        }
      `}
    >
      <span
        className={`mr-2 h-1.5 w-1.5 shrink-0 ${
          status ===
          "approved"
            ? "bg-secondary"
            : status ===
                  "rejected" ||
                status ===
                  "cancelled"
              ? "bg-accent"
              : status ===
                  "reviewing"
                ? "bg-primary"
                : "bg-foreground/35"
        }`}
        aria-hidden="true"
      />

      {
        statusLabels[
          status
        ]
      }
    </span>
  );
}