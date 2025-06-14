import PreserviceChecklist from '#app/components/ui/preservice-checklist';

import { cn } from '#app/utils/misc.tsx';
import { type Route } from './+types/index.ts';

export const meta: Route.MetaFunction = () => [{ title: 'NW AVL' }];

export default function Index() {
  return (
    <main className="font-poppins container grid h-full">
      <h1
        className={cn(
          'mt-5 mb-3',
          'text-xl',
          'leading-6',
          'font-semibold',
          'text-slate-700 dark:text-sky-400'
        )}
      >
        Pre-Service Checklist
      </h1>

      <PreserviceChecklist />
    </main>
  );
}
