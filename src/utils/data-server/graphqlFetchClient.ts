import { GraphQLResponse } from '@/utils/data-server/fetchGraphQL';

export async function graphqlFetchClient<T>(
  apiEndPoint: string,
  query: string,
  variables?: Record<string, unknown>,
  signal?: AbortSignal
): Promise<T> {
  const res = await fetch(apiEndPoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
    signal,
  });

  if (!res.ok) {
    throw new Error(`${apiEndPoint} - GraphQL network error ${res.status}`);
  }

  const json = (await res.json()) as GraphQLResponse<T>;

  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join('; '));
  }

  if (!json.data) {
    throw new Error(`${apiEndPoint} - GraphQL client: data is null`);
  }

  return json.data;
}
