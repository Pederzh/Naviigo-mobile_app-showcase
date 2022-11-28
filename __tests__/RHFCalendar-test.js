import React from 'react';
import renderer from 'react-test-renderer';
import {RHFCalendar} from '../src/components/forms/RHFCalendar';
import {
  ApplicationProvider
} from '@ui-kitten/components';
import {Provider} from 'react-redux';
import store from '../src/store/store';
import { mapping, light as lightTheme, dark as darkTheme } from '@eva-design/eva';

const onchange = () => {}
const value = {from: new Date('2020-12-17T03:24:00'), to: new Date('2020-12-17T03:40:00')}

test('renders correctly', () => {
  const tree = renderer.create(   
    <Provider store={store}>
          <ApplicationProvider mapping={mapping} theme={lightTheme}>
            <RHFCalendar value={value} onChange={onchange} />
          </ApplicationProvider>
        </Provider>
          ).toJSON();
  expect(tree).toMatchSnapshot();
});