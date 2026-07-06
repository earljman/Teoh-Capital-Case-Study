export type DemoState = 'happy' | 'loading' | 'gated' | 'alert';

export const DEMO_STATES: DemoState[] = ['happy', 'loading', 'gated', 'alert'];

export type ScreenId = 'executive' | 'supervisor' | 'compliance' | 'pick' | 'pack';

export type AppPath = '/' | '/supervisor' | '/compliance' | '/pick' | '/pack';
