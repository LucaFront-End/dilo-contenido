import { fallbackCuauhtliData } from '../data/cuauhtliFallbackData';

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
    console.warn('No se pudo conectar a la autenticación de Wix Headless, usando modo local:', error);
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

  return wixMediaUri;
}

/**
 * Extrae texto legible y estructurado de un documento Wix Rich Text
 */
export function extractTextFromWixDoc(doc) {
  if (!doc) return '';
  if (typeof doc === 'string') return doc;

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
 * Consulta todas las parrillas generales disponibles
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
    console.warn('Error al obtener ParrillasGenerales de Wix, usando respaldo local:', err);
    return [fallbackCuauhtliData];
  }
}

/**
 * Obtiene la parrilla completa de un cliente por su slug o título
 */
export async function getParrillaBySlug(slug) {
  try {
    const token = await getWixToken();
    if (!token) {
      return fallbackCuauhtliData;
    }

    // 1. Consultar ParrillaGeneral
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

    // Buscar coincidencia por slug o título
    let matchedGeneral = generalItems.find(
      it => it.data?.slug === slug || it.data?.title?.toLowerCase().includes(slug?.toLowerCase())
    )?.data;

    // Si no coincide o estamos buscando la default
    if (!matchedGeneral && (slug === 'sisitemas-cuauhtli-septiembre-2026' || !slug)) {
      matchedGeneral = generalItems.find(it => it.data?.title?.includes('Sistemas Cuauhtli'))?.data;
    }

    if (!matchedGeneral) {
      console.log('No se encontró en Wix, usando fallback:', slug);
      return fallbackCuauhtliData;
    }

    // 2. Consultar ParrillasdeContenido para este cliente
    const contentRes = await fetch('https://www.wixapis.com/wix-data/v2/items/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify({
        dataCollectionId: 'ParrillasdeContenido',
        paging: { limit: 50 }
      })
    });

    let wixPosts = [];
    if (contentRes.ok) {
      const contentData = await contentRes.json();
      const allPosts = contentData.dataItems || [];
      wixPosts = allPosts
        .map(it => it.data)
        .filter(p => p.title?.toLowerCase() === matchedGeneral.title?.toLowerCase());
    }

    // Si encontramos posts en Wix, los ensamblamos; si no o faltan slides, combinamos con el fallback enriquecido
    const resolvedMockup = resolveWixMediaUrl(matchedGeneral.mockup) || fallbackCuauhtliData.slides[1]?.image;

    // Resolver logo del cliente y datos del teléfono configurados en Wix
    const resolvedLogo = resolveWixMediaUrl(
      matchedGeneral.logo ||
      matchedGeneral.logoTelefono ||
      matchedGeneral.logoCliente ||
      matchedGeneral.avatar ||
      matchedGeneral.perfilLogo ||
      matchedGeneral.fotoPerfil ||
      matchedGeneral.logotipo ||
      matchedGeneral.imagenLogo
    );

    const dynamicInstagram = {
      ...fallbackCuauhtliData.instagram,
      logo: resolvedLogo || '/assets/logo/cuauhtli-logo.png',
      avatar: resolvedLogo || '/assets/logo/cuauhtli-logo.png',
      username:
        matchedGeneral.usuarioInstagram ||
        matchedGeneral.instagramUser ||
        matchedGeneral.usuario ||
        matchedGeneral.tituloTelefono ||
        matchedGeneral.nombreTelefono ||
        fallbackCuauhtliData.instagram.username,
      displayName:
        matchedGeneral.tituloTelefono ||
        matchedGeneral.nombreTelefono ||
        matchedGeneral.displayName ||
        matchedGeneral.perfilTitulo ||
        matchedGeneral.title ||
        fallbackCuauhtliData.instagram.displayName,
      bio:
        matchedGeneral.bioTelefono ||
        matchedGeneral.descripcionTelefono ||
        matchedGeneral.bio ||
        (matchedGeneral.descripcin ? extractTextFromWixDoc(matchedGeneral.descripcin) : null) ||
        fallbackCuauhtliData.instagram.bio,
      postsCount:
        matchedGeneral.publicaciones ||
        matchedGeneral.postsCount ||
        matchedGeneral.numeroPublicaciones ||
        fallbackCuauhtliData.instagram.postsCount,
      followersCount:
        matchedGeneral.seguidores ||
        matchedGeneral.followersCount ||
        matchedGeneral.numeroSeguidores ||
        fallbackCuauhtliData.instagram.followersCount,
      followingCount:
        matchedGeneral.seguidos ||
        matchedGeneral.followingCount ||
        matchedGeneral.numeroSeguidos ||
        fallbackCuauhtliData.instagram.followingCount,
      link:
        matchedGeneral.enlaceTelefono ||
        matchedGeneral.linkTelefono ||
        matchedGeneral.telefonoLink ||
        matchedGeneral.linkWhatsapp ||
        matchedGeneral.link ||
        fallbackCuauhtliData.instagram.link ||
        'wa.link/hpxqqv',
      highlights: fallbackCuauhtliData.instagram.highlights
    };

    // Construir la estructura completa de la parrilla
    const clientGrid = {
      id: matchedGeneral._id,
      title: matchedGeneral.title,
      slug: matchedGeneral.slug || slug,
      mes: matchedGeneral.mes || 'Septiembre',
      ano: 2026,
      contrasea: matchedGeneral.contrasea || '',
      logo: resolvedLogo || '/assets/logo/cuauhtli-logo.png',
      mockupUrl: resolvedMockup,
      estrategiaTexto: matchedGeneral.estartegiaInicial || extractTextFromWixDoc(matchedGeneral.estrategia),
      estrategia: fallbackCuauhtliData.estrategia,
      hashtags: fallbackCuauhtliData.hashtags,
      instagram: dynamicInstagram,
      rawGeneral: matchedGeneral,
      // Diapositivas completas (usando las 30 diapositivas del PDF enriquecidas con los datos de Wix)
      slides: fallbackCuauhtliData.slides.map((s, idx) => {
        // Post configurado en Wix (por orden o coincidencia)
        const wixMatch = wixPosts.find(p => Number(p.orden) === idx + 1) || wixPosts[0];
        const wixVideoMatch = wixPosts.find(p => p.tipoDePost?.toLowerCase().includes('video') || p.tipoDePost?.toLowerCase().includes('reel'));

        // Si esta lámina es video (por Wix o demostración en lámina #5)
        const isVideoSlide = (idx === 4 && wixVideoMatch) || s.pageNumber === 5 || s.type?.toUpperCase().includes('VIDEO');
        const resolvedVideoUrl = (wixVideoMatch && resolveWixMediaUrl(wixVideoMatch.contenido?.[0]?.src)) || '/assets/video/sample_reel.mp4';

        if (idx === 3 && wixMatch) {
          const wixCopy = extractTextFromWixDoc(wixMatch.descripcin);
          const wixImages = (wixMatch.contenido || []).map(c => resolveWixMediaUrl(c.src)).filter(Boolean);
          return {
            ...s,
            type: wixMatch.tipoDePost?.toUpperCase() || s.type,
            copy: wixCopy || s.copy,
            images: wixImages.length > 0 ? wixImages : (s.postImages || [s.image]),
            postImages: wixImages.length > 0 ? wixImages : (s.postImages || [s.image]),
            isVideo: isVideoSlide,
            videoUrl: isVideoSlide ? resolvedVideoUrl : null
          };
        }

        if (isVideoSlide) {
          return {
            ...s,
            type: 'VIDEO / REEL',
            isVideo: true,
            videoUrl: resolvedVideoUrl,
            copy: (wixVideoMatch ? extractTextFromWixDoc(wixVideoMatch.descripcin) : null) || s.copy,
            postImages: s.postImages || [s.image]
          };
        }

        return {
          ...s,
          postImages: s.postImages || [s.image]
        };
      })
    };

    return clientGrid;
  } catch (error) {
    console.warn('Error al procesar la parrilla desde Wix, aplicando datos locales seguros:', error);
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
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error al leer comentarios:', e);
    return [];
  }
}

