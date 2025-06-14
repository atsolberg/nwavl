import ExpandableImage from '#app/components/ui/expandable-image';
import Heading from '#app/components/ui/heading';
import { cn } from '#app/utils/misc';
import { type Route } from './+types/troubleshooting';

export const meta: Route.MetaFunction = () => [
  { title: 'NW AVL - Troubleshooting' },
];

export default function Component() {
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
        Troubleshooting
      </h1>

      <section className="mb-4">
        <Heading as="h3" size="md">
          Formatting a song
        </Heading>
        <ol className="list-decimal">
          <li>
            Highlight the copyright slide, right click, <b>Theme</b> &gt;{' '}
            <b>NW Double Screen</b> &gt; <b>Copyright</b>
          </li>
          <li>
            Blank slide should be next, if not add one.
            <br />
            Right click, add action <b>Stage</b> &gt; <b>Music</b>.
            <br />
            Then add a <b>Look</b> action, choose <b>Praise and worship</b>.
          </li>
          <li>
            Highlight all the lyric slides.
            <br />
            Add a stage action of <b>Music</b>.<br />
            If there is already a stage action, you may have to remove it first.
          </li>
        </ol>
      </section>

      <section className="mb-4">
        <Heading as="h3" size="md">
          No video to obs from switcher?
        </Heading>
        <p className="mb-2">
          Edit the `Atem` -&gt; properties, switch the `Device` to something
          else, then back to `Blackmagic Design`
        </p>
      </section>

      <section className="mb-4">
        <Heading as="h3" size="md">
          Stream Deck not working?
        </Heading>
        <ol className="list-decimal">
          <li>Make sure the stream deck app is NOT running</li>
          <li>start the companion app</li>
          <li>click the icon by the clock and 'Launch GUI'</li>
          <li>from the 'Surfaces' tab click 'Rescan USB'</li>
        </ol>
        <p className="mb-2">
          If it still thinks Stream Deck app is running, open Task Manager, find
          the Stream Deck instance, kill it with fire, Rescan
        </p>
      </section>

      <section className="mb-4">
        <Heading as="h3" size="md">
          No Audio on the 'OldS' channel in ATEM?
        </Heading>
        <p className="mb-2">
          Make sure the PC audio device is set to Black Magic.
        </p>
      </section>

      <section className="mb-4">
        <Heading as="h3" size="md">
          Outputs on ProPresenter Switched or not working?
        </Heading>
        <ul className="list-decimal">
          <li>
            In Apple's display settings - Make sure that the retina display is
            set to 'Main Display', and decimators are set to 'Extend'.
          </li>
          <li>
            Make sure the displays (Audience and Stage) are both enabled in
            Pro-Presenter (2 green lights top right in ProPresenter)
          </li>
          <li>
            In ProPresenter &gt; Configure Displays &gt; make sure Screen #1 is
            Decimator, Screen #2 is NDI
          </li>
        </ul>
      </section>

      <section className="mb-4">
        <Heading as="h3" size="md">
          Camera's look really orange (umpa lumpa)
        </Heading>
        <p className="mb-2">
          In Atem, <b>File</b> &gt; <b>Restore</b> &gt; choose the most recent
          profile. Click <b>Select All</b> in the restore window, <b>Restore</b>
        </p>
      </section>

      <section className="mb-4">
        <Heading as="h3" size="md">
          Ableton isn't configure right
        </Heading>
        <p className="mb-2">This is the correct ableton configuration:</p>
        <ExpandableImage
          src="/img/ableton_configuration.jpg"
          alt=""
          className="mt-1"
        />
      </section>
    </main>
  );
}
