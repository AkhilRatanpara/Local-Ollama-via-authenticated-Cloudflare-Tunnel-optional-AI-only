import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  // Query schemes instead of todos since the schemes table exists in the database!
  const { data: schemesList, error } = await supabase.from('schemes').select('id, title, category').limit(10)

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-xl font-bold text-red-500">Supabase Connection Error</h1>
        <pre className="mt-4 p-4 bg-gray-100 rounded text-sm text-black">{JSON.stringify(error, null, 2)}</pre>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-blue-600">Supabase Connection Success!</h1>
      <p className="mb-4 text-gray-600">Successfully fetched schemes from the database:</p>
      <ul className="space-y-2">
        {schemesList?.map((scheme) => (
          <li key={scheme.id} className="p-3 bg-white shadow rounded border border-gray-100 text-black">
            <span className="font-semibold">{scheme.title}</span> ({scheme.category})
          </li>
        ))}
      </ul>
    </div>
  )
}
