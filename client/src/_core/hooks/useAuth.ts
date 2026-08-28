import { Capacitor } from "@capacitor/core";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { TRPCClientError } from "@trpc/client";
import { useCallback, useEffect, useMemo } from "react";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

export function useAuth(options?: UseAuthOptions) {
  const isNative = Capacitor.isNativePlatform();
  const { redirectOnUnauthenticated = false, redirectPath = getLoginUrl() } = options ?? {};
  const utils = trpc.useUtils();

  const meQuery = trpc.auth.me.useQuery(undefined, {
    enabled: !isNative,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      utils.auth.me.setData(undefined, null);
    },
  });

  const logout = useCallback(async () => {
    if (isNative) return;

    try {
      await logoutMutation.mutateAsync();
    } catch (error: unknown) {
      if (error instanceof TRPCClientError && error.data?.code === "UNAUTHORIZED") return;
      throw error;
    } finally {
      utils.auth.me.setData(undefined, null);
      await utils.auth.me.invalidate();
    }
  }, [isNative, logoutMutation, utils]);

  const state = useMemo(() => {
    const localDisplayUser = isNative ? { name: "Modo local", email: "local" } : null;
    const user = meQuery.data ?? localDisplayUser;

    return {
      user,
      loading: isNative ? false : meQuery.isLoading || logoutMutation.isPending,
      error: isNative ? null : meQuery.error ?? logoutMutation.error ?? null,
      isAuthenticated: isNative ? false : Boolean(meQuery.data),
    };
  }, [isNative, meQuery.data, meQuery.error, meQuery.isLoading, logoutMutation.error, logoutMutation.isPending]);

  useEffect(() => {
    if (isNative || !redirectOnUnauthenticated) return;
    if (meQuery.isLoading || logoutMutation.isPending || meQuery.data) return;
    if (typeof window === "undefined") return;
    const current = `${window.location.pathname}${window.location.search}`;
    if (current === redirectPath) return;
    window.location.assign(redirectPath);
  }, [isNative, redirectOnUnauthenticated, redirectPath, logoutMutation.isPending, meQuery.data, meQuery.isLoading]);

  return {
    ...state,
    isNative,
    refresh: () => (isNative ? Promise.resolve(null) : meQuery.refetch()),
    logout,
  };
}
