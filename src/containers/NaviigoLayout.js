import React from 'react';
import {Icon, Layout, TopNavigation, TopNavigationAction,} from '@ui-kitten/components';

const BackIcon = (style) => (
    <Icon {...style} name='arrow-back'/>
);

const BackAction = () => (
    <TopNavigationAction icon={BackIcon}/>
);

const NaviigoLayout = (props) => {
    return (
        <Layout>
            <TopNavigation
                title='NAVIIGO'
                alignment='center'
                leftControl={BackAction()}
            />
            {props.children}
        </Layout>
    );
};

export default NaviigoLayout;