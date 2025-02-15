import * as Haptics from 'expo-haptics';

export const triggerHaptic = async () => {
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}; 