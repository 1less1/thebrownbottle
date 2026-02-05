
-- Sample Data to be inserted into the MySQL Database when Docker containers are created

-- Ensure we are in the correct database
USE `thebrownbottle`;

START TRANSACTION;

-- Optional: temporarily relax FK checks if you’re iterating
-- SET FOREIGN_KEY_CHECKS = 0;

-- ======================
-- Section Data
-- ======================
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

-- ======================
-- Role Data
-- ======================
INSERT INTO `thebrownbottle`.`role` (`role_name`)
VALUES
('Manager'),
('Host'),
('Server'),
('Bartender'),
('Kitchen'),
('Dish');

-- ======================
-- Employee Data
-- ======================
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

-- ======================
-- Recurring Task Data
-- ======================
INSERT INTO `thebrownbottle`.recurring_task
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

INSERT INTO `thebrownbottle`.recurring_task
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

-- ======================
-- Task Data (all due 2026-01-18 .. 2026-01-24)
-- ======================
INSERT INTO `thebrownbottle`.`task`
(`title`, `description`, `author_id`, `section_id`, `due_date`)
VALUES
('Line Deep Clean', 'Deep clean the sauté and grill stations before dinner service.', 6, 3, '2026-02-18'),
('Host Stand Audit', 'Verify menus, buzzers, and floor chart are up to date.', 1, 2, '2026-02-19'),
('Bar Inventory Check', 'Count all spirits below the par level and note reorders.', 2, 5, '2026-02-20'),
('Patio Heater Maintenance', 'Test patio heaters and replace empty propane tanks.', 2, 6, '2026-02-20'),
('Menu Tasting Prep', 'Prep tasting portions for new menu items for staff review.', 1, 1, '2026-02-21'),
('POS Button Update', 'Confirm new appetizer buttons are live on terminals.', 13, 2, '2026-02-21'),
('Glassware Polish', 'Polish wine and cocktail glasses before service.', 1, 5, '2026-02-22'),
('Friday Event Table Setup', 'Set up extra two-tops and reset silverware rolls.', 2, 2, '2026-02-23'),
('Saturday Brunch Prep', 'Batch hollandaise and cut fruit for brunch.', 6, 1, '2026-02-24'),
('Walk-in Fridge Temp Log', 'Record 3x daily temperature readings and initial.', 6, 3, '2026-02-24');

-- ======================
-- Announcement Data (role-aligned)
-- ======================
INSERT INTO `thebrownbottle`.`announcement` (`author_id`, `title`, `description`, `role_id`)
VALUES
(1, 'Managers: Quarterly P&L Review', 'Managers, please review last quarter''s P&L before Sunday''s check-in.', 1),
(2, 'Hosts: Updated Greeting Script', 'Use the revised greeting and guest waitlist language effective immediately.', 2),
(1, 'Servers: Appetizer Upsell Focus', 'This week''s focus: upsell the new roasted beet salad and crab cakes.', 3),
(2, 'Bartenders: Feature Cocktail of the Week', 'Feature: Blood Orange Old Fashioned. Specs posted behind the bar.', 4),
(1, 'Kitchen: Allergy Protocol Refresher', 'Re-read the allergy card and confirm all special-order procedures.', 5),
(2, 'Dish: Rack Labeling & Soak Times', 'Update rack labels and adhere to posted soak times for flatware.', 6);

-- ======================
-- Shift Data (2026-01-18 .. 2026-01-24)
-- IDs will be 1..36 in this order in a fresh DB
-- ======================
INSERT INTO `thebrownbottle`.`shift` (`employee_id`, `start_time`, `date`, `section_id`)
VALUES
-- Sun 2026-01-18 (IDs 1..5)
(1,  '10:00:00', '2026-02-18', 2),
(4,  '11:00:00', '2026-02-18', 7),
(11, '12:00:00', '2026-02-18', 5),
(5,  '09:00:00', '2026-02-18', 3),
(9,  '09:00:00', '2026-02-18', 4),

-- Mon 2026-01-19 (IDs 6..10)
(2,  '09:00:00', '2026-02-19', 2),
(3,  '10:00:00', '2026-02-19', 2),
(8,  '11:00:00', '2026-02-19', 8),
(12, '08:00:00', '2026-02-19', 1),
(6,  '13:00:00', '2026-02-19', 3),

