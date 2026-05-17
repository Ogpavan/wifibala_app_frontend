-- Plans Table
CREATE TABLE plans (
    plan_id SERIAL PRIMARY KEY,
    plan_name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    speed VARCHAR(50) NOT NULL, -- e.g., "100 Mbps", "1 Gbps"
    data_limit VARCHAR(50) DEFAULT 'Unlimited', -- e.g., "Unlimited", "500 GB"
    validity INTEGER NOT NULL DEFAULT 30, -- days
    features TEXT[], -- array of features like ["24/7 Support", "Free Installation"]
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'inactive'
    is_popular BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Offers Table  
CREATE TABLE offers (
    offer_id SERIAL PRIMARY KEY,
    offer_name VARCHAR(100) NOT NULL,
    description TEXT,
    discount_type VARCHAR(20) NOT NULL, -- 'percentage', 'fixed', 'free_months'
    discount_value DECIMAL(10,2) NOT NULL, -- percentage number or fixed amount
    min_plan_price DECIMAL(10,2) DEFAULT 0, -- minimum plan price to apply offer
    applicable_plans INTEGER[], -- array of plan_ids, NULL means all plans
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'inactive', 'expired'
    max_uses INTEGER DEFAULT NULL, -- NULL means unlimited
    current_uses INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Subscriptions Table (User-Plan relationship)
CREATE TABLE subscriptions (
    subscription_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    plan_id INTEGER NOT NULL REFERENCES plans(plan_id) ON DELETE RESTRICT,
    offer_id INTEGER DEFAULT NULL REFERENCES offers(offer_id) ON DELETE SET NULL,
    original_price DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    final_price DECIMAL(10,2) NOT NULL,
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'expired', 'cancelled', 'suspended'
    auto_renewal BOOLEAN DEFAULT true,
    payment_method VARCHAR(50) DEFAULT 'wallet',
    installation_address TEXT,
    installation_date DATE,
    installation_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'completed', 'failed'
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Payment History Table
CREATE TABLE payment_history (
    payment_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    subscription_id INTEGER DEFAULT NULL REFERENCES subscriptions(subscription_id) ON DELETE SET NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_type VARCHAR(30) NOT NULL, -- 'subscription', 'wallet_topup', 'refund'
    payment_method VARCHAR(50) NOT NULL, -- 'wallet', 'upi', 'card', 'cash'
    transaction_id VARCHAR(100),
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'refunded'
    gateway_response TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Update users table to ensure wallet column exists
ALTER TABLE users ADD COLUMN IF NOT EXISTS wallet DECIMAL(10,2) DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS deleted_phone_number VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS deleted_email VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS referral_code VARCHAR(12);
ALTER TABLE users ADD COLUMN IF NOT EXISTS referred_by_user_id INTEGER DEFAULT NULL REFERENCES users(user_id) ON DELETE SET NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_referral_code_unique ON users(referral_code);

-- Referral configuration and usage logs
CREATE TABLE IF NOT EXISTS referral_settings (
    id SERIAL PRIMARY KEY,
    reward_amount BIGINT NOT NULL DEFAULT 0,
    is_enabled BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS referral_rewards (
    reward_id SERIAL PRIMARY KEY,
    referrer_user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    referred_user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    referral_code VARCHAR(12) NOT NULL,
    reward_amount BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wallet_recharge_transactions (
    recharge_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    amount BIGINT NOT NULL DEFAULT 0,
    source VARCHAR(50) NOT NULL DEFAULT 'referral',
    reference_table VARCHAR(50) DEFAULT 'referral_rewards',
    reference_id INTEGER DEFAULT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_referral_rewards_referrer ON referral_rewards(referrer_user_id);
CREATE INDEX IF NOT EXISTS idx_referral_rewards_referred ON referral_rewards(referred_user_id);
CREATE INDEX IF NOT EXISTS idx_referral_rewards_created_at ON referral_rewards(created_at);
CREATE INDEX IF NOT EXISTS idx_wallet_recharges_user_id ON wallet_recharge_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_recharges_created_at ON wallet_recharge_transactions(created_at);

-- Add indexes for better performance
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_plan_id ON subscriptions(plan_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_payment_history_user_id ON payment_history(user_id);
CREATE INDEX idx_plans_status ON plans(status);
CREATE INDEX idx_offers_status ON offers(status);
CREATE INDEX idx_offers_dates ON offers(start_date, end_date);

-- Port Change Requests Table
CREATE TABLE port_change_requests (
    request_id SERIAL PRIMARY KEY,
    user_id INTEGER DEFAULT NULL REFERENCES users(user_id) ON DELETE SET NULL,
    current_operator_id INTEGER NOT NULL,
    requested_operator_id INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    remarks TEXT,
    reviewed_by INTEGER DEFAULT NULL REFERENCES users(user_id) ON DELETE SET NULL,
    reviewed_at TIMESTAMP DEFAULT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_port_change_requests_user_id ON port_change_requests(user_id);
CREATE INDEX idx_port_change_requests_status ON port_change_requests(status);
CREATE INDEX idx_port_change_requests_created_at ON port_change_requests(created_at);

-- Sample data for Plans
INSERT INTO plans (plan_name, description, price, speed, data_limit, validity, features, is_popular) VALUES
('Basic', 'Perfect for light internet usage', 299, '25 Mbps', 'Unlimited', 30, ARRAY['24/7 Support', 'Free Installation'], false),
('Premium', 'Great for families and streaming', 599, '50 Mbps', 'Unlimited', 30, ARRAY['24/7 Support', 'Free Installation', 'Free Router'], true),
('Ultra', 'Best for heavy usage and gaming', 999, '100 Mbps', 'Unlimited', 30, ARRAY['24/7 Support', 'Free Installation', 'Free Router', 'Priority Support'], false),
('Enterprise', 'For businesses and offices', 1999, '200 Mbps', 'Unlimited', 30, ARRAY['24/7 Support', 'Free Installation', 'Free Router', 'Priority Support', 'Static IP'], false);

-- Sample data for Offers
INSERT INTO offers (offer_name, description, discount_type, discount_value, start_date, end_date, status) VALUES
('New Year Special', 'Get 20% off on all plans', 'percentage', 20, '2026-01-01', '2026-01-31', 'active'),
('Premium Upgrade', 'Get 1 month free on Premium plan', 'free_months', 1, '2026-02-01', '2026-02-28', 'active'),
('Flat 500 Off', 'Flat Rs 500 discount on plans above Rs 999', 'fixed', 500, '2026-01-15', '2026-03-15', 'active');
