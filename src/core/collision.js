export function rectsOverlap(a, b) {
  return a.x < b.x + b.w
    && a.x + a.w > b.x
    && a.y < b.y + b.h
    && a.y + a.h > b.y;
}

export function solidCollisions(entity, platforms) {
  return platforms.filter(([x, y, w, h]) => rectsOverlap(entity, { x, y, w, h }));
}
