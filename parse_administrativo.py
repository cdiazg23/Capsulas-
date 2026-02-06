import json
import re

raw_data = """Acto Administrativo;Derecho Administrativo;Derecho Administrativo Funcional;Decisión escrita de la Administración que produce efectos jurídicos sobre los administrados.;Resolución que aprueba un permiso de ocupación en vía pública.;Art. 3 Ley 19.880;No se encontró jurisprudencia verificable para este concepto;Declaración voluntad|Escrito|Efectos jurídicos
Procedimiento Administrativo;Derecho Administrativo;Derecho Administrativo Funcional;Sucesión de actos trámite para producir un acto terminal.;Solicitud de licencia que sigue etapas hasta dictamen final.;Ley 19.880;No se encontró jurisprudencia verificable para este concepto;Garantías particulares|Forma de actuar|Procedimiento reglado
Descentralización Funcional;Derecho Administrativo;Derecho Administrativo Funcional;Administración del Estado funcional y territorialmente descentralizada o desconcentrada.;Asignación de competencias a servicios públicos descentralizados.;Art. 3 Constitución Política de la República;No se encontró jurisprudencia verificable para este concepto;Funcional territorial|Conforme ley|Eficiencia administrativa
Recurso de Protección;Derecho Administrativo;Derecho Procesal Administrativo;Acción constitucional para restablecer derechos vulnerados por acto arbitrario o ilegal.;Reclamo contra resolución administrativa que afecta derecho ambiental.;Art. 20 Constitución Política de la República;No se encontró jurisprudencia verificable para este concepto;Acción judicial|Restablecimiento derechos|Arbitrariedad administrativa
Contencioso Administrativo;Derecho Administrativo;Derecho Procesal Administrativo;Control judicial de actos administrativos ante tribunales.;Demanda contra invalidez de acto administrativo.;Ley 19.880;No se encontró jurisprudencia verificable para este concepto;Control judicial|Invalidez actos|Procedimiento especial
Procedimiento Sancionatorio Administrativo;Derecho Administrativo;Derecho Procesal Administrativo;Proceso para imponer sanciones por incumplimientos administrativos.;Fiscalización que deriva en multa por infracción.;Ley 19.880;No se encontró jurisprudencia verificable para este concepto;Debido proceso|Fiscalización|Imposición sanciones
Responsabilidad Extracontractual del Estado;Derecho Administrativo;Responsabilidad del Estado;Obligación de reparar daños causados por falta de servicio de la administración.;Daño por omisión en mantenimiento de vía pública.;Art. 38 Constitución Política de la República;No se encontró jurisprudencia verificable para este concepto;Falta de servicio|Daño patrimonial|Reparación integral
Falta de Servicio;Derecho Administrativo;Responsabilidad del Estado;Actuación defectuosa de la administración que causa daño.;Negligencia en inspección sanitaria generando perjuicio.;Art. 38 Constitución Política de la República;No se encontró jurisprudencia verificable para este concepto;Actuación defectuosa|Causal daño|Responsabilidad objetiva
Responsabilidad por Actividad Legislativa;Derecho Administrativo;Responsabilidad del Estado;Daños causados por normas legislativas inconstitucionales.;Ley que genera desigualdad en cargas públicas.;Art. 38 Constitución Política de la República;No se encontró jurisprudencia verificable para este concepto;Actividad legislativa|Daño FB|Reparación
Municipalidad;Derecho Administrativo;Derecho Municipal;Corporación autónoma de derecho público con personalidad jurídica y patrimonio propio.;Municipalidad administra servicios locales como aseo.;Art. 1 Ley 18.695;No se encontró jurisprudencia verificable para este concepto;Autónoma pública|Personalidad jurídica|Satisfacer necesidades locales
Concejo Municipal;Derecho Administrativo;Derecho Municipal;Órgano colegiado que fiscaliza al alcalde y aprueba planes comunales.;Aprobación de presupuesto municipal por concejales.;Art. 65 Ley 18.695;No se encontró jurisprudencia verificable para este concepto;Fiscalización|Normativo|Participación ciudadana
Alcalde;Derecho Administrativo;Derecho Municipal;Máxima autoridad municipal que dirige la administración local.;Alcalde preside concejo y representa a la municipalidad.;Art. 56 Ley 18.695;No se encontró jurisprudencia verificable para este concepto;Dirección administración|Representación judicial|Ejecución políticas
Derecho a Medio Ambiente Libre de Contaminación;Derecho Administrativo;Derecho Ambiental;Derecho a vivir en entorno sin contaminación, preservando naturaleza.;Denuncia por emisión contaminante afectando salud.;Art. 1 Ley 19.300;No se encontró jurisprudencia verificable para este concepto;Protección ambiental|Preservación naturaleza|Conservación ambiental
Evaluación de Impacto Ambiental;Derecho Administrativo;Derecho Ambiental;Proceso para identificar impactos de proyectos en el medio ambiente.;Proyecto minero somete EIA para aprobación.;Ley 19.300;No se encontró jurisprudencia verificable para este concepto;Identificación impactos|Participación ciudadana|Medidas mitigación
Plan de Descontaminación Ambiental;Derecho Administrativo;Derecho Ambiental;Instrumento para reducir contaminación en áreas declaradas saturadas.;Plan para zona saturada por material particulado.;Ley 19.300;No se encontró jurisprudencia verificable para este concepto;Reducción emisiones|Áreas saturadas|Medidas correctivas
Plan Regulador Comunal;Derecho Administrativo;Derecho Urbanístico;Instrumento de planificación que define usos de suelo y normas urbanísticas.;Plan que zonifica áreas residenciales y comerciales.;Art. 43 Ley General de Urbanismo y Construcciones;No se encontró jurisprudencia verificable para este concepto;Planificación territorial|Usos suelo|Normas edificación
Permiso de Edificación;Derecho Administrativo;Derecho Urbanístico;Autorización para construir o modificar edificaciones conforme normas.;Solicitud de permiso para casa unifamiliar.;Art. 116 Ley General de Urbanismo y Construcciones;No se encontró jurisprudencia verificable para este concepto;Autorización construcción|Cumplimiento normas|Derechos municipales
Límite Urbano;Derecho Administrativo;Derecho Urbanístico;Línea que delimita áreas urbanas de rurales.;Expansión urbana modificando límite para nuevo barrio.;Ley General de Urbanismo y Construcciones;No se encontró jurisprudencia verificable para este concepto;Delimitación urbana|Áreas rurales|Planificación
Derechos de Aduana;Derecho Administrativo;Derecho Aduanero;Gravámenes en arancel aduanero sobre mercancías que entran al territorio.;Imposición de derechos sobre importación de vehículos.;Ordenanza de Aduanas;No se encontró jurisprudencia verificable para este concepto;Gravámenes arancelarios|Importación exportación|Normativa nacional
Arancel Aduanero;Derecho Administrativo;Derecho Aduanero;Clasificación y tasas para derechos sobre importaciones.;Código arancelario para electrónica importada.;Ordenanza de Aduanas;No se encontró jurisprudencia verificable para este concepto;Clasificación mercancías|Tasas derechos|Ocho dígitos
Trámite Aduanero;Derecho Administrativo;Derecho Aduanero;Procedimientos para ingreso o salida de mercancías.;Declaración aduanera para exportación de vinos.;Ordenanza de Aduanas;No se encontró jurisprudencia verificable para este concepto;Declaración tránsito|Facilitación transporte|Manifiesto internacional
Visa de Residencia;Derecho Administrativo;Derecho Migratorio;Autorización para residir en Chile por motivos específicos como trabajo o estudio.;Visa temporal para trabajador extranjero contratado.;Ley 21.325 de Migración y Extranjería;No se encontró jurisprudencia verificable para este concepto;Autorización residencia|Motivos específicos|Condiciones ingreso
Expulsión Administrativa;Derecho Administrativo;Derecho Migratorio;Medida para egreso forzoso de extranjero por infracción migratoria.;Expulsión por ingreso irregular al país.;Ley 21.325 de Migración y Extranjería;No se encontró jurisprudencia verificable para este concepto;Infracción migratoria|Egreso forzoso|Debido proceso
Permiso de Permanencia Transitoria;Derecho Administrativo;Derecho Migratorio;Autorización para estadía temporal sin residencia.;Permiso para turista por 90 días.;Ley 21.325 de Migración y Extranjería;No se encontró jurisprudencia verificable para este concepto;Estadía temporal|Sin residencia|Control migratorio
"""

