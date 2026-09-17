/* =====================================================================
   DATOS DEL CLUB · Fénix FS
   ---------------------------------------------------------------------
   Este es el ÚNICO archivo que hay que tocar para actualizar el contenido
   de la web: cifras, historia, equipos, miembros y patrocinadores.
   No hace falta saber programar: copia un bloque existente, cámbialo
   y guarda. Las imágenes van en la carpeta assets/img/.
   ===================================================================== */

const CLUB = {

  /* Cifras que aparecen bajo el hero. Cambia el valor y la etiqueta. */
  stats: [
    { value: "2018", label: "Año de fundación" },
    { value: "4",    label: "Equipos senior" },
    { value: "Sabadell", label: "Nuestra casa" }
  ],

  /* Párrafo de introducción a la historia. */
  historiaIntro:
    "Todo empezó con una idea sencilla entre amigos: un equipo donde juntarse a jugar a fútbol sala. " +
    "Ocho años después, el Fénix es un club con cuatro equipos senior, cantera y un sitio en la " +
    "Primera División Catalana. Esta es la historia de cómo hemos llegado hasta aquí.",

  /* Línea de tiempo.
     - year: año o etiqueta.
     - title / text: hito y relato.
     - image: foto opcional en assets/img/historia/ (si no existe, no se muestra nada).
     - highlight: true para marcar los momentos grandes (ascensos) con el punto en dorado. */
  historia: [
    {
      year: "2018",
      title: "Renace el Fénix",
      text: "Un grupo de amigos con ganas de jugar a fútbol sala decide montar su propio equipo. De esa idea nace el Fénix: dos equipos senior en el primer año y muchas ganas de aprender.",
      image: "assets/img/historia/2018.jpg"
    },
    {
      year: "2019",
      title: "El primer ascenso",
      text: "Con solo un año de vida, el primer equipo asciende de división en la federación en la que competíamos. La señal de que aquello iba en serio.",
      image: "assets/img/historia/2019.jpg",
      highlight: true
    },
    {
      year: "2020",
      title: "Resistir",
      text: "El año de la COVID-19 pone a prueba a todos los clubes. El Fénix aguanta el golpe, mantiene el grupo unido y da el salto a la Federació Catalana de Futbol.",
      image: "assets/img/historia/2020.jpg"
    },
    {
      year: "2021",
      title: "Segunda Catalana y cantera",
      text: "Se mantiene la estructura de Senior A y B y empezamos a construir la base del club. Y el primer equipo consigue el ascenso a Segunda División Catalana.",
      image: "assets/img/historia/2021.jpg",
      highlight: true
    },
    {
      year: "2022",
      title: "El juvenil también sube",
      text: "La cantera da sus primeros frutos: el juvenil consigue su ascenso. El futuro del club empieza a tomar forma.",
      image: "assets/img/historia/2022.jpg",
      highlight: true
    },
    {
      year: "2024",
      title: "Segundo ascenso del juvenil",
      text: "Después de un año duro, el juvenil vuelve a subir de categoría. La constancia gana.",
      image: "assets/img/historia/2024.jpg",
      highlight: true
    },
    {
      year: "2026",
      title: "Primera División Catalana",
      text: "Tras mucho esfuerzo, el primer equipo asciende a Primera División Catalana, la categoría más alta en la historia del club. Y lo celebramos con cuatro equipos senior.",
      image: "assets/img/historia/2026.jpg",
      highlight: true
    },
    {
      year: "Hoy",
      title: "Lo mejor está por llegar",
      text: "Más equipos, más afición y la misma esencia de siempre. #SIENTELFÉNIX",
      image: ""
    }
  ],

  /* Equipos.
     - image: una foto (opcional; si no existe, se muestra un fondo del club).
     - images: varias fotos en lista; si hay más de una, la tarjeta muestra
       una galería con flechas. Tiene prioridad sobre 'image'.
     - plantilla: jugadores del equipo. Al hacer clic en la tarjeta se abre un
       pop-up con la plantilla agrupada por posición.
         · name: nombre del jugador
         · position: "Portero", "Cierre", "Ala" o "Pívot"
         · number: dorsal (opcional, "" si no tiene)
         · photo: ruta de la foto en assets/img/players/ (opcional; si está vacía
           o no existe, se muestran las iniciales). Recomendado: foto vertical 4:5.
         · Ficha (todo opcional, se muestra al pulsar el jugador): edad, altura,
           pie ("Derecho"/"Izquierdo"), desde (año de llegada), procedencia,
           bio (frase corta), instagram (usuario sin @).
           Los goles y tarjetas de la ficha salen solos de las estadísticas.
     - staff: lista de personas del cuerpo técnico (cargo y nombre).
     - pending: true si el equipo aún no está confirmado (sale con etiqueta "En preparación"). */
  equipos: [
    {
      name: "Senior A",
      tagline: "El presente del club",
      category: "Primera División Catalana",
      description: "Compite en la Primera División Catalana de fútbol sala tras un ascenso histórico. El equipo que lleva el nombre del Fénix a lo más alto.",
      images: [
        "assets/img/teams/senior-a-2.jpg",
        "assets/img/teams/senior-a-1.jpg"
      ],
      staff: [
        { role: "Entrenador", name: "Ciscu Venegas" }
      ],
      plantilla: [
        { name: "Raul Montenegro",   position: "Portero", number: "", photo: "assets/img/players/senior-a/raul-montenegro.jpg" },
        { name: "Sergio Cebollero",  position: "Portero", number: "", photo: "assets/img/players/senior-a/sergio-cebollero.jpg" },
        { name: "Serni Fenoy",       position: "Cierre",  number: "", photo: "assets/img/players/senior-a/serni-fenoy.jpg" },
        { name: "Cristian Riquelme", position: "Cierre",  number: "", photo: "assets/img/members/cristian-riquelme.jpg" },
        { name: "Juan Gutiérrez",    position: "Ala",     number: "", photo: "assets/img/players/senior-a/juan-gutierrez.jpg" },
        { name: "Angel Olivares",    position: "Ala",     number: "", photo: "assets/img/players/senior-a/angel-olivares.jpg" },
        { name: "Uri Moreno",        position: "Ala",     number: "", photo: "assets/img/players/senior-a/uri-moreno.jpg" },
        { name: "Joan Marc Uribe",   position: "Ala",     number: "", photo: "assets/img/players/senior-a/joan-marc-uribe.jpg" },
        { name: "Josep Masip",       position: "Ala",     number: "", photo: "assets/img/players/senior-a/josep-masip.jpg" },
        { name: "Kendry",            position: "Ala",     number: "", photo: "assets/img/players/senior-a/kendry.jpg" },
        { name: "Madrigal",          position: "Ala",     number: "", photo: "assets/img/players/senior-a/madrigal.jpg" },
        { name: "Azzy",              position: "Pívot",   number: "", photo: "assets/img/players/senior-a/azzy.jpg" },
        { name: "Aitor",             position: "Pívot",   number: "", photo: "assets/img/players/senior-a/aitor.jpg" }
      ],
      pending: false
    },
    {
      name: "Senior B",
      tagline: "El futuro del club",
      category: "Tercera División Catalana",
      description: "Un equipo hecho de pura ambición e intensidad. Jóvenes con hambre que empujan desde abajo para seguir creciendo.",
      images: [
        "assets/img/teams/senior-b-1.jpg",
        "assets/img/teams/senior-b-2.jpg"
      ],
      staff: [
        { role: "Entrenador", name: "Vlad Pienariu" },
        { role: "Segundo entrenador", name: "Joel García" }
      ],
      plantilla: [
        { name: "Eric Márquez",        position: "Portero", number: "1", photo: "assets/img/players/senior-b/eric-marquez.jpg" },
        { name: "Alejandro Del Saz",   position: "Portero", number: "25", photo: "assets/img/players/senior-b/alejandro-del-saz.jpg" },
        { name: "Izán Carrasco",       position: "Cierre",  number: "6", photo: "assets/img/players/senior-b/izan-carrasco.jpg" },
        { name: "Aleix Ruiz",          position: "Cierre",  number: "11", photo: "assets/img/players/senior-b/aleix-ruiz.jpg" },
        { name: "Cristian Riquelme",   position: "Cierre",  number: "4",  photo: "assets/img/members/cristian-riquelme.jpg" },
        { name: "Kike Nayach",         position: "Ala",     number: "10", photo: "assets/img/players/senior-b/kike-nayach.jpg" },
        { name: "Arnau Moreno",        position: "Ala",     number: "9", photo: "assets/img/players/senior-b/arnau-moreno.jpg" },
        { name: "David Cruz",          position: "Ala",     number: "17", photo: "assets/img/players/senior-b/david-cruz.jpg" },
        { name: "David Perdiguer",     position: "Ala",     number: "23", photo: "assets/img/players/senior-b/david-perdiguer.jpg" },
        { name: "Fran Alcaraz",        position: "Ala",     number: "15", photo: "assets/img/players/senior-b/fran-alcaraz.jpg" },
        { name: "Ivan Cortés",         position: "Ala",     number: "7", photo: "assets/img/players/senior-b/ivan-cortes.jpg" },
        { name: "Angel Pedraza",       position: "Ala",     number: "8", photo: "assets/img/players/senior-b/angel-pedraza.jpg" },
        { name: "Jordi Medina \"Oso\"", position: "Pívot",  number: "79", photo: "assets/img/players/senior-b/jordi-medina.jpg" },
        { name: "Agustín Conejos",     position: "Pívot",   number: "44", photo: "assets/img/players/senior-b/agustin-conejos.jpg" },
        { name: "Sergi Alberich",      position: "Pívot",   number: "22", photo: "assets/img/players/senior-b/sergi-alberich.jpg" }
      ],
      pending: false
    },
    {
      name: "Senior C",
      tagline: "Nueva creación",
      category: "Tercera División Catalana",
      description: "Equipo de nueva creación, dispuesto a darlo todo en la pista desde el primer día. La familia Fénix sigue creciendo.",
      image: "assets/img/teams/senior-c.jpg",
      staff: [
        { role: "Entrenador", name: "Roger Camins" }
      ],
      plantilla: [
        { name: "Nombre Apellido", position: "Portero", number: "1",  photo: "" },
        { name: "Nombre Apellido", position: "Cierre",  number: "4",  photo: "" },
        { name: "Nombre Apellido", position: "Cierre",  number: "5",  photo: "" },
        { name: "Nombre Apellido", position: "Ala",     number: "7",  photo: "" },
        { name: "Nombre Apellido", position: "Ala",     number: "8",  photo: "" },
        { name: "Nombre Apellido", position: "Ala",     number: "10", photo: "" },
        { name: "Nombre Apellido", position: "Pívot",   number: "9",  photo: "" }
      ],
      pending: false
    },
    {
      name: "Senior D",
      tagline: "Experiencia en la pista",
      category: "Tercera División Catalana",
      description: "Jugadores con experiencia que se inician en la categoría para competir al máximo nivel. Proyecto en preparación para la temporada.",
      image: "assets/img/teams/senior-d.jpg",
      staff: [],
      plantilla: [],
      pending: true
    }
  ],

  /* Miembros del club: directiva, cuerpo técnico, colaboradores.
     'photo' es opcional: si no existe, se muestran las iniciales. */
  miembros: [
    { name: "Biel Altarriba",  role: "Presidente",        photo: "assets/img/members/biel-altarriba.jpg" },
    { name: "Cristian Riquelme", role: "Vicepresidente",  photo: "assets/img/members/cristian-riquelme.jpg" },
    { name: "Ciscu Venegas",   role: "Tesorero",          photo: "assets/img/members/ciscu-venegas.jpg" },
    { name: "Sergio Rodríguez", role: "Community Manager", photo: "assets/img/members/sergio-rodriguez.jpg" }
  ],

  /* Patrocinadores y colaboradores.
     - logo: archivo en assets/img/sponsors/
     - url: web del patrocinador ("" si no tiene)
     - tier: "patrocinador" (todos en el mismo bloque). Si algún día queréis un bloque
             secundario, pon "colaborador" y aparecerá bajo el título "Colaboradores".
     - bg: "" para mostrar el logo directamente sobre el fondo oscuro (lo normal),
           o un color (por ejemplo "#ffffff") si el logo necesita una tarjeta
           de ese color para leerse bien.
     Los logos con fondo transparente (PNG) son los que mejor quedan. */
  patrocinadores: [
    { name: "Ingeniería Geproelec",   logo: "assets/img/sponsors/geproelec.png",                url: "https://www.geproelec.es", tier: "patrocinador", bg: "" },
    { name: "Almo Instal·lacions",    logo: "assets/img/sponsors/almo-instalacions-blanco.png", url: "https://almoinstalacions.es/",                       tier: "patrocinador", bg: "" },
    { name: "Bryma's Pizza Bar",      logo: "assets/img/sponsors/brymas.png",                   url: "https://www.instagram.com/pizzabrymasbar_sbd/",                       tier: "patrocinador", bg: "" },
    { name: "Rochel Estilistes",      logo: "assets/img/sponsors/rochel-estilistes.png",        url: "https://rochelestilitas.es/",                       tier: "patrocinador", bg: "" },
    { name: "Joel García · Masaje deportivo", logo: "assets/img/sponsors/joel-garcia.png",      url: "",                         tier: "patrocinador", bg: "" },
    /* Colaboradores (bloque aparte, más discreto) */
    { name: "Fenigraf Serigrafía",    logo: "assets/img/sponsors/fenigraf.png",                 url: "https://www.fenigraf.com/",                       tier: "colaborador",  bg: "" },
    { name: "Ajuntament de Sabadell", logo: "assets/img/sponsors/ajuntament-sabadell.png",      url: "https://www.sabadell.cat/",                       tier: "colaborador",  bg: "" }
  ],

  /* =====================================================================
     DATOS OFICIALES DE LA FCF (clasificación + calendario + resultados)
     Un bloque por equipo. 'grupId' sale de la URL de la competición en fcf.cat
     (…&grupId=XXXXXXXX). 'url' es esa misma página, para el botón "Ver en la FCF".
     Los datos se descargan con herramientas/actualizar-fcf.ps1 a data/fcf/<grupId>.js.
     Si un equipo aún no tiene grupo, deja grupId: "" y no aparecerá su pestaña.
     ===================================================================== */
  fcfGrupos: [
    { equipo: "Senior A", competicion: "1ª Catalana · BCN Gr. 2", grupId: "58162566",
      url: "https://www.fcf.cat/ca/competicio?temporadaId=22&disciplinaId=19308236&competicioId=58162562&grupId=58162566" },
    { equipo: "Senior B", competicion: "3ª Catalana · BCN Gr. 5", grupId: "58162590",
      url: "https://www.fcf.cat/ca/competicio?temporadaId=22&disciplinaId=19308236&competicioId=58162583&grupId=58162590" },
    { equipo: "Senior C", competicion: "3ª Catalana · BCN Gr. 4", grupId: "58162589",
      url: "https://www.fcf.cat/ca/competicio?temporadaId=22&disciplinaId=19308236&competicioId=58162583&grupId=58162589" },
    { equipo: "Senior D", competicion: "3ª Catalana · BCN Gr. 6", grupId: "58162591",
      url: "https://www.fcf.cat/ca/competicio?temporadaId=22&disciplinaId=19308236&competicioId=58162583&grupId=58162591" }
  ],
  /* Cómo reconocer al Fénix en los datos de la FCF (se busca este texto en el nombre del equipo). */
  fcfNombreClub: "FENIX",

  /* =====================================================================
     ESTADÍSTICAS (goles y tarjetas por jugador, balance del equipo)
     Se calculan solas a partir de dos fuentes, sin tocar nada más:
       1) La FCF: goleadores y sanciones oficiales del grupo (los descarga la
          misma automatización de partidos). Cuando existen, mandan.
       2) 'eventos': resultados que anotéis vosotros (amistosos, copa, o
          mientras la FCF no publique). Se suman automáticamente.
     Fotos de jugadores: por nombre en 'jugadoresFotos' (o la 'photo' de la
     plantilla del equipo, si el nombre coincide). Ruta en assets/img/players/.
     ===================================================================== */
  jugadoresFotos: {},

  /* Un bloque por partido. goles / amarillas / rojas: { "Nombre jugador": cantidad }.
     'equipo' debe coincidir con el nombre del equipo en 'equipos' y 'fcfGrupos'. */
  eventos: [],

  /* =====================================================================
     NOTICIAS. La más reciente primero. Al hacer clic se abre un pop-up con
     la noticia completa sin salir de la web.
       · fecha: AAAA-MM-DD
       · titulo / subtitulo (opcional)
       · resumen: texto corto que se ve en la tarjeta
       · contenido: texto completo del pop-up. Separa párrafos con una línea
         en blanco (\n\n). Si no hay contenido, se usa el resumen.
       · imagen: opcional (assets/img/noticias/...)
       · url: opcional. Enlace externo (post de Instagram) o interno (#tienda).
         Aparece como botón dentro del pop-up. 'urlTexto' cambia el texto del botón.
     ===================================================================== */
  noticias: [
    {
      fecha: "2026-09-10",
      titulo: "Presentamos la equipación 26/27",
      subtitulo: "Nueva piel, misma esencia",
      resumen: "Negro y blanco con la franja roja y dorada que nos identifica. Ya disponible en la tienda del club.",
      contenido:
        "El Fénix FS estrena piel para la temporada 2026/27. La primera equipación vuelve al negro, con la franja roja y dorada " +
        "cruzando el pecho, y la segunda se viste de blanco manteniendo los mismos detalles.\n\n" +
        "El escudo de Fénix Futsal Sabadell va en el pecho y el #SIENTELFENIX en la manga, porque la esencia no cambia: " +
        "somos el mismo club, con la misma ambición.\n\n" +
        "Las camisetas ya se pueden reservar en la tienda del club.",
      imagen: "assets/img/equipacion-26-27.jpg",
      url: "#tienda",
      urlTexto: "Ir a la tienda"
    },
    {
      fecha: "2026-09-01",
      titulo: "Arranca la pretemporada",
      subtitulo: "",
      resumen: "Los cuatro equipos vuelven a los entrenamientos con la vista puesta en el inicio de liga.",
      contenido:
        "Vuelve el fútbol sala al Pavelló del Nord. Senior A, Senior B y Senior C ya han empezado la pretemporada, " +
        "y el Senior D está tomando forma.\n\n" +
        "Si quieres probar con nosotros, escríbenos a través del formulario de contacto y te diremos cuándo puedes venir a entrenar.",
      imagen: "",
      url: "#contacto",
      urlTexto: "Quiero probar"
    },
    {
      fecha: "2026-08-20",
      titulo: "Nuevos patrocinadores para la temporada",
      subtitulo: "",
      resumen: "Damos la bienvenida a las empresas que apoyan al Fénix este año. Gracias por creer en el proyecto.",
      contenido:
        "Esta temporada contamos con el apoyo de Ingeniería Geproelec, Almo Instal·lacions, Bryma's Pizza Bar, Rochel Estilistes, " +
        "Fenigraf Serigrafía y Joel García Masaje Deportivo como patrocinadores del club.\n\n" +
        "Gracias a ellos podemos competir, equiparnos y seguir creciendo. Si quieres que tu marca acompañe al Fénix, hay sitio para ti.",
      imagen: "",
      url: "#patrocinadores",
      urlTexto: "Ver patrocinadores"
    }
  ],

  /* =====================================================================
     TIENDA. 'url' es el enlace de compra (tienda online, formulario, WhatsApp...).
     Si está vacío, el botón lleva al formulario de contacto con el producto ya escrito.
     ===================================================================== */
  /* Estado de la tienda:
       "proximamente" → los productos se ven desenfocados, sin precio, con etiqueta
                        "Próximamente" y botón "Avísame".
       "abierta"      → tienda normal con precios y botón de compra. */
  tiendaEstado: "proximamente",
  tiendaProximamente: {
    kicker: "Tienda · Muy pronto",
    titulo: "Algo se está cocinando",
    intro: "Estamos preparando la tienda oficial del Fénix. Equipación, ropa de calle y algún detalle más. Te dejamos entrever lo que viene.",
    nota: "¿Quieres ser el primero en saberlo? Pulsa \"Avísame\" y te escribiremos cuando esté disponible."
  },
  tienda: [
    { nombre: "Camiseta 1ª equipación · Local",     precio: "Por anunciar", imagen: "assets/img/tienda/camiseta-primera.jpg", url: "" },
    { nombre: "Camiseta 2ª equipación · Visitante", precio: "Por anunciar", imagen: "assets/img/tienda/camiseta-segunda.jpg", url: "" },
    { nombre: "Camiseta de soporte del club",       precio: "Por anunciar", imagen: "assets/img/tienda/camiseta-soporte.jpg", url: "" },
    { nombre: "Bufanda Siente el Fénix",            precio: "Por anunciar", imagen: "assets/img/tienda/bufanda.jpg",          url: "" }
  ],
  tiendaNota: "Pedidos a través del formulario de contacto o por Instagram. Recogida en el pabellón los días de partido.",

  /* =====================================================================
     INSTAGRAM. Pega aquí los enlaces de los posts que quieras mostrar
     (abre el post en Instagram y copia la URL, tipo https://www.instagram.com/p/XXXXXXXX/).
     Se muestran con el incrustado oficial de Instagram. Si la lista está vacía,
     se muestra un bloque de enlace al perfil.
     ===================================================================== */
  /* Previsualización del perfil (cabecera + últimas 6 publicaciones), sin necesidad
     de pegar posts. Si además hay posts en 'instagramPosts', se muestran debajo. */
  instagramPerfil: "fenix_fs",
  /* Cifras de la cabecera del widget (las fotos se actualizan solas; estas cifras
     hay que revisarlas de vez en cuando). Deja "" para ocultar una. */
  instagramStats: { publicaciones: "1.342", seguidores: "1.223", siguiendo: "1.076" },
  instagramNombre: "Fénix FS",
  /* Publicaciones que se muestran en la cuadrícula, ENTERAS (formato 4:5), la más
     reciente primero. Para añadir una: en Instagram, abre el post → "..." → "Copiar
     enlace" y pégalo aquí arriba del todo. Se muestran las 6 primeras de la lista.
     Si la lista está vacía, se usa la cuadrícula automática de Instagram (recorta a cuadrado). */
  instagramPosts: [
    "https://www.instagram.com/p/DdR42JygbqS/",
    "https://www.instagram.com/p/DdR3Eb5MNeE/",
    "https://www.instagram.com/p/DdJsaySIPBP/",
    "https://www.instagram.com/p/Dc_3xizIMDz/",
    "https://www.instagram.com/p/Dc4D8lNotIZ/",
    "https://www.instagram.com/p/Dc1dRfvAlPT/"
  ],
  /* Cuántas publicaciones enseñar en la cuadrícula (3 por fila). */
  instagramMax: 6
};
