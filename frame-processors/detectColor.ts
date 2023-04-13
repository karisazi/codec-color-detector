/* global __example_plugin __example_plugin_swift */
import type { Frame } from 'react-native-vision-camera';

declare let _WORKLET: true | undefined;


export function detectColor(frame: Frame): string[] {
  'worklet';
  if (!_WORKLET) throw new Error('examplePlugin must be called from a frame processor!');

  // @ts-expect-error because this function is dynamically injected by VisionCamera
  return __detectColor(frame);
}
