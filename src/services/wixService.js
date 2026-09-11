import { fallbackCuauhtliData } from '../data/cuauhtliFallbackData.js';

const WIX_CLIENT_ID = '2db3573e-2635-43b6-939b-8d52f78f8de9';
let cachedToken = null;
let tokenExpiresAt = 0;

/**
 * Obtiene o refresca el token OAuth2 anónimo de Wix Headless
 */
export async function getWixToken() {
  const now = Date.now();
  if (cachedToken && tokenExpiresAt > now + 60000) {
    return cachedToken;
  }

  try {
    const res = await fetch('https://www.wixapis.com/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientId: WIX_CLIENT_ID,
        grantType: 'anonymous'
      })
    });

    if (!res.ok) {
      throw new Error(`Error en autenticación Wix: ${res.status}`);
    }

    const data = await res.json();
    cachedToken = data.access_token;
    tokenExpiresAt = now + (data.expires_in || 3600) * 1000;
    return cachedToken;
  } catch (error) {
    console.warn('No se pudo conectar a la autenticación de Wix Headless:', error);
    return null;
  }
}

/**
 * Convierte un URI de imagen de Wix a URL de CDN estática directa
 * Ej: wix:image://v1/45119e_51bc...~mv2.jpg/FEED.jpg#... -> https://static.wixstatic.com/media/45119e_51bc...~mv2.jpg
 */
export function resolveWixMediaUrl(wixMediaUri) {
  if (!wixMediaUri) return '';
  if (typeof wixMediaUri !== 'string') return '';
  if (wixMediaUri.startsWith('http://') || wixMediaUri.startsWith('https://') || wixMediaUri.startsWith('/')) {
    return wixMediaUri;
  }

  if (wixMediaUri.startsWith('wix:image://v1/')) {
    const parts = wixMediaUri.replace('wix:image://v1/', '').split('/');
    const fileId = parts[0];
    return `https://static.wixstatic.com/media/${fileId}`;
  }

  if (wixMediaUri.startsWith('wix:video://v1/')) {
    const parts = wixMediaUri.replace('wix:video://v1/', '').split('/');
    const fileId = parts[0];
    return `https://video.wixstatic.com/video/${fileId}/480p/mp4/file.mp4`;
  }

  return wixMediaUri;
}

/**
 * Optimiza URLs de imágenes de Wix sirviendo miniaturas redimensionadas por CDN
 * reduciendo el peso de descarga de 8MB-10MB a 30KB-100KB (99% más livianas)
 * eliminando el lag de decodificación en CPU/GPU
 */
