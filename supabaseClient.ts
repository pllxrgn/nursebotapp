import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPAURL!;
const SUPABASE_ANON_KEY = process.env.SUPANON!;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);