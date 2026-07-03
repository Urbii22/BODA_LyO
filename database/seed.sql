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
    (1, 'Paparazzi sin verguenza', 'Sacad una foto con Luis y Oscar como si fueran celebrities y vuestra mesa la prensa mas pesada.', 50, 'medium', 'photo'),
    (2, 'Brindis que sube el volumen', 'Foto de brindis dramatica: brazos arriba, cara de discurso historico y cero timidez.', 50, 'medium', 'emotional'),
    (3, 'Alianza sospechosa', 'Haced una foto pactando con otra mesa: apreton de manos, servilleta firmada o mirada de mafia elegante.', 25, 'easy', 'social'),
    (4, 'Coreografia sin dignidad', 'Montad una pose final de baile como si acabarais de ganar Eurovision. La foto debe parecer el ultimo segundo del show.', 75, 'hard', 'dance'),
    (5, 'Telenovela de sobremesa', 'Recread una escena de celos, traicion o herencia millonaria con lo que haya en la mesa.', 50, 'medium', 'funny'),
    (6, 'Consejo no apto para suegras', 'Conseguid un consejo matrimonial picante pero elegante y fotografiad al sabio que lo diga.', 50, 'medium', 'emotional'),
    (7, 'Guardaespaldas intensitos', 'Escoltad a Luis u Oscar, o a su copa si estan ocupados, con pose seria y cero contexto.', 50, 'medium', 'funny'),
    (8, 'Mesa en modo diva', 'Foto de grupo como portada de disco: una diva central, secundarios dramaticos y actitud de gira mundial.', 25, 'easy', 'funny'),
    (9, 'Dos generaciones, cero verguenza', 'Juntad a alguien joven y alguien veterano en una pose de baile que nadie pueda desver.', 75, 'hard', 'dance'),
    (10, 'Caceria de secreto', 'Encontrad a alguien con una anecdota de los novios y sacad foto del momento de confesion.', 50, 'medium', 'social'),
    (11, 'Beso de pelicula voluntario', 'Recread un beso o casi-beso de poster romantico. Solo voluntarios y cero presion.', 25, 'easy', 'photo'),
    (12, 'Caos elegante', 'Montad la foto mas absurda y glamurosa de la noche sin romper nada ni molestar al personal.', 100, 'epic', 'funny')
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
    (1, 'Paparazzi sin verguenza'),
    (2, 'Brindis que sube el volumen'),
    (3, 'Alianza sospechosa'),
    (4, 'Coreografia sin dignidad'),
    (5, 'Telenovela de sobremesa'),
    (6, 'Consejo no apto para suegras'),
    (7, 'Guardaespaldas intensitos'),
    (8, 'Mesa en modo diva'),
    (9, 'Dos generaciones, cero verguenza'),
    (10, 'Caceria de secreto'),
    (11, 'Beso de pelicula voluntario'),
    (12, 'Caos elegante')
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
