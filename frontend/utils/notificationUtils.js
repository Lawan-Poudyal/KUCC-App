// utils/notificationUtils.js

export function groupNotifications(data = []) {
  const today = [];
  const weekly = [];
  const older = [];
  const now = new Date();

  data.forEach((n) => {
    if (!n.created_at) return;

    const created = new Date(n.created_at);
    const diffDays = (now - created) / (1000 * 60 * 60 * 24);

    if (diffDays < 1) {
      today.push(n);
    } else if (diffDays <= 7) {
      weekly.push(n);
    } else {
      older.push(n);
    }
  });

  return { today, weekly, older };
}

export function groupByPriority(data = []) {
  const high = [];
  const medium = [];
  const low = [];

  data.forEach((n) => {
    if (!n.priority) return;

    switch (n.priority.toLowerCase()) {
      case 'high':
        high.push(n);
        break;
      case 'medium':
        medium.push(n);
        break;
      case 'low':
        low.push(n);
        break;
      default:
        low.push(n);
    }
  });

  return { high, medium, low };
}