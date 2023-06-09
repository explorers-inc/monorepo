import { Database } from './DatabaseDefinitions';
import type { SupabaseClient } from '@supabase/supabase-js';

export type { Database };
export type ECSupabaseClient = SupabaseClient<Database>;

export type ProfilesTable = Database['public']['Tables']['profiles'];
export type ProfilesRow = ProfilesTable['Row'];
