"use client"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import CategorySidebar from "./components/CategorySidebar"
import { KnowledgeProvider, useKnowledge } from "./components/KnowledgeContext"

function KnowledgeLayoutContent({
  children,
}: {
  children: React.ReactNode
}) {
  const { categories, selectedCategory, setSelectedCategory, addCategory } = useKnowledge()

  return (
    <div className="h-full flex">
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
          <CategorySidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onAddCategory={addCategory}
          />
        </ResizablePanel>
        
        <ResizableHandle className="w-1 bg-border hover:bg-accent transition-colors" />
        
        <ResizablePanel defaultSize={75}>
          <div className="h-full">
            {children}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

export default function KnowledgeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <KnowledgeProvider>
      <KnowledgeLayoutContent>
        {children}
      </KnowledgeLayoutContent>
    </KnowledgeProvider>
  )
}
