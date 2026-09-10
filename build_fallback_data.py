import fitz
import json

doc = fitz.open('SISTEMAS CUAUHTLI AGOSTO (1).pdf')

slides = []

# Map slide badges
slide_types = {
    1: "PORTADA",
    2: "CONTENIDO VISUAL",
    3: "ESTRATEGIA",
    4: "POST DE VALOR",
    5: "POST DE VALOR",
    6: "POST DE VALOR",
    7: "POST DE VALOR",
    8: "POST DE VALOR",
    9: "POST DE VALOR",
    10: "POST DE VALOR",
    11: "POST DE VALOR",
    12: "POST DE VALOR",
    13: "POST DE VALOR",
    14: "POST",
    15: "POST",
    16: "POST",
    17: "POST",
    18: "POST",
    19: "POST",
    20: "POST",
    21: "POST",
    22: "POST",
    23: "POST",
    24: "POST",
    25: "POST",
    26: "POST",
    27: "POST",
    28: "POST",
    29: "HASTAGS",
    30: "CONTACTO"
}

for i in range(len(doc)):
    page_num = i + 1
    text = doc[i].get_text()
    
    # Clean text
    clean_text = text.strip()
    
    # Categorize
    badge = slide_types.get(page_num, "POST")
    
    slide_obj = {
        "id": page_num,
        "pageNumber": page_num,
        "type": badge,
        "image": f"/assets/slides/slide_{page_num:02d}.png",
        "rawText": clean_text
    }
    
    # Extract copy paragraphs and hashtags
    lines = [l.strip() for l in clean_text.split('\n') if l.strip()]
    hashtags = [l for l in lines if l.startswith('#')]
    body_lines = [l for l in lines if not l.startswith('#')]
    
    slide_obj["copy"] = "\n\n".join(body_lines)
    slide_obj["hashtags"] = " ".join(hashtags)
    
    slides.append(slide_obj)

# Create full fallback data export
client_data = {
    "title": "Sistemas Cuauhtli",
    "slug": "sisitemas-cuauhtli-septiembre-2026",
    "mes": "Septiembre",
    "ano": 2026,
    "contrasea": "V7#mQ2!xL9@pR4$k",
    "instagram": {
        "username": "sistemascuauhtli",
        "displayName": "Sistemas Cuauhtli | Instalación de CCTV Y ALARMAS",
        "bio": "Ciencia, tecnología e ingeniería\nSistemas de seguridad para empresas: #CCTV, #Alarmas, #ControldeAcceso y #Cercaselectricas\nServicio en #CDMX y #EDOMEX\nCotiza Ahora 👇 wa.link/hpxqqv",
        "postsCount": 336,
        "followersCount": 92,
        "followingCount": 65,
        "highlights": [
            {"id": 1, "title": "ALARMAS", "icon": "bell"},
            {"id": 2, "title": "ACCESOS", "icon": "key"},
            {"id": 3, "title": "CERCA ELÉ...", "icon": "zap"},
            {"id": 4, "title": "CCTV", "icon": "camera"}
        ]
    },
    "estrategia": {
        "enfoque": [
            "Contenido como confianza y autoridad, no solo impacto.",
            "Decisiones basadas en credibilidad y tranquilidad.",
            "Mostrar cómo trabajamos, no solo qué vendemos."
        ],
        "contenido": [
            "Fotos reales del día a día.",
            "Reels de procesos: instalaciones, funcionamiento y casos reales."
        ],
        "narrativa": [
            "Cercana, sin alarmismo.",
            "Posicionamiento como aliado experto."
        ],
        "objetivo": [
            "Confianza antes del contacto.",
            "Menos objeciones al cotizar."
        ]
    },
    "hashtags": {
        "nicho": [
            "#HogarSeguroInteligente",
            "#SeguridadResidencialPremium",
            "#EmpresasSeguras",
            "#Proteccion24Horas",
            "#InstalacionesSeguras"
        ],
        "marca": [
            "#SeguridadElectrónica",
            "#CCTVProfesional",
            "#AlarmasInteligentes",
            "#VideoporterosParaNegocios",
            "#MonitoreoRemoto",
            "#ProtecciónEmpresarial"
        ],
        "geolocalizacion": [
            "#CDMX",
            "#CiudadDeMexico",
            "#SeguridadCDMX",
            "#NegociosCDMX",
            "#HogarSeguroCDMX",
            "#EmpresasCDMX"
        ]
    },
    "slides": slides
}

js_content = f"// Datos de Sistemas Cuauhtli generados a partir del PDF de Dilo Digital\nexport const fallbackCuauhtliData = {json.dumps(client_data, indent=2, ensure_ascii=False)};\n"

with open('src/data/cuauhtliFallbackData.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print("Generated src/data/cuauhtliFallbackData.js successfully!")
