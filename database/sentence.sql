
USE hotel_booking;
SELECT * FROM users WHERE username = 'CtripTest001';

UPDATE users SET role = 'admin' WHERE username = 'admin001';


SELECT * FROM users;

SELECT email, COUNT(*) FROM users GROUP BY email HAVING COUNT(*) > 1;

SELECT * FROM hotels;

SELECT * FROM rooms;

SELECT * FROM hotel_images;