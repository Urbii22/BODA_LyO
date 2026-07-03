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
    ('Foto con los novios', 'Conseguid una foto con Luis y Oscar donde vuestro grupo parezca portada de revista.', 50, 'medium', 'photo'),
    ('Brindis creativo', 'Inventad un brindis breve, bonito y con una pizca de teatro.', 50, 'medium', 'emotional'),
    ('Alianza entre grupos', 'Firmad una alianza diplomatica con otro grupo y dejad prueba grafica del pacto.', 25, 'easy', 'social'),
    ('Coreografia expres', 'Preparad ocho segundos de baile coordinado. El glamour suma, la valentia tambien.', 75, 'hard', 'dance'),
    ('Portada de pelicula', 'Recread el poster de una pelicula con los recursos que tengais en el grupo.', 50, 'medium', 'funny'),
    ('Consejo matrimonial', 'Escribid o representad un consejo matrimonial digno de pasar a la historia familiar.', 50, 'medium', 'emotional'),
    ('Guardaespaldas de los novios', 'Proteged a los novios con pose seria y maxima solemnidad absurda.', 50, 'medium', 'funny'),
    ('Grupo legendario', 'Demostrad por que vuestro grupo merece entrar en las leyendas del banquete.', 25, 'easy', 'funny'),
    ('Generaciones en pista', 'Juntad dos generaciones bailando en una misma prueba.', 75, 'hard', 'dance'),
    ('Anecdota secreta', 'Conseguid una anecdota tierna o divertida sobre los novios y documentad el momento.', 50, 'medium', 'social'),
    ('Foto real', 'Haced una foto espontanea que capture la boda tal como se recordara.', 25, 'easy', 'photo'),
    ('Momento epico', 'Cread el momento mas inesperado, elegante y memorable de la noche.', 100, 'epic', 'funny'),
    ('Intercambio de nombres', 'Conseguid el nombre de cinco personas de grupos distintos y una foto con cada nuevo fichaje.', 50, 'medium', 'social'),
    ('Baile con desconocido', 'Sacad a bailar a alguien que no conociais de nada antes de hoy.', 50, 'medium', 'dance'),
    ('Brindis entre grupos', 'Cruzad un brindis sincero con un grupo que no sea el vuestro.', 25, 'easy', 'social'),
    ('Selfie en cadena', 'Una sola foto en la que salga gente de al menos tres grupos diferentes.', 50, 'medium', 'photo'),
    ('El conector', 'Presentad a dos personas que no se conocian y lograd que acaben charlando solas.', 75, 'hard', 'social'),
    ('Mas anos que vosotros', 'Encontrad a alguien que conozca a los novios desde hace mas anos que vosotros y que os cuente como fue.', 50, 'medium', 'emotional'),
    ('Equipo mixto de baile', 'Montad un grupo de baile mitad del vuestro, mitad de otro, y grabadlo.', 75, 'hard', 'dance'),
    ('Piropo elegante', 'Regalad un piropo con clase a alguien que acabais de conocer y guardad su reaccion.', 25, 'easy', 'funny'),
    ('El dato imposible', 'Averiguad un dato sorprendente de un desconocido de la boda y verificadlo con una foto juntos.', 50, 'medium', 'social'),
    ('Familia de enfrente', 'Haced una foto de grupo con el grupo que teneis justo enfrente.', 25, 'easy', 'photo'),
    ('Cadena de abrazos', 'Formad una cadena de abrazos que una a personas de tres grupos distintos.', 50, 'medium', 'emotional'),
    ('Reto del idioma', 'Encontrad a alguien que hable otro idioma y aprended a decir felicidades en el.', 50, 'medium', 'social'),
    ('Grupos hermanados', 'Adoptad a otro grupo como aliado oficial e inventad un saludo secreto comun.', 50, 'medium', 'funny'),
    ('Modo cupido', 'Conseguid que dos personas que no se conocian se hagan una foto juntas y felices.', 75, 'hard', 'funny'),
    ('Busca tu gemelo', 'Encontrad a alguien de otro grupo vestido de un color parecido al vuestro y posad juntos.', 25, 'easy', 'photo'),
    ('La ola', 'Organizad una ola humana que recorra al menos tres grupos del banquete.', 75, 'hard', 'funny'),
    ('Consejo a duo', 'Un joven y una persona mayor que no se conocian graban juntos un consejo para los novios.', 50, 'medium', 'emotional'),
    ('El corrillo', 'Formad un corro de ocho personas venidas de al menos cuatro grupos diferentes.', 50, 'medium', 'social'),
    ('De la primera a la ultima', 'Reunid en una misma foto a alguien del primer grupo y a alguien del ultimo.', 50, 'medium', 'photo'),
    ('Historia de dos invitados', 'Encontrad a dos desconocidos que descubran que tienen algo en comun y contadlo.', 75, 'hard', 'social')
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
    ('GRUPO-1', 'Grupo 1', 1, 1),
    ('GRUPO-2', 'Grupo 2', 2, 2),
    ('GRUPO-3', 'Grupo 3', 3, 3),
    ('GRUPO-4', 'Grupo 4', 4, 4),
    ('GRUPO-5', 'Grupo 5', 5, 5),
    ('GRUPO-6', 'Grupo 6', 6, 6),
    ('GRUPO-7', 'Grupo 7', 7, 7),
    ('GRUPO-8', 'Grupo 8', 8, 8),
    ('GRUPO-9', 'Grupo 9', 9, 9),
    ('GRUPO-10', 'Grupo 10', 10, 10),
    ('GRUPO-11', 'Grupo 11', 11, 11),
    ('GRUPO-12', 'Grupo 12', 12, 12)
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
