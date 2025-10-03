"use client"

import { Button } from "@/components/ui/button"

interface PolicyPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  totalItems: number
  itemsPerPage: number
}

export default function PolicyPagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage
}: PolicyPaginationProps) {
  if (totalPages <= 1) return null

  const currentPageItems = Math.min(itemsPerPage, totalItems - (currentPage - 1) * itemsPerPage)

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
      <div className="text-sm text-muted-foreground">
        Showing {currentPageItems} of {totalItems} total Policies
      </div>
      <div className="flex items-center gap-2">
        <Button 
          className="bg-card"
          disabled={currentPage <= 1} 
          onClick={() => onPageChange(currentPage - 1)} 
          variant="outline"
        >
          Previous
        </Button>
        <span className="px-3 py-1 text-sm text-muted-foreground rounded">
          Page {currentPage} of {totalPages}
        </span>
        <Button 
          className="bg-card"
          disabled={currentPage >= totalPages} 
          onClick={() => onPageChange(currentPage + 1)} 
          variant="outline"
        >
          Next
        </Button>
      </div>
    </div>
  )
}