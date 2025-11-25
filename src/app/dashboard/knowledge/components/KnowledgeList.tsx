import KnowledgeItem from "./KnowledgeItem";
import SearchBar from "./SearchBar";

interface Category {
  _id: string;
  name: string;
  description: string;
  businessId: string;
}

interface KnowledgeItem {
  _id: string;
  categoryId: string;
  businessId: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

interface KnowledgeListProps {
  items: KnowledgeItem[];
  categories: Category[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onEditItem: (item: KnowledgeItem) => void;
  onDeleteItem: (itemId: string) => void;
  loading?: boolean;
}

export default function KnowledgeList({
  items,
  categories,
  searchQuery,
  onSearchChange,
  onEditItem,
  onDeleteItem,
  loading = false,
}: KnowledgeListProps) {
  return (
    <div className="flex flex-col space-y-6">
      <SearchBar value={searchQuery} onChange={onSearchChange} />

      <div className="space-y-4 min-h-[400px]">
        {loading ? (
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading knowledge items...</p>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            <div className="text-center">
              <p className="text-lg font-medium">No knowledge items found</p>
              <p className="text-sm mt-2">
                Try adjusting your search or add a new knowledge item
              </p>
            </div>
          </div>
        ) : (
          items.map((item) => (
            <KnowledgeItem
              key={item._id}
              item={item}
              category={categories.find((c) => c._id === item.categoryId)}
              onEdit={() => onEditItem(item)}
              onDelete={() => onDeleteItem(item._id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
