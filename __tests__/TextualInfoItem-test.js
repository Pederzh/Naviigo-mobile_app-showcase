import React from 'react';
import renderer from 'react-test-renderer';
import {TextualInfoItem} from '../src/components/common/TextualInfoItem';
import {
  ApplicationProvider
} from '@ui-kitten/components';
import {Provider} from 'react-redux';
import store from '../src/store/store';
import { mapping, light as lightTheme, dark as darkTheme } from '@eva-design/eva';

const data = {
  find: () => {}
};

test('renders correctly', () => {
  const tree = renderer.create(   
    <Provider store={store}>
          <ApplicationProvider mapping={mapping} theme={lightTheme}>
            <TextualInfoItem />
          </ApplicationProvider>
        </Provider>
          ).toJSON();
  expect(tree).toMatchSnapshot();
});