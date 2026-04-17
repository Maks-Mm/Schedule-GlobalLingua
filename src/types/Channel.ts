//src/types/Channel.ts

export type ChannelType = 'zoom' | 'meet' | 'skype' | 'whatsapp' | 'viber' | 'teams' | 'facetime';

export interface Channel {
  type: ChannelType;
  label: string;
  icon: string;
}

export const AVAILABLE_CHANNELS: Channel[] = [
  { type: 'zoom', label: 'Zoom', icon: '🎥' },
  { type: 'meet', label: 'Google Meet', icon: '🎬' },
  { type: 'skype', label: 'Skype', icon: '💬' },
  { type: 'whatsapp', label: 'WhatsApp', icon: '📱' },
  { type: 'viber', label: 'Viber', icon: '📞' },
  { type: 'teams', label: 'Microsoft Teams', icon: '👥' },
  { type: 'facetime', label: 'FaceTime', icon: '📹' }
];

export const getChannelLabel = (type: ChannelType): string => {
  const channel = AVAILABLE_CHANNELS.find(c => c.type === type);
  return channel ? channel.label : type;
};