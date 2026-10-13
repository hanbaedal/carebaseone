import { activity, ensureIndexes, pageviews, type PageViewDoc } from "@/lib/db";

function seoulStartOfToday() {
  const day = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  return new Date(`${day}T00:00:00+09:00`);
}

export async function recordPageView(input: {
  path: string;
  locale: PageViewDoc["locale"];
  device: PageViewDoc["device"];
  kind: PageViewDoc["kind"];
}) {
  await ensureIndexes();
  await (await pageviews()).insertOne({ ...input, createdAt: new Date() });
}

export async function getDashboard() {
  await ensureIndexes();
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const today = seoulStartOfToday();
  const views = await pageviews();
  const logs = await activity();

  const [guestToday, guestWeek, staffWeek, byLocale, byDevice, topPages, daily, loginsToday, recent] =
    await Promise.all([
      views.countDocuments({ kind: "guest", createdAt: { $gte: today } }),
      views.countDocuments({ kind: "guest", createdAt: { $gte: since } }),
      views.countDocuments({ kind: "staff", createdAt: { $gte: since } }),
      views
        .aggregate<{ _id: string; count: number }>([
          { $match: { kind: "guest", createdAt: { $gte: since } } },
          { $group: { _id: "$locale", count: { $sum: 1 } } },
        ])
        .toArray(),
      views
        .aggregate<{ _id: string; count: number }>([
          { $match: { kind: "guest", createdAt: { $gte: since } } },
          { $group: { _id: "$device", count: { $sum: 1 } } },
        ])
        .toArray(),
      views
        .aggregate<{ _id: string; count: number }>([
          { $match: { kind: "guest", createdAt: { $gte: since } } },
          { $group: { _id: "$path", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 8 },
        ])
        .toArray(),
      views
        .aggregate<{ _id: string; count: number }>([
          { $match: { kind: "guest", createdAt: { $gte: since } } },
          {
            $group: {
              _id: {
                $dateToString: {
                  format: "%m-%d",
                  date: "$createdAt",
                  timezone: "Asia/Seoul",
                },
              },
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ])
        .toArray(),
      logs.countDocuments({ action: "login", createdAt: { $gte: today } }),
      logs.find({}).sort({ createdAt: -1 }).limit(30).toArray(),
    ]);

  return {
    guestToday,
    guestWeek,
    staffWeek,
    loginsToday,
    byLocale,
    byDevice,
    topPages,
    daily,
    recent,
  };
}
