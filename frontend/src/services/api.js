const API_BASE = 'http://localhost:8005';

export async function fetchStreamStatus() {
  try {
    const res = await fetch(`${API_BASE}/api/stream-status`);
    if (!res.ok) throw new Error('Failed');
    return await res.json();
  } catch (e) {
    return null;
  }
}

export async function fetchMedallion() {
  try {
    const res = await fetch(`${API_BASE}/api/medallion`);
    if (!res.ok) throw new Error('Failed');
    return await res.json();
  } catch (e) {
    return null;
  }
}

export async function fetchSnapshots() {
  try {
    const res = await fetch(`${API_BASE}/api/snapshots`);
    if (!res.ok) throw new Error('Failed');
    return await res.json();
  } catch (e) {
    return null;
  }
}

export async function runTimeTravelQuery(snapshotId) {
  try {
    const res = await fetch(`${API_BASE}/api/time-travel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ snapshotId })
    });
    if (!res.ok) throw new Error('Failed');
    return await res.json();
  } catch (e) {
    return null;
  }
}
