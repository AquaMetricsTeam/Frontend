export function useMe(_options?: { staleTime?: number }) {
  return {
    data: {
      data: {
        id: "1",
        name: "Rania Amari",
        email: "rania@aquametrics.com",
        role: "Administrator",
      },
    },
    isLoading: false,
  };
}
