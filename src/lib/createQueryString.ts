export const createQueryStringBase =
  (originalSearchParams?: URLSearchParams) =>
  (
    searchParams: {
      name: string;
      value?: string;
    }[],
  ) => {
    const params = new URLSearchParams(originalSearchParams?.toString());
    searchParams.forEach(({ name, value }) => {
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
    });

    return params.toString();
  };

export const createQueryString = (
  params: Record<string, string | number | undefined | null>,
) => {
  const searchParams = Object.entries(params)
    .filter(([, value]) => Boolean(value))
    .map(([name, value]) => ({
      name,
      value: value as string,
    }));

  return createQueryStringBase()(searchParams);
};
