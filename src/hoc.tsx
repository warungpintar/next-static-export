import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import * as pathToRegexp from 'path-to-regexp';

const hoc = (Component: React.FC) => {
  const FallbackWrapper = () => {
    const [isPathChecking, setPathChecking] = useState(true);
    const router = useRouter();

    useEffect(() => {
      const routeDefs = (process.env.ROUTE_DEFS ?? []) as string[];

      if (window.location.pathname === '/') {
        router.replace('/');
      }

      if (
        window.location.pathname !== '/404' &&
        window.location.pathname !== '/'
      ) {
        const found = routeDefs.find(item => {
          const fn = pathToRegexp.match(item, {
            decode: decodeURIComponent,
          });
          if (fn(window.location.pathname)) {
            return true;
          }

          return false;
        });

        if (found) {
          const parse = pathToRegexp.match(found, {
            decode: decodeURIComponent,
          });

          // @ts-ignore
          const { params = {} } = parse(window.location.pathname);
          router
            .replace({
              pathname: window.location.pathname.replace(/\/\:.+/g, ''),
              query: params,
              search: window.location.search,
            })
            .then(() => {
              setPathChecking(false);
            });
        } else {
          setPathChecking(false);
        }
      }
    }, [router]);

    if (isPathChecking) {
      return null;
    }

    return <Component />;
  };

  return FallbackWrapper;
};

export default hoc;
