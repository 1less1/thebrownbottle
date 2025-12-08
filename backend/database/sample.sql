-- Sample Data to be inserted into the MySQL Database when Docker containers are created


-- Sample section data ---------------------------------------------------------------------------------------------------------------------------
INSERT INTO `thebrownbottle`.`section` (`section_name`)
VALUES
('Prep'),
('Front'),
('New Back'),
('Old Back'),
('Bar'),
('Patio'),
('Lounge'),
('Upstairs');


-- Sample role data ---------------------------------------------------------------------------------------------------------------------------
INSERT INTO `thebrownbottle`.`role` (`role_name`)
VALUES
('Manager'),
('Host'),
('Server'),
('Bartender'),
('Kitchen'),
('Dish');


-- Sample employee data --------------------------------------------------------------------------------------------------------------------------
INSERT INTO `thebrownbottle`.`employee` 
(`first_name`, `last_name`, `email`, `phone_number`, `wage`, `admin`, `primary_role`, `secondary_role`, `tertiary_role`)
VALUES 
('Emily', 'Turner', 'emily.turner@example.com', '555-123-4567', 18.50, 1, 1, NULL, NULL),
('Marcus', 'Reed', 'marcus.reed@example.com', '555-234-5678', 19.75, 1, 1, NULL, NULL),
('Jenna', 'Klein', 'jenna.klein@example.com', '555-345-6789', 15.25, 0, 2, 3, NULL),
('Tyler', 'Nguyen', 'tyler.nguyen@example.com', '555-456-7890', 16.00, 0, 3, 4, NULL),
('Sophia', 'Martinez', 'sophia.martinez@example.com', '555-567-8901', 14.75, 0, 5, 6, NULL),
('Devin', 'Biggs', 'devin.biggs@example.com', '555-444-8998', 14.75, 1, 5, 6, NULL),
('Jodi', 'Brown', 'jodi.brown@example.com', '555-333-4327', 15.25, 0, 2, 3, NULL),
('Avery', 'Hughes', 'avery.hughes@example.com', '555-678-9012', 16.25, 0, 3, 4, NULL),
('Liam', 'Foster', 'liam.foster@example.com', '555-789-0123', 14.50, 0, 6, NULL, NULL),
('Nina', 'Choi', 'nina.choi@example.com', '555-890-1234', 15.00, 0, 2, NULL, NULL),
('Caleb', 'Morris', 'caleb.morris@example.com', '555-901-2345', 17.00, 0, 4, 3, NULL),
('Zoe', 'Ramirez', 'zoe.ramirez@example.com', '555-012-3456', 15.75, 0, 5, NULL, NULL),
('Ethan', 'Bishop', 'ethan.bishop@example.com', '555-123-9876', 18.00, 1, 1, 2, NULL);


-- Sample recurring_task data ------------------------------------------------------------------------------------------------------------------------------
INSERT INTO recurring_task
(title, description, author_id, section_id, mon, tue, wed, thu, fri, sat, sun, start_date, end_date)
VALUES
(
  'Everyday Recurring Task ',
  'This task recurs all 7 weekdays.',
  1,
  1,
  1, 1, 1, 1, 1, 1, 1,
  CURDATE(),
  NULL
);

INSERT INTO recurring_task
(title, description, author_id, section_id, mon, tue, wed, thu, fri, sat, sun, start_date, end_date)
VALUES
(
  'Weekday Recurring Task',
  'This task recurs every weekday (Mon-Fri).',
  1,
  1,
  1, 1, 1, 1, 1,
  0, 0,
  CURDATE(),
  NULL
);


-- Sample task data (mapped into 7–13 DEC 2025) ---------------------------------------------------------------------------------------------------
INSERT INTO `thebrownbottle`.`task` 
(`title`, `description`, `author_id`, `section_id`, `due_date`)
VALUES
('Inventory Count', 'Count all wine bottles in storage.', 1, 1, '2025-12-07'),
('Clean Patio', 'Deep clean the outdoor patio seating area.', 2, 5, '2025-12-08'),
('Restock Bar', 'Refill bar shelves with necessary liquors and mixers.', 1, 4, '2025-12-09'),
('Table Setup', 'Set up tables for the Friday evening event.', 2, 2, '2025-12-12'),
('Check Lighting', 'Inspect all lights and replace any burnt-out bulbs.', 1, 3, '2025-12-10');


