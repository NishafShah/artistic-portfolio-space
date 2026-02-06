import { useState, useEffect, useMemo } from 'react';
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

const ReviewsSection = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>('all');
  const [sortOption, setSortOption] = useState<SortOption>('newest');

  const fetchReviews = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('reviews')
      .select('id, reviewer_name, rating, review_text, created_at')
      .eq('is_approved', true)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setReviews(data);
      
      // Calculate average rating
      if (data.length > 0) {
        const avg = data.reduce((sum, r) => sum + r.rating, 0) / data.length;
        setAverageRating(Math.round(avg * 10) / 10);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const filteredAndSortedReviews = useMemo(() => {
    let result = [...reviews];

    // Apply rating filter
    if (ratingFilter !== 'all') {
      const filterRating = parseInt(ratingFilter);
      result = result.filter(r => r.rating === filterRating);
    }

    // Apply sorting
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

  const resetFilters = () => {
    setRatingFilter('all');
    setSortOption('newest');
  };

  return (
    <section id="reviews" className="py-24 px-4 bg-gradient-to-br from-purple-50 via-white to-blue-50 reveal relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-200 rounded-full animate-float opacity-20"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-200 rounded-full animate-float opacity-20" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/90 backdrop-blur-lg border-2 border-yellow-200 text-yellow-700 font-bold mb-8 shadow-xl">
            <Star className="w-5 h-5 mr-3 fill-yellow-400 text-yellow-400" />
            Reviews & Testimonials
          </div>
          <h2 className="text-5xl md:text-7xl font-heading font-black text-gradient mb-8">
            What People Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hear from those who have experienced my work and collaboration
          </p>
        </div>

        {/* Stats Row */}
        {reviews.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-white/80 backdrop-blur-lg border-2 border-yellow-200 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                  <Star className="w-7 h-7 text-white fill-white" />
                </div>
                <div className="text-4xl font-black text-gradient mb-2">{averageRating}</div>
                <StarRating rating={Math.round(averageRating)} readonly size="sm" />
                <p className="text-muted-foreground mt-2">Average Rating</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-lg border-2 border-purple-200 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <div className="text-4xl font-black text-gradient mb-2">{reviews.length}</div>
                <p className="text-muted-foreground">Total Reviews</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-lg border-2 border-green-200 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <div className="text-4xl font-black text-gradient-secondary mb-2">
                  {reviews.filter(r => r.rating >= 4).length}
                </div>
                <p className="text-muted-foreground">Positive Reviews</p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Reviews List */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-purple-600" />
                Reviews ({filteredAndSortedReviews.length})
              </h3>
              
              {reviews.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <Select value={ratingFilter} onValueChange={(v) => setRatingFilter(v as RatingFilter)}>
                      <SelectTrigger className="w-[130px] h-9 bg-white/80">
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
                      <SelectTrigger className="w-[130px] h-9 bg-white/80">
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
                      className="text-purple-600 hover:text-purple-800"
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
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                        <div className="flex-1 space-y-3">
                          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                          <div className="h-16 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredAndSortedReviews.length > 0 ? (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {filteredAndSortedReviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            ) : reviews.length > 0 ? (
              <Card className="bg-white/80 backdrop-blur-lg border-2 border-purple-100">
                <CardContent className="p-8 text-center">
                  <Filter className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">No reviews match your filters.</p>
                  <Button 
                    variant="link" 
                    onClick={resetFilters}
                    className="text-purple-600 mt-2"
                  >
                    Clear filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-white/80 backdrop-blur-lg border-2 border-purple-100">
                <CardContent className="p-8 text-center">
                  <MessageSquare className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">No reviews yet. Be the first to leave a review!</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Review Form */}
          <div>
            <Card className="bg-white/90 backdrop-blur-lg border-2 border-purple-200 shadow-xl sticky top-8">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-purple-800 flex items-center gap-2">
                  <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
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
};

export default ReviewsSection;
