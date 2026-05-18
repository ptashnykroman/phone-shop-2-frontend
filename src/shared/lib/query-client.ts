import {
  MutationCache,
  QueryCache,
  QueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/shared/lib/api-error";

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 0,
      },
    },
    queryCache: new QueryCache({
      onError: (error) => {
        toast.error(getApiErrorMessage(error));
      },
    }),
    mutationCache: new MutationCache({
      onError: (error) => {
        toast.error(getApiErrorMessage(error));
      },
    }),
  });
}
