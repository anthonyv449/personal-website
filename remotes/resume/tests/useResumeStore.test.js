import { act } from 'react';
import { useResumeStore } from '../store/useResumeStore';

beforeEach(() => {
  global.fetch = jest.fn(() => Promise.resolve({
    ok: true,
    text: () => Promise.resolve('markdown')
  }));
});

afterEach(() => {
  jest.resetAllMocks();
});

test('fetchResume loads markdown', async () => {
  await act(async () => {
    await useResumeStore.getState().fetchResume();
  });
  expect(useResumeStore.getState().resumeMarkdown).toBe('markdown');
});
