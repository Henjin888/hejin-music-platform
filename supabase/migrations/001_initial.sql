-- VocalOS 数据库迁移
-- 请在 Supabase SQL Editor 中执行

-- 1. profiles 表
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL,
  nickname TEXT,
  plan TEXT DEFAULT 'free',
  project_quota INTEGER DEFAULT 3,
  export_quota INTEGER DEFAULT 1,
  used_projects INTEGER DEFAULT 0,
  used_exports INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. projects 表  
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  goal TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. project_results 表
CREATE TABLE IF NOT EXISTS project_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL,
  result_type TEXT NOT NULL,
  content JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 导出记录表
CREATE TABLE IF NOT EXISTS project_exports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL,
  user_id UUID NOT NULL,
  export_type TEXT NOT NULL,
  file_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_project_results_project_id ON project_results(project_id);
CREATE INDEX IF NOT EXISTS idx_project_exports_user_id ON project_exports(user_id);

SELECT 'VocalOS tables created successfully!' as status;