import { useState, useMemo } from "react";
import { ShiftCoverRequest } from "@/types/iShiftCover";

export type ShiftFilterValue =
  | "Available"
  | "My Covers"
  | "My Shifts"
  | "Approved"
  | "Denied";

export function ShiftCoverFilters(
  userId: number | undefined,
  requests: ShiftCoverRequest[]
) {
  const [filter, setFilter] = useState<ShiftFilterValue>("Available");

  const isMine = (r: ShiftCoverRequest) =>
    Number(r.requested_employee_id) === Number(userId) ||
    Number(r.accepted_employee_id) === Number(userId);

  const availableRequests = useMemo(
    () =>
      requests.filter(
        (r) =>
          r.status === "Pending" &&
          r.accepted_employee_id === null &&
          !isMine(r)
      ),
    [requests]
  );

  const myCovers = useMemo(
    () => requests.filter((r) => Number(r.accepted_employee_id) === Number(userId)),
    [requests]
  );

  const myShifts = useMemo(
    () => requests.filter((r) => Number(r.requested_employee_id) === Number(userId)),
    [requests]
  );

  const approved = useMemo(
    () => requests.filter((r) => r.status === "Accepted" && isMine(r)),
    [requests]
  );

  const denied = useMemo(
    () => requests.filter((r) => r.status === "Denied" && isMine(r)),
    [requests]
  );

  const filteredRequests = useMemo(() => {
    switch (filter) {
      case "Available": return availableRequests;
      case "My Covers": return myCovers;
      case "My Shifts": return myShifts;
      case "Approved":  return approved;
      case "Denied":    return denied;
      default: return availableRequests;
    }
  }, [filter, availableRequests, myCovers, myShifts, approved, denied]);

  const emptyMessages: Record<ShiftFilterValue, string> = {
    Available: "No available shifts.",
    "My Covers": "You haven't requested to cover anyone yet.",
    "My Shifts": "No one is covering your posted shifts yet.",
    Approved: "No approved shift requests.",
    Denied: "No denied shift requests.",
  };

  return {
    filter,
    setFilter,
    filteredRequests,
    emptyMessage: emptyMessages[filter]
  };
}
