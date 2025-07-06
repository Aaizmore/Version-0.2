import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { PostCard } from "@/components/blog/post-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Settings, Calendar } from "lucide-react"
import Link from "next/link"
import type { Post } from "@/lib/types"

export default async function ProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const { data: posts } = await supabase
    .from("posts")
    .select(`
      *,
      profiles (
        id,
        email,
        full_name,
        avatar_url
      )
    `)
    .eq("author_id", user.id)
    .order("created_at", { ascending: false })

  const publishedPosts = posts?.filter((post) => post.published) || []
  const draftPosts = posts?.filter((post) => !post.published) || []

  const displayName = profile?.full_name || user.email || "User"
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const joinDate = new Date(user.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  })

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8 glass-morphism">
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <Avatar className="h-20 w-20 ring-4 ring-gold-200 shadow-lg">
                <AvatarImage
                  src={profile?.avatar_url || "/placeholder.svg"}
                  alt={displayName}
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-to-br from-royal-100 to-gold-100 text-royal-700 font-semibold text-2xl">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="font-serif text-2xl text-gradient">{displayName}</CardTitle>
                    <p className="text-muted-foreground">{user.email}</p>
                  </div>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="border-royal-200 hover:bg-royal-50 bg-transparent"
                  >
                    <Link href="/profile/edit" className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Edit Profile
                    </Link>
                  </Button>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {joinDate}</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-6 text-sm">
              <div>
                <span className="font-semibold text-lg text-gradient">{publishedPosts.length}</span>
                <span className="text-muted-foreground ml-1">Published Posts</span>
              </div>
              <div>
                <span className="font-semibold text-lg text-gradient">{draftPosts.length}</span>
                <span className="text-muted-foreground ml-1">Drafts</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {draftPosts.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="font-serif text-2xl font-semibold text-gradient">Drafts</h2>
              <Badge variant="secondary" className="bg-royal-100 text-royal-700">
                {draftPosts.length}
              </Badge>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {draftPosts.map((post: Post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="font-serif text-2xl font-semibold text-gradient">Published Posts</h2>
            <Badge variant="outline" className="border-royal-200 text-royal-700">
              {publishedPosts.length}
            </Badge>
          </div>
          {publishedPosts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {publishedPosts.map((post: Post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg mb-4">
                No published posts yet. Start writing to share your thoughts!
              </p>
              <Button
                asChild
                className="bg-gradient-to-r from-royal-600 to-gold-500 hover:from-royal-700 hover:to-gold-600 text-white"
              >
                <Link href="/write">Write Your First Post</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
