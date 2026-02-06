import json
import re

raw_data = """Protección Financiera Concursal;Derecho Comercial;Derecho Concursal;Periodo de prohibición de iniciar ejecuciones contra el deudor durante la negociación de un acuerdo de reorganización judicial.;Una empresa textil suspende el remate de sus maquinarias por parte de un banco tras admitirse su reorganización.;Art. 57 Ley 20.720;27° Juzgado Civil de Santiago, Rol V-154-2023;Suspensión de ejecuciones|Prórroga de contratos|Prohibición de embargos 
Acción Pauliana Concursal;Derecho Comercial;Derecho Concursal;Acción para revocar actos del deudor realizados en perjuicio de acreedores dentro del periodo de sospecha previo a la liquidación.;Un deudor transfiere su único inmueble a un familiar meses antes de declararse en quiebra para evitar el embargo.;Art. 287 Ley 20.720;Corte Suprema, Rol 14.231-2022;Revocación de actos fraudulentos|Periodo de sospecha|Beneficio de la masa 
Veedor;Derecho Comercial;Derecho Concursal;Persona natural encargada de propiciar acuerdos entre el deudor y sus acreedores en los procedimientos de reorganización judicial.;Un experto facilita la renegociación de deudas de una constructora para evitar su liquidación definitiva.;Art. 2 N° 39 Ley 20.720;Corte de Apelaciones de Santiago, Rol 567-2021;Facilitador de acuerdos|Fiscalizador del proceso|Inscrito en nómina pública 
Procedimiento Concursal de Renegociación;Derecho Comercial;Derecho Concursal;Procedimiento administrativo y gratuito ante la Superir que permite a la Persona Deudora normalizar sus obligaciones mediante acuerdos.;Un profesor con deudas bancarias superiores a 80 UF solicita a la Superintendencia mediar con sus acreedores.;Art. 260 Ley 20.720;Dictamen Superir N° 45-2023;Exclusivo personas naturales|Sin costo legal|Sede administrativa 
Verificación de Crédito;Derecho Comercial;Derecho Concursal;Acto procesal donde los acreedores presentan sus títulos ante el tribunal para acreditar la existencia y monto de sus acreencias.;Un proveedor de insumos presenta sus facturas impagas ante el liquidador para participar en el reparto de fondos.;Art. 170 Ley 20.720;Corte Suprema, Rol 22.450-2023;Carga procesal del acreedor|Plazo perentorio|Reconocimiento de pasivos 
Desasimiento;Derecho Comercial;Derecho Concursal;Efecto legal que priva al deudor de la administración de sus bienes, traspasándola al liquidador.;Tras dictarse la resolución de liquidación, el dueño de una imprenta no puede vender legalmente sus máquinas.;Art. 129 Ley 20.720;Corte Suprema, Rol 34.120-2022;Pérdida de administración|Administración del Liquidador|Nulidad de actos posteriores
 Continuidad Económica;Derecho Comercial;Derecho Concursal;Facultad del liquidador para mantener el giro del deudor si esto permite una mejor realización del activo.;Un colegio en quiebra sigue operando hasta fin de año para no afectar a alumnos y vender la unidad económica.;Art. 230 Ley 20.720;1° Juzgado Civil de Concepción, Rol C-442-2023;Preservación de valor|Autorización de acreedores|Enajenación como unidad
Incidente de Objeción de Créditos;Derecho Comercial;Derecho Concursal;Mecanismo procesal para impugnar la existencia, monto o preferencia de créditos verificados por otros acreedores.;Un acreedor objeta el crédito de un socio de la empresa concursada por sospecha de simulación.;Art. 174 Ley 20.720;Corte de Apelaciones de San Miguel, Rol 1.022-2023;Control cruzado entre acreedores|Sustanciación incidental|Plazo de 10 días
Acreedor Valista;Derecho Comercial;Derecho Concursal;Acreedor que no goza de ninguna preferencia legal para el pago de su crédito.;Un proveedor de servicios de oficina que solo posee facturas sin garantías reales ni privilegios legales.;Art. 2489 Código Civil;CGR Dictamen N° E11234-2022;Pago a prorrata|Último orden de prelación|Sin garantía específica
Liquidación de Bienes (Persona);Derecho Comercial;Derecho Concursal;Procedimiento judicial para la venta rápida de bienes de una persona natural para pagar sus deudas.;Un particular entrega su vehículo y ahorros para extinguir saldos de deudas tras fracasar una renegociación.;Art. 273 Ley 20.720;Corte de Apelaciones de Santiago, Rol 12.445-2023;Extinción de saldos insolutos (Discharge)|Persona natural|Resolución de término
Delitos Concursales;Derecho Comercial;Derecho Concursal;Figuras penales que sancionan conductas en procedimientos concursales como alzamiento de bienes e insolvencia punible.;Deudor en reorganización oculta activos para evitar liquidación, incurriendo en delito concursal punible.;Arts. 463 a 465 bis Código Penal;Ley 20.720;Fuente: vLex Chile;Procedimiento Concursal|Protección Financiera|Insolvencia Punible|Alzamiento de Bienes
Personas Relacionadas con el Deudor;Derecho Comercial;Derecho Concursal;Personas enumeradas taxativamente como familiares, sociedades del grupo empresarial o controladores con efectos en créditos subordinados.;Cónyuge otorga préstamo a deudor insolvente, resultando crédito subordinado y sin voto en junta.;Art. 2 Nº 26 Ley 20.720;Fuente: vLex Chile;Subordinación Créditos|Prohibición Voto|Grupo Empresarial|Relación Familiar
Procedimiento Concursal de Reorganización;Derecho Comercial;Derecho Concursal;Procedimiento judicial para reestructurar pasivos y activos de empresa deudora viable.;Empresa viable solicita reorganización, presenta acuerdo a acreedores para evitar liquidación.;Art. 2 Nº 29 Ley 20.720;Fuente: vLex Chile;Reestructuración Pasivos|Viabilidad Empresa|Acuerdo Judicial|Protección Financiera
Acciones Revocatorias Concursales;Derecho Comercial;Derecho Concursal;Mecanismos para declarar inoponibles actos perjudiciales a la masa en procedimientos concursales.;Acreedor impugna venta de bienes por deudor en período sospechoso, revirtiendo perjuicio a masa.;Arts. 287 a 291 Ley 20.720;Corte Suprema, Rol 44397-2020, 2021;Acción Objetiva|Período Sospechoso|Inoponibilidad Actos|Perjuicio Masa
Junta de Acreedores;Derecho Comercial;Derecho Concursal;Órgano colegiado de acreedores verificados que decide sobre acuerdos en procedimientos concursales.;En liquidación, junta aprueba objeción de crédito relacionado, excluyendo voto de entidad vinculada.;Arts. 79 y 191 Ley 20.720;Corte Suprema, Rol C-15819-2022, 2023;Acreedores Verificados|Quorum Mayorías|Objeción Créditos|Transparencia Mercado
Negociación Colectiva;Derecho Laboral;Derecho Colectivo;Proceso entre empleadores y trabajadores/sindicatos para acordar condiciones laborales comunes.;Sindicato de empresa presenta proyecto de contrato colectivo al empleador, negocian remuneraciones, bonos y horarios, alcanzando acuerdo ratificado.;Arts. 303-314 Código del Trabajo;Ley 20.940;Corte Suprema, Rol 30.347-2025, 2025;Procedimiento reglado|Derecho a información|Buena fe|Titularidad sindical
Huelga;Derecho Laboral;Derecho Colectivo;Cese colectivo de labores por trabajadores para presionar en conflictos laborales.;Trabajadores de fábrica votan huelga tras rechazo de oferta salarial en negociación, paralizando producción hasta mediación.;Art. 345 Código del Trabajo;Ley 20.940;Corte Suprema, Rol 127624, 2025;Votación secreta|No reemplazo|Servicios mínimos|Limitaciones esenciales
Sindicato;Derecho Laboral;Derecho Colectivo;Asociación de trabajadores con personería jurídica para proteger intereses comunes.;Trabajadores de comercio forman sindicato para negociar mejores condiciones, eligen directiva y registran en Dirección del Trabajo.;Art. 212 Código del Trabajo;Ley 19.069;Corte Suprema, Rol 46.906-2022, 2022;Constitución asamblea|Estatutos|Fuero dirigentes|Representación colectiva
Contrato Colectivo;Derecho Laboral;Derecho Colectivo;Acuerdo entre empleador y sindicato sobre condiciones laborales por tiempo determinado.;Empleador y sindicato firman contrato colectivo estipulando bono productividad y jornada reducida para 2 años.;Art. 303 Código del Trabajo;Ley 20.940;Corte Suprema, Rol 217.399-2023, 2023;Obligatorio partes|Registro obligatorio|Incumplimiento sancionado|Extensión beneficios
Instrumento Colectivo;Derecho Laboral;Derecho Colectivo;Acuerdo general entre partes que establece normas laborales, incluyendo o no sindicato.;Grupo negociador acuerda con empleador pacto sobre turnos especiales, incorporado como instrumento colectivo.;Art. 303 Código del Trabajo;Ley 20.940;Corte de Apelaciones de Santiago, Rol 2140338400-0, 2023;Convención celebrada|Condiciones comunes|Duración determinada|Mediación posible
Fuero Sindical;Derecho Laboral;Derecho Colectivo;Protección legal que impide despido de dirigentes sindicales sin autorización judicial para evitar represalias.;Dirigente sindical es despedido sin desafuero; tribunal ordena reincorporación y pago de remuneraciones.;Art. 243 Código del Trabajo;Ley 19.069;Corte Suprema, Rol 238.177-2023, 2023;Protección contra despido|Autorización judicial|Dirigentes sindicales|Libertad sindical
Prácticas Antisindicales;Derecho Laboral;Derecho Colectivo;Acciones del empleador que atentan contra la libertad sindical, como obstaculizar formación de sindicatos.;Empleador amenaza con despidos a trabajadores que intentan formar sindicato, resultando en multa.;Art. 289 Código del Trabajo;Ley 20.940;Corte Suprema, Rol 17.829-2024, 2024;Atentado libertad sindical|Sanciones multas|Prohibición represalias|Buena fe negociaciones
Servicios Mínimos;Derecho Laboral;Derecho Colectivo;Servicios esenciales durante huelga para proteger bienes, salud pública y prevenir daños ambientales.;En huelga hospitalaria, sindicato provee equipo mínimo para emergencias, evitando paralización total.;Art. 359 Código del Trabajo;Ley 20.940;Corte Suprema, Año 2022;Obligación sindical|Equipo emergencia|Remuneración tiempo trabajado|Prevención daños
Reemplazo en Huelga;Derecho Laboral;Derecho Colectivo;Prohibición de contratar o reasignar trabajadores para sustituir a huelguistas durante el cese.;Empresa contrata temporales durante huelga, incurriendo en práctica antisindical con multa.;Art. 381 Código del Trabajo;Ley 20.940;Corte Suprema, Rol 117731, 2024;Prohibición reemplazo|Libertad huelga|Multas empleador|Excepciones limitadas
Extensión de Beneficios;Derecho Laboral;Derecho Colectivo;Acuerdo para extender estipulaciones de instrumento colectivo a trabajadores no sindicalizados, con pago de cuota.;Sindicato acuerda extender bono productividad a no afiliados, quienes pagan cuota sindical.;Art. 322 Código del Trabajo;Ley 20.940;Corte Suprema, Rol 124723, 2023;Acuerdo expreso|Pago cuota sindical|Criterios objetivos|No unilateral

Contrato Individual de Trabajo;Derecho Laboral;Derecho Individual del Trabajo;Convención por la cual el empleador y el trabajador se obligan recíprocamente, este a prestar servicios personales bajo dependencia y subordinación del primero, y aquel a pagar una remuneración determinada.;Un programador suscribe contrato con empresa de software para desarrollar aplicaciones bajo supervisión gerencial, recibiendo salario fijo mensual.;Art. 7 Código del Trabajo;Corte Suprema, Rol 466-2021, 2022;Convención bilateral|Dependencia y subordinación|Prestación personal|Remuneración determinada
Terminación del Contrato de Trabajo;Derecho Laboral;Derecho Individual del Trabajo;Cese de la relación laboral por causales legales como mutuo consentimiento, despido justificado o injustificado, con procedimientos y derechos asociados.;Empleador despide a trabajador por necesidades de la empresa, pero tribunal declara injustificado, ordenando pago de indemnizaciones.;Arts. 159-178 Código del Trabajo;Tribunal Constitucional, Rol 11228-21, 2022;Causales legales|Procedimientos formales|Indemnizaciones aplicables|Protección trabajador
Indemnización por Años de Servicio;Derecho Laboral;Derecho Individual del Trabajo;Pago equivalente a 30 días de remuneración por cada año trabajado y fracción superior a 6 meses, en caso de despido por causales del artículo 161.;Trabajador con 10 años es despedido por necesidades de empresa; tribunal declara injustificado y condena a pago de indemnización legal.;Art. 163 Código del Trabajo;Corte Suprema, Rol 11.464-2024, 2025;Base remuneración|Tope 330 días|Convencional superior|Recargo aplicable
Finiquito;Derecho Laboral;Derecho Individual del Trabajo;Documento que liquida obligaciones al término del contrato, detallando pagos por remuneraciones pendientes, feriados e indemnizaciones.;Al finalizar contrato, empleador presenta finiquito con pago de indemnización, pero trabajador impugna por omisión de horas extras.;Arts. 177-178 Código del Trabajo;Corte Suprema, Rol 38146-2024, 2024;Ministro de fe|Ratificación sindical|Alcance liberatorio limitado|Cláusulas expresas
Nulidad del Despido;Derecho Laboral;Derecho Individual del Trabajo;Sanción por no pago de cotizaciones previsionales que declara ineficaz el despido, extendiendo el contrato hasta regularización.;Despido sin cotizaciones pagadas; tribunal declara nulidad, obligando a empleador a pagar remuneraciones hasta subsanación.;Art. 162 Código del Trabajo;Corte Suprema, Rol 16092-2024, 2024;Cotizaciones pendientes|Extensión contrato|Responsabilidad principal|Subcontratación solidaria
Renuncia del Trabajador;Derecho Laboral;Derecho Individual del Trabajo;Manifestación voluntaria del trabajador para terminar el contrato, requiriendo formalidades como ratificación ante ministro de fe.;Trabajador presenta renuncia sin ratificación; empleador no puede invocarla, tribunal declara vigencia del contrato.;Art. 159 Nº2 Código del Trabajo;Corte Suprema, Rol 17959-2024, 2024;Formalidades obligatorias|Ratificación ministerial|Representante sindical|Irrenunciabilidad derechos
Recargo Legal en Despido;Derecho Laboral;Derecho Individual del Trabajo;Aumento porcentual sobre indemnización por años de servicio cuando despido es declarado injustificado, variando por causal.;Despido por necesidades declarado improcedente; tribunal aplica recargo del 30% sobre indemnización legal.;Art. 168 Código del Trabajo;Corte Suprema, Rol 14241-2025, 2025;Porcentajes variables|Causal específica|Base convencional o legal|Convenio colectivo
Descuento al Seguro de Cesantía;Derecho Laboral;Derecho Individual del Trabajo;Imputación del aporte empleador al seguro de cesantía a la indemnización, solo procedente si despido es justificado.;Despido injustificado; tribunal prohíbe descuento del 2,4% aportado al seguro de cesantía de la indemnización.;Art. 13 Ley 19.728;Corte Suprema, Rol 92.645-2021, 2021;Causal justificada|Despido válido|Imputación prohibida|Protección indemnización
Subcontratación;Derecho Laboral;Derecho Individual del Trabajo;Régimen donde empresa principal contrata servicios de terceros, con responsabilidad solidaria por obligaciones laborales y previsionales.;Trabajador de contratista demanda a principal por nulidad despido; tribunal extiende responsabilidad solidaria.;Arts. 183-A a 183-AB Código del Trabajo;Corte Suprema, Rol 16092-2024, 2024;Responsabilidad solidaria|Cotizaciones previsionales|Contrato escrito|Protección trabajador
Irrenunciabilidad de Derechos Laborales;Derecho Laboral;Derecho Individual del Trabajo;Imposibilidad de renunciar a derechos laborales mientras subsista el contrato de trabajo, protegiendo al trabajador.;Trabajador acuerda renuncia a feriado; tribunal declara nulo por irrenunciabilidad, ordenando pago.;Art. 5 Código del Trabajo;No se encontró jurisprudencia verificable para este concepto;Derechos mínimos|Subsistencia contrato|Principio protector|Nulidad renuncia

Matrimonio Civil;Derecho de Familia;Matrimonio y Uniones;Unión solemne entre dos personas mayores de 18 años, capaces, que consienten libre y espontáneamente, celebrada ante oficial del Registro Civil.;Pareja heterosexual o del mismo sexo contrae matrimonio ante oficial, adquiriendo estado civil de casados y derechos mutuos.;Art. 1 Ley 19.947;Ley 21.400;Corte Suprema, Rol 8851-20, 2021;Capacidad contrayentes|Consentimiento libre|Celebración oficial|Igualdad condiciones
Divorcio;Derecho de Familia;Matrimonio y Uniones;Disolución del vínculo matrimonial por sentencia judicial, tras cese de convivencia o causales específicas, regulando efectos en bienes y hijos.;Cónyuges separados de hecho por más de un año solicitan divorcio, tribunal declara disolución y liquida sociedad conyugal.;Arts. 54-55 Ley 19.947;Corte Suprema, Rol 12080-21, 2021;Cese convivencia|Causales culpa|Compensación económica|Liquidación bienes
Acuerdo de Unión Civil;Derecho de Familia;Matrimonio y Uniones;Contrato entre dos personas que comparten hogar, regulando efectos jurídicos de su convivencia afectiva de pareja.;Dos personas del mismo o distinto sexo celebran AUC ante oficial, adquiriendo estado civil y derechos patrimoniales.;Art. 1 Ley 20.830;Corte Suprema, Rol 5962-19, 2019;Convivencia afectiva|Efectos patrimoniales|Terminación causas|No filiación
Filiación;Derecho de Familia;Filiación y Patria Potestad;Vínculo jurídico entre padres e hijos, determinado por naturaleza, técnicas de reproducción asistida o adopción, generando derechos y deberes.;Madre reconoce hijo no matrimonial en inscripción de nacimiento, estableciendo filiación y patria potestad.;Arts. 179-203 Código Civil;Ley 19.585;Corte Suprema, Rol 11969-21, 2022;Filiación matrimonial|No matrimonial|Investigación paternidad|Presunciones legales
Adopción;Derecho de Familia;Filiación y Patria Potestad;Institución que crea vínculo de filiación entre adoptantes y adoptado, extinguiendo lazos biológicos salvo impedimentos matrimoniales.;Pareja idónea adopta menor declarado adoptable, tras evaluación y sentencia judicial, integrándolo a su familia.;Ley 21.760;Tribunal Constitucional, Rol 7059-2012, 2014;Interés superior niño|Idoneidad adoptantes|Procedimiento judicial|Irrevocabilidad
Patria Potestad;Derecho de Familia;Filiación y Patria Potestad;Conjunto de derechos y deberes de padres sobre persona y bienes de hijos no emancipados, incluyendo cuidado y representación.;Padres ejercen conjuntamente patria potestad sobre hijo menor, decidiendo educación y administración de bienes.;Art. 243 Código Civil;Corte Suprema, Rol 16604-2018, 2019;Cuidado personal|Administration bienes|Representación judicial|Suspensión causales
Obligación de Alimentos;Derecho de Familia;Alimentos y Pensiones;Deber de proveer sustento, habitación, vestuario, educación y salud a descendientes, cónyuge o familiares en necesidad.;Padre debe alimentos a hijo menor, cubriendo necesidades básicas proporcional a sus facultades económicas.;Arts. 321-337 Código Civil;Ley 14.908;Corte Suprema, Rol 12080-21, 2021;Necesidad alimentario|Facultades alimentante|Proporcionalidad|Ejecución apremios
Pensión de Alimentos;Derecho de Familia;Alimentos y Pensiones;Pago periódico fijado judicialmente para cubrir necesidades de alimentarios, con reajuste y mecanismos de cobro efectivo.;Tribunal fija pensión mensual para hijos, ordenando retención de sueldo al padre deudor.;Ley 14.908;Ley 21.389;Corte de Apelaciones de La Serena, Año 2023;Monto mínimo|Reajustabilidad|Registro deudores|Apremiios judiciales
Registro Nacional de Deudores de Pensiones de Alimentos;Derecho de Familia;Alimentos y Pensiones;Base de datos pública de personas con deudas alimenticias impagas, aplicando sanciones y restricciones.;Deudor inscrito en registro no puede renovar licencia de conducir hasta pagar deuda alimenticia.;Ley 21.389;Corte Suprema, Rol 33-2016, 2017;Inscripción automática|Sanciones financieras|Pago efectivo|Protección alimentarios
Tutela;Derecho de Familia;Protección de Menores e Incapacitados;Guardia legal sobre menores impúberes no emancipados, sin patria potestad, para su cuidado y representación.;Abuela designada tutora de nieto huérfano, ejerciendo derechos y deberes sobre su persona y bienes.;Arts. 341-493 Código Civil;Corte Suprema, Rol 8452-20, 2020;Nombramiento judicial|Curador bienes|Responsabilidades tutor|Extinción causas
Curatela;Derecho de Familia;Protección de Menores e Incapacitados;Guardia sobre menores púberes, dementes, disipadores o patrimonios, limitando capacidad de actuar.;Tribunal nombra curador a familiar de persona con discapacidad mental, administrando sus bienes.;Arts. 494-577 Código Civil;Tribunal Constitucional, Rol 2703, Año no especificado;Clases curadurías|Discernimiento cargo|Ejercicio funciones|Remoción curador
Guardas;Derecho de Familia;Protección de Menores e Incapacitados;Medidas de protección para personas vulnerables sin capacidad, incluyendo tutela y curatela para menores o incapacitados.;Juez otorga guarda a institución para menor abandonado, asegurando su cuidado y derechos.;Ley 19.968;Corte Suprema, Rol 7059-2012, 2014;Protección integral|Interés superior|Nombramiento guardador|Supervisión judicial
"""

