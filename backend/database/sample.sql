-- Sample Data to be inserted into the MySQL Database when Docker containers are created


-- Sample employee data --------------------------------------------------------------------------------------------------------------------------
INSERT INTO `thebrownbottle`.`employee` 
(`first_name`, `last_name`, `email`, `phone_number`, `wage`, `admin`)
VALUES 
('Emily', 'Turner', 'emily.turner@example.com', '555-123-4567', 18.50, 1),
('Marcus', 'Reed', 'marcus.reed@example.com', '555-234-5678', 19.75, 1),
('Jenna', 'Klein', 'jenna.klein@example.com', '555-345-6789', 15.25, 0),
('Tyler', 'Nguyen', 'tyler.nguyen@example.com', '555-456-7890', 16.00, 0),
('Sophia', 'Martinez', 'sophia.martinez@example.com', '555-567-8901', 14.75, 0);


-- Sample task data ------------------------------------------------------------------------------------------------------------------------------
INSERT INTO `thebrownbottle`.`task` 
(`title`, `description`, `author_id`, `assignee_id`, `due_date`)
VALUES
-- Task 1 by Emily Turner for Jenna Klein
('Inventory Count', 'Count all wine bottles in storage.', 1, 3, '2025-05-05'),

-- Task 2 by Marcus Reed for Tyler Nguyen
('Clean Patio', 'Deep clean the outdoor patio seating area.', 2, 4, '2025-05-06'),

-- Task 3 by Emily Turner for Sophia Martinez
('Restock Bar', 'Refill bar shelves with necessary liquors and mixers.', 1, 5, '2025-05-07'),

-- Task 4 by Marcus Reed for Jenna Klein
('Table Setup', 'Set up tables for the Friday evening event.', 2, 3, '2025-05-02', 1),

-- Task 5 by Emily Turner for Tyler Nguyen
('Check Lighting', 'Inspect all lights and replace any burnt-out bulbs.', 1, 4, '2025-05-04');


-- Sample announcement data ----------------------------------------------------------------------------------------------------------------------
INSERT INTO `thebrownbottle`.`announcement` (`employee_id`, `title`, `description`)
VALUES
(1,'New Uniform Policy', 'Please review the updated uniform guidelines posted in the staff room.'),
(2, 'Shift Coverage', 'We need additional coverage for the Saturday evening shift. Please reach out if available.'),
(1, 'Inventory Audit', 'A full inventory audit is scheduled for Monday. Be prepared to assist.'),
(2, 'Holiday Schedule', 'The holiday work schedule has been released. Check the bulletin board for your shifts.'),
(1, 'Customer Feedback', 'Recent feedback has been positive! Keep up the excellent service.'),
(2, 'Training Session', 'Mandatory service training will take place this Friday at 3 PM.'),
(1, 'Menu Updates', 'Several new items have been added to the menu. Review them before your next shift.'),
(2, 'Safety Reminder', 'Remember to use proper lifting techniques when handling heavy items.'),
(1, 'Parking Changes', 'Staff parking spots have been reassigned. Check your new location.'),
(2, 'Team Meeting', 'There will be a brief team meeting before Friday’s dinner shift. Please arrive 15 minutes early.');


-- Sample section data ---------------------------------------------------------------------------------------------------------------------------
INSERT INTO `thebrownbottle`.`section` (`section_id`, `section_name`)
VALUES
(1, 'Front House'),
(2, 'Back House'),
(3, 'Bar'),
(4, 'Kitchen');


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


