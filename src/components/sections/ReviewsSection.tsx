import { useState, useEffect, useMemo, memo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StarRating } from '@/components/reviews/StarRating';
import { ReviewCard } from '@/components/reviews/ReviewCard';
import { ReviewForm } from '@/components/reviews/ReviewForm';
import { supabase } from '@/integrations/supabase/client';
import { MessageSquare, Star, TrendingUp, Users, Filter, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Review {
  id: string;
  reviewer_name: string;
  rating: number;
  review_text: string;
  created_at: string;
}

type RatingFilter = 'all' | '5' | '4' | '3' | '2' | '1';
type SortOption = 'newest' | 'oldest' | 'highest' | 'lowest';

const StatCard = memo(({ 
  icon: Icon, 
  value, 
  label, 
  gradient,
  children 
}: { 
  icon: React.ElementType; 
  value: string | number; 
  label: string; 
  gradient: string;
  children?: React.ReactNode;
}) => (
  <Card className="bg-white/80 backdrop-blur-lg border-2 border-gray-200 shadow-lg">
    <CardContent className="p-4 sm:p-6 text-center">
      <div className={`w-10 h-10 sm:w-14 sm:h-14 mx-auto mb-3 sm:mb-4 rounded-full ${gradient} flex items-center justify-center`}>
        <Icon className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
      </div>
      <div className="text-2xl sm:text-4xl font-black text-gradient mb-2">{value}</div>
      {children}
      <p className="text-muted-foreground text-sm sm:text-base">{label}</p>
    </CardContent>
  </Card>
));

StatCard.displayName = 'StatCard';

const ReviewsSection = memo(() => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>('all');
  const [sortOption, setSortOption] = useState<SortOption>('newest');

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    const { data, error } = await (supabase as any)
      .from('reviews_public')
      .select('id, reviewer_name, rating, review_text, created_at')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setReviews(data);
      
      if (data.length > 0) {
        const avg = data.reduce((sum, r) => sum + r.rating, 0) / data.length;
        setAverageRating(Math.round(avg * 10) / 10);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const filteredAndSortedReviews = useMemo(() => {
    let result = [...reviews];

    if (ratingFilter !== 'all') {
      const filterRating = parseInt(ratingFilter);
      result = result.filter(r => r.rating === filterRating);
    }

    switch (sortOption) {
      case 'newest':
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case 'highest':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'lowest':
        result.sort((a, b) => a.rating - b.rating);
        break;
    }

    return result;
  }, [reviews, ratingFilter, sortOption]);

  const resetFilters = useCallback(() => {
    setRatingFilter('all');
    setSortOption('newest');
  }, []);

  const positiveReviewsCount = useMemo(() => 
    reviews.filter(r => r.rating >= 4).length, 
    [reviews]
  );

  return (
    <section id="reviews" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 via-white to-blue-50 reveal relative overflow-hidden">
      {/* Background Elements - simplified */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-24 h-24 sm:w-32 sm:h-32 bg-yellow-200/20 rounded-full animate-float" />
        <div className="absolute bottom-20 right-10 w-32 h-32 sm:w-40 sm:h-40 bg-purple-200/20 rounded-full animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-10 sm:mb-16">
          <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-white/90 backdrop-blur-lg border-2 border-yellow-200 text-yellow-700 font-bold mb-6 sm:mb-8 shadow-lg text-sm sm:text-base">
            <Star className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 fill-yellow-400 text-yellow-400" />
            Reviews & Testimonials
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-7xl font-heading font-black text-gradient mb-4 sm:mb-8">
            What People Say
          </h2>
          <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Hear from those who have experienced my work and collaboration
          </p>
        </div>

        {/* Stats Row */}
        {reviews.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
            <StatCard 
              icon={Star} 
              value={averageRating} 
              label="Average Rating" 
              gradient="bg-gradient-to-br from-yellow-400 to-orange-500"
            >
              <StarRating rating={Math.round(averageRating)} readonly size="sm" />
            </StatCard>
            
            <StatCard 
              icon={Users} 
              value={reviews.length} 
              label="Total Reviews" 
              gradient="bg-gradient-to-br from-purple-500 to-blue-500"
            />
            
            <StatCard 
              icon={TrendingUp} 
              value={positiveReviewsCount} 
              label="Positive Reviews" 
              gradient="bg-gradient-to-br from-green-500 to-emerald-500"
            />
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
          {/* Reviews List */}
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col gap-4">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                Reviews ({filteredAndSortedReviews.length})
              </h3>
              
              {reviews.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <Select value={ratingFilter} onValueChange={(v) => setRatingFilter(v as RatingFilter)}>
                      <SelectTrigger className="w-[110px] sm:w-[130px] h-9 bg-white/80 text-sm">
                        <SelectValue placeholder="Rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Ratings</SelectItem>
                        <SelectItem value="5">5 Stars</SelectItem>
                        <SelectItem value="4">4 Stars</SelectItem>
                        <SelectItem value="3">3 Stars</SelectItem>
                        <SelectItem value="2">2 Stars</SelectItem>
                        <SelectItem value="1">1 Star</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
                    <Select value={sortOption} onValueChange={(v) => setSortOption(v as SortOption)}>
                      <SelectTrigger className="w-[110px] sm:w-[130px] h-9 bg-white/80 text-sm">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest</SelectItem>
                        <SelectItem value="oldest">Oldest</SelectItem>
                        <SelectItem value="highest">Highest Rated</SelectItem>
                        <SelectItem value="lowest">Lowest Rated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {(ratingFilter !== 'all' || sortOption !== 'newest') && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={resetFilters}
                      className="text-purple-600 hover:text-purple-800 text-sm"
                    >
                      Reset
                    </Button>
                  )}
                </div>
              )}
            </div>
            
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-full flex-shrink-0" />
                        <div className="flex-1 space-y-2 sm:space-y-3">
                          <div className="h-4 bg-gray-200 rounded w-1/3" />
                          <div className="h-4 bg-gray-200 rounded w-1/4" />
                          <div className="h-12 sm:h-16 bg-gray-200 rounded" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredAndSortedReviews.length > 0 ? (
              <div className="space-y-4 max-h-[500px] sm:max-h-[600px] overflow-y-auto pr-2">
                {filteredAndSortedReviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            ) : reviews.length > 0 ? (
              <Card className="bg-white/80 backdrop-blur-lg border-2 border-purple-100">
                <CardContent className="p-6 sm:p-8 text-center">
                  <Filter className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 text-sm sm:text-base">No reviews match your filters.</p>
                  <Button 
                    variant="link" 
                    onClick={resetFilters}
                    className="text-purple-600 mt-2 text-sm sm:text-base"
                  >
                    Clear filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-white/80 backdrop-blur-lg border-2 border-purple-100">
                <CardContent className="p-6 sm:p-8 text-center">
                  <MessageSquare className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 text-sm sm:text-base">No reviews yet. Be the first to leave a review!</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Review Form */}
          <div>
            <Card className="bg-white/90 backdrop-blur-lg border-2 border-purple-200 shadow-xl lg:sticky lg:top-24">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl sm:text-2xl font-bold text-purple-800 flex items-center gap-2">
                  <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 fill-yellow-500" />
                  Leave a Review
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ReviewForm onSuccess={fetchReviews} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
});

ReviewsSection.displayName = 'ReviewsSection';

export default ReviewsSection;
