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
    ('Momento epico', 'Cread el momento mas inesperado, elegante y memorable de la noche.', 100, 'epic', 'funny'),
    ('Intercambio de nombres', 'Conseguid el nombre de cinco personas de mesas distintas y una foto con cada nuevo fichaje.', 50, 'medium', 'social'),
    ('Baile con desconocido', 'Sacad a bailar a alguien que no conociais de nada antes de hoy.', 50, 'medium', 'dance'),
    ('Brindis entre mesas', 'Cruzad un brindis sincero con una mesa que no sea la vuestra.', 25, 'easy', 'social'),
    ('Selfie en cadena', 'Una sola foto en la que salga gente de al menos tres mesas diferentes.', 50, 'medium', 'photo'),
    ('El conector', 'Presentad a dos personas que no se conocian y lograd que acaben charlando solas.', 75, 'hard', 'social'),
    ('Mas anos que vosotros', 'Encontrad a alguien que conozca a los novios desde hace mas anos que vosotros y que os cuente como fue.', 50, 'medium', 'emotional'),
    ('Equipo mixto de baile', 'Montad un grupo de baile mitad de vuestra mesa, mitad de otra, y grabadlo.', 75, 'hard', 'dance'),
    ('Piropo elegante', 'Regalad un piropo con clase a alguien que acabais de conocer y guardad su reaccion.', 25, 'easy', 'funny'),
    ('El dato imposible', 'Averiguad un dato sorprendente de un desconocido de la boda y verificadlo con una foto juntos.', 50, 'medium', 'social'),
    ('Familia de enfrente', 'Haced una foto de grupo con la mesa que teneis justo enfrente.', 25, 'easy', 'photo'),
    ('Cadena de abrazos', 'Formad una cadena de abrazos que una a personas de tres mesas distintas.', 50, 'medium', 'emotional'),
    ('Reto del idioma', 'Encontrad a alguien que hable otro idioma y aprended a decir felicidades en el.', 50, 'medium', 'social'),
    ('Mesas hermanadas', 'Adoptad a otra mesa como aliada oficial e inventad un saludo secreto comun.', 50, 'medium', 'funny'),
    ('Modo cupido', 'Conseguid que dos personas que no se conocian se hagan una foto juntas y felices.', 75, 'hard', 'funny'),
    ('Busca tu gemelo', 'Encontrad a alguien de otra mesa vestido de un color parecido al vuestro y posad juntos.', 25, 'easy', 'photo'),
    ('La ola', 'Organizad una ola humana que recorra al menos tres mesas del banquete.', 75, 'hard', 'funny'),
    ('Consejo a duo', 'Un joven y una persona mayor que no se conocian graban juntos un consejo para los novios.', 50, 'medium', 'emotional'),
    ('El corrillo', 'Formad un corro de ocho personas venidas de al menos cuatro mesas diferentes.', 50, 'medium', 'social'),
    ('De la primera a la ultima', 'Reunid en una misma foto a alguien de la primera mesa y a alguien de la ultima.', 50, 'medium', 'photo'),
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
