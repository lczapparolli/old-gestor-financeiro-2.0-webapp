//Libs
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

/**
 * Provide a more powerfull route, that renders a Layout arround the Component
 * and verifies a condition to render or redirect to another path.
 * 
 * When a `redirect` path is provided and `condition` is false, then a redirection occours.
 * Otherwise, the Layout and Component are rendered.
 */
function ConditionalRoute({ path, exact, layout: Layout, component: Component, condition, redirect, childProps }) {
    Layout = Layout || Fragment;
    return (
        <Route path={path} exact={exact} render={(props) => {
            if (!condition && redirect)
                return <Redirect to={redirect} />;
            return (
                <Layout>
                    <Component {...props} {...childProps} />
                </Layout>
            );
        }} />
    );
}

ConditionalRoute.propTypes = {
    /** Conditional path to match. Exactly like react-router */
    path: PropTypes.string.isRequired,
    /** The rendered component when route matches. Exactly like react-router */
    component: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired,
    /** Indicate if route must match exactly. Like react-router */
    exact: PropTypes.bool,
    /** Wrapper of the component. If empty a React Fragment is used */
    layout: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
    /** Condition to render the route component. If false, the route is redirected */
    condition: PropTypes.bool,
    /** Path to be redirected when condition is false */
    redirect: PropTypes.string,
    /** Any props necessary to child */
    childProps: PropTypes.any

};

export default ConditionalRoute;