export type RouteTransform = {
  readonly stripPrefix?: string;
  readonly addPrefix?: string;
};

export type ProxyConfig = {
  readonly targetUrl: string;
  readonly routeTransform?: RouteTransform;
};
