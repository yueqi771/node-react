import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Index from '@pages/Index/index'
import RouteMap from './map'

class RouterMap extends Component{
    constructor() {
        super(...arguments)
    }

    render() {
        return (
            <Switch>
                {/* <Route key="index" path="/index" Component={ Index } exact /> */}
                {
                    RouteMap.map((item, index) => 
                        <Route key={index} path={item.path} render={matchProps => <item.component {...matchProps} exact={item.exact} />} />)
                }
            </Switch>
        )
    }
}

export default RouterMap