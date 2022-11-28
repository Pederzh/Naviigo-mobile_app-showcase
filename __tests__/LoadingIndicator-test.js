import React from 'react';
import renderer from 'react-test-renderer';
import {LoadingIndicator} from '../src/components/common/LoadingIndicator';
import {
  ApplicationProvider
} from '@ui-kitten/components';
import {Provider} from 'react-redux';
import store from '../src/store/store';
import { mapping, light as lightTheme, dark as darkTheme } from '@eva-design/eva';

// define the props that should be passed to the component
const boat = { item: {name: 'Boat 1', image: require('naviigo/assets/img/boat1.jpg')}}
const key = 1;
//const value = []
const onchange = () => {};
const selectedoption = 1;
const day = {};
const multiple = true;

const data = {
  find: () => {}
};

test('renders correctly', () => {
  const tree = renderer.create(   
    <Provider store={store}>
          <ApplicationProvider mapping={mapping} theme={lightTheme}>
            <LoadingIndicator />
          </ApplicationProvider>
        </Provider>
          ).toJSON();
  expect(tree).toMatchSnapshot();
});