lines = [l.strip() for l in raw_data.split('\n') if l.strip()]

def sql_escape(text):
    if not text: return ""
    return text.replace("'", "''")

dcom_count = 0
dlab_count = 0
dfam_count = 0

sql_statements = []

for line in lines:
    parts = [p.strip() for p in line.split(';')]
    if len(parts) < 8:
        print(f"Skipping line (too few fields): {line}")
        continue
    
    concept = parts[0]
    category = parts[1]
    subcategory = parts[2]
    definition = parts[3]
    example = parts[4]
    
    # Handle variable field counts (8 or 9)
    if len(parts) == 8:
        # Standard: concept;cat;sub;def;ex;reg;juris;keypoints
        regulation = parts[5]
        jurisprudence = parts[6]
        key_points_raw = parts[7]
    elif len(parts) == 9:
        # Extra field: concept;cat;sub;def;ex;reg1;reg2;juris;keypoints
        regulation = f"{parts[5]}; {parts[6]}"
        jurisprudence = parts[7]
        key_points_raw = parts[8]
    else:
        # If even more fields, merge everything into regulation except last two
        regulation = "; ".join(parts[5:-2])
        jurisprudence = parts[-2]
        key_points_raw = parts[-1]

    # Generate ID based on category
    if category == 'Derecho Comercial':
        dcom_count += 1
        cid = f'DCOM-{dcom_count:03d}'
    elif category == 'Derecho Laboral':
        dlab_count += 1
        cid = f'DLAB-{dlab_count:03d}'
    elif category == 'Derecho de Familia':
        dfam_count += 1
        cid = f'DFAM-{dfam_count:03d}'
    else:
        cid = f'MISC-{hash(line) % 1000:03d}'

    # Parse key points
    key_points = [kp.strip() for kp in key_points_raw.split('|') if kp.strip()]
    key_points_json = json.dumps(key_points, ensure_ascii=False)

    sql = f"('{cid}', '{sql_escape(concept)}', '{sql_escape(category)}', '{sql_escape(subcategory)}', '{sql_escape(definition)}', " \
          f"'{sql_escape(example)}', '{sql_escape(regulation)}', '{sql_escape(jurisprudence)}', '', '{sql_escape(key_points_json)}')"
    sql_statements.append(sql)

output_sql = "INSERT INTO legal_concepts (id, concept, category, subcategory, definition_simple, real_example, regulation, jurisprudence, video_url, key_points) VALUES\n"
output_sql += ",\n".join(sql_statements) + ";"

with open('C:/Users/carlo/OneDrive/Escritorio/iuris/insert_multi_batch.sql', 'w', encoding='utf-8') as f:
    f.write(output_sql)

print(f"Generated SQL for {len(sql_statements)} concepts.")
print(f"Comercial: {dcom_count}, Laboral: {dlab_count}, Familia: {dfam_count}")
