import React from 'react';

import ChecklistItem from '#app/components/ui/checklist-item';
import ExpandableImage from '#app/components/ui/expandable-image';
import Heading from '#app/components/ui/heading';
import { cn } from '#app/utils/misc';

function Checklist({ children }: React.ComponentProps<'ul'>) {
  return <ul className="mb-8 flex flex-col gap-3">{children}</ul>;
}

function Description(props: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'mt-2 rounded-sm bg-slate-200 p-2 text-black',
        'dark:bg-slate-800 dark:text-slate-400'
      )}
      {...props}
    />
  );
}

function PreserviceChecklist() {
  return (
    <section>
      <Checklist>
        <ChecklistItem>🔌 Power-cycle the switcher and Resi box</ChecklistItem>

        <ChecklistItem>
          🖥️ On the streaming pc, Start OBS, StreamDeck Companion, Atem, and
          Chrome (https://studio.resi.io/)
        </ChecklistItem>

        <ChecklistItem>
          🎥 Turn on camera's 1 and 2
          <ExpandableImage src="/img/camera_2.jpg" alt="" className="mt-1" />
        </ChecklistItem>

        <ChecklistItem>
          📺 Turn on sanctuary tv's, DSM tv, and lobby tv's
        </ChecklistItem>

        <ChecklistItem>
          🎧 Check comms
          <Description>
            Verify with someone else that you can hear each other from the av
            room and camera 1
          </Description>
        </ChecklistItem>

        <ChecklistItem>
          🎶 Pre-service Audio Works
          <Description>
            Hit the "pre audio" Pre-service button on the StreamDeck and verify
            you hear the preservice music in the headphones. You might need to
            start the music from ProPresenter
          </Description>
        </ChecklistItem>

        <ChecklistItem>
          🚀 Start macro works
          <Description>
            Hit the "start" button on the StreamDeck and verify you hear the
            band practicing. The "start" button does a couple things: the
            pre-service audio channel on the StreamDeck should get faded down,
            the audio feed from the room should get faded up, and the video feed
            should get faded to camera 2
          </Description>
        </ChecklistItem>

        <ChecklistItem>
          🎵 Words Key Works
          <Description>
            Have the pro-op put a song slide up and verify that the slide's
            words appear correctly. If the 'Look' didn't change to the praise
            and worship look, hit the "Look PW".
          </Description>
        </ChecklistItem>

        <ChecklistItem>
          📖 Scripture Key Works
          <Description>
            Have the pro-op put a scripture up and then hit the "Scripture"
            button on the StreamDeck, verify that the scripture is looking good
            on the lower third. You may need to hit the "Look Message" button to
            change the look from PW to Message.
          </Description>
        </ChecklistItem>
        <ChecklistItem>
          🎙️ Make sure podcast backup audio stick is plugged into the sound
          board
        </ChecklistItem>
      </Checklist>

      <Heading as="h3" size="md">
        At 10:15
      </Heading>
      <Checklist>
        <ChecklistItem>
          🎶 Hit the "Pre-service Audio" button on the StreamDeck
        </ChecklistItem>
        <ChecklistItem>📺 Set StreamDeck program to 'Pro'</ChecklistItem>
      </Checklist>

      <Heading as="h3" size="md">
        At 10:20 - Resi should be streaming
      </Heading>
      <Checklist>
        <ChecklistItem>
          <i className="fa-brands fa-youtube text-red-700" aria-hidden /> Open
          the 'Go Live' page from{' '}
          <a
            target="_blank"
            className="text-sky-500 underline-offset-4 hover:underline"
            href="https://studio.youtube.com/"
          >
            <i
              className="fa-solid fa-arrow-up-right-from-square text-sm"
              aria-hidden
            />{' '}
            YouTube Studio
          </a>{' '}
          , click the schedule tab, click the live stream for today.
        </ChecklistItem>
        <ChecklistItem>
          <i className="fa-brands fa-youtube text-red-700" aria-hidden /> Check
          stream audio on youtube
        </ChecklistItem>
      </Checklist>

      <Heading as="h3" size="md">
        After Praise and Worship
      </Heading>
      <Checklist>
        <ChecklistItem>🎵 Take out "Words" key</ChecklistItem>
      </Checklist>

      <Heading as="h3" size="md">
        After Service
      </Heading>
      <Checklist>
        <ChecklistItem>
          🎙️ Get audio file from soundboard for podcast
        </ChecklistItem>
        <ChecklistItem>🖥️ Turn off monitors in av room</ChecklistItem>
        <ChecklistItem>🎥 Turn off cameras</ChecklistItem>
        <ChecklistItem>
          📺 Turn off tv's in sanctuary, and the lobby
        </ChecklistItem>
        <ChecklistItem>
          💡 Make sure the sound guy turned off the lights in the sanctuary
        </ChecklistItem>
      </Checklist>
    </section>
  );
}

export default PreserviceChecklist;
