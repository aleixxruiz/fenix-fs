# Web Fénix FS

Web estática del club de fútbol sala Fénix FS (Sabadell). No necesita base de datos ni servidor especial: cualquier hosting que sirva archivos HTML funciona.

## Estructura

```
FFS/
├── index.html          Página principal (todas las secciones)
├── css/style.css       Estilos
├── js/data.js          ← CONTENIDO EDITABLE (historia, equipos, miembros, patrocinadores)
├── js/main.js          Lógica (pinta los datos, menú, formulario)
├── assets/img/
│   ├── bg-dark.jpg            Fondo oscuro (hero y tarjetas de equipos)
│   ├── bg-light.jpg           Fondo claro (sección de contacto)
│   ├── logo.png               Escudo del club (cabecera, hero y pie)
│   ├── favicon.png            Icono de pestaña
│   ├── equipacion-26-27.jpg   Cartel de la equipación 26/27
│   ├── teams/                 Fotos de equipos (senior-a.jpg, senior-b.jpg)
│   ├── members/               Fotos de miembros
│   └── sponsors/              Logos de patrocinadores y colaboradores
├── assets/originales/         Archivos originales tal cual se subieron (no los usa la web)
└── README.md

Las imágenes de `assets/img/` están optimizadas para web (JPG comprimido, PNG reducido). Si cambias un original, vuelve a exportarlo ligero antes de sustituirlo.
```

## Cómo actualizar el contenido

Todo el contenido variable está en `js/data.js`. Abre el archivo con cualquier editor de texto y cambia los valores. Cada sección tiene comentarios explicando qué hace.

- **Cifras del hero**: bloque `stats`.
- **Historia**: `historiaIntro` y la lista `historia` (año, título, texto).
- **Equipos**: lista `equipos`. Para añadir uno, copia un bloque `{ ... }` y cámbialo. Una foto va en `image`; varias fotos van en `images` como lista y la tarjeta muestra una galería con flechas y deslizamiento en móvil. Fotos en `assets/img/teams/` (ideal 1400 px de ancho, JPG). `pending: true` marca un equipo aún no confirmado.
- **Plantillas (pop-up)**: al hacer clic en un equipo se abre una ventana con sus jugadores por posición. Se rellenan en la lista `plantilla` de cada equipo con `name`, `position` (Portero, Cierre, Ala o Pívot), `number` (dorsal) y `photo`. Las fotos de jugadores van en `assets/img/players/senior-a/`, `senior-b/`, etc. (cuadradas, por ejemplo 400x400). Si `photo` está vacía o el archivo no existe, salen las iniciales.
- **Miembros**: lista `miembros`. Si no hay foto, se muestran las iniciales.
- **Patrocinadores**: lista `patrocinadores`. Todos llevan `tier: "patrocinador"` y salen en un solo bloque; si algún día hace falta un bloque secundario, `tier: "colaborador"` lo muestra bajo el título "Colaboradores". Los logos se muestran directamente sobre el fondo oscuro, sin tarjeta, así que lo ideal es un PNG con fondo transparente (y versión blanca si el logo es oscuro, como Almo). Si un logo no se lee sobre oscuro, pon `bg: "#ffffff"` y saldrá sobre una tarjeta blanca. Los PNG de `assets/img/sponsors/` ya están recortados y sin fondo; el de Geproelec lleva el texto pasado a blanco para leerse sobre oscuro.
- **Equipación 26/27**: el texto está directamente en `index.html` (sección `#equipacion`) y la imagen en `assets/img/equipacion-26-27.jpg`.
- **Partidos y clasificación (FCF)**: la sección muestra datos oficiales de la Federació Catalana de Futbol. En `fcfGrupos` va un bloque por equipo con su `grupId` (sale de la URL de la competición en fcf.cat, `…&grupId=XXXXXXXX`) y la `url` de esa página. Los datos se descargan ejecutando `herramientas/actualizar-fcf.ps1` (clic derecho → Ejecutar con PowerShell), que genera `data/fcf/<grupId>.js`; después hay que subir la carpeta `data/` al servidor. Conviene ejecutarlo cada semana después de la jornada (o programarlo en el Programador de tareas de Windows). No se puede consultar la FCF en directo desde la web porque su API lleva una protección antibots que solo acepta navegadores reales. Si un equipo no tiene `grupId`, no aparece su pestaña.
  Mientras no haya datos de ningún equipo, la sección muestra un aviso. Un partido sin `resultado` sale en "Próximos"; con `resultado` (por ejemplo `"4-2"`) sale en "Últimos resultados" y se colorea verde, dorado o gris según victoria, empate o derrota del Fénix. `partidosEnlaces` son los botones de clasificación.
