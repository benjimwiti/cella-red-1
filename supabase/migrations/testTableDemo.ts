import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl: string = process.env.VITE_SUPABASE_URL as string;
const supabaseKey: string = process.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

interface TestTableRow {
  // Define your table columns here, for example:
  id: number;
  name: string;
  // Add other columns as needed
}


async function fetchTestRows(): Promise<void> {
  console.log(supabaseUrl, supabaseKey);
  const { data, error } = await supabase
    .from<TestTableRow>('test_table')
    .select('*');
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Rows:', data);
  }
}

fetchTestRows();

// /c/Users/benzm/.deno/bin/deno --help