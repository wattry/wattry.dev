import { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

interface GithubEvent {
  id: string;
  type: string;
  repo: { name: string };
  created_at: string;
  payload: {
    commits?: unknown[];
    action?: string;
    number?: number;
    pull_request?: { number?: number };
    issue?: { number?: number };
    ref_type?: string;
    ref?: string | null;
  };
}

const relativeTime = (iso: string): string => {
  const ms = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(ms / 60000);

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h ago`;
  }

  return `${Math.floor(hours / 24)}d ago`;
};

const describe = (event: GithubEvent): string => {
  const repo = event.repo.name;

  switch (event.type) {
    case 'PushEvent': {
      const count = event.payload.commits?.length ?? 0;

      return `pushed ${count} commit${count === 1 ? '' : 's'} to ${repo}`;
    }
    case 'PullRequestEvent':
      return `${event.payload.action ?? 'touched'} PR #${event.payload.pull_request?.number ?? event.payload.number ?? '?'} in ${repo}`;
    case 'IssuesEvent':
      return `${event.payload.action ?? 'touched'} issue #${event.payload.issue?.number ?? '?'} in ${repo}`;
    case 'CreateEvent':
      return `created ${event.payload.ref_type ?? 'ref'} ${event.payload.ref ?? ''} in ${repo}`.replace(/\s+/g, ' ').trim();
    case 'WatchEvent':
      return `starred ${repo}`;
    case 'ForkEvent':
      return `forked ${repo}`;
    default:
      return `${event.type} in ${repo}`;
  }
};

function GithubFeed() {
  const [events, setEvents] = useState<GithubEvent[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    fetch('https://api.github.com/users/wattry/events/public')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        return res.json();
      })
      .then((json: GithubEvent[]) => {
        if (!cancelled) {
          setEvents(json.slice(0, 10));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError('github unreachable');
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!events) {
    return <Typography>fetching github activity…</Typography>;
  }

  if (!events.length) {
    return <Typography>no recent public activity</Typography>;
  }

  return (
    <Typography>
      <Link color="primary" underline="hover" href="https://github.com/wattry" target="_blank">github.com/wattry</Link>
      {events.map((event) => <li key={event.id}>{describe(event)} — {relativeTime(event.created_at)}</li>)}
    </Typography>
  );
}

export default GithubFeed;
