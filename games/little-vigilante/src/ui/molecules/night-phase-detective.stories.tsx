import { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import { NightPhaseDetectiveComponent } from './night-phase-detective.component';
import { withCardDecorator } from '@storybook-decorators/CardDecorator';

export default {
  component: NightPhaseDetectiveComponent,
  decorators: [withCardDecorator],
  argTypes: {
    onSelectPlayer: { action: 'select' },
  },
} as Meta;

export const Primary: ComponentStory<typeof NightPhaseDetectiveComponent> = (args) => {
  return <NightPhaseDetectiveComponent {...args} />;
};

Primary.args = {
  players: [
    {
      userId: '1',
      name: 'Player 1',
      role: 'vigilante',
      slotNumber: 1,
    },
    {
      userId: '2',
      name: 'Player 2',
      role: 'student',
      slotNumber: 2,
    },
    {
      userId: '3',
      name: 'Player 3',
      role: 'monk',
      slotNumber: 3,
    },
    {
      userId: '4',
      name: 'Player 4',
      role: 'student',
      slotNumber: 4,
    },
  ],
};
