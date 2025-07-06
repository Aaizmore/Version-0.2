import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Settings, Calendar } from "lucide-react"

export default async function ProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth")

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .eq("author_id", user.id)
    .order("created_at", { ascending: false })

  const published = posts?.filter((p) => p.published) || []
  const drafts = posts?.filter((p) => !p.published) || []

  const displayName = profile?.full_name || user.email || "User"
  const initials = displayName
    .split(" ")
    .map((part: string) => part[0])
    .join("")
    .toUpperCase()

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card className="glass-morphism mb-8">
        <CardHeader>
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20 ring-2 ring-gold-200">
              <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} alt={displayName} />
              <AvatarFallback className="text-xl">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="font-serif text-2xl">{displayName}</CardTitle>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <p className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Joined{" "}
                {new Date(user.created_at).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex gap-6">
          <div>
            <span className="font-bold">{published.length}</span> Published
          </div>
          <div>
            <span className="font-bold">{drafts.length}</span> Drafts
          </div>
          <Button asChild variant="outline" size="sm" className="ml-auto bg-transparent">
            <Link href="/profile/edit">
              <Settings className="mr-1 h-4 w-4" /> Edit Profile
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* List of posts could be rendered here */}
    </div>
  )
}
