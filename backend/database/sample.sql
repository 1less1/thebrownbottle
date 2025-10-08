-- Sample Data to be inserted into the MySQL Database when Docker containers are created


-- Sample section data ---------------------------------------------------------------------------------------------------------------------------
INSERT INTO `thebrownbottle`.`section` (`section_name`)
VALUES
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
('Emily', 'Turner', 'emily.turner@example.com', '555-123-4567', 18.50, 1, 1, NULL, NULL),  -- Manager (just Manager)
('Marcus', 'Reed', 'marcus.reed@example.com', '555-234-5678', 19.75, 1, 1, NULL, NULL),  -- Manager (just Manager)
('Jenna', 'Klein', 'jenna.klein@example.com', '555-345-6789', 15.25, 0, 2, 3, NULL),  -- Host (also Server)
('Tyler', 'Nguyen', 'tyler.nguyen@example.com', '555-456-7890', 16.00, 0, 3, 4, NULL),  -- Server (also Bartender)
('Sophia', 'Martinez', 'sophia.martinez@example.com', '555-567-8901', 14.75, 0, 5, 6, NULL);  -- Kitchen (also Dish)


-- Sample recurring_task data ------------------------------------------------------------------------------------------------------------------------------
-- Insert recurring task that recurs EVERY DAY starting today, no end date
INSERT INTO recurring_task
(title, description, author_id, section_id, mon, tue, wed, thu, fri, sat, sun, start_date, end_date)
VALUES
(
  'Everyday Recurring Task ',
  'This task recurs all 7 weekdays.',
  1,       -- Replace with actual author_id
  1,       -- Replace with actual section_id
  1, 1, 1, 1, 1, 1, 1,
  CURDATE(),
  NULL
);

-- Insert recurring task that recurs ONLY on WEEKDAYS (Mon-Fri), no end date
INSERT INTO recurring_task
(title, description, author_id, section_id, mon, tue, wed, thu, fri, sat, sun, start_date, end_date)
VALUES
(
  'Weekday Recurring Task',
  'This task recurs every weekday (Mon-Fri).',
  1,       -- Replace with actual author_id
  1,       -- Replace with actual section_id
  1, 1, 1, 1, 1,
  0, 0,
  CURDATE(),
  NULL
);


-- Sample task data ------------------------------------------------------------------------------------------------------------------------------
INSERT INTO `thebrownbottle`.`task` 
(`title`, `description`, `author_id`, `section_id`, `due_date`)
VALUES
('Inventory Count', 'Count all wine bottles in storage.', 1, 1, '2025-05-05'),  -- Author is a Manager, section is Front
('Clean Patio', 'Deep clean the outdoor patio seating area.', 2, 5, '2025-05-06'),  -- Author is a Manager, section is Patio
('Restock Bar', 'Refill bar shelves with necessary liquors and mixers.', 1, 4, '2025-05-07'),  -- Author is a Manager, section is Bar
('Table Setup', 'Set up tables for the Friday evening event.', 2, 2, '2025-05-02'),  -- Author is a Manager, section is New Back
('Check Lighting', 'Inspect all lights and replace any burnt-out bulbs.', 1, 3, '2025-05-04');  -- Author is a Manager, section is Old Back


-- Sample announcement data ----------------------------------------------------------------------------------------------------------------------
INSERT INTO `thebrownbottle`.`announcement` (`author_id`, `title`, `description`, `role_id`)
VALUES
(1, 'New Uniform Policy', 'Please review the updated uniform guidelines posted in the staff room.', 1),   -- All Staff
(2, 'Shift Coverage', 'We need additional coverage for the Saturday evening shift. Please reach out if available.', 1),   -- All Staff
(1, 'Inventory Audit', 'A full inventory audit is scheduled for Monday. Be prepared to assist.', 1),   -- All Staff
(2, 'Holiday Schedule', 'The holiday work schedule has been released. Check the bulletin board for your shifts.', 1),   -- All Staff
(1, 'Customer Feedback', 'Recent feedback has been positive! Keep up the excellent service.', 1),   -- All Staff
(2, 'Training Session', 'Mandatory service training will take place this Friday at 3 PM.', 1),   -- All Staff
(1, 'Menu Updates', 'Several new items have been added to the menu. Review them before your next shift.', 1),   -- All Staff
(2, 'Safety Reminder', 'Remember to use proper lifting techniques when handling heavy items.', 1),   -- All Staff
(1, 'Parking Changes', 'Staff parking spots have been reassigned. Check your new location.', 1),   -- All Staff
(2, 'Team Meeting', 'There will be a brief team meeting before Friday’s dinner shift. Please arrive 15 minutes early.', 1),   -- All Staff

-- Targeted Role Announcements (specific role_id assigned)
(1, 'Manager Briefing', 'Managers, please attend the monthly briefing on upcoming restaurant changes.', 2),   -- Manager
(2, 'Host Responsibilities', 'Reminder: All hosts should be familiar with the updated guest seating chart.', 3),   -- Host
(1, 'Bartender Training', 'Bartenders, please review the new cocktail recipes added to the menu.', 5),   -- Bartender
(2, 'Server Scheduling', 'Servers, be aware that your schedule for next week has been updated. Check the board.', 4),   -- Server
(1, 'Dishwashing Protocols', 'Dish staff, please adhere to the new cleaning and sanitizing guidelines effective today.', 6);   -- Dish


-- Sample shift data -----------------------------------------------------------------------------------------------------------------------------
INSERT INTO `thebrownbottle`.`shift` 
(`employee_id`, `start_time`, `end_time`, `date`, `section_id`)
VALUES
-- Emily Turner (ID 1)
(1, '10:00:00', '14:00:00', '2025-05-26', 2),
(1, '16:00:00', '20:00:00', '2025-05-28', 3),
(1, '08:00:00', '12:00:00', '2025-05-30', 1),

-- Marcus Reed (ID 2)
(2, '12:00:00', '18:00:00', '2025-05-25', 4),
(2, '09:00:00', '13:00:00', '2025-05-27', 1),
(2, '15:00:00', '19:00:00', '2025-05-29', 2),

-- Jenna Klein (ID 3)
(3, '17:00:00', '21:00:00', '2025-05-26', 3),
(3, '10:00:00', '14:00:00', '2025-05-28', 1),
(3, '08:00:00', '12:00:00', '2025-05-30', 4),

-- Tyler Nguyen (ID 4)
(4, '11:00:00', '15:00:00', '2025-05-25', 2),
(4, '14:00:00', '18:00:00', '2025-05-27', 3),
(4, '09:00:00', '13:00:00', '2025-05-29', 4),

-- Sophia Martinez (ID 5)
(5, '13:00:00', '17:00:00', '2025-05-26', 1),
(5, '10:00:00', '14:00:00', '2025-05-28', 4),
(5, '16:00:00', '20:00:00', '2025-05-31', 2);


