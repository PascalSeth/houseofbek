import { getMenuItems, getCategories } from "../actions"
import { MenuTable } from "../components/menu-table"

export default async function MenuPage() {
  const [menuResult, categoriesResult] = await Promise.all([getMenuItems(), getCategories()])

  if (!menuResult.success) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Menu Management</h1>
          <p className="text-slate-400 mt-2">Manage your restaurant menu items</p>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
          <div className="text-center py-8">
            <div className="text-red-400 mb-2">Error loading menu items</div>
            <p className="text-slate-400 text-sm">{menuResult.error}</p>
          </div>
        </div>
      </div>
    )
  }

  const categories = categoriesResult.success ? categoriesResult.data : []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Menu Management</h1>
        <p className="text-slate-400 mt-2">Manage your restaurant menu items</p>
      </div>
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
        <MenuTable menuItems={menuResult.data} categories={categories} />
      </div>
    </div>
  )
}
