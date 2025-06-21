"use client"

import { Spinner, PageSpinner } from "@/components/ui/spinner"
import { Card } from "@/components/ui/card"

export default function SpinnerDemo() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Spinner Components</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-6 space-y-6">
          <h2 className="text-xl font-semibold">Border Variant</h2>
          <div className="flex flex-wrap gap-8">
            <div className="flex flex-col items-center gap-2">
              <Spinner size="sm" />
              <span className="text-xs text-muted-foreground">Small</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Spinner size="md" />
              <span className="text-xs text-muted-foreground">Medium</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Spinner size="lg" />
              <span className="text-xs text-muted-foreground">Large</span>
            </div>
          </div>

          <h3 className="text-lg font-medium mt-6">Colors</h3>
          <div className="flex flex-wrap gap-8">
            <div className="flex flex-col items-center gap-2">
              <Spinner color="default" />
              <span className="text-xs text-muted-foreground">Default</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Spinner color="primary" />
              <span className="text-xs text-muted-foreground">Primary</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Spinner color="secondary" />
              <span className="text-xs text-muted-foreground">Secondary</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Spinner color="accent" />
              <span className="text-xs text-muted-foreground">Accent</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-6">
          <h2 className="text-xl font-semibold">Dots Variant</h2>
          <div className="flex flex-wrap gap-8">
            <div className="flex flex-col items-center gap-2">
              <Spinner variant="dots" size="sm" />
              <span className="text-xs text-muted-foreground">Small</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Spinner variant="dots" size="md" />
              <span className="text-xs text-muted-foreground">Medium</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Spinner variant="dots" size="lg" />
              <span className="text-xs text-muted-foreground">Large</span>
            </div>
          </div>

          <h3 className="text-lg font-medium mt-6">Colors</h3>
          <div className="flex flex-wrap gap-8">
            <div className="flex flex-col items-center gap-2">
              <Spinner variant="dots" color="default" />
              <span className="text-xs text-muted-foreground">Default</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Spinner variant="dots" color="primary" />
              <span className="text-xs text-muted-foreground">Primary</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Spinner variant="dots" color="secondary" />
              <span className="text-xs text-muted-foreground">Secondary</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Spinner variant="dots" color="accent" />
              <span className="text-xs text-muted-foreground">Accent</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-6">
          <h2 className="text-xl font-semibold">Pulse Variant</h2>
          <div className="flex flex-wrap gap-8">
            <div className="flex flex-col items-center gap-2">
              <Spinner variant="pulse" size="sm" />
              <span className="text-xs text-muted-foreground">Small</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Spinner variant="pulse" size="md" />
              <span className="text-xs text-muted-foreground">Medium</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Spinner variant="pulse" size="lg" />
              <span className="text-xs text-muted-foreground">Large</span>
            </div>
          </div>

          <h3 className="text-lg font-medium mt-6">Colors</h3>
          <div className="flex flex-wrap gap-8">
            <div className="flex flex-col items-center gap-2">
              <Spinner variant="pulse" color="default" />
              <span className="text-xs text-muted-foreground">Default</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Spinner variant="pulse" color="primary" />
              <span className="text-xs text-muted-foreground">Primary</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Spinner variant="pulse" color="secondary" />
              <span className="text-xs text-muted-foreground">Secondary</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Spinner variant="pulse" color="accent" />
              <span className="text-xs text-muted-foreground">Accent</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-6">
          <h2 className="text-xl font-semibold">Page Spinner</h2>
          <div className="border rounded-lg h-80">
            <PageSpinner message="Loading content..." />
          </div>
        </Card>
      </div>
    </div>
  )
}
