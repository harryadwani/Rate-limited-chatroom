const backendUrl: string = 'http://localhost:8080';

export async function signInWithUsername(username: string): Promise<string[]> {
  const result = await fetch(`${backendUrl}/signin`, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
    }),
  });
  return result.json();
}

export async function getLast50Messages(): Promise<any> {
  const result = await fetch(`${backendUrl}/last50messages`, {
    method: 'get',
  });
  return result.json();
}