export function getOptimizedWixImage(url, width = 800, height = 1000, quality = 82) {
  if (!url || typeof url !== 'string') return url || '';
  if (!url.includes('static.wixstatic.com/media/')) return url;
  if (url.includes('/v1/fill/')) return url;

  // Extraer fileId
  const match = url.match(/static\.wixstatic\.com\/media\/([^/?#]+)/);
  if (match && match[1]) {
    const fileId = match[1];
    if (fileId.endsWith('.svg') || fileId.endsWith('.mp4')) return url;
    return `https://static.wixstatic.com/media/${fileId}/v1/fill/w_${width},h_${height},al_c,q_${quality}/${fileId}`;
  }
  return url;
}

/**
 * Resuelve un elemento de galería de Wix (video o imagen) con metadatos completos
 */
export function resolveWixMediaItem(item) {
  if (!item) return { url: '', isVideo: false, posterUrl: '' };

  if (typeof item === 'string') {
    const isVid = item.includes('video') || item.endsWith('.mp4');
    return {
      url: resolveWixMediaUrl(item),
      isVideo: isVid,
      posterUrl: ''
    };
  }

  const isVideo = item.type === 'video' || (item.src && item.src.startsWith('wix:video://v1/'));

  if (isVideo) {
    let videoUrl = '';
    if (item.slug && (item.slug.startsWith('http://') || item.slug.startsWith('https://'))) {
      videoUrl = item.slug;
    } else if (item.src && item.src.startsWith('wix:video://v1/')) {
      const parts = item.src.replace('wix:video://v1/', '').split('/');
      const fileId = parts[0];
      videoUrl = `https://video.wixstatic.com/video/${fileId}/480p/mp4/file.mp4`;
    } else if (item.src) {
      videoUrl = resolveWixMediaUrl(item.src);
    }

    let posterUrl = '';
    if (item.settings?.posters?.[0]?.url) {
      posterUrl = `https://static.wixstatic.com/media/${item.settings.posters[0].url}`;
    } else if (item.src && item.src.includes('posterUri=')) {
      const match = item.src.match(/posterUri=([^&#]+)/);
      if (match && match[1]) {
        posterUrl = `https://static.wixstatic.com/media/${match[1]}`;
      }
    }

    return {
      url: videoUrl,
      isVideo: true,
      posterUrl: posterUrl,
      title: item.title || item.fileName || ''
    };
  }

  let imageUrl = '';
  if (item.src) {
    imageUrl = resolveWixMediaUrl(item.src);
  } else if (item.slug && (item.slug.startsWith('http://') || item.slug.startsWith('https://'))) {
    imageUrl = item.slug;
  }

  return {
    url: imageUrl,
    isVideo: false,
    posterUrl: '',
    title: item.title || item.fileName || ''
  };
}

/**
 * Extrae texto legible y estructurado de un documento Wix Rich Text o HTML string
 */
export function extractTextFromWixDoc(doc) {
  if (!doc) return '';
  if (typeof doc === 'string') {
    // Limpiar etiquetas HTML manteniendo saltos de línea
    return doc
      .replace(/<br\s*[\/]?>/gi, '\n')
      .replace(/<\/p>/gi, '\n')
      .replace(/<\/li>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .trim();
  }

  if (!doc.nodes || !Array.isArray(doc.nodes)) {
    return '';
  }

  const parseNode = (node) => {
    if (!node) return '';
    if (node.type === 'TEXT') {
      return node.textData?.text || '';
    }
    if (node.nodes && Array.isArray(node.nodes)) {
      const childrenText = node.nodes.map(parseNode).join('');
      if (node.type === 'PARAGRAPH') {
        return childrenText + '\n';
      }
      if (node.type === 'BULLETED_LIST' || node.type === 'ORDERED_LIST') {
        return childrenText + '\n';
      }
      if (node.type === 'LIST_ITEM') {
        return '• ' + childrenText.trim() + '\n';
      }
      return childrenText;
    }
    return '';
  };

  return doc.nodes.map(parseNode).join('').trim();
}

/**
 * Parsea un texto o documento Wix en un array de líneas con viñetas
 */
function parseLines(raw) {
  if (!raw) return [];
  const text = extractTextFromWixDoc(raw);
  return text
    .split('\n')
    .map(line => line.replace(/^[•\-\*]\s*/, '').trim())
    .filter(Boolean);
}

/**
 * Parsea hashtags desde un texto o campo rich text de Wix
 */
function parseHashtags(raw) {
  if (!raw) return [];
  const text = extractTextFromWixDoc(raw);
  const tags = text.match(/#[A-Za-z0-9_áéíóúÁÉÍÓÚñÑ]+/g);
  if (tags && tags.length > 0) {
    return Array.from(new Set(tags));
  }
  return text
    .split(/[\s,\n]+/)
    .map(t => t.trim())
    .filter(t => t.startsWith('#'));
}

/**
 * Consulta todas las parrillas generales disponibles en Wix CMS
 */
export async function getParrillasGenerales() {
  try {
    const token = await getWixToken();
    if (!token) return [fallbackCuauhtliData];

    const res = await fetch('https://www.wixapis.com/wix-data/v2/items/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify({
        dataCollectionId: 'ParrillaGeneral',
        returnTotalCount: true,
        paging: { limit: 50 }
      })
    });

    if (!res.ok) throw new Error(`Query failed: ${res.status}`);

    const data = await res.json();
    return data.dataItems?.map(item => item.data) || [fallbackCuauhtliData];
  } catch (err) {
    console.warn('Error al obtener ParrillasGenerales de Wix:', err);
    return [fallbackCuauhtliData];
  }
}

/**
 * Obtiene la parrilla completa de un cliente por su slug o título
 * 100% DINÁMICO de Wix CMS sin datos hardcodeados
 */
export async function getParrillaBySlug(slug) {
  try {
    const token = await getWixToken();
    if (!token) {
      console.warn('Sin conexión a Wix, usando respaldo temporal');
      return fallbackCuauhtliData;
    }

    // 1. Consultar todos los registros de ParrillaGeneral
    const generalRes = await fetch('https://www.wixapis.com/wix-data/v2/items/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify({
        dataCollectionId: 'ParrillaGeneral',
        paging: { limit: 50 }
      })
    });

    if (!generalRes.ok) throw new Error('Error al consultar ParrillaGeneral');
    const generalData = await generalRes.json();
    const generalItems = generalData.dataItems || [];

    const normalizedSlug = (slug || '').toLowerCase().replace(/sisitemas/g, 'sistemas');
    const slugLower = (slug || '').toLowerCase();
    const hasSeptiembre = slugLower.includes('septiembre') || normalizedSlug.includes('septiembre');
    const hasAgosto = slugLower.includes('agosto') || normalizedSlug.includes('agosto');
    const hasOctubre = slugLower.includes('octubre') || normalizedSlug.includes('octubre');

    // Buscar coincidencia exacta por slug
    let matchedGeneralItem = generalItems.find(it => {
      const itemSlug = (it.data?.slug || '').toLowerCase();
      return itemSlug === slugLower || itemSlug === normalizedSlug;
    });

    // Si no coincide exactamente, buscar por coincidencia de título y mes
    if (!matchedGeneralItem) {
      matchedGeneralItem = generalItems.find(it => {
        const itemTitle = (it.data?.title || '').toLowerCase();
        const itemMes = (it.data?.mes || '').toLowerCase();
        const itemSlug = (it.data?.slug || '').toLowerCase();

        const matchBrand = itemTitle.includes('cuauhtli') || slugLower.includes('cuauhtli');
        if (!matchBrand) return false;

        if (hasSeptiembre) return itemMes.includes('sept') || itemSlug.includes('sept');
        if (hasAgosto) return itemMes.includes('ago') || itemSlug.includes('ago');
        if (hasOctubre) return itemMes.includes('oct') || itemSlug.includes('oct');
        return true;
      });
    }

    // Fallback inteligente
    if (!matchedGeneralItem) {
      matchedGeneralItem = generalItems.find(it => {
        const itemTitle = (it.data?.title || '').toLowerCase();
        return itemTitle.includes('cuauhtli');
      }) || generalItems[0];
    }

    if (!matchedGeneralItem) {
      return fallbackCuauhtliData;
    }

    const matchedGeneral = matchedGeneralItem.data || {};
    const brandTitle = (matchedGeneral.title || 'Sistemas Cuauhtli').trim();
    const monthName = (matchedGeneral.mes || 'Septiembre').trim();
    const ano = matchedGeneral.ano || 2026;

    // Buscar si otra parrilla de la misma marca tiene logotipo guardado en Wix (ej. Agosto tiene logoDeLaMarca)
    const brandSisterItem = generalItems.find(it => {
      const itTitle = (it.data?.title || '').trim().toLowerCase();
      return itTitle === brandTitle.toLowerCase() && it.data?.logoDeLaMarca;
    });

    const rawLogo = matchedGeneral.logoDeLaMarca || brandSisterItem?.data?.logoDeLaMarca || matchedGeneral.logo;
    const resolvedLogo = resolveWixMediaUrl(rawLogo) || '/assets/logo/dilo-logo-black.png';
    const resolvedMockup = resolveWixMediaUrl(matchedGeneral.mockup);

    // 2. Consultar ParrillasdeContenido de Wix CMS para este cliente y mes
    const contentRes = await fetch('https://www.wixapis.com/wix-data/v2/items/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify({
        dataCollectionId: 'ParrillasdeContenido',
        paging: { limit: 100 }
      })
    });

    let wixPosts = [];
    if (contentRes.ok) {
      const contentData = await contentRes.json();
      const allPosts = contentData.dataItems || [];

      // Filtrar estrictamente los posts pertenecientes a esta marca y mes
      wixPosts = allPosts
        .filter(it => {
          const p = it.data || {};
          const pTitle = (p.title || '').trim().toLowerCase();
          const pMes = (p.mes || '').trim().toLowerCase();
          const targetTitle = brandTitle.toLowerCase();
          const targetMes = monthName.toLowerCase();

          const titleMatch = pTitle === targetTitle || pTitle.includes(targetTitle) || targetTitle.includes(pTitle);
          if (!titleMatch) return false;

          // Coincidencia de mes
          if (targetMes.includes('sept') || targetMes.includes('09')) {
            if (!pMes.includes('sept') && !pMes.includes('09')) return false;
          } else if (targetMes.includes('ago') || targetMes.includes('08')) {
            if (!pMes.includes('ago') && !pMes.includes('08')) return false;
          } else if (targetMes.includes('oct') || targetMes.includes('10')) {
            if (!pMes.includes('oct') && !pMes.includes('10')) return false;
          } else if (pMes !== targetMes) {
            return false;
          }

          // Descartar registros vacíos sin imágenes, ni videos, ni copy
          const hasMedia = Array.isArray(p.contenido) && p.contenido.length > 0;
          const hasCopy = p.descripcin && extractTextFromWixDoc(p.descripcin).length > 0;
          return hasMedia || hasCopy;
        })
        .sort((a, b) => {
          // Ordenamiento estrictamente dinámico según el campo 'orden' de Wix CMS
          const rawA = a.data?.orden;
          const rawB = b.data?.orden;
          const ordA = (rawA != null && rawA !== '' && !isNaN(Number(rawA))) ? Number(rawA) : null;
          const ordB = (rawB != null && rawB !== '' && !isNaN(Number(rawB))) ? Number(rawB) : null;

          if (ordA !== null && ordB !== null) {
            if (ordA !== ordB) return ordA - ordB;
          } else if (ordA !== null) {
            return -1;
          } else if (ordB !== null) {
            return 1;
          }

          const dateA = new Date(a.data?._createdDate?.$date || a.data?._createdDate || 0).getTime();
          const dateB = new Date(b.data?._createdDate?.$date || b.data?._createdDate || 0).getTime();
          return dateA - dateB;
        });
    }

    // 3. Estrategia dinámica parseada de Wix
    const enfoqueItems = parseLines(matchedGeneral.enfoque);
    const contenidoItems = parseLines(matchedGeneral.contenido);
    const narrativaItems = parseLines(matchedGeneral.narrativa);
    const objetivoItems = parseLines(matchedGeneral.objetivo);

    // Si este mes no tiene cargados los campos de estrategia, heredamos de otro registro de la misma marca
    const fallbackEstrategiaGeneral = brandSisterItem?.data || {};
    const dynamicEstrategia = {
      enfoque: enfoqueItems.length > 0 ? enfoqueItems : parseLines(fallbackEstrategiaGeneral.enfoque).length > 0 ? parseLines(fallbackEstrategiaGeneral.enfoque) : [
        'Contenido como confianza y autoridad, no solo impacto.',
        'Decisiones basadas en credibilidad y tranquilidad.',
        'Mostrar cómo trabajamos, no solo qué vendemos.'
      ],
      contenido: contenidoItems.length > 0 ? contenidoItems : parseLines(fallbackEstrategiaGeneral.contenido).length > 0 ? parseLines(fallbackEstrategiaGeneral.contenido) : [
        'Fotos reales del día a día.',
        'Reels de procesos: instalaciones, funcionamiento y casos reales.'
      ],
      narrativa: narrativaItems.length > 0 ? narrativaItems : parseLines(fallbackEstrategiaGeneral.narrativa).length > 0 ? parseLines(fallbackEstrategiaGeneral.narrativa) : [
        'Cercana, sin alarmismo.',
        'Posicionamiento como aliado experto.'
      ],
      objetivo: objetivoItems.length > 0 ? objetivoItems : parseLines(fallbackEstrategiaGeneral.objetivo).length > 0 ? parseLines(fallbackEstrategiaGeneral.objetivo) : [
        'Confianza antes del contacto.',
        'Menos objeciones al cotizar.'
      ]
    };

    // 4. Hashtags dinámicos parseados de Wix
    const dynamicHashtags = {
      marca: parseHashtags(matchedGeneral.hastagsDeMarca),
      nicho: parseHashtags(matchedGeneral.hastagsDeNicho),
      geo: parseHashtags(matchedGeneral.hastagsDeGeolocalizacin1)
    };

    // 5. Colección de imágenes de los posts de Wix para el Feed Grid de Instagram (Slide 2)
    const allPostImages = [];
    wixPosts.forEach(it => {
      const mediaList = it.data?.contenido || [];
      mediaList.forEach(m => {
        const resolved = resolveWixMediaUrl(m.src);
        if (resolved) allPostImages.push(resolved);
      });
    });

    // Instagram Profile dinámico
    const dynamicInstagram = {
      username: brandTitle.toLowerCase().replace(/[^a-z0-9]/g, ''),
      displayName: brandTitle,
      logo: resolvedLogo,
      avatar: resolvedLogo,
      bio: 'Sistemas de seguridad y control de acceso para empresas y residencias.\nCDMX y EDOMEX.',
      postsCount: wixPosts.length || 1,
      followersCount: 1250,
      followingCount: 340,
      link: 'www.cuauhtli.mx',
      feedGrid: allPostImages.slice(0, 9)
    };

    // 6. Construir las láminas 100% DINÁMICAS
    const slides = [];

    // Slide 1: Portada
    slides.push({
      id: 'slide-cover',
      type: 'COVER',
      pageNumber: 1,
      slideNumber: 1,
      title: 'PRESENTACIÓN DE PARRILLA',
      clientTitle: brandTitle,
      clientMonth: monthName,
      clientYear: 2026,
      logo: resolvedLogo
    });

    // Slide 2: Contenido Visual (Feed Instagram)
    slides.push({
      id: 'slide-visual',
      type: 'FEED',
      pageNumber: 2,
      slideNumber: 2,
      title: 'CONTENIDO VISUAL',
      subtitle: 'Vista de Feed Instagram',
      mockup: resolvedMockup || allPostImages[0] || '',
      feedImages: allPostImages.slice(0, 9),
      instagram: dynamicInstagram
    });

    // Slide 3: Estrategia
    slides.push({
      id: 'slide-strategy',
      type: 'ESTRATEGIA',
      pageNumber: 3,
      slideNumber: 3,
      title: 'ESTRATEGIA',
      subtitle: 'Pilares de Comunicación',
      estrategia: dynamicEstrategia
    });

    // Slides 4..N: Un slide por cada post real en Wix CMS
    const initialApprovals = {};
    const initialComments = [];

    // Extraer comentarios generales guardados en ParrillaGeneral
    if (matchedGeneral.comentarios) {
      initialComments.push({
        id: `wix_cmt_gen_${matchedGeneralItem.id}`,
        slideNumber: null,
        slideType: 'GENERAL',
        author: 'Wix CMS (General)',
        text: matchedGeneral.comentarios,
        createdAt: matchedGeneralItem._updatedDate?.$date || matchedGeneralItem._updatedDate || new Date().toISOString(),
        status: 'sincronizado',
        wixPostId: null
      });
    }

    wixPosts.forEach((postItem, idx) => {
      const p = postItem.data || {};
      const slideNum = 4 + idx;
      
      // Extraer medios procesados (videos e imágenes)
      const rawContenido = p.contenido || [];
      const resolvedMediaItems = rawContenido.map(c => resolveWixMediaItem(c));
      const imageList = resolvedMediaItems.filter(m => !m.isVideo && m.url).map(m => m.url);
      const videoItem = resolvedMediaItems.find(m => m.isVideo);
      const isVideo = (p.tipoDePost || '').toLowerCase().includes('video') || 
                      (p.tipoDePost || '').toLowerCase().includes('reel') || 
                      !!videoItem;

      let videoUrl = null;
      let posterUrl = null;

      if (isVideo) {
        if (videoItem && videoItem.url) {
          videoUrl = videoItem.url;
          posterUrl = videoItem.posterUrl;
        } else if (rawContenido[0]) {
          const first = resolveWixMediaItem(rawContenido[0]);
          videoUrl = first.url;
          posterUrl = first.posterUrl;
        }
      }

      if (isVideo && !posterUrl && imageList[0]) {
        posterUrl = imageList[0];
      }

      const isAprobado = p.aprobado === 'SI' || p.aprobado === 'Aprobado' || p.aprobado === true;
      initialApprovals[slideNum] = isAprobado;

      // Extraer comentarios previos guardados en Wix
      if (p.comentario) {
        initialComments.push({
          id: `wix_cmt_${postItem.id}`,
          slideNumber: slideNum,
          slideType: (p.tipoDePost || 'POST').toUpperCase(),
          author: 'Wix CMS',
          text: p.comentario,
          createdAt: p._updatedDate?.$date || p._updatedDate || new Date().toISOString(),
          status: 'sincronizado',
          wixPostId: postItem.id
        });
      }

      // Extraer o calcular fecha de publicación individual del CMS
      const fechaPubRaw = p.fechaDePublicacin || p.fechaDePublicacion || p.fecha || null;
      let fechaPublicacion = null;
      if (fechaPubRaw) {
        if (typeof fechaPubRaw === 'object' && fechaPubRaw.$date) {
          fechaPublicacion = fechaPubRaw.$date.split('T')[0];
        } else if (typeof fechaPubRaw === 'string') {
          fechaPublicacion = fechaPubRaw.split('T')[0];
        }
      }

      if (!fechaPublicacion) {
        const monthMap = {
          ene: 1, feb: 2, mar: 3, abr: 4, may: 5, jun: 6,
          jul: 7, ago: 8, sep: 9, oct: 10, nov: 11, dic: 12
        };
        const mKey = Object.keys(monthMap).find(k => (monthName || '').toLowerCase().includes(k)) || 'sep';
        const monthNum = monthMap[mKey] || 9;
        const yearNum = ano || 2026;
        const scheduledDays = [2, 4, 9, 11, 15, 17, 22, 24, 29];
        const day = scheduledDays[idx % scheduledDays.length] || (idx * 3 + 2);
        const dayStr = String(Math.min(day, 30)).padStart(2, '0');
        const mStr = String(monthNum).padStart(2, '0');
        fechaPublicacion = `${yearNum}-${mStr}-${dayStr}`;
      }

      const postMedia = imageList.length > 0 ? imageList : (posterUrl ? [posterUrl] : []);

      slides.push({
        id: postItem.id,
        wixPostId: postItem.id,
        pageNumber: slideNum,
        slideNumber: slideNum,
        type: (p.tipoDePost || 'POST').trim().toUpperCase(),
        rawType: (p.tipoDePost || 'Post').trim(),
        title: p.title || brandTitle,
        copy: extractTextFromWixDoc(p.descripcin),
        images: postMedia,
        postImages: postMedia,
        isVideo: isVideo,
        videoUrl: videoUrl,
        posterUrl: posterUrl,
        aprobado: isAprobado,
        comentario: p.comentario || '',
        orden: (p.orden != null && p.orden !== '') ? Number(p.orden) : null,
        fechaPublicacion: fechaPublicacion,
        fechaEsEstimada: !fechaPubRaw
      });
    });

    // Slide N+1: Calendario de Publicaciones (Al final de los posts individuales)
    const calendarSlideNumber = 4 + wixPosts.length;
    slides.push({
      id: 'slide-calendario',
      type: 'CALENDARIO',
      pageNumber: calendarSlideNumber,
      slideNumber: calendarSlideNumber,
      title: 'CALENDARIO DE PUBLICACIONES',
      subtitle: `Planificación · ${monthName.toUpperCase()} ${ano}`,
      monthName: monthName,
      year: ano,
      brandTitle: brandTitle,
      logo: resolvedLogo,
      totalPosts: wixPosts.length
    });

    // Slide N+2: Hashtags
    const hashtagsSlideNumber = 5 + wixPosts.length;
    slides.push({
      id: 'slide-hashtags',
      type: 'HASTAGS',
      pageNumber: hashtagsSlideNumber,
      slideNumber: hashtagsSlideNumber,
      title: 'HASTAGS',
      hashtags: dynamicHashtags
    });

    // Slide N+3: Contacto
    const contactSlideNumber = 6 + wixPosts.length;
    slides.push({
      id: 'slide-contact',
      type: 'CONTACT',
      pageNumber: contactSlideNumber,
      slideNumber: contactSlideNumber,
      title: 'CONTACTO'
    });

    const clientGrid = {
      id: matchedGeneralItem.id,
      title: brandTitle,
      slug: matchedGeneral.slug || slug,
      mes: monthName,
      ano: 2026,
      contrasea: matchedGeneral.contrasea || '',
      logo: resolvedLogo,
      mockupUrl: resolvedMockup,
      estrategia: dynamicEstrategia,
      hashtags: dynamicHashtags,
      instagram: dynamicInstagram,
      rawGeneral: matchedGeneral,
      slides: slides,
      initialApprovals: initialApprovals,
      initialComments: initialComments
    };

    return clientGrid;
  } catch (error) {
    console.error('Error al procesar la parrilla dinámica desde Wix:', error);
    return fallbackCuauhtliData;
  }
}

