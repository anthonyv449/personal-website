import React from 'react';
import { loader } from '../index';
import { useResumeStore } from '../store/useResumeStore';

jest.mock('react-markdown', () => () => <div />);

test('loader calls fetchResume', async () => {
  const original = useResumeStore.getState().fetchResume;
  const mock = jest.fn();
  useResumeStore.setState({ fetchResume: mock });
  await loader();
  expect(mock).toHaveBeenCalled();
  useResumeStore.setState({ fetchResume: original });
});