-- Sample announcement data ----------------------------------------------------------------------------------------------------------------------
INSERT INTO `thebrownbottle`.`announcement` (`author_id`, `title`, `description`, `role_id`)
VALUES
(1, 'New Uniform Policy', 'Please review the updated uniform guidelines posted in the staff room.', 1),
(2, 'Shift Coverage', 'We need additional coverage for the Saturday evening shift. Please reach out if available.', 1),
(1, 'Inventory Audit', 'A full inventory audit is scheduled for Monday. Be prepared to assist.', 1),
(2, 'Holiday Schedule', 'The holiday work schedule has been released. Check the bulletin board for your shifts.', 1),
(1, 'Customer Feedback', 'Recent feedback has been positive! Keep up the excellent service.', 1),
(2, 'Training Session', 'Mandatory service training will take place this Friday at 3 PM.', 1),
(1, 'Menu Updates', 'Several new items have been added to the menu. Review them before your next shift.', 1),
(2, 'Safety Reminder', 'Remember to use proper lifting techniques when handling heavy items.', 1),
(1, 'Parking Changes', 'Staff parking spots have been reassigned. Check your new location.', 1),
(2, 'Team Meeting', 'There will be a brief team meeting before Friday’s dinner shift. Please arrive 15 minutes early.', 1),

(1, 'Manager Briefing', 'Managers, please attend the monthly briefing on upcoming restaurant changes.', 2),
(2, 'Host Responsibilities', 'Reminder: All hosts should be familiar with the updated guest seating chart.', 3),
(1, 'Bartender Training', 'Bartenders, please review the new cocktail recipes added to the menu.', 5),
(2, 'Server Scheduling', 'Servers, be aware that your schedule for next week has been updated. Check the board.', 4),
(1, 'Dishwashing Protocols', 'Dish staff, please adhere to the new cleaning and sanitizing guidelines effective today.', 6);


-- Sample shift data (all dates mapped into 7–13 DEC 2025) ---------------------------------------------------------------------------------------
INSERT INTO `thebrownbottle`.`shift` 
(`employee_id`, `start_time`, `date`, `section_id`)
VALUES
(1, '10:00:00', '2025-12-07', 1),
(1, '12:00:00', '2025-12-10', 1),

(2, '09:00:00', '2025-12-07', 1),
(2, '11:00:00', '2025-12-13', 1),
(2, '09:00:00', '2025-12-08', 2),
(2, '11:00:00', '2025-12-10', 2),

(3, '16:00:00', '2025-12-09', 2),
(3, '10:00:00', '2025-12-12', 2),
(3, '17:00:00', '2025-12-13', 2),

(4, '17:00:00', '2025-12-07', 3),
(4, '11:00:00', '2025-12-09', 3),
(4, '16:00:00', '2025-12-13', 3),

(5, '08:00:00', '2025-12-08', 5),
(5, '14:00:00', '2025-12-10', 5),

(6, '09:00:00', '2025-12-09', 5),
(6, '13:00:00', '2025-12-12', 5),
(6, '07:00:00', '2025-12-13', 5),

(7, '10:00:00', '2025-12-07', 2),
(7, '17:00:00', '2025-12-09', 2),

(8, '12:00:00', '2025-12-08', 3),
(8, '16:00:00', '2025-12-10', 3),
(8, '10:00:00', '2025-12-12', 3),

(9, '08:00:00', '2025-12-09', 6),
(9, '14:00:00', '2025-12-12', 6),

(10, '09:00:00', '2025-12-09', 2),
(10, '15:00:00', '2025-12-13', 2),

(11, '17:00:00', '2025-12-07', 4),
(11, '11:00:00', '2025-12-09', 4),
(11, '13:00:00', '2025-12-12', 4),

(12, '08:00:00', '2025-12-08', 5),
(12, '14:00:00', '2025-12-10', 5),

(13, '09:00:00', '2025-12-09', 1),
(13, '12:00:00', '2025-12-12', 1);


-- Shift cover requests remain unchanged (no dates stored) ---------------------------------------------------------------------------------------
INSERT INTO `thebrownbottle`.`shift_cover_request` 
(`shift_id`, `accepted_employee_id`, `requested_employee_id`, `status`) 
VALUES
(1, 3, 1, 'Accepted'),
(4, NULL, 2, 'Pending'),
(7, 5, 3, 'Accepted'),
(10, NULL, 4, 'Pending'),
(13, 9, 5, 'Denied');


-- Time off requests (mapped into same week) -----------------------------------------------------------------------------------------------------
INSERT INTO `thebrownbottle`.`time_off_request` 
(`employee_id`, `start_date`, `end_date`, `reason`, `status`) 
VALUES
(1, '2025-12-11', '2025-12-13', 'Family vacation', 'Accepted'),
(2, '2025-12-10', '2025-12-10', 'Doctor appointment', 'Pending'),
(3, '2025-12-10', '2025-12-11', 'Traveling for wedding', 'Accepted'),
(4, '2025-12-10', '2025-12-11', 'Personal reasons', 'Denied'),
(5, '2025-12-12', '2025-12-13', 'Attending conference', 'Pending');

