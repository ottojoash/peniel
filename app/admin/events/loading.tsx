import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function EventsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-[180px]" />
          </div>

          <div className="border rounded-md">
            <div className="p-4 border-b">
              <div className="grid grid-cols-5 gap-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[80px]" />
              </div>
            </div>

            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="p-4 border-b">
                <div className="grid grid-cols-5 gap-4">
                  <div>
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-4 w-3/4 mt-2" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                  <div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full mt-2" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-8 w-8 rounded-full ml-auto" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

