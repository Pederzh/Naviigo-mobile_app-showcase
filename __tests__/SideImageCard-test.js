import React from 'react';
import renderer from 'react-test-renderer';
import {SideImageCard} from '../src/components/common/SideImageCard';
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
            <SideImageCard />
          </ApplicationProvider>
        </Provider>
          ).toJSON();
  expect(tree).toMatchSnapshot();
});