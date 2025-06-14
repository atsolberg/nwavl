import { cn } from '#app/utils/misc.tsx';
import { type Route } from './+types/index.ts';

export const meta: Route.MetaFunction = () => [{ title: 'NW AVL' }];

export default function Index() {
  return <main className="font-poppins grid h-full place-items-center"></main>;
}
