export interface Snippet {
  id: string;
  lang: 'ts' | 'js' | 'rust';
  code: string;
}

export const snippets: Snippet[] = [
  {
    id: 'ts-dedupe',
    lang: 'ts',
    code: `const seen = new Set<string>();
export function dedupe(items: string[]): string[] {
  return items.filter((item) => !seen.has(item) && !!seen.add(item));
}`,
  },
  {
    id: 'ts-unwrap',
    lang: 'ts',
    code: `type Result<T> = { ok: true; value: T } | { ok: false; error: Error };
function unwrap<T>(result: Result<T>): T {
  if (result.ok) return result.value;
  throw result.error;
}`,
  },
  {
    id: 'js-tally',
    lang: 'js',
    code: `const tally = (votes) => votes.reduce((acc, vote) => {
  acc[vote] = (acc[vote] ?? 0) + 1;
  return acc;
}, {});`,
  },
  {
    id: 'js-fetch',
    lang: 'js',
    code: `async function getJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
  return res.json();
}`,
  },
  {
    id: 'rust-match',
    lang: 'rust',
    code: `fn describe(n: i32) -> &'static str {
    match n {
        0 => "zero",
        n if n < 0 => "negative",
        _ => "positive",
    }
}`,
  },
  {
    id: 'rust-iter',
    lang: 'rust',
    code: `let evens: Vec<i32> = (1..=20).filter(|n| n % 2 == 0).map(|n| n * n).collect();
println!("{:?}", evens);`,
  },
];
