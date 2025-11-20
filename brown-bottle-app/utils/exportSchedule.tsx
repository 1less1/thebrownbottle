import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

import { ScheduleEmployee } from "@/types/iShift";

export const exportToCSV = async (scheduleData: ScheduleEmployee[], weekDays: any[]) => {
  const header = ["Employee", "Role", ...weekDays.map(d => d.dayName)];
  const rows = scheduleData.map(emp => {
    const shiftCells = emp.shifts.map(shift =>
      shift ? `${shift.start_time} - ${shift.section_name}` : ""
    );
    return [emp.full_name, emp.primary_role_name, ...shiftCells];
  });

  const csvContent = [header, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(","))
    .join("\n");

  const dir = (FileSystem as any).documentDirectory;
  if (!dir) {
    // Web fallback: download via Blob
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "schedule.csv";
    a.click();
    URL.revokeObjectURL(url);
    return;
  }

  const path = dir + "schedule.csv";
  await FileSystem.writeAsStringAsync(path, csvContent);

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(path, { mimeType: "text/csv" });
  } else {
    alert("Sharing is not available on this device");
  }
};


