import React from 'react';
import renderer from 'react-test-renderer';
import {OpeningTimes} from '../src/components/OpeningTimes';
import {
  ApplicationProvider
} from '@ui-kitten/components';
import { mapping, light as lightTheme, dark as darkTheme } from '@eva-design/eva';

// define the props that should be passed to the component
const value =  [{ from: '14:00', to: '18:00', value: 'monday'}]
const fun = () => {}

test('renders correctly', () => {
  const tree = renderer.create(<ApplicationProvider mapping={mapping} theme={lightTheme}><OpeningTimes value={value} onChange={fun}/></ApplicationProvider>).toJSON();
  expect(tree).toMatchSnapshot();
});