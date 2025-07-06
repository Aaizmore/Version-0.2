import { createClient } from "@/lib/supabase/server"
import { PostCard } from "@/components/blog/post-card"
import { Button } from "@/components/ui/button"
import { PenTool, BookOpen, Award, Users } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { Post } from "@/lib/types"

export default async function HomePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

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
    .eq("published", true)
    .order("created_at", { ascending: false })

  const totalPosts = posts?.length || 0
  const recentPosts = posts?.slice(0, 6) || []

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-royal-100/50 via-transparent to-gold-100/50" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <Image
                  src="/images/lakambini-badge.png"
                  alt="Lakambini XI Badge"
                  width={120}
                  height={120}
                  className="rounded-full shadow-2xl ring-4 ring-white/50 animate-fade-in"
                />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-gold-400 to-gold-500 rounded-full flex items-center justify-center">
                  <Award className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>

            <h1 className="font-serif font-bold text-4xl sm:text-5xl lg:text-6xl mb-6 text-gradient animate-fade-in">
              Lakambini XI Archives
            </h1>

            <p className="text-lg sm:text-xl text-gray-700 mb-4 leading-relaxed animate-fade-in">
              A distinguished digital repository for Grade 11 academic excellence, scholarly discourse, and cultural
              heritage preservation.
            </p>

            <p className="text-base text-gray-600 mb-12 max-w-2xl mx-auto animate-fade-in">
              Empowering students to share knowledge, insights, and perspectives that shape our academic community and
              preserve our collective learning journey.
            </p>

            {user && (
              <Button
                asChild
                size="lg"
                className="mb-12 bg-gradient-to-r from-royal-600 to-gold-500 hover:from-royal-700 hover:to-gold-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 font-medium px-8 py-3"
              >
                <Link href="/write" className="flex items-center gap-3">
                  <PenTool className="h-5 w-5" />
                  Contribute to Archives
                </Link>
              </Button>
            )}

            {/* Stats Section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-gradient mb-2">{totalPosts}</div>
                <div className="text-sm text-gray-600 font-medium">Published Articles</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gradient mb-2">2025-2026</div>
                <div className="text-sm text-gray-600 font-medium">Academic Year</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gradient mb-2">XI</div>
                <div className="text-sm text-gray-600 font-medium">Grade Level</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Content */}
      {recentPosts.length > 0 ? (
        <section className="py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-serif font-bold text-3xl sm:text-4xl mb-4 text-gradient">Featured Publications</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Discover the latest scholarly contributions from our academic community, showcasing diverse perspectives
                and innovative thinking.
              </p>
            </div>

            <div className="grid gap-8 sm:gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {recentPosts.map((post: Post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            {posts && posts.length > 6 && (
              <div className="text-center mt-12">
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-royal-200 text-royal-700 hover:bg-royal-50 font-medium bg-transparent"
                >
                  <Link href="/archives">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Explore All Archives
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </section>
      ) : (
        <section className="py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto">
              <div className="mb-8">
                <BookOpen className="h-20 w-20 text-royal-300 mx-auto mb-6" />
              </div>

              <h3 className="font-serif font-bold text-2xl sm:text-3xl mb-4 text-gradient">Begin Our Digital Legacy</h3>

              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Be among the first contributors to establish our academic archive. Share your insights, research, and
                perspectives to build a lasting repository of knowledge.
              </p>

              {user ? (
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-royal-600 to-gold-500 hover:from-royal-700 hover:to-gold-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 font-medium"
                >
                  <Link href="/write" className="flex items-center gap-3">
                    <PenTool className="h-5 w-5" />
                    Publish First Article
                  </Link>
                </Button>
              ) : (
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-royal-600 to-gold-500 hover:from-royal-700 hover:to-gold-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 font-medium"
                >
                  <Link href="/auth" className="flex items-center gap-3">
                    <Users className="h-5 w-5" />
                    Join Our Community
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
