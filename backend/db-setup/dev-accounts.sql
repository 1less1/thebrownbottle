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
('Dom', 'Olhava', 'olhavad@uni.edu', '699-699-5764', 99.50, 1, 1, NULL, NULL);


COMMIT;