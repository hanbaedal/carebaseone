export function cmsSlotRing(active: boolean) {
  return active
    ? "rounded-md ring-2 ring-brand ring-offset-2 ring-offset-white"
    : "rounded-md hover:ring-2 hover:ring-brand/40 hover:ring-offset-2 hover:ring-offset-transparent";
}

export function cmsPreviewText(value: string, empty: string) {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : empty;
}