lines = [l.strip() for l in raw_data.split('\n') if l.strip()]

def sql_escape(text):
    if not text: return ""
    return text.replace("'", "''")

dadm_count = 0
sql_statements = []

for line in lines:
    parts = [p.strip() for p in line.split(';')]
    if len(parts) < 8: continue
    
    concept = parts[0]
    category = parts[1]
    subcategory = parts[2]
    definition = parts[3]
    example = parts[4]
    regulation = parts[5]
    jurisprudence = parts[6]
    key_points_raw = parts[7]

    dadm_count += 1
    cid = f'DADM-{dadm_count:03d}'

    key_points = [kp.strip() for kp in key_points_raw.split('|') if kp.strip()]
    key_points_json = json.dumps(key_points, ensure_ascii=False)

    sql = f"('{cid}', '{sql_escape(concept)}', '{sql_escape(category)}', '{sql_escape(subcategory)}', '{sql_escape(definition)}', " \
          f"'{sql_escape(example)}', '{sql_escape(regulation)}', '{sql_escape(jurisprudence)}', '', '{sql_escape(key_points_json)}')"
    sql_statements.append(sql)

output_sql = "INSERT INTO legal_concepts (id, concept, category, subcategory, definition_simple, real_example, regulation, jurisprudence, video_url, key_points) VALUES\n"
output_sql += ",\n".join(sql_statements) + ";"

with open('C:/Users/carlo/OneDrive/Escritorio/iuris/insert_administrativo.sql', 'w', encoding='utf-8') as f:
    f.write(output_sql)

print(f"Generated SQL for {len(sql_statements)} concepts.")
