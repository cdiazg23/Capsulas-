import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const Terms: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 selection:bg-primary/10 selection:text-primary">
            <Helmet>
                <title>Términos y Condiciones | IurisAcademy</title>
                <meta name="description" content="Términos y condiciones de uso de la plataforma IurisAcademy." />
            </Helmet>

            {/* Header */}
            <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-4">
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <div
                        className="flex items-center gap-2 cursor-pointer group"
                        onClick={() => navigate('/')}
                    >
                        <div className="bg-primary text-white size-8 rounded-lg flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform">
                            <span className="material-symbols-outlined text-xl">balance</span>
                        </div>
                        <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white">
                            Iuris<span className="text-primary">Academy</span>
                        </span>
                    </div>
                    <button
                        onClick={() => navigate(-1)}
                        className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-primary transition-colors flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                        Volver
                    </button>
                </div>
            </header>

            <main className="pt-32 pb-24">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 md:p-16 shadow-xl shadow-slate-200/50 dark:shadow-none">
                        <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 leading-tight">
                            Términos y Condiciones de Uso
                        </h1>
                        <p className="text-primary font-bold uppercase tracking-widest text-sm mb-12 flex items-center gap-2">
                            <span className="size-2 bg-primary rounded-full"></span>
                            Última actualización: Febrero de 2026
                        </p>

                        <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                            <section>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-wider mb-4">Información General</h2>
                                <p>
                                    El presente sitio web <a href="https://www.iurisacademy.cl" className="text-primary font-bold hover:underline">www.iurisacademy.cl</a> (en adelante, "la Plataforma") es operado por Cápsulas de Derecho (en adelante, "IurisAcademy", "nosotros" o "nuestro"). IurisAcademy es una plataforma educacional independiente destinada a estudiantes de Derecho, egresados y todo aquel interesado en reforzar sus conocimientos jurídicos en el sistema chileno.
                                </p>
                                <p>
                                    Al visitar, registrarse o utilizar cualquier servicio de la Plataforma, el usuario ("usted", "tú") acepta íntegramente los presentes Términos y Condiciones ("T&C"). Si no está de acuerdo con alguno de estos términos, le pedimos que no utilice la Plataforma.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-wider mb-4">1. Aceptación de los Términos</h2>
                                <p>Estos T&C constituyen un acuerdo legalmente vinculante entre usted e IurisAcademy. Al acceder o utilizar la Plataforma, usted declara:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Tener al menos 18 años de edad, o contar con la autorización de su representante legal si es menor de edad;</li>
                                    <li>Poseer la capacidad legal para aceptar este acuerdo;</li>
                                    <li>Haber leído y comprendido los presentes T&C en su totalidad.</li>
                                </ul>
                                <p>
                                    Cualquier nueva funcionalidad, herramienta o servicio que se agregue a la Plataforma quedará también sujeto a estos T&C. IurisAcademy se reserva el derecho de actualizar estos términos en cualquier momento, publicando la versión actualizada en esta misma página. El uso continuado de la Plataforma tras la publicación de cambios implica su aceptación.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-wider mb-4">2. Registro y Cuentas de Usuario</h2>
                                <p>Para acceder a los servicios de la Plataforma, usted deberá crear una cuenta personal. Al registrarse, usted se compromete a:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Proporcionar información verídica, completa y actualizada;</li>
                                    <li>Mantener la confidencialidad de su contraseña y datos de acceso;</li>
                                    <li>Notificar a IurisAcademy de inmediato ante cualquier uso no autorizado de su cuenta;</li>
                                    <li>Ser el único responsable de toda actividad realizada desde su cuenta.</li>
                                </ul>
                                <p>
                                    Queda estrictamente prohibido compartir su cuenta con terceros. La cuenta es de uso personal e intransferible. La detección de uso compartido o de múltiples accesos simultáneos desde distintos dispositivos o ubicaciones facultará a IurisAcademy para suspender o cancelar el acceso de manera inmediata y sin previo aviso.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-wider mb-4">3. Descripción de los Servicios</h2>
                                <p>IurisAcademy ofrece los siguientes servicios a través de la Plataforma:</p>
                                <ul className="list-disc pl-6 space-y-4">
                                    <li><strong>Glosario Jurídico Gratuito:</strong> Acceso a más de 1.000 conceptos jurídicos organizados por rama del Derecho, con definiciones, ejemplos prácticos y normativa chilena.</li>
                                    <li><strong>Flashcards de Estudio:</strong> Sistema de tarjetas interactivas para memorización de conceptos legales.</li>
                                    <li><strong>Gamificación:</strong> Sistema de niveles, XP, puntos de prestigio y rachas de estudio.</li>
                                    <li><strong>Aula Iuris:</strong> Clases en formato video (masterclasses) para usuarios Fundadores.</li>
                                </ul>
                                <p>
                                    Los servicios están disponibles exclusivamente en línea. No se permite la descarga, grabación ni reproducción de contenidos en ningún formato ajeno a la Plataforma.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-wider mb-4">4. Plan Fundador y Donaciones</h2>
                                <p>IurisAcademy opera como un proyecto educativo independiente financiado voluntariamente por su comunidad a través de Ko-fi. Las donaciones:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>No constituyen una compraventa ni contrato de suscripción bajo el Código Civil;</li>
                                    <li>Son contribuciones voluntarias para cubrir costos operativos;</li>
                                    <li>No generan derecho a reembolso.</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-wider mb-4">5. Propiedad Intelectual</h2>
                                <p>
                                    Todo el contenido disponible en la Plataforma es de propiedad de IurisAcademy / Cápsulas de Derecho. Queda estrictamente prohibido reproducir, copiar, vender o extraer masivamente datos (scraping) de la Plataforma.
                                </p>
                                <p>
                                    El uso del contenido se otorga como licencia personal, no exclusiva, intransferible y revocable, exclusivamente para fines de estudio individual. Cualquier infracción facultará a IurisAcademy para ejercer las acciones legales correspondientes bajo la Ley N° 17.336.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-wider mb-4">6. Conducta del Usuario</h2>
                                <p>Queda prohibido utilizar la Plataforma para fines ilícitos, transmitir malware, intentar accesos no autorizados o manipular el sistema de gamificación.</p>
                            </section>

                            <section>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-wider mb-4">7. Limitación Pedagógica</h2>
                                <p>
                                    <strong>IMPORTANTE:</strong> El contenido tiene finalidad exclusivamente educativa. No constituye asesoría jurídica ni reemplaza la consulta a un abogado habilitado. IurisAcademy no garantiza éxito en exámenes o evaluaciones.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-wider mb-4">10. Protección de Datos</h2>
                                <p>
                                    El tratamiento de datos personales se rige por la Ley N° 19.628. Al registrarse, usted consiente el uso de sus datos para los fines del servicio educativo prestado.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-wider mb-4">15. Legislación y Jurisdicción</h2>
                                <p>
                                    Los presentes T&C se rigen por las leyes de la República de Chile. Cualquier controversia será sometida a los tribunales ordinarios de la ciudad de Santiago de Chile.
                                </p>
                            </section>

                            <section id="contacto" className="pt-8 border-t border-slate-100 dark:border-slate-800">
                                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-wider mb-4">Contacto</h2>
                                <p>Para consultas respecto a estos términos:</p>
                                <ul className="list-none space-y-2 font-bold text-slate-900 dark:text-white">
                                    <li className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">mail</span>
                                        contacto@iurisacademy.cl
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">brand_awareness</span>
                                        @capsulasdederecho (TikTok)
                                    </li>
                                </ul>
                            </section>
                        </div>

                        <div className="mt-16 text-center border-t border-slate-100 dark:border-slate-800 pt-8">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em]">
                                © 2026 Cápsulas de Derecho / IurisAcademy
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer Minimalista */}
            <footer className="py-12 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-sm text-slate-500 mb-4">IurisAcademy - Educación Legal Chile</p>
                    <button
                        onClick={() => navigate('/')}
                        className="text-primary font-bold text-sm hover:underline"
                    >
                        Volver al Inicio
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default Terms;
