export function bd09togcj02(bd_lng: number, bd_lat: number): number[] {
  // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
  const x_PI = 3.14159265358979324 * 3000.0 / 180.0;
  let x = bd_lng - 0.0065;
  let y = bd_lat - 0.006;
  let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_PI);
  let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_PI);
  let gg_lng = z * Math.cos(theta);
  let gg_lat = z * Math.sin(theta);
  return [gg_lng, gg_lat]
}