/**
 * In this file, we create a React component
 * which incorporates components provided by Material-UI.
 */
import React, {Component} from 'react';
import { IndexRedirect, Router, Route, hashHistory, IndexRoute, browserHistory, Link } from 'react-router';

import {deepOrange500} from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import RaisedButton from 'material-ui/RaisedButton';
import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';

import Tasks from './tasks/tasks';
import Triggers from './triggers/triggers';
import TaskRecords from './taskrecords/taskrecords';
import TaskLogs from './tasklogs/tasklogs';

var history = hashHistory;

const styles = {
    container: {
        paddingTop: 10,
        paddingLeft: 0,
        float: 'left'
    },
    container_open: {
        paddingTop: 10,
        paddingLeft: 190,
        float: 'left'
    },
    paper: {
        display: 'inline-block',
        float: 'left',
        position: 'absolute',
        margin: '10px 32px 10px 0',
    },
    rightIcon: {
        textAlign: 'center',
        lineHeight: '24px',
    },
    activeMenuItem: {
        background: 'rgba(127, 221, 233, 0.4)',
        color: 'rgba(20, 20, 20, 1.0)'
    },
    menuItem: {
        display: 'block',
        position: 'relative',
        width: '180px',
        textAlign: 'center',
        lineHeight: '40px',
        textDecoration: 'none',
        borderBottom: '1px solid rgba(120, 120, 120, 0.2)',
        letterSpacing: '3px',
        color: 'rgba(120, 120, 120, 1.0)'
    }
};

const muiTheme = getMuiTheme({
    palette: {
        accent1Color: deepOrange500,
    },
});

class App extends Component {
    constructor(props, context) {
        super(props, context);
        
        this.state = {
            index: 0,
            open: false
        }
    }

    handleMenu() {
        this.setState({open: !this.state.open});
    }

    render() {
        var _this = this;
        var menuItems = [["触发器管理", "/triggers"], ["任务管理", "/tasks"], ["任务记录", "/taskrecords"], ["任务日志", "/tasklogs"]].map(function(item, index){
            return (
                <Link key={index} to={item[1]} style={styles.menuItem}  activeStyle={styles.activeMenuItem} >
                    {item[0]}
                </Link>
            );
        });

        return (
            <div>
                <AppBar
                    title="分布式任务调度系统 - 管理控制台"
                    iconClassNameRight="muidocs-icon-navigation-expand-more"
                    onLeftIconButtonTouchTap={this.handleMenu.bind(this)}
                />
                <div style={this.state.open ? {} : {display: 'none'}}>
                    <Paper zDepth={2} style={styles.paper}>
                        <div >
                            {menuItems}
                        </div>
                    </Paper>
                </div>
                <div style={this.state.open ? styles.container_open : styles.container}>
                    <Paper  zDepth={2}>
                        {this.props.children}
                    </Paper>
                </div>
            </div>
        );
    }
}

const Main = () => (
    <MuiThemeProvider muiTheme={muiTheme}>
        <Router history={history}>
            <Route path="/" component={App}>
                <IndexRedirect to='/triggers' />
                <Route path="/triggers" component={Triggers}/>
                <Route path="/tasks" component={Tasks}/>
                <Route path="/taskrecords" component={TaskRecords}/>
                <Route path="/tasklogs" component={TaskLogs}/>
            </Route>
        </Router>
    </MuiThemeProvider>
);

export default Main;
