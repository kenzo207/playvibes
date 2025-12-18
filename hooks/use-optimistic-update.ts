import { useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { getErrorMessage } from "@/lib/utils/api-client";

interface UseOptimisticUpdateOptions<TResult = void> {
  mutationFn: () => Promise<TResult>;
  onSuccess?: (data: TResult) => void;
  onError?: (error: Error) => void;
  rollbackFn?: () => void;
  successMessage?: string;
  errorMessage?: string;
}

interface UseOptimisticUpdateReturn {
  execute: () => Promise<void>;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook for managing optimistic UI updates with automatic rollback on error
 *
 * @example
 * const { execute, isLoading } = useOptimisticUpdate({
 *   mutationFn: async () => {
 *     return await apiClient.post('/api/like', { id: '123' });
 *   },
 *   onSuccess: (data) => {
 *     console.log('Success:', data);
 *   },
 *   successMessage: 'Liked!',
 *   errorMessage: 'Failed to like'
 * });
 */
export function useOptimisticUpdate<TResult = void>(
  options: UseOptimisticUpdateOptions<TResult>
): UseOptimisticUpdateReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const execute = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await options.mutationFn();

      // Call success callback
      options.onSuccess?.(result);

      // Show success toast if message provided
      if (options.successMessage) {
        toast({
          title: "Success",
          description: options.successMessage,
          variant: "success",
          duration: 2000,
        });
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);

      // Rollback optimistic update
      options.rollbackFn?.();

      // Call error callback
      options.onError?.(error);

      // Show error toast
      toast({
        title: "Error",
        description: options.errorMessage || getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, options, toast]);

  return {
    execute,
    isLoading,
    error,
  };
}
