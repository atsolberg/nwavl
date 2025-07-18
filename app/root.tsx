import { OpenImgContextProvider } from 'openimg/react';
import React from 'react';
import {
  data,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useMatches,
} from 'react-router';
import { HoneypotProvider } from 'remix-utils/honeypot/react';
import { type Route } from './+types/root.ts';
import appleTouchIconAssetUrl from './assets/favicons/apple-touch-icon.png';
import faviconAssetUrl from './assets/favicons/favicon.svg';
import { GeneralErrorBoundary } from './components/error-boundary.tsx';
import { EpicProgress } from './components/progress-bar.tsx';
import { SearchBar } from './components/search-bar.tsx';
import { useToast } from './components/toaster.tsx';
import { Button } from './components/ui/button.tsx';
import { href as iconsHref } from './components/ui/icon.tsx';
import { EpicToaster } from './components/ui/sonner.tsx';
import { UserDropdown } from './components/user-dropdown.tsx';
import {
  ThemeSwitch,
  useOptionalTheme,
  useTheme,
} from './routes/resources+/theme-switch.tsx';
import tailwindStyleSheetUrl from './styles/tailwind.css?url';
import { getUserId, logout } from './utils/auth.server.ts';
import { ClientHintCheck, getHints } from './utils/client-hints.tsx';
import { prisma } from './utils/db.server.ts';
import { getEnv } from './utils/env.server.ts';
import { pipeHeaders } from './utils/headers.server.ts';
import { honeypot } from './utils/honeypot.server.ts';
import { cn, combineHeaders, getDomainUrl, getImgSrc } from './utils/misc.tsx';
import { useNonce } from './utils/nonce-provider.ts';
import { type Theme, getTheme } from './utils/theme.server.ts';
import { makeTimings, time } from './utils/timing.server.ts';
import { getToast } from './utils/toast.server.ts';
import { useOptionalUser } from './utils/user.ts';

export const links: Route.LinksFunction = () => {
  return [
    // Preload svg sprite as a resource to avoid render blocking
    { rel: 'preload', href: iconsHref, as: 'image' },
    {
      rel: 'icon',
      href: '/favicon.ico',
      sizes: '48x48',
    },
    { rel: 'icon', type: 'image/svg+xml', href: faviconAssetUrl },
    { rel: 'apple-touch-icon', href: appleTouchIconAssetUrl },
    {
      rel: 'manifest',
      href: '/site.webmanifest',
      crossOrigin: 'use-credentials',
    } as const, // necessary to make typescript happy
    { rel: 'stylesheet', href: tailwindStyleSheetUrl },
  ].filter(Boolean);
};

export const meta: Route.MetaFunction = ({ data }) => {
  return [
    { title: data ? 'Epic Notes' : 'Error | Epic Notes' },
    { name: 'description', content: `Your own captain's log` },
  ];
};

export async function loader({ request }: Route.LoaderArgs) {
  const timings = makeTimings('root loader');
  const userId = await time(() => getUserId(request), {
    timings,
    type: 'getUserId',
    desc: 'getUserId in root',
  });

  const user = userId
    ? await time(
        () =>
          prisma.user.findUnique({
            select: {
              id: true,
              name: true,
              username: true,
              image: { select: { objectKey: true } },
              roles: {
                select: {
                  name: true,
                  permissions: {
                    select: { entity: true, action: true, access: true },
                  },
                },
              },
            },
            where: { id: userId },
          }),
        { timings, type: 'find user', desc: 'find user in root' }
      )
    : null;
  if (userId && !user) {
    console.info('something weird happened');
    // something weird happened... The user is authenticated but we can't find
    // them in the database. Maybe they were deleted? Let's log them out.
    await logout({ request, redirectTo: '/' });
  }
  const { toast, headers: toastHeaders } = await getToast(request);
  const honeyProps = await honeypot.getInputProps();

  return data(
    {
      user,
      requestInfo: {
        hints: getHints(request),
        origin: getDomainUrl(request),
        path: new URL(request.url).pathname,
        userPrefs: {
          theme: getTheme(request),
        },
      },
      ENV: getEnv(),
      toast,
      honeyProps,
    },
    {
      headers: combineHeaders(
        { 'Server-Timing': timings.toString() },
        toastHeaders
      ),
    }
  );
}

export const headers: Route.HeadersFunction = pipeHeaders;

