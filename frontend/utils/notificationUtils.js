export function groupNotifications(data) {
  const today = [];
  const weekly = [];
  const now = new Date();

  data.forEach((n) => {
    const created = new Date(n.created_at);
    const diffDays = (now - created) / (1000 * 60 * 60 * 24);

    diffDays < 1 ? today.push(n) : weekly.push(n);
  });

  return { today, weekly };
}
