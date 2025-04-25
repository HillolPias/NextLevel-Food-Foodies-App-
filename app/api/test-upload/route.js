// app/api/test-upload/route.js
import { supabase } from '@/lib/supabase';

export async function GET() {
  const file = new File(["Hello, world!"], "hello.txt", { type: "text/plain" });

  const { data, error } = await supabase.storage
    .from('meal-images')
    .upload('test/hello.txt', file, {
      cacheControl: '3600',
      upsert: true,
    });

  console.log("Upload test result:", { data, error });

  return new Response(JSON.stringify({ data, error }), {
    headers: { "Content-Type": "application/json" },
  });
}
