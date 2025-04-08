import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ContentLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <Skeleton className="h-8 w-[250px]" />
          <Skeleton className="h-4 w-[300px] mt-2" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-[120px]" />
          <Skeleton className="h-10 w-[120px]" />
        </div>
      </div>

      <Tabs defaultValue="rooms" className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <TabsTrigger value="rooms" disabled>
            Rooms & Rates
          </TabsTrigger>
          <TabsTrigger value="restaurant" disabled>
            Restaurant Menu
          </TabsTrigger>
          <TabsTrigger value="kids-park" disabled>
            Kids Park
          </TabsTrigger>
          <TabsTrigger value="pages" disabled>
            Website Pages
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rooms" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <Skeleton className="h-6 w-[150px]" />
                <Skeleton className="h-4 w-[250px] mt-2" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-10 w-[120px]" />
                <Skeleton className="h-10 w-[120px]" />
                <Skeleton className="h-10 w-[120px]" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="h-[400px] w-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

