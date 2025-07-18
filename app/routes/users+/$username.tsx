import { invariantResponse } from '@epic-web/invariant';
import { Img } from 'openimg/react';
import {
  type LoaderFunctionArgs,
  Form,
  Link,
  useLoaderData,
} from 'react-router';
import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx';
import { Spacer } from '#app/components/spacer.tsx';
import { Button } from '#app/components/ui/button.tsx';
import { Icon } from '#app/components/ui/icon.tsx';
import { prisma } from '#app/utils/db.server.ts';
import { getUserImgSrc } from '#app/utils/misc.tsx';
import { useOptionalUser } from '#app/utils/user.ts';
import { type Route } from './+types/$username.ts';

export async function loader({ params }: LoaderFunctionArgs) {
  const user = await prisma.user.findFirst({
    select: {
      id: true,
      name: true,
      username: true,
      createdAt: true,
      image: { select: { id: true, objectKey: true } },
    },
    where: {
      username: params.username,
    },
  });

  invariantResponse(user, 'User not found', { status: 404 });

  return { user, userJoinedDisplay: user.createdAt.toLocaleDateString() };
}

export default function ProfileRoute() {
  const data = useLoaderData<typeof loader>();
  const user = data.user;
  const userDisplayName = user.name ?? user.username;
  const loggedInUser = useOptionalUser();
  const isLoggedInUser = user.id === loggedInUser?.id;

  return (
    <div className="container mt-36 mb-48 flex flex-col items-center justify-center">
      <Spacer size="4xs" />

      <div className="bg-muted container flex flex-col items-center rounded-3xl p-12">
        <div className="relative w-52">
          <div className="absolute -top-40">
            <div className="relative">
              <Img
                src={getUserImgSrc(data.user.image?.objectKey)}
                alt={userDisplayName}
                className="size-52 rounded-full object-cover"
                width={832}
                height={832}
              />
            </div>
          </div>
        </div>

        <Spacer size="sm" />

        <div className="flex flex-col items-center">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <h1 className="text-h2 text-center">{userDisplayName}</h1>
          </div>
          <p className="text-muted-foreground mt-2 text-center">
            Joined {data.userJoinedDisplay}
          </p>
          {isLoggedInUser ? (
            <Form action="/logout" method="POST" className="mt-3">
              <Button type="submit" variant="link" size="pill">
                <Icon name="exit" className="scale-125 max-md:scale-150">
                  Logout
                </Icon>
              </Button>
            </Form>
          ) : null}
          <div className="mt-10 flex gap-4">
            {isLoggedInUser ? (
              <>
                <Button asChild>
                  <Link to="notes" prefetch="intent">
                    My notes
                  </Link>
                </Button>
                <Button asChild>
                  <Link to="/settings/profile" prefetch="intent">
                    Edit profile
                  </Link>
                </Button>
              </>
            ) : (
              <Button asChild>
                <Link to="notes" prefetch="intent">
                  {userDisplayName}'s notes
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export const meta: Route.MetaFunction = ({ data, params }) => {
  const displayName = data?.user.name ?? params.username;
  return [
    { title: `${displayName} | Epic Notes` },
    {
      name: 'description',
      content: `Profile of ${displayName} on Epic Notes`,
    },
  ];
};

export function ErrorBoundary() {
  return (
    <GeneralErrorBoundary
      statusHandlers={{
        404: ({ params }) => (
          <p>No user with the username "{params.username}" exists</p>
        ),
      }}
    />
  );
}
