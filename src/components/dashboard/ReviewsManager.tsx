import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StarRating } from '@/components/reviews/StarRating';
import { Check, X, Trash2, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface Review {
  id: string;
  reviewer_name: string;
  reviewer_email: string;
  rating: number;
  review_text: string;
  is_approved: boolean | null;
  created_at: string;
}

const ReviewsManager = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchReviews = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch reviews',
        variant: 'destructive',
      });
    } else {
      setReviews(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleApproval = async (reviewId: string, approve: boolean) => {
    setActionLoading(reviewId);
    const { error } = await supabase
      .from('reviews')
      .update({ is_approved: approve })
      .eq('id', reviewId);

    if (error) {
      toast({
        title: 'Error',
        description: `Failed to ${approve ? 'approve' : 'reject'} review`,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: `Review ${approve ? 'approved' : 'rejected'} successfully`,
      });
      fetchReviews();
    }
    setActionLoading(null);
  };

  const handleDelete = async (reviewId: string) => {
    setActionLoading(reviewId);
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete review',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Review deleted successfully',
      });
      fetchReviews();
    }
    setActionLoading(null);
  };

  const getStatusBadge = (isApproved: boolean | null) => {
    if (isApproved === true) {
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          <CheckCircle className="w-3 h-3 mr-1" />
          Approved
        </Badge>
      );
    } else if (isApproved === false) {
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
          <XCircle className="w-3 h-3 mr-1" />
          Rejected
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      );
    }
  };

  const pendingReviews = reviews.filter(r => r.is_approved === null || r.is_approved === false);
  const approvedReviews = reviews.filter(r => r.is_approved === true);

  if (loading) {
    return (
      <Card className="animate-fade-in">
        <CardContent className="p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-purple-600" />
          <p className="mt-4 text-muted-foreground">Loading reviews...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Review Management</span>
            <div className="flex gap-2 text-sm font-normal">
              <Badge variant="outline" className="bg-yellow-50">
                {pendingReviews.length} Pending
              </Badge>
              <Badge variant="outline" className="bg-green-50">
                {approvedReviews.length} Approved
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reviews.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No reviews submitted yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <Card key={review.id} className="border-l-4 border-l-purple-400">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h4 className="font-semibold text-lg">{review.reviewer_name}</h4>
                          {getStatusBadge(review.is_approved)}
                        </div>
                        
                        <p className="text-sm text-muted-foreground">{review.reviewer_email}</p>
                        
                        <div className="flex items-center gap-2">
                          <StarRating rating={review.rating} readonly size="sm" />
                          <span className="text-sm text-muted-foreground">({review.rating}/5)</span>
                        </div>
                        
                        <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{review.review_text}</p>
                        
                        <p className="text-xs text-muted-foreground">
                          Submitted: {new Date(review.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>

                      <div className="flex md:flex-col gap-2">
                        {review.is_approved !== true && (
                          <Button
                            size="sm"
                            onClick={() => handleApproval(review.id, true)}
                            disabled={actionLoading === review.id}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            {actionLoading === review.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <Check className="w-4 h-4 mr-1" />
                                Approve
                              </>
                            )}
                          </Button>
                        )}
                        
                        {review.is_approved !== false && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleApproval(review.id, false)}
                            disabled={actionLoading === review.id}
                            className="border-orange-300 text-orange-600 hover:bg-orange-50"
                          >
                            {actionLoading === review.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <X className="w-4 h-4 mr-1" />
                                Reject
                              </>
                            )}
                          </Button>
                        )}

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="destructive"
                              disabled={actionLoading === review.id}
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Review</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to permanently delete this review from {review.reviewer_name}? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(review.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewsManager;