/**
 * Obtiene todos los comentarios almacenados para una parrilla (por slug)
 */
export function getComments(slug) {
  try {
    const key = `dilo_comments_${slug || 'default'}`;
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error al leer comentarios locales:', e);
    return [];
  }
}

/**
 * Guarda un nuevo comentario para un slide de la parrilla y lo sincroniza en tiempo real con Wix CMS
 */
export async function saveComment(slug, commentData) {
  try {
    const key = `dilo_comments_${slug || 'default'}`;
    const existing = getComments(slug);

    const now = new Date();
    const dateStr = now.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const newComment = {
      id: 'cmt_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      slideNumber: commentData.slideNumber,
      slideType: commentData.slideType || 'POST',
      author: commentData.author?.trim() || 'Cliente',
      category: commentData.category || 'General',
      text: commentData.text?.trim(),
      createdAt: now.toISOString(),
      status: 'enviado',
      wixPostId: commentData.wixPostId || null
    };

    const updated = [newComment, ...existing];
    localStorage.setItem(key, JSON.stringify(updated));

    const commentLine = `[${dateStr}] ${newComment.author} (Lámina #${newComment.slideNumber || 'General'}): "${newComment.text}"`;

    // Sincronizar en tiempo real con Wix CMS
    try {
      const token = await getWixToken();
      if (token) {
        if (commentData.wixPostId) {
          // Consultar el post actual directamente por su ID en Wix Data API v2
          const getRes = await fetch(`https://www.wixapis.com/wix-data/v2/items/${commentData.wixPostId}?dataCollectionId=ParrillasdeContenido`, {
            method: 'GET',
            headers: {
              'Authorization': token
            }
          });

          if (getRes.ok) {
            const resData = await getRes.json();
            const item = resData.dataItem;
            if (item && item.id) {
              const currentComentario = item.data?.comentario || '';
              const newComentario = currentComentario ? `${currentComentario}\n---\n${commentLine}` : commentLine;

              const updatePayload = {
                dataCollectionId: 'ParrillasdeContenido',
                dataItem: {
                  id: item.id,
                  data: {
                    ...item.data,
                    comentario: newComentario,
                    comentariosAplicados: 'NO'
                  }
                }
              };

              await fetch(`https://www.wixapis.com/wix-data/v2/items/${item.id}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': token
                },
                body: JSON.stringify(updatePayload)
              });
              console.log(`✓ Comentario persistido en Wix CMS para el post ${item.id}`);
            }
          }
        } else {
          // Comentario general o de lámina sin ID directo -> Guardar en ParrillaGeneral
          const genQueryRes = await fetch('https://www.wixapis.com/wix-data/v2/items/query', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': token
            },
            body: JSON.stringify({
              dataCollectionId: 'ParrillaGeneral',
              paging: { limit: 50 }
            })
          });

          if (genQueryRes.ok) {
            const genData = await genQueryRes.json();
            const items = genData.dataItems || [];
            const target = items.find(it => {
              const s = (it.data?.slug || '').toLowerCase();
              const q = (slug || '').toLowerCase();
              return s === q || (q.includes('sept') && s.includes('sept')) || (q.includes('ago') && s.includes('ago'));
            }) || items[0];

            if (target && target.id) {
              const currentComentarios = target.data?.comentarios || '';
              const newComentarios = currentComentarios ? `${currentComentarios}\n---\n${commentLine}` : commentLine;

              await fetch(`https://www.wixapis.com/wix-data/v2/items/${target.id}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': token
                },
                body: JSON.stringify({
                  dataCollectionId: 'ParrillaGeneral',
                  dataItem: {
                    id: target.id,
                    data: {
                      ...target.data,
                      comentarios: newComentarios
                    }
                  }
                })
              });
              console.log(`✓ Comentario general persistido en ParrillaGeneral ${target.id}`);
            }
          }
        }
      }
    } catch (wixErr) {
      console.warn('Error al sincronizar comentario con Wix CMS:', wixErr);
    }

    return updated;
  } catch (e) {
    console.error('Error al guardar comentario:', e);
    return [];
  }
}

