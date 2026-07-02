insert into weddings (slug, couple_name, title, wedding_date)
values ('luis-oscar-2026', 'Luis y Oscar', 'La gran mision de Luis y Oscar', '2026-09-12')
on conflict (slug) do update set
  couple_name = excluded.couple_name,
  title = excluded.title,
  wedding_date = excluded.wedding_date,
  updated_at = now();

with wedding as (
  select id from weddings where slug = 'luis-oscar-2026'
), mission_seed(title, description, points, difficulty, category) as (
  values
    ('Foto con los novios', 'Conseguid una foto con Luis y Oscar donde vuestra mesa parezca portada de revista.', 50, 'medium', 'photo'),
    ('Brindis creativo', 'Inventad un brindis breve, bonito y con una pizca de teatro.', 50, 'medium', 'emotional'),
    ('Alianza entre mesas', 'Firmad una alianza diplomatica con otra mesa y dejad prueba grafica del pacto.', 25, 'easy', 'social'),
    ('Coreografia expres', 'Preparad ocho segundos de baile coordinado. El glamour suma, la valentia tambien.', 75, 'hard', 'dance'),
    ('Portada de pelicula', 'Recread el poster de una pelicula con los recursos que tengais en la mesa.', 50, 'medium', 'funny'),
    ('Consejo matrimonial', 'Escribid o representad un consejo matrimonial digno de pasar a la historia familiar.', 50, 'medium', 'emotional'),
    ('Guardaespaldas de los novios', 'Proteged a los novios con pose seria y maxima solemnidad absurda.', 50, 'medium', 'funny'),
    ('Mesa legendaria', 'Demostrad por que vuestra mesa merece entrar en las leyendas del banquete.', 25, 'easy', 'funny'),
    ('Generaciones en pista', 'Juntad dos generaciones bailando en una misma prueba.', 75, 'hard', 'dance'),
    ('Anecdota secreta', 'Conseguid una anecdota tierna o divertida sobre los novios y documentad el momento.', 50, 'medium', 'social'),
    ('Foto real', 'Haced una foto espontanea que capture la boda tal como se recordara.', 25, 'easy', 'photo'),
    ('Momento epico', 'Cread el momento mas inesperado, elegante y memorable de la noche.', 100, 'epic', 'funny')
)
insert into missions (wedding_id, title, description, points, difficulty, category)
select wedding.id, mission_seed.title, mission_seed.description, mission_seed.points, mission_seed.difficulty, mission_seed.category
from wedding, mission_seed
where not exists (
  select 1 from missions m where m.wedding_id = wedding.id and m.title = mission_seed.title
);

with wedding as (
  select id from weddings where slug = 'luis-oscar-2026'
), ordered_missions as (
  select id, row_number() over (order by created_at, title) as rn
  from missions
  where wedding_id = (select id from wedding)
), table_seed(code, name, display_order, rn) as (
  values
    ('MESA-1', 'Mesa 1', 1, 1),
    ('MESA-2', 'Mesa 2', 2, 2),
    ('MESA-3', 'Mesa 3', 3, 3),
    ('MESA-4', 'Mesa 4', 4, 4),
    ('MESA-5', 'Mesa 5', 5, 5),
    ('MESA-6', 'Mesa 6', 6, 6),
    ('MESA-7', 'Mesa 7', 7, 7),
    ('MESA-8', 'Mesa 8', 8, 8),
    ('MESA-9', 'Mesa 9', 9, 9),
    ('MESA-10', 'Mesa 10', 10, 10),
    ('MESA-11', 'Mesa 11', 11, 11),
    ('MESA-12', 'Mesa 12', 12, 12)
)
insert into tables (wedding_id, code, name, display_order, mission_id)
select wedding.id, table_seed.code, table_seed.name, table_seed.display_order, ordered_missions.id
from wedding
join table_seed on true
left join ordered_missions on ordered_missions.rn = table_seed.rn
on conflict (wedding_id, code) do update set
  name = excluded.name,
  display_order = excluded.display_order,
  mission_id = excluded.mission_id,
  updated_at = now();
