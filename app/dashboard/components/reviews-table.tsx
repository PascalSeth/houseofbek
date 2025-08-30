"use client"

import { useState, useTransition, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Trash2, MessageSquare, User, Calendar, Filter, TrendingUp } from "lucide-react"
import { deleteReview } from "../actions"
import { useRouter } from "next/navigation"

type ReviewWithUser = {
  id: string
  userId: string
  rating: number
  comment: string | null
  createdAt: Date
  updatedAt: Date
  user: {
    id: string
    email: string
    name: string | null
    phone: string | null
  }
}

interface ReviewsTableProps {
  reviews: ReviewWithUser[]
}

export function ReviewsTable({ reviews }: ReviewsTableProps) {
  const [isPending, startTransition] = useTransition()
  const [ratingFilter, setRatingFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("newest")
  const router = useRouter()

  const handleDelete = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review? This action cannot be undone.")) {
      return
    }

    startTransition(async () => {
      try {
        const result = await deleteReview(reviewId)
        if (result.success) {
          router.refresh()
        } else {
          alert(result.error || "Failed to delete review")
        }
      } catch (error) {
        console.error("Error deleting review:", error)
        alert("Failed to delete review")
      }
    })
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-slate-400"}`} />
    ))
  }

  const getTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`

    const diffInWeeks = Math.floor(diffInDays / 7)
    if (diffInWeeks < 4) return `${diffInWeeks}w ago`

    return date.toLocaleDateString()
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "text-green-400"
    if (rating >= 3) return "text-yellow-400"
    return "text-red-400"
  }

  const filteredAndSortedReviews = useMemo(() => {
    let filtered = reviews

    // Filter by rating
    if (ratingFilter !== "all") {
      const targetRating = Number.parseInt(ratingFilter)
      filtered = filtered.filter((review) => review.rating === targetRating)
    }

    // Sort reviews
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case "highest":
          return b.rating - a.rating
        case "lowest":
          return a.rating - b.rating
        default:
          return 0
      }
    })

    return filtered
  }, [reviews, ratingFilter, sortBy])

  const reviewStats = useMemo(() => {
    if (reviews.length === 0) return { average: 0, distribution: {} }

    const total = reviews.reduce((sum, review) => sum + review.rating, 0)
    const average = total / reviews.length

    const distribution = reviews.reduce(
      (acc, review) => {
        acc[review.rating] = (acc[review.rating] || 0) + 1
        return acc
      },
      {} as Record<number, number>,
    )

    return { average, distribution }
  }, [reviews])

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageSquare className="w-16 h-16 text-slate-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No reviews yet</h3>
        <p className="text-slate-400">Customer reviews will appear here once they start leaving feedback.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-700/30 border-slate-600">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Average Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white">{reviewStats.average.toFixed(1)}</span>
              <div className="flex">{renderStars(Math.round(reviewStats.average))}</div>
            </div>
            <p className="text-xs text-slate-400 mt-1">Based on {reviews.length} reviews</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-700/30 border-slate-600">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Total Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{reviews.length}</div>
            <p className="text-xs text-slate-400 mt-1">All time</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-700/30 border-slate-600">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Rating Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400">{rating}★</span>
                  <div className="flex-1 bg-slate-600 rounded-full h-1">
                    <div
                      className="bg-yellow-400 h-1 rounded-full"
                      style={{
                        width: `${reviews.length > 0 ? ((reviewStats.distribution[rating] || 0) / reviews.length) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <span className="text-slate-400 w-6">{reviewStats.distribution[rating] || 0}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">All Reviews</h2>
          <p className="text-slate-400 text-sm">
            {filteredAndSortedReviews.length} of {reviews.length} reviews
          </p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-32 bg-slate-700 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="all" className="text-white">
                  All Ratings
                </SelectItem>
                <SelectItem value="5" className="text-white">
                  5 Stars
                </SelectItem>
                <SelectItem value="4" className="text-white">
                  4 Stars
                </SelectItem>
                <SelectItem value="3" className="text-white">
                  3 Stars
                </SelectItem>
                <SelectItem value="2" className="text-white">
                  2 Stars
                </SelectItem>
                <SelectItem value="1" className="text-white">
                  1 Star
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-32 bg-slate-700 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600">
              <SelectItem value="newest" className="text-white">
                Newest
              </SelectItem>
              <SelectItem value="oldest" className="text-white">
                Oldest
              </SelectItem>
              <SelectItem value="highest" className="text-white">
                Highest
              </SelectItem>
              <SelectItem value="lowest" className="text-white">
                Lowest
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredAndSortedReviews.map((review) => (
          <Card key={review.id} className="bg-slate-700/30 border-slate-600 hover:bg-slate-700/50 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-slate-300" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{review.user.name || review.user.email}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex">{renderStars(review.rating)}</div>
                      <span className={`text-sm font-medium ${getRatingColor(review.rating)}`}>{review.rating}/5</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-slate-400 text-sm">
                    <Calendar className="w-3 h-3" />
                    <span>{getTimeAgo(new Date(review.createdAt))}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(review.id)}
                    disabled={isPending}
                    className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            {review.comment && (
              <CardContent>
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <p className="text-slate-300 text-sm leading-relaxed">{review.comment}</p>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
