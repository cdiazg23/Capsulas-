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
                            Última actualización: Marzo de 2026
                        </p>

                        <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                            <section>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-wider mb-4">Información General</h2>
                                <p>
                                    El presente sitio web <a href="https://www.iurisacademy.cl" className="text-primary font-bold hover:underline">www.iurisacademy.cl</a> (en adelante, "la Plataforma") es operado por Cápsulas de Derecho (en adelante, "IurisAcademy", "nosotros" o "nuestro"). IurisAcademy es una plataforma SaaS educacional destinada a estudiantes de Derecho y profesionales jurídicos en Chile.
                                </p>
                                <p>
                                    Al visitar, registrarse o contratar cualquier plan de la Plataforma, el usuario acepta íntegramente los presentes Términos y Condiciones ("T&C").
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-wider mb-4">1. Aceptación de los Términos</h2>
                                <p>Estos T&C constituyen un acuerdo legalmente vinculante. Al acceder o utilizar la Plataforma, usted declara tener plena capacidad legal para contratar servicios digitales bajo la normativa chilena.</p>
                            </section>

                            <section>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-wider mb-4">2. Registro y Cuentas</h2>
                                <p>El acceso es personal e intransferible. Queda prohibido compartir credenciales. La detección de accesos simultáneos anómalos facultará la suspensión de la cuenta sin derecho a reembolso.</p>
                            </section>

                            <section>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-wider mb-4">3. Descripción de los Servicios Premium</h2>
                                <p>IurisAcademy ofrece planes de suscripción que incluyen:</p>
                                <ul className="list-disc pl-6 space-y-4">
                                    <li><strong>Glosario Jurídico Ilimitado:</strong> Acceso total a la base de datos de conceptos con ejemplos y normativa.</li>
                                    <li><strong>Jurisprudencia Revisada:</strong> Informes de análisis de fallos recientes de tribunales superiores.</li>
                                    <li><strong>Quizzes Dinámicos:</strong> Herramientas de autoevaluación avanzada.</li>
                                    <li><strong>Comunidad Pro:</strong> Espacio de interacción y consultas entre usuarios activos.</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-wider mb-4">4. Suscripciones y Facturación</h2>
                                <p>La Plataforma opera bajo un modelo de suscripción prepagada con tres modalidades:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li><strong>Plan Trimestral:</strong> Acceso por 3 meses (24.900 CLP).</li>
                                    <li><strong>Plan Semestral:</strong> Acceso por 6 meses (49.900 CLP).</li>
                                    <li><strong>Plan Anual:</strong> Acceso por 12 meses (90.000 CLP).</li>
                                </ul>
                                <p className="mt-4">
                                    <strong>Prueba Gratuita:</strong> Los nuevos usuarios acceden a una prueba gratuita de 3 días con acceso total. Tras finalizar, el acceso será restringido hasta la contratación de un plan pagado.
                                </p>
                                <p>
                                    Los pagos se procesan a través de pasarelas externas seguras. IurisAcademy no almacena información de tarjetas de crédito o débito.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-wider mb-4">5. Propiedad Intelectual</h2>
                                <p>
                                    Todo el contenido es propiedad intelectual protegida. El scraping o extracción masiva de datos está estrictamente prohibido y será perseguido legalmente bajo la Ley N° 17.336.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-wider mb-4">6. Limitación de Responsabilidad</h2>
                                <p>
                                    El contenido es pedagógico y no constituye asesoría legal ni garantiza aprobación en exámenes de grado o similares.
                                </p>
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
