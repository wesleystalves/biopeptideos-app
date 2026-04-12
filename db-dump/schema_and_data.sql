-- =============================================
-- PEPTIDEOS HEALTH - PostgreSQL Schema
-- Gerado automaticamente do bundle JS original
-- =============================================

-- Extensões
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- TABELA: peptides (conteúdo dos peptídeos)
-- =============================================
CREATE TABLE IF NOT EXISTS peptides (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(200) NOT NULL,
    category    VARCHAR(100),
    description TEXT,
    mechanism   TEXT,
    benefits    TEXT[],
    variants    TEXT[],
    stability   VARCHAR(100),
    half_life   VARCHAR(100),
    reconstitution TEXT,
    storage     VARCHAR(200),
    is_free     BOOLEAN DEFAULT FALSE,
    image_path  VARCHAR(300),
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================  
-- TABELA: profiles (usuários)
-- =============================================
CREATE TABLE IF NOT EXISTS profiles (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email       VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(200),
    phone       VARCHAR(50),
    profile_type VARCHAR(50) DEFAULT 'user',
    avatar_url  VARCHAR(500),
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABELA: subscriptions (assinaturas)
-- =============================================
CREATE TABLE IF NOT EXISTS subscriptions (
    id          SERIAL PRIMARY KEY,
    user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE,
    plan        VARCHAR(50) DEFAULT 'free',  -- free, mensal, anual, vitalicio
    status      VARCHAR(50) DEFAULT 'active', -- active, cancelled, expired
    activated_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at  TIMESTAMPTZ,
    payment_provider VARCHAR(50), -- kiwify, stripe, etc
    external_id VARCHAR(200),
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABELA: user_roles (papéis de acesso)
-- =============================================
CREATE TABLE IF NOT EXISTS user_roles (
    id          SERIAL PRIMARY KEY,
    user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE,
    role        VARCHAR(50) NOT NULL, -- admin, clinica, medico, user
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABELA: protocols (protocolos)
-- =============================================
CREATE TABLE IF NOT EXISTS protocols (
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(300) NOT NULL,
    description TEXT,
    peptides    INTEGER[],  -- IDs dos peptídeos
    category    VARCHAR(100),
    duration    VARCHAR(100),
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABELA: marketing_leads (leads de marketing)
-- =============================================
CREATE TABLE IF NOT EXISTS marketing_leads (
    id          SERIAL PRIMARY KEY,
    email       VARCHAR(255) NOT NULL,
    name        VARCHAR(200),
    phone       VARCHAR(50),
    source      VARCHAR(100),
    status      VARCHAR(50) DEFAULT 'new',
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ÍNDICES
-- =============================================
CREATE INDEX IF NOT EXISTS idx_peptides_category ON peptides(category);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_user_roles_user ON user_roles(user_id);

-- =============================================
-- DADOS: Peptídeos
-- =============================================
INSERT INTO peptides (id, name, category, description, mechanism, benefits, variants, stability, half_life, reconstitution, storage, is_free, image_path)
VALUES (1, '5-Amino-1MQ', 'Metabolismo', '', '', ARRAY[]::text[], ARRAY[]::text[], '', '', '', '', FALSE, '/assets/peptide-1-*.jpg')
ON CONFLICT (id) DO NOTHING;
INSERT INTO peptides (id, name, category, description, mechanism, benefits, variants, stability, half_life, reconstitution, storage, is_free, image_path)
VALUES (2, 'Adamax', 'Nootrópicos', '', '', ARRAY[]::text[], ARRAY[]::text[], '', '', '', '', FALSE, '/assets/peptide-2-*.jpg')
ON CONFLICT (id) DO NOTHING;
INSERT INTO peptides (id, name, category, description, mechanism, benefits, variants, stability, half_life, reconstitution, storage, is_free, image_path)
VALUES (3, 'AICAR', 'Performance', '', '', ARRAY[]::text[], ARRAY[]::text[], '', '', '', '', FALSE, '/assets/peptide-3-*.jpg')
ON CONFLICT (id) DO NOTHING;
INSERT INTO peptides (id, name, category, description, mechanism, benefits, variants, stability, half_life, reconstitution, storage, is_free, image_path)
VALUES (4, 'AOD-9604', 'Emagrecimento', '', '', ARRAY[]::text[], ARRAY[]::text[], '', '', '', '', FALSE, '/assets/peptide-4-*.jpg')
ON CONFLICT (id) DO NOTHING;
INSERT INTO peptides (id, name, category, description, mechanism, benefits, variants, stability, half_life, reconstitution, storage, is_free, image_path)
VALUES (5, 'Ara-290', 'Neuroproteção', '', '', ARRAY[]::text[], ARRAY[]::text[], '', '', '', '', FALSE, '/assets/peptide-5-*.jpg')
ON CONFLICT (id) DO NOTHING;
INSERT INTO peptides (id, name, category, description, mechanism, benefits, variants, stability, half_life, reconstitution, storage, is_free, image_path)
VALUES (6, 'BPC-157', 'Recuperação', '', '', ARRAY[]::text[], ARRAY[]::text[], '', '', '', '', FALSE, '/assets/peptide-6-*.jpg')
ON CONFLICT (id) DO NOTHING;
INSERT INTO peptides (id, name, category, description, mechanism, benefits, variants, stability, half_life, reconstitution, storage, is_free, image_path)
VALUES (7, 'BPC-157 para Neuroproteção', 'Nootrópicos', '', '', ARRAY[]::text[], ARRAY[]::text[], '', '', '', '', FALSE, '/assets/peptide-7-*.jpg')
ON CONFLICT (id) DO NOTHING;
INSERT INTO peptides (id, name, category, description, mechanism, benefits, variants, stability, half_life, reconstitution, storage, is_free, image_path)
VALUES (8, 'Cagrilintide', 'Emagrecimento', '', '', ARRAY[]::text[], ARRAY[]::text[], '', '', '', '', FALSE, '/assets/peptide-8-*.jpg')
ON CONFLICT (id) DO NOTHING;
INSERT INTO peptides (id, name, category, description, mechanism, benefits, variants, stability, half_life, reconstitution, storage, is_free, image_path)
VALUES (9, 'Cardiogen', 'Cardiovascular', '', '', ARRAY[]::text[], ARRAY[]::text[], '', '', '', '', FALSE, '/assets/peptide-9-*.jpg')
ON CONFLICT (id) DO NOTHING;
INSERT INTO peptides (id, name, category, description, mechanism, benefits, variants, stability, half_life, reconstitution, storage, is_free, image_path)
VALUES (10, 'Cartalax', 'Anti-aging', '', '', ARRAY[]::text[], ARRAY[]::text[], '', '', '', '', FALSE, '/assets/peptide-10-*.jpg')
ON CONFLICT (id) DO NOTHING;
INSERT INTO peptides (id, name, category, description, mechanism, benefits, variants, stability, half_life, reconstitution, storage, is_free, image_path)
VALUES (11, 'Cerebrolysin - Neurotrófico Peptídico', 'Nootrópicos', '', '', ARRAY[]::text[], ARRAY[]::text[], '', '', '', '', FALSE, '/assets/peptide-11-*.jpg')
ON CONFLICT (id) DO NOTHING;
INSERT INTO peptides (id, name, category, description, mechanism, benefits, variants, stability, half_life, reconstitution, storage, is_free, image_path)
VALUES (12, 'Cerebrolysin', 'Nootrópicos', '', '', ARRAY[]::text[], ARRAY[]::text[], '', '', '', '', FALSE, '/assets/peptide-12-*.jpg')
ON CONFLICT (id) DO NOTHING;
INSERT INTO peptides (id, name, category, description, mechanism, benefits, variants, stability, half_life, reconstitution, storage, is_free, image_path)
VALUES (13, 'Chonluten', 'Biorregulador', '', '', ARRAY[]::text[], ARRAY[]::text[], '', '', '', '', FALSE, '/assets/peptide-13-*.jpg')
ON CONFLICT (id) DO NOTHING;
INSERT INTO peptides (id, name, category, description, mechanism, benefits, variants, stability, half_life, reconstitution, storage, is_free, image_path)
VALUES (14, 'CJC-1295 DAC', 'GH / Secretagogos', '', '', ARRAY[]::text[], ARRAY[]::text[], '', '', '', '', FALSE, '/assets/peptide-14-*.jpg')
ON CONFLICT (id) DO NOTHING;
INSERT INTO peptides (id, name, category, description, mechanism, benefits, variants, stability, half_life, reconstitution, storage, is_free, image_path)
VALUES (15, 'CJC-1295 NO DAC', 'GH / Secretagogos', '', '', ARRAY[]::text[], ARRAY[]::text[], '', '', '', '', FALSE, '/assets/peptide-15-*.jpg')
ON CONFLICT (id) DO NOTHING;
INSERT INTO peptides (id, name, category, description, mechanism, benefits, variants, stability, half_life, reconstitution, storage, is_free, image_path)
VALUES (16, 'Cortagen', 'Nootrópicos', '', '', ARRAY[]::text[], ARRAY[]::text[], '', '', '', '', FALSE, '/assets/peptide-16-*.jpg')
ON CONFLICT (id) DO NOTHING;
INSERT INTO peptides (id, name, category, description, mechanism, benefits, variants, stability, half_life, reconstitution, storage, is_free, image_path)
VALUES (17, 'Crystagen', 'Imunidade', '', '', ARRAY[]::text[], ARRAY[]::text[], '', '', '', '', FALSE, '/assets/peptide-17-*.jpg')
ON CONFLICT (id) DO NOTHING;
INSERT INTO peptides (id, name, category, description, mechanism, benefits, variants, stability, half_life, reconstitution, storage, is_free, image_path)
VALUES (18, 'Dihexa - Potenciador Cognitivo', 'Nootrópicos', '', '', ARRAY[]::text[], ARRAY[]::text[], '', '', '', '', FALSE, '/assets/peptide-18-*.jpg')
ON CONFLICT (id) DO NOTHING;
INSERT INTO peptides (id, name, category, description, mechanism, benefits, variants, stability, half_life, reconstitution, storage, is_free, image_path)
VALUES (19, 'DSIP', 'Sono / Recuperação', '', '', ARRAY[]::text[], ARRAY[]::text[], '', '', '', '', FALSE, '/assets/peptide-19-*.jpg')
ON CONFLICT (id) DO NOTHING;
INSERT INTO peptides (id, name, category, description, mechanism, benefits, variants, stability, half_life, reconstitution, storage, is_free, image_path)
VALUES (20, 'Epithalon', 'Anti-aging', '', '', ARRAY[]::text[], ARRAY[]::text[], '', '', '', '', FALSE, '/assets/peptide-20-*.jpg')
ON CONFLICT (id) DO NOTHING;
INSERT INTO peptides (id, name, category, description, mechanism, benefits, variants, stability, half_life, reconstitution, storage, is_free, image_path)
VALUES (21, 'FOXO4-DRI', 'Anti-aging', '', '', ARRAY[]::text[], ARRAY[]::text[], '', '', '', '', FALSE, '/assets/peptide-21-*.jpg')
ON CONFLICT (id) DO NOTHING;
INSERT INTO peptides (id, name, category, description, mechanism, benefits, variants, stability, half_life, reconstitution, storage, is_free, image_path)
VALUES (22, 'GHK-Cu', 'Anti-aging', '', '', ARRAY[]::text[], ARRAY[]::text[], '', '', '', '', FALSE, '/assets/peptide-22-*.jpg')
ON CONFLICT (id) DO NOTHING;
INSERT INTO peptides (id, name, category, description, mechanism, benefits, variants, stability, half_life, reconstitution, storage, is_free, image_path)
VALUES (23, 'GHRP-2', 'GH / Secretagogos', '', '', ARRAY[]::text[], ARRAY[]::text[], '', '', '', '', FALSE, '/assets/peptide-23-*.jpg')
ON CONFLICT (id) DO NOTHING;
INSERT INTO peptides (id, name, category, description, mechanism, benefits, variants, stability, half_life, reconstitution, storage, is_free, image_path)
VALUES (24, 'GHRP-6', 'GH / Secretagogos', '', '', ARRAY[]::text[], ARRAY[]::text[], '', '', '', '', FALSE, '/assets/peptide-24-*.jpg')
ON CONFLICT (id) DO NOTHING;
INSERT INTO peptides (id, name, category, description, mechanism, benefits, variants, stability, half_life, reconstitution, storage, is_free, image_path)
VALUES (25, 'Glutathione', 'Antioxidante', '', '', ARRAY[]::text[], ARRAY[]::text[], '', '', '', '', FALSE, '/assets/peptide-25-*.jpg')
ON CONFLICT (id) DO NOTHING;
INSERT INTO peptides (id, name, category, description, mechanism, benefits, variants, stability, half_life, reconstitution, storage, is_free, image_path)
VALUES (26, 'Gonadorelin', 'Hormonal', '', '', ARRAY[]::text[], ARRAY[]::text[], '', '', '', '', FALSE, '/assets/peptide-26-*.jpg')
ON CONFLICT (id) DO NOTHING;
INSERT INTO peptides (id, name, category, description, mechanism, benefits, variants, stability, half_life, reconstitution, storage, is_free, image_path)
VALUES (27, 'HCG (5000IU Vial)', 'Hormonal', '', '', ARRAY[]::text[], ARRAY[]::text[], '', '', '', '', FALSE, '/assets/peptide-27-*.jpg')
ON CONFLICT (id) DO NOTHING;
INSERT INTO peptides (id, name, category, description, mechanism, benefits, variants, stability, half_life, reconstitution, storage, is_free, image_path)
VALUES (28, 'HGH 191AA (10IU Vial)', 'GH / Secretagogos', '', '', ARRAY[]::text[], ARRAY[]::text[], '', '', '', '', FALSE, '/assets/peptide-28-*.jpg')
ON CONFLICT (id) DO NOTHING;
INSERT INTO peptides (id, name, category, description, mechanism, benefits, variants, stability, half_life, reconstitution, storage, is_free, image_path)
VALUES (29, 'HMG (75IU Vial)', 'Hormonal', '', '', ARRAY[]::text[], ARRAY[]::text[], '', '', '', '', FALSE, '/assets/peptide-29-*.jpg')
ON CONFLICT (id) DO NOTHING;
INSERT INTO peptides (id, name, category, description, mechanism, benefits, variants, stability, half_life, reconstitution, storage, is_free, image_path)
VALUES (30, 'IGF-1 LR3', 'GH / Secretagogos', '', '', ARRAY[]::text[], ARRAY[]::text[], '', '', '', '', FALSE, '/assets/peptide-30-*.jpg')
ON CONFLICT (id) DO NOTHING;
INSERT INTO peptides (id, name, category, description, mechanism, benefits, variants, stability, half_life, reconstitution, storage, is_free, image_path)
VALUES (31, 'Ipamorelin', 'GH / Secretagogos', '', '', ARRAY[]::text[], ARRAY[]::text[], '', '', '', '', FALSE, '/assets/peptide-31-*.jpg')
ON CONFLICT (id) DO NOTHING;
INSERT INTO peptides (id, name, category, description, mechanism, benefits, variants, stability, half_life, reconstitution, storage, is_free, image_path)
VALUES (32, 'Kisspeptin', 'Hormonal', '', '', ARRAY[]::text[], ARRAY[]::text[], '', '', '', '', FALSE, '/assets/peptide-32-*.jpg')
ON CONFLICT (id) DO NOTHING;
INSERT INTO peptides (id, name, category, description, mechanism, benefits, variants, stability, half_life, reconstitution, storage, is_free, image_path)
VALUES (33, 'KLOW', 'Recuperação', '', '', ARRAY[]::text[], ARRAY[]::text[], '', '', '', '', FALSE, '/assets/peptide-33-*.jpg')
ON CONFLICT (id) DO NOTHING;
INSERT INTO peptides (id, name, category, description, mechanism, benefits, variants, stability, half_life, reconstitution, storage, is_free, image_path)
VALUES (34, 'KPV', 'Imunidade', '', '', ARRAY[]::text[], ARRAY[]::text[], '', '', '', '', FALSE, '/assets/peptide-34-*.jpg')
ON CONFLICT (id) DO NOTHING;
INSERT INTO peptides (id, name, category, description, mechanism, benefits, variants, stability, half_life, reconstitution, storage, is_free, image_path)
VALUES (35, 'L-Carnitine', 'Metabolismo', '', '', ARRAY[]::text[], ARRAY[]::text[], '', '', '', '', FALSE, '/assets/peptide-35-*.jpg')
ON CONFLICT (id) DO NOTHING;
INSERT INTO peptides (id, name, category, description, mechanism, benefits, variants, stability, half_life, reconstitution, storage, is_free, image_path)
VALUES (36, 'Livagen', 'Biorregulador', '', '', ARRAY[]::text[], ARRAY[]::text[], '', '', '', '', FALSE, '/assets/peptide-36-*.jpg')
ON CONFLICT (id) DO NOTHING;
INSERT INTO peptides (id, name, category, description, mechanism, benefits, variants, stability, half_life, reconstitution, storage, is_free, image_path)
VALUES (37, 'LL-37', 'Imunidade', '', '', ARRAY[]::text[], ARRAY[]::text[], '', '', '', '', FALSE, '/assets/peptide-37-*.jpg')
ON CONFLICT (id) DO NOTHING;
INSERT INTO peptides (id, name, category, description, mechanism, benefits, variants, stability, half_life, reconstitution, storage, is_free, image_path)
VALUES (38, 'Mazdutide', 'Emagrecimento', '', '', ARRAY[]::text[], ARRAY[]::text[], '', '', '', '', FALSE, '/assets/peptide-38-*.jpg')
ON CONFLICT (id) DO NOTHING;
INSERT INTO peptides (id, name, category, description, mechanism, benefits, variants, stability, half_life, reconstitution, storage, is_free, image_path)
VALUES (39, 'Melanotan II', 'Estética', '', '', ARRAY[]::text[], ARRAY[]::text[], '', '', '', '', FALSE, '/assets/peptide-39-*.jpg')
ON CONFLICT (id) DO NOTHING;
INSERT INTO peptides (id, name, category, description, mechanism, benefits, variants, stability, half_life, reconstitution, storage, is_free, image_path)
VALUES (40, 'MGF', 'Recuperação', '', '', ARRAY[]::text[], ARRAY[]::text[], '', '', '', '', FALSE, '/assets/peptide-40-*.jpg')
ON CONFLICT (id) DO NOTHING;
INSERT INTO peptides (id, name, category, description, mechanism, benefits, variants, stability, half_life, reconstitution, storage, is_free, image_path)
VALUES (41, 'MOTS-C', 'Metabolismo', '', '', ARRAY[]::text[], ARRAY[]::text[], '', '', '', '', FALSE, '/assets/peptide-41-*.jpg')
ON CONFLICT (id) DO NOTHING;
INSERT INTO peptides (id, name, category, description, mechanism, benefits, variants, stability, half_life, reconstitution, storage, is_free, image_path)
VALUES (42, 'NAD+', 'Anti-aging', '', '', ARRAY[]::text[], ARRAY[]::text[], '', '', '', '', FALSE, '/assets/peptide-42-*.jpg')
ON CONFLICT (id) DO NOTHING;
INSERT INTO peptides (id, name, category, description, mechanism, benefits, variants, stability, half_life, reconstitution, storage, is_free, image_path)
VALUES (43, 'Ovagen', 'Biorregulador', '', '', ARRAY[]::text[], ARRAY[]::text[], '', '', '', '', FALSE, '/assets/peptide-43-*.jpg')
ON CONFLICT (id) DO NOTHING;
INSERT INTO peptides (id, name, category, description, mechanism, benefits, variants, stability, half_life, reconstitution, storage, is_free, image_path)
VALUES (44, 'Oxytocin', 'Hormonal', '', '', ARRAY[]::text[], ARRAY[]::text[], '', '', '', '', FALSE, '/assets/peptide-44-*.jpg')
ON CONFLICT (id) DO NOTHING;
INSERT INTO peptides (id, name, category, description, mechanism, benefits, variants, stability, half_life, reconstitution, storage, is_free, image_path)
VALUES (45, 'P21 (Cerebrolysin Mimético)', 'Nootrópicos', '', '', ARRAY[]::text[], ARRAY[]::text[], '', '', '', '', FALSE, '/assets/peptide-45-*.jpg')
ON CONFLICT (id) DO NOTHING;
INSERT INTO peptides (id, name, category, description, mechanism, benefits, variants, stability, half_life, reconstitution, storage, is_free, image_path)
VALUES (46, 'PE-22-28', 'Nootrópicos', '', '', ARRAY[]::text[], ARRAY[]::text[], '', '', '', '', FALSE, '/assets/peptide-46-*.jpg')
ON CONFLICT (id) DO NOTHING;
INSERT INTO peptides (id, name, category, description, mechanism, benefits, variants, stability, half_life, reconstitution, storage, is_free, image_path)
VALUES (47, 'Pinealon', 'Nootrópicos', '', '', ARRAY[]::text[], ARRAY[]::text[], '', '', '', '', FALSE, '/assets/peptide-47-*.jpg')
ON CONFLICT (id) DO NOTHING;
INSERT INTO peptides (id, name, category, description, mechanism, benefits, variants, stability, half_life, reconstitution, storage, is_free, image_path)
VALUES (48, 'PNC-27', 'Anti-aging', '', '', ARRAY[]::text[], ARRAY[]::text[], '', '', '', '', FALSE, '/assets/peptide-48-*.jpg')
ON CONFLICT (id) DO NOTHING;
INSERT INTO peptides (id, name, category, description, mechanism, benefits, variants, stability, half_life, reconstitution, storage, is_free, image_path)
VALUES (49, 'Prostamax', 'Biorregulador', '', '', ARRAY[]::text[], ARRAY[]::text[], '', '', '', '', FALSE, '/assets/peptide-49-*.jpg')
ON CONFLICT (id) DO NOTHING;
INSERT INTO peptides (id, name, category, description, mechanism, benefits, variants, stability, half_life, reconstitution, storage, is_free, image_path)
VALUES (50, 'PT-141', 'Sexual', '', '', ARRAY[]::text[], ARRAY[]::text[], '', '', '', '', FALSE, '/assets/peptide-50-*.jpg')
ON CONFLICT (id) DO NOTHING;
INSERT INTO peptides (id, name, category, description, mechanism, benefits, variants, stability, half_life, reconstitution, storage, is_free, image_path)
VALUES (51, 'Retatrutide', 'Emagrecimento', '', '', ARRAY[]::text[], ARRAY[]::text[], '', '', '', '', FALSE, '/assets/peptide-51-*.jpg')
ON CONFLICT (id) DO NOTHING;
INSERT INTO peptides (id, name, category, description, mechanism, benefits, variants, stability, half_life, reconstitution, storage, is_free, image_path)
VALUES (52, 'Selank - Ansiolítico Peptídico', 'Nootrópicos', '', '', ARRAY[]::text[], ARRAY[]::text[], '', '', '', '', FALSE, '/assets/peptide-52-*.jpg')
ON CONFLICT (id) DO NOTHING;
INSERT INTO peptides (id, name, category, description, mechanism, benefits, variants, stability, half_life, reconstitution, storage, is_free, image_path)
VALUES (53, 'Selank', 'Nootrópicos', '', '', ARRAY[]::text[], ARRAY[]::text[], '', '', '', '', FALSE, '/assets/peptide-53-*.jpg')
ON CONFLICT (id) DO NOTHING;
INSERT INTO peptides (id, name, category, description, mechanism, benefits, variants, stability, half_life, reconstitution, storage, is_free, image_path)
VALUES (54, 'Semaglutide', 'Emagrecimento', '', '', ARRAY[]::text[], ARRAY[]::text[], '', '', '', '', FALSE, '/assets/peptide-54-*.jpg')
ON CONFLICT (id) DO NOTHING;
INSERT INTO peptides (id, name, category, description, mechanism, benefits, variants, stability, half_life, reconstitution, storage, is_free, image_path)
VALUES (55, 'Semax - Peptídeo Nootrópico', 'Nootrópicos', '', '', ARRAY[]::text[], ARRAY[]::text[], '', '', '', '', FALSE, '/assets/peptide-55-*.jpg')
ON CONFLICT (id) DO NOTHING;
INSERT INTO peptides (id, name, category, description, mechanism, benefits, variants, stability, half_life, reconstitution, storage, is_free, image_path)
VALUES (56, 'Semax', 'Nootrópicos', '', '', ARRAY[]::text[], ARRAY[]::text[], '', '', '', '', FALSE, '/assets/peptide-56-*.jpg')
ON CONFLICT (id) DO NOTHING;
INSERT INTO peptides (id, name, category, description, mechanism, benefits, variants, stability, half_life, reconstitution, storage, is_free, image_path)
VALUES (57, 'Sermorelin', 'GH / Secretagogos', '', '', ARRAY[]::text[], ARRAY[]::text[], '', '', '', '', FALSE, '/assets/peptide-57-*.jpg')
ON CONFLICT (id) DO NOTHING;
INSERT INTO peptides (id, name, category, description, mechanism, benefits, variants, stability, half_life, reconstitution, storage, is_free, image_path)
VALUES (58, 'SLU-PP-332', 'Metabolismo', '', '', ARRAY[]::text[], ARRAY[]::text[], '', '', '', '', FALSE, '/assets/peptide-58-*.jpg')
ON CONFLICT (id) DO NOTHING;
INSERT INTO peptides (id, name, category, description, mechanism, benefits, variants, stability, half_life, reconstitution, storage, is_free, image_path)
VALUES (59, 'SNAP-8', 'Estética', '', '', ARRAY[]::text[], ARRAY[]::text[], '', '', '', '', FALSE, '/assets/peptide-59-*.jpg')
ON CONFLICT (id) DO NOTHING;
INSERT INTO peptides (id, name, category, description, mechanism, benefits, variants, stability, half_life, reconstitution, storage, is_free, image_path)
VALUES (60, 'HGH Fragment 176-191', 'Emagrecimento', '', '', ARRAY[]::text[], ARRAY[]::text[], '', '', '', '', FALSE, '/assets/peptide-60-*.jpg')
ON CONFLICT (id) DO NOTHING;
INSERT INTO peptides (id, name, category, description, mechanism, benefits, variants, stability, half_life, reconstitution, storage, is_free, image_path)
VALUES (61, 'Survodutide', 'Emagrecimento', '', '', ARRAY[]::text[], ARRAY[]::text[], '', '', '', '', FALSE, '/assets/peptide-61-*.jpg')
ON CONFLICT (id) DO NOTHING;
INSERT INTO peptides (id, name, category, description, mechanism, benefits, variants, stability, half_life, reconstitution, storage, is_free, image_path)
VALUES (62, 'TB-500', 'Recuperação', '', '', ARRAY[]::text[], ARRAY[]::text[], '', '', '', '', FALSE, '/assets/peptide-62-*.jpg')
ON CONFLICT (id) DO NOTHING;
INSERT INTO peptides (id, name, category, description, mechanism, benefits, variants, stability, half_life, reconstitution, storage, is_free, image_path)
VALUES (63, 'Tesamorelin', 'GH / Secretagogos', '', '', ARRAY[]::text[], ARRAY[]::text[], '', '', '', '', FALSE, '/assets/peptide-63-*.jpg')
ON CONFLICT (id) DO NOTHING;
INSERT INTO peptides (id, name, category, description, mechanism, benefits, variants, stability, half_life, reconstitution, storage, is_free, image_path)
VALUES (64, 'Testagen', 'Hormonal', '', '', ARRAY[]::text[], ARRAY[]::text[], '', '', '', '', FALSE, '/assets/peptide-64-*.jpg')
ON CONFLICT (id) DO NOTHING;
INSERT INTO peptides (id, name, category, description, mechanism, benefits, variants, stability, half_life, reconstitution, storage, is_free, image_path)
VALUES (65, 'Thymosin Alpha-1', 'Imunidade', '', '', ARRAY[]::text[], ARRAY[]::text[], '', '', '', '', FALSE, '/assets/peptide-65-*.jpg')
ON CONFLICT (id) DO NOTHING;
INSERT INTO peptides (id, name, category, description, mechanism, benefits, variants, stability, half_life, reconstitution, storage, is_free, image_path)
VALUES (66, 'Tirzepatide', 'Emagrecimento', '', '', ARRAY[]::text[], ARRAY[]::text[], '', '', '', '', TRUE, '/assets/peptide-66-*.jpg')
ON CONFLICT (id) DO NOTHING;
INSERT INTO peptides (id, name, category, description, mechanism, benefits, variants, stability, half_life, reconstitution, storage, is_free, image_path)
VALUES (67, 'Vesugen', 'Cardiovascular', '', '', ARRAY[]::text[], ARRAY[]::text[], '', '', '', '', FALSE, '/assets/peptide-67-*.jpg')
ON CONFLICT (id) DO NOTHING;
INSERT INTO peptides (id, name, category, description, mechanism, benefits, variants, stability, half_life, reconstitution, storage, is_free, image_path)
VALUES (68, 'Vilon', 'Imunidade', '', '', ARRAY[]::text[], ARRAY[]::text[], '', '', '', '', FALSE, '/assets/peptide-68-*.jpg')
ON CONFLICT (id) DO NOTHING;
INSERT INTO peptides (id, name, category, description, mechanism, benefits, variants, stability, half_life, reconstitution, storage, is_free, image_path)
VALUES (69, 'Tesamorelin + Ipamorelin (Blend 10mg)', 'GH / Secretagogos', '', '', ARRAY[]::text[], ARRAY[]::text[], '', '', '', '', FALSE, '/assets/peptide-69-*.jpg')
ON CONFLICT (id) DO NOTHING;
INSERT INTO peptides (id, name, category, description, mechanism, benefits, variants, stability, half_life, reconstitution, storage, is_free, image_path)
VALUES (70, 'SS-31 (Elamipretide)', 'Anti-aging', '', '', ARRAY[]::text[], ARRAY[]::text[], '', '', '', '', FALSE, '/assets/peptide-70-*.jpg')
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- DADOS: Admin padrão
-- =============================================
INSERT INTO profiles (id, email, display_name, profile_type)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'admin@peptideoshealth.local',
    'Administrador',
    'admin'
) ON CONFLICT (email) DO NOTHING;

INSERT INTO user_roles (user_id, role) 
VALUES ('00000000-0000-0000-0000-000000000001', 'admin')
ON CONFLICT DO NOTHING;

INSERT INTO subscriptions (user_id, plan, status, expires_at)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'vitalicio',
    'active',
    '2099-12-31'
) ON CONFLICT DO NOTHING;

-- Reset sequence
SELECT setval('peptides_id_seq', (SELECT MAX(id) FROM peptides));

