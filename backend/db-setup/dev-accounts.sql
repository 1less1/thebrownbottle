USE `thebrownbottle`;

START TRANSACTION;

-- ======================
-- Employee Data
-- ======================
INSERT INTO `thebrownbottle`.`employee` 
(`first_name`, `last_name`, `email`, `phone_number`, `wage`, `admin`, `primary_role`, `secondary_role`, `tertiary_role`)
VALUES 
('Ishimwe', 'Gentil', 'gentili@uni.edu', '677-677-6769', 99.50, 1, 1, NULL, NULL),
('Aaryn', 'Warrior', 'warriora@uni.edu', '999-999-8899', 99.50, 1, 1, NULL, NULL),
('Dom', 'Olhava', 'olhavad@uni.edu', '699-699-5764', 99.50, 1, 1, NULL, NULL),
('Andy', 'Berns', 'andrew.berns@uni.edu', '123-723-5764', 99.50, 1, 1, NULL, NULL),
('Brad', 'Hoffman', 'brad2dabonelv@gmail.com', '319-404-3338', 99.50, 1, 1, NULL, NULL),

-- Test Account for App Store Testing
('Test', 'Account', 'testbrownbottle@gmail.com', '313-454-3038', 99.50, 1, 3, NULL, NULL);

COMMIT;