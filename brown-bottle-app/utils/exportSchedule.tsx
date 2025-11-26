import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as Print from "expo-print";
import { Platform } from "react-native";
import { ScheduleEmployee } from "@/types/iShift";

import { getWeekStartEnd } from "@/routes/schedule";


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

export const exportToPDF = async (weekStart: Date, scheduleData: ScheduleEmployee[], weekDays: any[]) => {
  const { weekStartStr, weekEndStr } = getWeekStartEnd(weekStart);

  const title = `Schedule for ${weekStartStr}-${weekEndStr}`
  const header = ["Employee", "Role", ...weekDays.map(d => d.dayName)];
  const rows = scheduleData.map(emp => {
    const shiftCells = emp.shifts.map(
      shift => (shift ? `${shift.start_time} - ${shift.section_name}` : "")
    );
    return [emp.full_name, emp.primary_role_name, ...shiftCells];
  });

  const tableHeaderHtml = header.map(h => `<th>${h}</th>`).join("");
  const tableRowsHtml = rows
    .map(row => `<tr>${row.map(cell => `<td>${cell || ""}</td>`).join("")}</tr>`)
    .join("");

  const htmlContent = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { text-align: center; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #444; padding: 8px; text-align: center; }
          th { background-color: #f2f2f2; font-weight: bold; }
          tr:nth-child(even) { background-color: #fafafa; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <table>
          <thead><tr>${tableHeaderHtml}</tr></thead>
          <tbody>${tableRowsHtml}</tbody>
        </table>
      </body>
    </html>
  `;

  if (Platform.OS === "web") {
    // Web fallback: use Blob (this is just saving HTML, not a true PDF)
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "schedule.html"; // or integrate jspdf/html2pdf for real PDF
    a.click();
    URL.revokeObjectURL(url);
    return;
  }

  // Native (iOS/Android): generate PDF
  const { uri } = await Print.printToFileAsync({ html: htmlContent });

  const dir = (FileSystem as any).documentDirectory;
  const path = dir + "schedule.pdf";
  await FileSystem.moveAsync({ from: uri, to: path });

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(path, { mimeType: "application/pdf" });
  } else {
    alert("Sharing is not available on this device");
  }
};
