import React from 'react';
import renderer from 'react-test-renderer';
import {LottieImage} from '../src/components/common/LottieImage';
import {
  ApplicationProvider
} from '@ui-kitten/components';
import {Provider} from 'react-redux';
import store from '../src/store/store';
import { mapping, light as lightTheme, dark as darkTheme } from '@eva-design/eva';

test('renders correctly', () => {
  const tree = renderer.create(   
    <Provider store={store}>
          <ApplicationProvider mapping={mapping} theme={lightTheme}>
            <LottieImage />
          </ApplicationProvider>
        </Provider>
          ).toJSON();
  expect(tree).toMatchSnapshot();
});