insert into weddings (slug, couple_name, title, wedding_date)
values ('luis-oscar-2026', 'Luis y Oscar', 'La gran mision de Luis y Oscar', '2026-09-12')
on conflict (slug) do update set
  couple_name = excluded.couple_name,
  title = excluded.title,
  wedding_date = excluded.wedding_date,
  updated_at = now();

with wedding as (
  select id from weddings where slug = 'luis-oscar-2026'
), mission_seed(slot, title, description, points, difficulty, category) as (
  values
    (1, 'Foto con los novios', 'Conseguid una foto con Luis y Oscar donde vuestra mesa parezca portada de revista.', 50, 'medium', 'photo'),
    (2, 'Brindis creativo', 'Haced una foto de brindis breve, bonito y con una pizca de teatro.', 50, 'medium', 'emotional'),
    (3, 'Alianza entre mesas', 'Sacad una foto con otra mesa para sellar una alianza durante el banquete.', 25, 'easy', 'social'),
    (4, 'Coreografia expres', 'Preparad una pose final de baile coordinado. El glamour suma, la valentia tambien.', 75, 'hard', 'dance'),
    (5, 'Portada de pelicula', 'Recread el poster de una pelicula con los recursos que tengais en la mesa.', 50, 'medium', 'funny'),
    (6, 'Consejo matrimonial', 'Conseguid un consejo matrimonial digno de pasar a la historia familiar.', 50, 'medium', 'emotional'),
    (7, 'Guardaespaldas de los novios', 'Proteged a los novios con pose seria y maxima solemnidad absurda.', 50, 'medium', 'funny'),
    (8, 'Mesa legendaria', 'Demostrad por que vuestra mesa merece entrar en las leyendas del banquete.', 25, 'easy', 'funny'),
    (9, 'Generaciones en pista', 'Juntad dos generaciones en una misma prueba de baile o pose de pista.', 75, 'hard', 'dance'),
    (10, 'Anecdota secreta', 'Conseguid una anecdota tierna o divertida sobre los novios y documentad el momento.', 50, 'medium', 'social'),
    (11, 'Foto real', 'Haced una foto espontanea que capture la boda tal como se recordara.', 25, 'easy', 'photo'),
    (12, 'Momento epico', 'Cread el momento mas inesperado, elegante y memorable de la noche.', 100, 'epic', 'funny')
), existing_missions as (
  select id, row_number() over (order by created_at, title) as slot
  from missions
  where wedding_id = (select id from wedding)
), updated_missions as (
  update missions m
  set
    title = mission_seed.title,
    description = mission_seed.description,
    points = mission_seed.points,
    difficulty = mission_seed.difficulty,
    category = mission_seed.category,
    is_active = true,
    updated_at = now()
  from mission_seed
  join existing_missions on existing_missions.slot = mission_seed.slot
  where m.id = existing_missions.id
  returning m.id
)
insert into missions (wedding_id, title, description, points, difficulty, category)
select wedding.id, mission_seed.title, mission_seed.description, mission_seed.points, mission_seed.difficulty, mission_seed.category
from wedding, mission_seed
where not exists (
  select 1 from existing_missions where existing_missions.slot = mission_seed.slot
);

with wedding as (
  select id from weddings where slug = 'luis-oscar-2026'
), mission_seed(slot, title) as (
  values
    (1, 'Foto con los novios'),
    (2, 'Brindis creativo'),
    (3, 'Alianza entre mesas'),
    (4, 'Coreografia expres'),
    (5, 'Portada de pelicula'),
    (6, 'Consejo matrimonial'),
    (7, 'Guardaespaldas de los novios'),
    (8, 'Mesa legendaria'),
    (9, 'Generaciones en pista'),
    (10, 'Anecdota secreta'),
    (11, 'Foto real'),
    (12, 'Momento epico')
), mission_assignments as (
  select distinct on (mission_seed.slot) mission_seed.slot, missions.id
  from wedding
  join mission_seed on true
  join missions on missions.wedding_id = wedding.id and missions.title = mission_seed.title
  order by mission_seed.slot, missions.created_at, missions.id
), table_seed(code, name, display_order, slot) as (
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
select wedding.id, table_seed.code, table_seed.name, table_seed.display_order, mission_assignments.id
from wedding
join table_seed on true
left join mission_assignments on mission_assignments.slot = table_seed.slot
on conflict (wedding_id, code) do update set
  name = excluded.name,
  display_order = excluded.display_order,
  mission_id = excluded.mission_id,
  updated_at = now();
