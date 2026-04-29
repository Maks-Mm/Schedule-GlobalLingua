// src/types/Channel.ts
export type ChannelType = 'zoom' | 'meet' | 'teams' | 'webex' | 'in-person';

export interface Channel {
  type: ChannelType;
  label: string;
  icon: string;
}

export const AVAILABLE_CHANNELS: Channel[] = [
  { type: 'zoom',      label: 'Zoom',             icon: '🎥' },
  { type: 'meet',      label: 'Google Meet',       icon: '🎬' },
  { type: 'teams',     label: 'Microsoft Teams',   icon: '👥' },
  { type: 'webex',     label: 'Webex',             icon: '💼' },
  { type: 'in-person', label: 'In Person',         icon: '🏫' },
];

export const getChannelLabel = (type: ChannelType): string => {
  const channel = AVAILABLE_CHANNELS.find(c => c.type === type);
  return channel ? channel.label : type;
};