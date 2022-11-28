import React from 'react';
import renderer from 'react-test-renderer';
import {RHFRadio} from '../src/components/forms/RHFRadio';
import {
  ApplicationProvider
} from '@ui-kitten/components';
import {Provider} from 'react-redux';
//import {AuthProvider, PushNotificationProvider} from '../src/providers';
import store from '../src/store/store';
import { mapping, light as lightTheme, dark as darkTheme } from '@eva-design/eva';

const onchange = () => {}

const data = [{
  findIndex: () => {},
  map: () => {}
}]

test('renders correctly', () => {
  const tree = renderer.create(   
    <Provider store={store}>
          <ApplicationProvider mapping={mapping} theme={lightTheme}>
            <RHFRadio onChange={onchange} data={data} />
          </ApplicationProvider>
        </Provider>
          ).toJSON();
  expect(tree).toMatchSnapshot();
});