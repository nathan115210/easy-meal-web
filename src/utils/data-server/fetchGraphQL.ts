import apiFetchServer from '@/utils/data-server/apiFetchServer';

export type GraphQLErrorItem = { message: string };

export type GraphQLResponse<T> = {
  data?: T;
  errors?: GraphQLErrorItem[];
};

async function fetchGraphQL<T>(
  apiEndPoint: string,
  query: string,
  options: {
    tags?: string[];
    variables?: Record<string, unknown>;
    revalidate?: number | false;
  } = {}
): Promise<T | null> {
  const payload = {
    query,
    ...(options.variables ? { variables: options.variables } : {}),
  };

  const res = await apiFetchServer<GraphQLResponse<T>>(apiEndPoint, {
    method: 'POST',
    body: payload,
    tags: options.tags,
    revalidate: options.revalidate,
  });

  if (res.errors?.length) {
    const msg = res.errors.map((e) => e.message).join('; ');
    throw new Error(`GraphQL failed: ${msg}`);
  }

  return res.data ?? null;
}

export default fetchGraphQL;
