import { Loader2 } from "lucide-react"

export default function CalendarLoading() {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <div className="h-8 w-48 bg-muted rounded animate-pulse" />
        <div className="flex gap-2">
          <div className="h-10 w-32 bg-muted rounded animate-pulse" />
          <div className="h-10 w-32 bg-muted rounded animate-pulse" />
        </div>
      </div>

      <div className="h-12 w-full bg-muted rounded animate-pulse" />

      <div className="border rounded-lg p-6 flex justify-center items-center h-[600px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Loading calendar...</span>
      </div>
    </div>
  )
}

