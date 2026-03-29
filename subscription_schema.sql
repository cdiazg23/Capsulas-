-- 1. Crear tabla de Planes
CREATE TABLE IF NOT EXISTS public.plans (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    interval TEXT NOT NULL, -- 'quarterly', 'semiannual', 'annual'
    price_clp INTEGER NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insertar planes iniciales
INSERT INTO public.plans (id, name, interval, price_clp) VALUES
('plan_trimestral', 'Plan Trimestral', 'quarterly', 24900),
('plan_semestral', 'Plan Semestral', 'semiannual', 49900),
('plan_anual', 'Plan Anual', 'annual', 90000)
ON CONFLICT (id) DO NOTHING;

-- 2. Añadir columnas a Profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'trialing' CHECK (subscription_status IN ('trialing', 'active', 'expired', 'canceled')),
ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMP WITH TIME ZONE DEFAULT (timezone('utc'::text, now()) + interval '3 days'),
ADD COLUMN IF NOT EXISTS current_period_end TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS plan_id TEXT REFERENCES public.plans(id);

-- 3. Crear tabla de Subscripciones (Historial/Detalle)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id TEXT REFERENCES public.plans(id),
    status TEXT NOT NULL,
    trial_ends_at TIMESTAMP WITH TIME ZONE,
    current_period_start TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    current_period_end TIMESTAMP WITH TIME ZONE,
    payment_provider TEXT, -- 'mercado_pago', 'webpay'
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Crear tabla de Pagos
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subscription_id UUID REFERENCES public.subscriptions(id),
    user_id UUID REFERENCES auth.users(id),
    provider TEXT NOT NULL,
    provider_reference TEXT,
    amount_clp INTEGER NOT NULL,
    status TEXT NOT NULL, -- 'paid', 'pending', 'failed'
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Migración de datos solicitada
-- Ascender Socios Fundadores a Admin
UPDATE public.profiles 
SET role = 'admin' 
WHERE role = 'founder';

-- Asegurar que todos los usuarios actuales tengan 3 días de trial desde hoy
UPDATE public.profiles 
SET 
  subscription_status = 'trialing',
  trial_ends_at = (timezone('utc'::text, now()) + interval '3 days')
WHERE role = 'user' AND subscription_status IS NULL;

-- 6. Habilitar RLS para las nuevas tablas
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public plans are viewable by everyone" ON public.plans FOR SELECT USING (true);
CREATE POLICY "Users can view their own subscriptions" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own payments" ON public.payments FOR SELECT USING (auth.uid() = user_id);
