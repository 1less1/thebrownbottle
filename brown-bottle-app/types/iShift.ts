// This file contains Object Types that will be reused multiple times!



/* Calendar Shift Notes

Calendar will only have shifts
Current Shift Table Columns: shiftId, startTime, date (string in react native)
- We are going to have to add some way to trace the shift back to each employee (foreign key)!!!!
Shift Id is the main primary key in mysql 

*/

// Using an Array to hold the "Shift Objects" (Will make it easier when pulling from MySQL)
export interface ShiftData {
    visible: true;
    date: string | null;
    startTime: string | null;
    role: string | null;
  }
  