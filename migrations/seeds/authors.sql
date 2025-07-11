-- Sample seed data for authors table
INSERT INTO public.authors (name, biography, birth_date, death_date, nationality, website, awards, genres, profile_image_url) VALUES
('J.K. Rowling', 'British author best known for the Harry Potter series. Born Joanne Rowling, she writes under the pen names J.K. Rowling and Robert Galbraith.', '1965-07-31', NULL, 'British', 'https://www.jkrowling.com', 'Order of the British Empire, Hugo Award, British Book Awards', 'Fantasy, Young Adult, Crime Fiction', 'jk_rowling.jpg'),

('George Orwell', 'English novelist, essayist, journalist and critic. His work is characterized by lucid prose, social criticism, opposition to totalitarianism, and support of democratic socialism.', '1903-06-25', '1950-01-21', 'British', NULL, 'Prometheus Hall of Fame Award', 'Dystopian Fiction, Political Fiction, Social Criticism', 'george_orwell.jpg'),

('Harper Lee', 'American novelist widely known for To Kill a Mockingbird, published in 1960. She won the Pulitzer Prize for Fiction in 1961.', '1926-04-28', '2016-02-19', 'American', NULL, 'Pulitzer Prize for Fiction, Presidential Medal of Freedom', 'Southern Gothic, Bildungsroman', 'harper_lee.jpg'),

('Agatha Christie', 'English writer known for her 66 detective novels and 14 short story collections, particularly those revolving around fictional detectives Hercule Poirot and Miss Marple.', '1890-09-15', '1976-01-12', 'British', NULL, 'Grand Master Award, Order of the British Empire', 'Mystery, Crime Fiction, Detective Fiction', 'agatha_christie.jpg'),

('Stephen King', 'American author of horror, supernatural fiction, suspense, crime, science-fiction, and fantasy novels. His books have sold more than 350 million copies worldwide.', '1947-09-21', NULL, 'American', 'https://stephenking.com', 'Bram Stoker Awards, World Fantasy Awards, British Fantasy Society Awards', 'Horror, Supernatural Fiction, Suspense, Fantasy', 'stephen_king.jpg'),

('Gabriel García Márquez', 'Colombian novelist, short-story writer, screenwriter, and journalist. He was awarded the Nobel Prize in Literature in 1982.', '1927-03-06', '2014-04-17', 'Colombian', NULL, 'Nobel Prize in Literature, Neustadt International Prize for Literature', 'Magical Realism, Literary Fiction', 'gabriel_garcia_marquez.jpg'),

('Toni Morrison', 'American novelist, essayist, editor, teacher, and professor emeritus. She won the Nobel Prize in Literature in 1993.', '1931-02-18', '2019-08-05', 'American', NULL, 'Nobel Prize in Literature, Pulitzer Prize for Fiction, Presidential Medal of Freedom', 'African American Literature, Historical Fiction', 'toni_morrison.jpg'),

('Ray Bradbury', 'American author and screenwriter. He worked in a variety of genres, including fantasy, science fiction, horror, and mystery fiction.', '1920-08-22', '2012-06-05', 'American', NULL, 'Hugo Award, Nebula Award, Bram Stoker Award', 'Science Fiction, Fantasy, Horror, Mystery', 'ray_bradbury.jpg'),

('Maya Angelou', 'American poet, memoirist, and civil rights activist. She published seven autobiographies, three books of essays, several books of poetry, and is credited with a list of plays, movies, and television shows.', '1928-04-04', '2014-05-28', 'American', NULL, 'Presidential Medal of Freedom, National Medal of Arts', 'Autobiography, Poetry, Civil Rights Literature', 'maya_angelou.jpg'),

('Ernest Hemingway', 'American novelist, short-story writer, and journalist. He was awarded the Nobel Prize in Literature in 1954.', '1899-07-21', '1961-07-02', 'American', NULL, 'Nobel Prize in Literature, Pulitzer Prize for Fiction', 'Literary Fiction, War Literature, Adventure Fiction', 'ernest_hemingway.jpg');

-- Add some contemporary authors
INSERT INTO public.authors (name, biography, birth_date, nationality, website, genres, profile_image_url) VALUES
('Neil Gaiman', 'English author of short fiction, novels, comic books, graphic novels, nonfiction, audio theatre, and films.', '1960-11-10', 'British', 'https://www.neilgaiman.com', 'Fantasy, Horror, Science Fiction, Graphic Novels', 'neil_gaiman.jpg'),

('Chimamanda Ngozi Adichie', 'Nigerian writer whose works include novels, short stories and nonfiction. She was described in The Times Literary Supplement as "the most prominent" of a "procession of critically acclaimed young anglophone authors" of African fiction.', '1977-09-15', 'Nigerian', 'https://www.chimamanda.com', 'Literary Fiction, Postcolonial Literature, Feminist Literature', 'chimamanda_adichie.jpg'),

('Haruki Murakami', 'Japanese writer. His books and stories have been bestsellers in Japan as well as internationally, with his work being translated into 50 languages.', '1949-01-12', 'Japanese', NULL, 'Magical Realism, Postmodern Literature, Surreal Fiction', 'haruki_murakami.jpg'),

('Margaret Atwood', 'Canadian poet, novelist, literary critic, essayist, teacher, environmental activist, and inventor.', '1939-11-18', 'Canadian', 'https://margaretatwood.ca', 'Dystopian Fiction, Literary Fiction, Speculative Fiction, Poetry', 'margaret_atwood.jpg'),

('Paulo Coelho', 'Brazilian lyricist and novelist, best known for his novel The Alchemist.', '1947-08-24', 'Brazilian', 'https://paulocoelho.com', 'Philosophical Fiction, Spiritual Literature, Adventure Fiction', 'paulo_coelho.jpg');

-- Add comment
SELECT 'Sample authors data inserted successfully' AS message;
