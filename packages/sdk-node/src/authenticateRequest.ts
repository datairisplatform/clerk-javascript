import { Clerk, constants, RequestState } from '@clerk/backend';
import cookie from 'cookie';
import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

import { ClerkMiddlewareOptions } from './types';

const parseCookies = (req: ExpressRequest) => {
  return cookie.parse(req.headers['cookie'] || '');
};

export const authenticateRequest = (
  clerkClient: ReturnType<typeof Clerk>,
  apiKey: string,
  frontendApi: string,
  publishableKey: string,
  req: ExpressRequest,
  options?: ClerkMiddlewareOptions,
) => {
  const cookies = parseCookies(req);
  const { jwtKey, authorizedParties } = options || {};
  return clerkClient.authenticateRequest({
    apiKey,
    frontendApi,
    publishableKey,
    jwtKey,
    authorizedParties,
    cookieToken: cookies[constants.Cookies.Session] || '',
    headerToken: req.headers[constants.Headers.Authorization]?.replace('Bearer ', '') || '',
    clientUat: cookies[constants.Cookies.ClientUat] || '',
    host: req.headers.host as string,
    forwardedPort: req.headers[constants.Headers.ForwardedPort] as string,
    forwardedHost: req.headers[constants.Headers.ForwardedHost] as string,
    referrer: req.headers.referer,
    userAgent: req.headers['user-agent'] as string,
  });
};

export const handleInterstitialCase = (res: ExpressResponse, requestState: RequestState, interstitial: string) => {
  if (requestState.isInterstitial) {
    res.writeHead(401, { 'Content-Type': 'text/html' });
    res.end(interstitial);
  }
};

export const decorateResponseWithObservabilityHeaders = (res: ExpressResponse, requestState: RequestState) => {
  requestState.message && res.setHeader(constants.Headers.AuthMessage, requestState.message);
  requestState.reason && res.setHeader(constants.Headers.AuthReason, requestState.reason);
  requestState.status && res.setHeader(constants.Headers.AuthStatus, requestState.status);
};