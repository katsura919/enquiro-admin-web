import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        placeholder="Search knowledge base..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 bg-white/5 text-white border-blue-500/20"
      />
    </div>
  )
} 