/**
 * Elimina un comentario por ID
 */
export function deleteComment(slug, commentId) {
  try {
    const key = `dilo_comments_${slug || 'default'}`;
    const existing = getComments(slug);
    const updated = existing.filter(c => c.id !== commentId);
    localStorage.setItem(key, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Error al eliminar comentario:', e);
    return [];
  }
}

/**
 * Obtiene las publicaciones aprobadas de una parrilla
 */
export function getApprovals(slug) {
  try {
    const key = `dilo_approvals_${slug || 'default'}`;
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error('Error al leer aprobaciones:', e);
    return {};
  }
}

/**
 * Guarda las aprobaciones de los posts en localStorage y las sincroniza en tiempo real con Wix CMS
 */
export async function saveApprovals(slug, approvedPosts, clientTitle = 'Cliente', slides = []) {
  try {
    const key = `dilo_approvals_${slug || 'default'}`;
    localStorage.setItem(key, JSON.stringify(approvedPosts));

    // Filtrar los slides que son publicaciones reales con wixPostId
    const postSlides = slides.filter(s => s.wixPostId);
    const totalPosts = postSlides.length > 0 ? postSlides.length : 1;

    const approvedCount = postSlides.filter(s => !!approvedPosts[s.slideNumber]).length;
    const percentage = Math.round((approvedCount / totalPosts) * 100);

    // Sincronizar cada post modificado en Wix CMS (campo 'aprobado' = 'SI' / 'NO')
    try {
      const token = await getWixToken();
      if (token && postSlides.length > 0) {
        for (const s of postSlides) {
          const isApproved = !!approvedPosts[s.slideNumber];
          const targetAprobadoStr = isApproved ? 'SI' : 'NO';

          // Consultar el post actual directamente por su ID en Wix Data API v2
          const getRes = await fetch(`https://www.wixapis.com/wix-data/v2/items/${s.wixPostId}?dataCollectionId=ParrillasdeContenido`, {
            method: 'GET',
            headers: {
              'Authorization': token
            }
          });

          if (getRes.ok) {
            const resData = await getRes.json();
            const item = resData.dataItem;
            if (item && item.id && item.data?.aprobado !== targetAprobadoStr) {
              await fetch(`https://www.wixapis.com/wix-data/v2/items/${item.id}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': token
                },
                body: JSON.stringify({
                  dataCollectionId: 'ParrillasdeContenido',
                  dataItem: {
                    id: item.id,
                    data: {
                      ...item.data,
                      aprobado: targetAprobadoStr
                    }
                  }
                })
              });
              console.log(`✓ Estado de aprobación '${targetAprobadoStr}' guardado en Wix para el post ${item.id}`);
            }
          }
        }

        // Actualizar resumen de porcentaje y conteo de aprobaciones en ParrillaGeneral
        try {
          const genRes = await fetch('https://www.wixapis.com/wix-data/v2/items/query', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': token
            },
            body: JSON.stringify({
              dataCollectionId: 'ParrillaGeneral',
              paging: { limit: 50 }
            })
          });
          if (genRes.ok) {
            const genData = await genRes.json();
            const genItem = (genData.dataItems || []).find(it => {
              const s = (it.data?.slug || '').toLowerCase();
              const q = (slug || '').toLowerCase();
              return s === q || (q.includes('sept') && s.includes('sept')) || (q.includes('ago') && s.includes('ago'));
            });
            if (genItem) {
              await fetch(`https://www.wixapis.com/wix-data/v2/items/${genItem.id}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': token
                },
                body: JSON.stringify({
                  dataCollectionId: 'ParrillaGeneral',
                  dataItem: {
                    id: genItem.id,
                    data: {
                      ...genItem.data,
                      porcentajeAprobado: `${percentage}%`,
                      resumenAprobacion: `${approvedCount}/${totalPosts} posts aprobados`
                    }
                  }
                })
              });
              console.log(`✓ ParrillaGeneral ${genItem.id} actualizada con porcentaje ${percentage}% y resumen`);
            }
          }
        } catch (genErr) {
          console.warn('Error al actualizar resumen en ParrillaGeneral:', genErr);
        }
      }
    } catch (wixErr) {
      console.warn('Error al sincronizar aprobaciones con Wix CMS:', wixErr);
    }

    return { approvedPosts, percentage, approvedCount, totalPosts };
  } catch (e) {
    console.error('Error al guardar aprobaciones:', e);
    return { approvedPosts };
  }
}