-- Tue 2026-01-20 (IDs 11..16)
(13, '09:00:00', '2026-02-20', 2),
(7,  '10:00:00', '2026-02-20', 2),
(4,  '16:00:00', '2026-02-20', 6),
(11, '14:00:00', '2026-02-20', 5),
(5,  '08:00:00', '2026-02-20', 4),
(9,  '08:00:00', '2026-02-20', 4),

-- Wed 2026-01-21 (IDs 17..20)
(1,  '10:00:00', '2026-02-21', 2),
(10, '10:00:00', '2026-02-21', 2),
(8,  '16:00:00', '2026-02-21', 7),
(12, '08:00:00', '2026-02-21', 1),

-- Thu 2026-01-22 (IDs 21..25)
(2,  '09:00:00', '2026-02-22', 2),
(3,  '10:00:00', '2026-02-22', 2),
(11, '14:00:00', '2026-02-22', 5),
(6,  '12:00:00', '2026-02-22', 3),
(9,  '08:00:00', '2026-02-22', 4),

-- Fri 2026-01-23 (IDs 26..29)
(13, '09:00:00', '2026-02-23', 2),
(7,  '10:00:00', '2026-02-23', 2),
(4,  '17:00:00', '2026-02-23', 8),
(5,  '08:00:00', '2026-02-23', 3),

-- Sat 2026-01-24 (IDs 30..36)
(1,  '12:00:00', '2026-02-24', 2),
(10, '16:00:00', '2026-02-24', 2),
(11, '16:00:00', '2026-02-24', 5),
(12, '09:00:00', '2026-02-24', 1),
(6,  '14:00:00', '2026-02-24', 3),
(9,  '09:00:00', '2026-02-24', 4),
(8,  '17:00:00', '2026-01-24', 7);

-- ======================
-- Shift Cover Requests (IDs mapped to the shift insert order above)
-- ======================
INSERT INTO `thebrownbottle`.`shift_cover_request`
(`shift_id`, `accepted_employee_id`, `requested_employee_id`, `status`)
VALUES
-- Mon 2026-01-19 10:00 Front (ID 7): Jenna (3) -> Nina (10)
(7, 10, 3, 'Accepted'),

-- Thu 2026-01-22 14:00 Bar (ID 23): Caleb (11) -> Avery (8)
(23, 8, 11, 'Awaiting Approval'),

-- Fri 2026-01-23 08:00 New Back (ID 29): Sophia (5) -> Devin (6)
(29, 6, 5, 'Pending'),

-- Thu 2026-01-22 09:00 Front (ID 21): Marcus (2) -> Ethan (13)
(21, 13, 2, 'Accepted'),

-- Fri 2026-01-23 17:00 Upstairs (ID 28): Tyler (4) -> Avery (8)
(28, 8, 4, 'Pending'),

-- Sat 2026-01-24 16:00 Bar (ID 32): Caleb (11) -> Tyler (4) (denied)
(32, 4, 11, 'Denied'),

-- Tue 2026-01-20 08:00 Old Back (ID 16): Liam (9) -> Devin (6)
(16, 6, 9, 'Accepted'),

-- Wed 2026-01-21 10:00 Front (ID 17): Emily (1) -> Marcus (2)
(17, 2, 1, 'Awaiting Approval'),

-- Sat 2026-01-24 16:00 Front (ID 31): Nina (10) -> Jenna (3) (denied)
(31, 3, 10, 'Denied'),

-- Sat 2026-01-24 09:00 Prep (ID 33): Zoe (12) -> Sophia (5)
(33, 5, 12, 'Awaiting Approval');

-- ======================
-- Time Off Requests (start 2026-01-25 and later)
-- ======================
INSERT INTO `thebrownbottle`.`time_off_request`
(`employee_id`, `start_date`, `end_date`, `reason`, `status`)
VALUES
(3,  '2026-01-26', '2026-01-26', 'DMV appointment', 'Accepted'),
(4,  '2026-01-25', '2026-01-27', 'Weekend trip', 'Pending'),
(12, '2026-02-02', '2026-02-05', 'Family visit', 'Accepted'),
(9,  '2026-02-10', '2026-02-10', 'School meeting', 'Pending'),
(1,  '2026-03-01', '2026-03-03', 'Industry conference', 'Accepted'),
(11, '2026-01-28', '2026-01-28', 'Dentist appointment', 'Denied'),
(7,  '2026-02-15', '2026-02-16', 'Out of town', 'Pending'),
(10, '2026-02-01', '2026-02-01', 'Personal day', 'Accepted');

-- SET FOREIGN_KEY_CHECKS = 1;
COMMIT;