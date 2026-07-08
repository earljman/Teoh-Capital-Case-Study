export type DemoState = 'happy' | 'loading' | 'gated' | 'alert' | 'rerouted';

export const DEMO_STATES: DemoState[] = ['happy', 'loading', 'gated', 'alert', 'rerouted'];

export type ScreenId = 'executive' | 'supervisor' | 'compliance' | 'pick' | 'pack';

export type AppPath = '/' | '/supervisor' | '/compliance' | '/pick' | '/pack';
