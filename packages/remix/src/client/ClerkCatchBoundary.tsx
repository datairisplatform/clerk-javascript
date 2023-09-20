import { isRouteErrorResponse, useRouteError } from '@remix-run/react';
import React from 'react';

import { Interstitial } from './Interstitial';

export function ClerkCatchBoundary(RootCatchBoundary?: React.ComponentType) {
  return () => {
    const error = useRouteError();

    let __clerk_ssr_interstitial_html;

    if (isRouteErrorResponse(error)) {
      ({ __clerk_ssr_interstitial_html } = error?.data?.clerkState?.__internal_clerk_state || {});
    }

    if (__clerk_ssr_interstitial_html) {
      return <Interstitial html={__clerk_ssr_interstitial_html} />;
    }

    if (!RootCatchBoundary) {
      return undefined;
    }

    return <RootCatchBoundary />;
  };
}
