-- Sample shift data for testing
INSERT INTO `thebrownbottle`.`shift` (`start_time`, `date`) VALUES ('08:00:00', '2025-04-15');
INSERT INTO `thebrownbottle`.`shift` (`start_time`, `date`) VALUES ('12:00:00', '2025-04-16');
INSERT INTO `thebrownbottle`.`shift` (`start_time`, `date`) VALUES ('16:00:00', '2025-04-17');
INSERT INTO `thebrownbottle`.`shift` (`start_time`, `date`) VALUES ('20:00:00', '2025-04-18');
INSERT INTO `thebrownbottle`.`shift` (`start_time`, `date`) VALUES ('00:00:00', '2025-04-19');



-- Sample Employee Data for Testing
INSERT INTO `thebrownbottle`.`employee` (
  `first_name`,
  `last_name`,
  `email`,
  `phone_number`,
  `wage`,
  `admin`
) VALUES
  ('Alice', 'Johnson', 'alice.johnson@example.com', '319-555-0101', 18.50, 1),
  ('Bob', 'Smith', 'bob.smith@example.com', '319-555-0202', 16.75, 0),
  ('Charlie', 'Brown', 'charlie.brown@example.com', '319-555-0303', 15.25, 0);



-- Sample Shift Data for Testing
INSERT INTO `thebrownbottle`.`shift` (
  `employee_id`,
  `start_time`,
  `end_time`,
  `date`
) VALUES
  -- Alice's shift
  (1, '09:00:00', '17:00:00', '2025-04-18'),

  -- Bob's shift
  (2, '10:00:00', '18:00:00', '2025-04-18'),

  -- Charlie's shift
  (3, '11:00:00', '19:00:00', '2025-04-18');



-- Sample Task Data for Testing
INSERT INTO `thebrownbottle`.`tasks` 
(`title`, `description`, `author_id`, `assignee_id`, `due_date`, `complete`)
VALUES 
('Design Menu Layout', 'Create a new menu layout for the spring season.', 1, 2, '2025-04-25', 0);

INSERT INTO `thebrownbottle`.`task` 
(`title`, `description`, `author_id`, `assignee_id`, `due_date`, `complete`)
VALUES 
('Inventory Audit', 'Perform a complete inventory check for the month.', 1, 3, '2025-04-20', 0);

INSERT INTO `thebrownbottle`.`task` 
(`title`, `description`, `author_id`, `assignee_id`, `due_date`, `complete`)
VALUES 
('Social Media Campaign', 'Plan and schedule posts for the upcoming event.', 1, 2, '2025-04-30', 0);