/**
 * Guarda un nuevo comentario para un slide de la parrilla
 */
export async function saveComment(slug, commentData) {
  try {
    const key = `dilo_comments_${slug || 'default'}`;
    const existing = getComments(slug);

    const newComment = {
      id: 'cmt_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      slideNumber: commentData.slideNumber,
      slideType: commentData.slideType || 'POST',
      author: commentData.author?.trim() || 'Cliente',
      category: commentData.category || 'General',
      text: commentData.text?.trim(),
      createdAt: new Date().toISOString(),
      status: 'enviado'
    };

    const updated = [newComment, ...existing];
    localStorage.setItem(key, JSON.stringify(updated));

    // Formato estructurado para persistir en el campo único de comentarios de Wix CMS
    const serializedLog = updated
      .map(c => {
        const d = new Date(c.createdAt || Date.now());
        const dateStr = d.toLocaleDateString('es-MX', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
        return `[${dateStr}] ${c.author} (Lámina #${c.slideNumber || 'General'}) [${c.category || 'Nota'}]: "${c.text}"`;
      })
      .join('\n---\n');

    // Intentar sincronizar con Wix Headless en ParrillasdeContenido o ParrillaGeneral
    try {
      const token = await getWixToken();
      if (token) {
        // Enviar a colección ComentariosParrilla o actualizar campo en ParrillaGeneral
        fetch('https://www.wixapis.com/wix-data/v2/items/query', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          },
          body: JSON.stringify({
            dataCollectionId: 'ParrillaGeneral',
            query: { filter: { slug: slug } }
          })
        })
          .then(r => r.json())
          .then(res => {
            const item = res?.dataItems?.[0];
            if (item && item.id) {
              fetch(`https://www.wixapis.com/wix-data/v2/items/${item.id}`, {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': token
                },
                body: JSON.stringify({
                  dataCollectionId: 'ParrillaGeneral',
                  dataItem: {
                    data: {
                      ...item.data,
                      comentarios: serializedLog,
                      comentariosCliente: serializedLog,
                      historialComentarios: JSON.stringify(updated)
                    }
                  }
                })
              }).catch(() => {});
            }
          })
          .catch(() => {});
      }
    } catch (_) {}

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
 * Obtiene las publicaciones aprobadas de una parrilla desde localStorage
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
 * Guarda las aprobaciones de los posts en localStorage y las sincroniza con Wix CMS
 */
