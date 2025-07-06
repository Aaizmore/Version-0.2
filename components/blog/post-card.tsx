import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock } from "lucide-react"
import type { Post } from "@/lib/types"

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  const author = post.profiles
  const authorName = author?.full_name || author?.email || "Anonymous"
  const initials = authorName
    .split(" ")
    .map((part: string) => part[0])
    .join("")
    .toUpperCase()

  const readingTime = Math.ceil(post.content.split(" ").length / 200)
  const date = new Date(post.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  return (
    <article className="group overflow-hidden rounded-lg border bg-white/70 backdrop-blur-md transition-shadow hover:shadow-lg">
      <Link href={`/post/${post.slug}`} className="block space-y-4 p-6">
        <h2 className="line-clamp-2 font-serif text-xl font-bold group-hover:underline">{post.title}</h2>
        {post.excerpt && <p className="line-clamp-3 text-gray-700">{post.excerpt}</p>}

        <div className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
          <Avatar className="h-8 w-8">
            <AvatarImage src={author?.avatar_url || "/placeholder.svg"} alt={authorName} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <span>{authorName}</span>
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" /> {date}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" /> {readingTime} min
          </span>
        </div>
      </Link>
    </article>
  )
}
