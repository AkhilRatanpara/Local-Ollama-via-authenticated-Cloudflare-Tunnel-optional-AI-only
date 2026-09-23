import https from 'https';

async function checkSupabase() {
  const url = 'https://wtsknwbatuyjfumhtygk.supabase.co/rest/v1/';
  console.log('Fetching', url);
  try {
    const res = await fetch(url, {
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || ''
      }
    });
    console.log('Status:', res.status, res.statusText);
    const headers = Object.fromEntries(res.headers.entries());
    console.log('Headers:', headers);
  } catch (e: any) {
    console.error('Fetch error:', e);
  }
}

checkSupabase();
