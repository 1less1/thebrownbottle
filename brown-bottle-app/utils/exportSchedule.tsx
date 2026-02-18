import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as Print from "expo-print";
import { Platform } from "react-native";

import { GlobalStyles } from "@/constants/GlobalStyles";
import { Colors } from "@/constants/Colors";

import { ScheduleEmployee } from "@/types/iSchedule";
import { getWeekStartEnd } from "@/routes/schedule";


export const exportToCSV = async (scheduleData: ScheduleEmployee[]) => {
  // Generate Headers using the days from the first employee
  // We assume all employees have the same 7-day structure
  const firstEmployeeDays = scheduleData[0]?.days || [];
  const header = ["Employee", "Role", ...firstEmployeeDays.map(d => d.day_name)];

  // Map Rows
  const rows = scheduleData.map(emp => {
    const dayCells = emp.days.map(day => {
      const shift = day.shift;

      // Handle "Time Off" or "Unavailable" logic if needed
      if (day.time_off_approved === 1) return "Time Off";

      // If there is a shift, format the string; otherwise, return empty
      return shift
        ? `${shift.start_time} - ${shift.section_name}`
        : "";
    });

    return [emp.full_name, emp.primary_role_name, ...dayCells];
  });

  // onstruct CSV String
  const csvContent = [header, ...rows]
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  // 4. File System / Sharing Logic
  const dir = (FileSystem as any).documentDirectory;

  if (!dir) {
    // Web fallback
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



export const exportToPDF = async (scheduleData: ScheduleEmployee[]) => {
  if (!scheduleData || scheduleData.length === 0) return;

  // Date Formatting + Title
  const weekStartStr = scheduleData[0].days[0].date;
  const title = `Schedule for Week of ${weekStartStr}`;

  const dateFormatted = weekStartStr.replace(/\//g, '-');
  const fileName = `schedule_${dateFormatted}.pdf`; // e.g., schedule_2026-02-18.pdf

  // Map Rows
  const firstEmployeeDays = scheduleData[0].days;
  const header = ["Employee", ...firstEmployeeDays.map(d => d.day_name)];
  const tableHeaderHtml = header.map(h => `<th>${h}</th>`).join("");

  const rowsHtml = scheduleData.map(emp => {
    const dayCells = emp.days.map(day => {
      if (day.time_off_approved === 1) return `<td class="time-off">Time Off</td>`;
      const isAvailable = day.availability?.is_available === 1;
      const shift = day.shift;
      if (shift) {
        const bgColor = !isAvailable ? Colors.bgRed : 'white';
        return `<td style="background-color: ${bgColor};">
                  <div class="shift-time">${shift.start_time}</div>
                  <div class="shift-section">${shift.section_name}</div>
                </td>`;
      }
      return !isAvailable ? `<td class="unavailable">-</td>` : `<td>-</td>`;
    }).join("");

    return `<tr>
              <td class="name-cell">
                <div class="employee-name">${emp.full_name}</div>
                <div class="employee-role">(${emp.primary_role_name})</div>
              </td>
              ${dayCells}
            </tr>`;
  }).join("");

  // Define HTML with CSS similar to SpreadSheet.tsx
  const htmlContent = `
    <html>
      <head>
        <title>${fileName.replace('.pdf', '')}</title>
        <style>
          /* This forces the browser print engine into landscape mode */
          @page { 
            size: landscape; 
            margin: 10mm; 
          }
          body { 
            font-family: 'Helvetica', sans-serif; 
            padding: 0; 
            margin: 0;
            -webkit-print-color-adjust: exact; /* Ensures background colors print */
            print-color-adjust: exact;
          }
          h1 { text-align: center; color: ${Colors.black}; }
          table { width: 100%; border-collapse: collapse; table-layout: fixed; border: 2px solid ${Colors.borderColor}; }
          th, td { border: 1px solid ${Colors.lightGray}; padding: 6px; text-align: center; font-size: 10px; word-wrap: break-word; }
          th, .name-cell { background-color: ${Colors.whiteGray}; }
          .name-cell { text-align: left !important; }
          .employee-name { font-weight: 600; }
          .employee-role { font-size: 9px; color: ${Colors.darkGray}; font-style: italic; }
          .time-off, .unavailable { background-color: ${Colors.lightGray}; color: ${Colors.darkGray}; font-weight: 600; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <table>
          <thead><tr>${tableHeaderHtml}</tr></thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </body>
    </html>
  `;


  if (Platform.OS === "web") {
    // Create a hidden iframe specifically for the print content
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentWindow?.document || iframe.contentDocument;

    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(htmlContent);
      iframeDoc.close();

      // Wait for styles and content to load, then trigger print from the iframe's window
      // This prevents the browser from "guessing" and printing the main app screen
      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();

        // Cleanup after the print dialog closes
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1000);
      }, 500);
    }
    return;
  }

  // Native Mobile (iOS/Android)
  // Button DOES NOT show on mobile so no logic as of right now!!!
  /*
  const { uri } = await Print.printToFileAsync({ html: htmlContent });
  const docDir = (FileSystem as any).documentDirectory;

  if (docDir) {
    const path = docDir + "schedule.pdf";
    await FileSystem.moveAsync({ from: uri, to: path });
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(path, { mimeType: "application/pdf" });
    }
  } else {
    await Sharing.shareAsync(uri, { mimeType: "application/pdf" });
  }
  */
};
