import { StarRating } from './StarRating';
import { Card, CardContent } from '@/components/ui/card';
import { User } from 'lucide-react';
import { format } from 'date-fns';

interface Review {
  id: string;
  reviewer_name: string;
  rating: number;
  review_text: string;
  created_at: string;
}

interface ReviewCardProps {
  review: Review;
}

export const ReviewCard = ({ review }: ReviewCardProps) => {
  return (
    <Card className="bg-white/80 backdrop-blur-lg border-2 border-purple-100 hover:border-purple-200 transition-all duration-300 hover:shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
            <User className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
              <h4 className="font-bold text-gray-800 truncate">{review.reviewer_name}</h4>
              <span className="text-sm text-muted-foreground">
                {format(new Date(review.created_at), 'MMM d, yyyy')}
              </span>
            </div>
            <StarRating rating={review.rating} readonly size="sm" />
            <p className="mt-3 text-gray-600 leading-relaxed">{review.review_text}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
