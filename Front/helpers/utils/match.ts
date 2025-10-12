import { MatchItem } from '@/helpers/interfaces/matches';

//date
export const todayISO = () => new Date().toISOString().slice(0, 10);

export const shiftDate = (iso: string, days: number) => {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

export function formatKickoff(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

//matches
export function statusBadge(m: MatchItem) {
  if (m.status === 'FINISHED') return 'FT';
  if (m.status === 'LIVE' || m.status === 'IN_PLAY' || m.status === 'PAUSED') {
    return m.minute ? `${m.minute}'` : 'LIVE';
  }
  return formatKickoff(m.utcDate);
}

export function sortMatches(a: MatchItem, b: MatchItem) {
  const order = (m: MatchItem) =>
    m.status === 'LIVE' || m.status === 'IN_PLAY' || m.status === 'PAUSED'
      ? 0
      : m.status === 'SCHEDULED' || m.status === 'TIMED'
      ? 1
      : 2;
  const oa = order(a);
  const ob = order(b);
  if (oa !== ob) return oa - ob;
  return new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime();
}
