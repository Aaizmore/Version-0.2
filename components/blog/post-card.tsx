import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, ImageIcon, Clock, ArrowRight } from "lucide-react"
import type { Post } from "@/lib/types"
import Image from "next/image"

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const authorName = post.profiles?.full_name || post.profiles?.email || "Anonymous"
  const authorInitials = authorName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  const readingTime = Math.ceil(post.content.split(" ").length / 200)

  return (
    <Card className="h-full hover:shadow-2xl transition-all duration-500 overflow-hidden group glass-morphism hover:scale-[1.02] border-white/30">
      {post.featured_image && (
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={post.featured_image || "/placeholder.svg"}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <Badge className="bg-white/90 text-royal-700 border-0 font-medium">Featured</Badge>
          </div>
        </div>
      )}

      <CardHeader className="pb-4">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-10 w-10 ring-2 ring-gold-200 hover:ring-gold-300 transition-all duration-300">
            <AvatarImage
              src={post.profiles?.avatar_url || "/placeholder.svg"}
              alt={authorName}
              className="object-cover"
            />
            <AvatarFallback className="bg-gradient-to-br from-royal-100 to-gold-100 text-royal-700 text-sm font-semibold">
              {authorInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-gray-900 truncate">{authorName}</div>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(post.created_at)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{readingTime} min read</span>
              </div>
            </div>
          </div>
        </div>

        <Link href={`/post/${post.slug}`} className="group/title">
          <h2 className="font-serif font-bold text-xl sm:text-2xl leading-tight mb-3 group-hover/title:text-gradient transition-all duration-300 line-clamp-2">
            {post.title}
          </h2>
        </Link>
      </CardHeader>

      <CardContent className="pt-0">
        {post.excerpt && <p className="text-gray-600 line-clamp-3 mb-6 text-base leading-relaxed">{post.excerpt}</p>}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href={`/post/${post.slug}`}>
              <Badge
                variant="outline"
                className="border-royal-200 text-royal-700 hover:bg-gradient-to-r hover:from-royal-600 hover:to-gold-500 hover:text-white hover:border-transparent transition-all duration-300 group/badge"
              >
                <span>Read Article</span>
                <ArrowRight className="h-3 w-3 ml-1 group-hover/badge:translate-x-1 transition-transform duration-300" />
              </Badge>
            </Link>
            {post.images && post.images.length > 0 && (
              <div className="flex items-center gap-1 text-xs text-gold-600 bg-gold-50 px-2 py-1 rounded-full">
                <ImageIcon className="h-3 w-3" />
                <span>{post.images.length}</span>
              </div>
            )}
          </div>
          {!post.published && (
            <Badge
              variant="secondary"
              className="bg-gradient-to-r from-royal-100 to-gold-100 text-royal-700 border-royal-200"
            >
              Draft
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