function Document({
  children,
  nonce,
  theme = 'light',
  env = {},
}: {
  children: React.ReactNode;
  nonce: string;
  theme?: Theme;
  env?: Record<string, string | undefined>;
}) {
  const allowIndexing = ENV.ALLOW_INDEXING !== 'false';
  return (
    <html lang="en" className={`${theme} h-full overflow-x-hidden`}>
      <head>
        <ClientHintCheck nonce={nonce} />
        <Meta />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        {allowIndexing ? null : (
          <meta name="robots" content="noindex, nofollow" />
        )}
        <Links />
        <script
          src="https://kit.fontawesome.com/fe766b0f79.js"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body
        className={cn(
          'bg-white text-slate-500 antialiased',
          'dark:bg-slate-900 dark:text-slate-400'
        )}
      >
        {children}
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(env)}`,
          }}
        />
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  // if there was an error running the loader, data could be missing
  const data = useLoaderData<typeof loader | null>();
  const nonce = useNonce();
  const theme = useOptionalTheme();
  return (
    <Document nonce={nonce} theme={theme} env={data?.ENV}>
      {children}
    </Document>
  );
}

function Logo() {
  return (
    <Link to="/" className="font-bold">
      📺 <span className="hidden sm:inline">NW AVL</span>
    </Link>
  );
}

function Header() {
  const user = useOptionalUser();
  const matches = useMatches();
  const isOnSearchPage = matches.find(m => m.id === 'routes/users+/index');
  const searchBar =
    !user || isOnSearchPage ? null : <SearchBar status="idle" />;

  return (
    <header
      className={cn(
        'sticky',
        'w-full',
        'top-0',
        'z-40',
        'transition-colors',
        'duration-500',

        'border-b',
        'border-slate-200',
        'dark:border-slate-700',
        'dark:border-slate-50/[0.06]',

        'backdrop-blur',
        'bg-white',
        'dark:bg-slate-900/75'
      )}
    >
      <nav
        className={cn(
          'container py-3 md:py-6',
          'flex flex-wrap items-center justify-between gap-4',
          'sm:flex-nowrap',
          'md:gap-8'
        )}
      >
        <Logo />
        <div className="ml-auto hidden max-w-sm flex-1 sm:block">
          {searchBar}
        </div>
        <div className="flex items-center gap-10">
          <ul
            className={cn(
              'flex',
              'text-sm leading-6 font-semibold text-slate-700',
              'dark:text-slate-200'
            )}
          >
            <li>
              <Link className="px-3 text-sky-500 hover:text-sky-600" to="/">
                <i className="fa-solid fa-clipboard-list text-lg" aria-hidden />{' '}
                Checklist
              </Link>
            </li>
            <li>
              <Link
                className="px-3 text-sky-500 hover:text-sky-600"
                to="/troubleshooting"
              >
                <i
                  className="fa-solid fa-circle-question text-lg"
                  aria-hidden
                />{' '}
                Help
              </Link>
            </li>
          </ul>

          {user ? (
            <UserDropdown />
          ) : (
            <Button asChild variant="secondary" size="sm">
              <Link to="/login">Log In</Link>
            </Button>
          )}
        </div>
        {searchBar ? (
          <div className="block w-full sm:hidden">{searchBar}</div>
        ) : null}
      </nav>
    </header>
  );
}

function App() {
  const data = useLoaderData<typeof loader>();
  const theme = useTheme();
  useToast(data.toast);

  return (
    <OpenImgContextProvider
      optimizerEndpoint="/resources/images"
      getSrc={getImgSrc}
    >
      <div className="flex min-h-screen flex-col justify-between">
        <Header />

        <div className="flex flex-1 flex-col">
          <Outlet />
        </div>

        <footer
          className={cn(
            'transition-colors duration-500',

            'border-t',
            'border-slate-200',
            'dark:border-slate-700',
            'dark:border-slate-50/[0.06]',

            'backdrop-blur',
            'bg-white',
            'dark:bg-slate-900/75'
          )}
        >
          <div className="container flex justify-end py-5">
            <ThemeSwitch userPreference={data.requestInfo.userPrefs.theme} />
          </div>
        </footer>
      </div>
      <EpicToaster closeButton position="top-center" theme={theme} />
      <EpicProgress />
    </OpenImgContextProvider>
  );
}

function AppWithProviders() {
  const data = useLoaderData<typeof loader>();
  return (
    <HoneypotProvider {...data.honeyProps}>
      <App />
    </HoneypotProvider>
  );
}

export default AppWithProviders;

// This is a last resort error boundary.
// There's not much useful information we can offer at this level.
export const ErrorBoundary = GeneralErrorBoundary;
