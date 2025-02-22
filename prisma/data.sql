INSERT INTO public."Publisher" (code, name, address, city, phone)
VALUES 
('SP01', 'Penerbit Informatika', 'Jl. Buah Batu No. 121', 'Bandung', '0813-2220-1946'),
('SP02', 'Andi Offset', 'Jl. Suryalaya IX No. 3', 'Bandung', '0878-3903-0688'),
('SP03', 'Danendra', 'Jl. Moch. Toha 44', 'Bandung', '022-5201215');

INSERT INTO public."Book" (code, category, name, price, stock, publisher_id)
VALUES
('K1001', 'Keilmuan', 'Analisis & Perancangan Sistem Informasi', 50000, 60, 1),
('K1002', 'Keilmuan', 'Artificial Intelligence', 45000, 40, 1),
('K1003', 'Keilmuan', 'Autocad 3 Dimensi', 48000, 25, 1),
('B1001', 'Bisnis', 'Manajemen & Bisnis Online', 75000, 20, 1),
('B1002', 'Bisnis', 'Cloud Computing System', 85000, 12, 1),
('B1003', 'Bisnis', 'Etika Bisnis dan Tanggung Jawab Sosial', 90000, 15, 2),
('N1001', 'Novel', 'Cahaya Di Penjuru Hati', 50000, 10, 3),
('N1002', 'Novel', 'Aku Ingin Cerita', 48000, 12, 3);