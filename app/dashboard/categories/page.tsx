import { getCategories } from "../actions"
import { CategoriesTable } from "../components/categories-table"

export default async function CategoriesPage() {
  const result = await getCategories()

  if (!result.success) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Categories Management</h1>
          <p className="text-slate-400 mt-2">Organize your menu items by categories</p>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
          <div className="text-center py-8">
            <div className="text-red-400 mb-2">Error loading categories</div>
            <p className="text-slate-400 text-sm">{result.error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Categories Management</h1>
        <p className="text-slate-400 mt-2">Organize your menu items by categories</p>
      </div>
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
        <CategoriesTable categories={result.data} />
      </div>
    </div>
  )
}