export async function saveApprovals(slug, approvedPosts, clientTitle = 'Cliente') {
  try {
    const key = `dilo_approvals_${slug || 'default'}`;
    localStorage.setItem(key, JSON.stringify(approvedPosts));

    const totalContentPosts = 25;
    const approvedList = Object.keys(approvedPosts)
      .filter((k) => !!approvedPosts[k])
      .map(Number)
      .sort((a, b) => a - b);
    const approvedCount = approvedList.length;
    const percentage = totalContentPosts > 0 ? Math.round((approvedCount / totalContentPosts) * 100) : 0;
    const formattedList = approvedList.map((n) => `#${n}`).join(', ');

    const nowStr = new Date().toLocaleString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const approvalSummary = `${percentage}% Aprobado (${approvedCount}/${totalContentPosts}) | Posts aprobados: [${formattedList || 'Ninguno'}] | Actualizado: ${nowStr} por ${clientTitle}`;

    // Sincronizar en segundo plano con Wix CMS en ParrillaGeneral
    try {
      const token = await getWixToken();
      if (token) {
        fetch('https://www.wixapis.com/wix-data/v2/items/query', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          },
          body: JSON.stringify({
            dataCollectionId: 'ParrillaGeneral',
            query: { filter: { slug: slug } }
          })
        })
          .then((r) => r.json())
          .then((res) => {
            const item = res?.dataItems?.[0];
            if (item && item.id) {
              fetch(`https://www.wixapis.com/wix-data/v2/items/${item.id}`, {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': token
                },
                body: JSON.stringify({
                  dataCollectionId: 'ParrillaGeneral',
                  dataItem: {
                    data: {
                      ...item.data,
                      aprobaciones: JSON.stringify(approvedPosts),
                      resumenAprobacion: approvalSummary,
                      porcentajeAprobado: percentage,
                      postsAprobados: formattedList,
                      estadoAprobacion: percentage === 100 ? '100% Aprobado' : `${percentage}% Aprobado`
                    }
                  }
                })
              }).catch(() => {});
            }
          })
          .catch(() => {});
      }
    } catch (_) {}

    return { approvedPosts, percentage, approvedCount, approvalSummary };
  } catch (e) {
    console.error('Error al guardar aprobaciones:', e);
    return { approvedPosts };
  }
}

