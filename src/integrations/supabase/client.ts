// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://sihhsdewcdisezcpbmst.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpaGhzZGV3Y2Rpc2V6Y3BibXN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyOTE3NjQsImV4cCI6MjA2NTg2Nzc2NH0.QuB9BVRZY9wd19fiQYyQtrNNV7CztcsTmmEIF6KUyzk";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);