- **Noticias**: lista `noticias`, la más reciente primero. Al hacer clic se abre un pop-up con la noticia completa. `resumen` es el texto corto de la tarjeta y `contenido` el texto completo del pop-up (párrafos separados con `\n\n`). `imagen` opcional en `assets/img/noticias/`. `url` opcional: enlace externo (post de Instagram) o interno (`#tienda`), aparece como botón; `urlTexto` cambia el texto del botón.
- **Tienda**: `tiendaEstado` controla el modo. Con `"proximamente"` los productos se ven desenfocados, sin precio, con etiqueta "Próximamente" y botón "Avísame" que rellena el formulario de contacto (textos en `tiendaProximamente`). Con `"abierta"` es la tienda normal: lista `tienda` con precios; si un producto tiene `url` el botón dice "Comprar" y abre ese enlace, si no dice "Lo quiero" y rellena el formulario. Las fotos van en `assets/img/tienda/` (formato 4:5, por ejemplo 600x750). Las camisetas actuales están recortadas de los carteles de packs, que se guardan en `assets/originales/`; la bufanda es un montaje propio.
- **Instagram**: `instagramPerfil` (por defecto `fenix_fs`) muestra un widget con cabecera propia (escudo, nombre, cifras de `instagramStats` y botón Seguir) y debajo la cuadrícula de las últimas 6 publicaciones, siempre al día sin tocar nada. Las cifras de la cabecera son manuales: revísalas de vez en cuando. Si algún día la cuadrícula sale desplazada (Instagram cambia la altura de su cabecera), ajusta `instagramEmbedOffset` (por defecto 156). La cuadrícula se alimenta de `instagramPosts`: una lista de enlaces de publicaciones (en Instagram: abrir el post → "..." → "Copiar enlace"), la más reciente primero. Cada post se incrusta entero en formato 4:5 y se muestran las 6 primeras (`instagramMax`). Si la lista está vacía se usa la cuadrícula automática del perfil, que recorta las fotos a cuadrado. Ambos dependen de Instagram: si algún día cambian su servicio, dejar `instagramPerfil` vacío hace que aparezca una tarjeta de enlace al perfil.

## Estructura de la página

Inicio (hero) → Club (historia, equipación, personas, patrocinadores) → Equipos → Partidos → Noticias → Tienda → Instagram → Contacto.

Si una imagen no existe, la web la oculta y muestra un fondo o las iniciales, así que no se rompe nada.

## Cómo verla en local

Basta con abrir `index.html` con doble clic en el navegador. Para probar con un servidor local (opcional):

```
python -m http.server 8000
```

y entrar en `http://localhost:8000`.

## Formulario de contacto

Ahora mismo el formulario abre el programa de correo del visitante con el mensaje preparado hacia `fenixfutsala@gmail.com`. Para que envíe directamente desde la web sin abrir el correo:

1. Crea una cuenta gratuita en https://formspree.io y un formulario nuevo.
2. Copia el ID que te da (algo como `xpzgabcd`).
3. En `index.html`, sustituye `TU_ID_FORMSPREE` por ese ID en el atributo `action` del formulario.

Sin hacer nada más, el formulario pasará a enviar por Formspree.

## GitHub y web pública

- Repositorio: https://github.com/aleixxruiz/fenix-fs
- Web publicada con GitHub Pages: https://aleixxruiz.github.io/fenix-fs/

Cada vez que se suben cambios a la rama `main`, GitHub Pages actualiza la web pública en uno o dos minutos. Flujo habitual desde esta carpeta:

```
git add -A
git commit -m "Descripción del cambio"
git push
```

## Cómo publicarla en el servidor

Sube el contenido completo de la carpeta (index.html, css, js, assets) a la carpeta pública del hosting (normalmente `public_html` o `www`). La web debe quedar accesible en la raíz del dominio.

## Pendientes / mejoras futuras

- Fotos reales de equipos y miembros (nombres y cargos en `js/data.js`).
- Webs de los patrocinadores que no tienen `url` todavía.
- Revisar y completar la historia (los hitos actuales son orientativos).
- Configurar Formspree para el formulario.
- Sección de noticias o resultados, galería, versión en catalán.
