import { GraphQLResponse } from '@/utils/data-server/fetchGraphQL';

export async function graphqlFetchClient<T>(
  query: string,
  variables?: Record<string, unknown>,
  signal?: AbortSignal
): Promise<T> {
  const res = await fetch('/api/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
    signal,
  });

  if (!res.ok) {
    throw new Error(`GraphQL network error ${res.status}`);
  }

  const json = (await res.json()) as GraphQLResponse<T>;

  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join('; '));
  }

  if (!json.data) {
    throw new Error('GraphQL client: data is null');
  }

  return json.data;
}
