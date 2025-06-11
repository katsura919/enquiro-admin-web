import KnowledgeItem from "./KnowledgeItem"
import SearchBar from "./SearchBar"

interface Category {
  _id: string
  name: string
  description: string
  businessId: string
}

interface KnowledgeItem {
  _id: string
  categoryId: string
  businessId: string
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
}

interface KnowledgeListProps {
  items: KnowledgeItem[]
  categories: Category[]
  searchQuery: string
  onSearchChange: (query: string) => void
  onEditItem: (item: KnowledgeItem) => void
  onDeleteItem: (itemId: string) => void
}

export default function KnowledgeList({
  items,
  categories,
  searchQuery,
  onSearchChange,
  onEditItem,
  onDeleteItem,
}: KnowledgeListProps) {
  return (
    <div className="h-full flex flex-col space-y-6">
      <SearchBar value={searchQuery} onChange={onSearchChange} />
      
      <div className="flex-1 overflow-y-auto space-y-4">
        {items.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>No knowledge items found</p>
          </div>
        ) : (
          items.map((item) => (
            <KnowledgeItem
              key={item._id}
              item={item}
              category={categories.find(c => c._id === item.categoryId)}
              onEdit={() => onEditItem(item)}
              onDelete={() => onDeleteItem(item._id)}
            />
          ))
        )}
      </div>
    </div>
  )
}