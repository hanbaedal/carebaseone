function formatKoreaDateTimeStorage(value = new Date()) {
  const local = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(value);
  return `${local.replace(" ", "T")}+09:00`;
}

function mongoCreated(at = new Date()) {
  return { createdAt: at, createdAtKst: formatKoreaDateTimeStorage(at) };
}

function mongoCreatedUpdated(at = new Date()) {
  const kst = formatKoreaDateTimeStorage(at);
  return {
    createdAt: at,
    createdAtKst: kst,
    updatedAt: at,
    updatedAtKst: kst,
  };
}

module.exports = { formatKoreaDateTimeStorage, mongoCreated, mongoCreatedUpdated };
