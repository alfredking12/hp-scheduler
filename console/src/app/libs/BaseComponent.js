import React from 'react';
import Addons from 'react-addons';


import FlatButton from 'material-ui/FlatButton';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import Dialog from 'material-ui/Dialog';
import Snackbar from 'material-ui/Snackbar';

const styles = {

    container: {
        position: 'relative',
    },

    refresh: {
        display: 'inline-block',
        position: 'relative',
    }
};

const Snackbar_Duration = 3000;
const Loading_Size = 50;

//TODO: Loading需增加遮层

export default class BaseComponent extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            //alert(Dialog)
            __alert_title: ' ',
            __alert_text: ' ',
            __alert_actions: [],
            __alert_show: false,
            //loading(RefreshIndicator)
            __loading_show: false,
            __loading_left: 0,
            __loading_top: 0,
        
            //dialog(Dialog)
            __dialog_show: false,
            __dialog_title: '',
            __dialog_component: null,
            //snackbar(Snackbar)
            __snack_show: false,
            __snack_title: '',
            __snack_duration: 0,
        };

        this.__handleResize = this.__handleResize.bind(this);
    }

    handleResize() {

        console.log('handleResize:' + this.constructor.name);

        var _this = this;
        setTimeout(function(){
            var root = _this.refs.root;

            if (!root) return;

            var left = (root.scrollWidth - Loading_Size) / 2;
            var top = (root.scrollHeight - Loading_Size) / 3;

            _this.setState({
                __loading_left: left,
                __loading_top: top
            });
        }, 0);
    }

    componentDidMount() {
        window.addEventListener('resize', this.__handleResize);

        console.log('componentDidMount:' + this.constructor.name);
    }

    componentWillUnmount() {
        this.__will_unmount = true;
        window.removeEventListener('resize', this.__handleResize);

        console.log('componentWillUnmount:' + this.constructor.name);
    }

    close(data) {
        this.props.__dialog_parent && this.props.__dialog_parent.__handleDialogClose();
        this.props.__dialog_callback && this.props.__dialog_callback(this.props, data);
    }

    showDialog(options) {
        var title = options.title;
        var type = options.type;
        var props = options.props || {};
        var callback = options.callback;

        var component = React.createFactory(type);
        Object.assign(props, {
            __dialog_parent: this,
            __dialog_callback: callback  
        });
        
        var _this = this;
        this.setState({
            __dialog_show: true,
            __dialog_title: title, 
            __dialog_component: component(props)
        })
    }

    __handleResize(e) {
        this.handleResize(e);
    }

    showAlert(title, text, actions, callback) {
        
        //解决重入问题
        if (this.__callback) return;


        if (!actions) {
            alert("actions不能为空");
            return;
        }
        
        if (!Array.isArray(actions)) actions = [actions];

        if (actions.length > 1 && callback == null) {
            alert("传入多个action，没有传入callback进行处理");
            return;
        }

        this.__callback = callback;

        this.setState({
            __alert_show: true, 
            __alert_title: title, 
            __alert_text: text,
            __alert_actions: actions
        });
    }

    showLoading() {
        var _this = this;
        setTimeout(function(){
            var root = _this.refs.root;

            if (!root) return;

            var left = (root.scrollWidth - Loading_Size) / 2;
            var top = (root.scrollHeight - Loading_Size) / 3;

            _this.setState({
                __loading_show: true,
                __loading_left: left,
                __loading_top: top
            });
        }, 100);
    }

    hideLoading() {
        var _this = this;
        setTimeout(function(){
            if (!_this.__will_unmount) {
                _this.setState({
                    __loading_show: false
                });
            }
        }, 1000);
    }

    showSnack(title, duration) {
        this.setState({
            __snack_show: true,
            __snack_duration: duration ? parseInt(duration) : 0,
            __snack_title: title
        });
    }

    render() {
        var _this = this;

        const actions = this.state.__alert_actions
            ? this.state.__alert_actions.map(function(action, index){
                return <FlatButton
                label={action}
                primary={true}
                onTouchTap={_this.__handleAction.bind(_this, index)}
                />;
            }) 
            : [];

        return (
            <div ref="root" style={styles.container}>

                {
                    this.state.__loading_show ? 
                        <div style = {{
                            display: 'inline-block',
                            float: 'left',
                            position: 'absolute',
                        }}>
                            <RefreshIndicator
                                size={Loading_Size}
                                left={this.state.__loading_left}
                                top={this.state.__loading_top}
                                loadingColor={"#FF9800"}
                                status={this.state.__loading_show ? "loading" : "hide"}
                                style={styles.refresh}
                                />
                        </div>
                    : null
                }

                <div>
                    {this._render()}
                </div>

                <Dialog
                    title={this.state.__alert_title}
                    actions={actions}
                    modal={true}
                    open={this.state.__alert_show && actions.length > 0}
                    onRequestClose={this.__handleClose.bind(this)}
                    >
                    {this.state.__alert_text}
                </Dialog>
                
                <Dialog
                    ref="dialog"
                    title={this.state.__dialog_title}
                    modal={false}
                    open={this.state.__dialog_show}
                    onRequestClose={this.__handleDialogClose.bind(this)}
                    autoScrollBodyContent={true}
                    >
                    {this.state.__dialog_component}
                </Dialog>

                <Snackbar
                    open={this.state.__snack_show}
                    message={this.state.__snack_title}
                    autoHideDuration={this.state.__snack_duration || Snackbar_Duration}
                    onRequestClose={this.__handleSnackClose.bind(this)}
                    />

            </div>
        );
    }

    _render() {
        return null;
    }

    __handleSnackClose() {
        this.setState({
            __snack_show: false,
            __snack_title: '',
            __snack_duration: 0
        });
    }

    __handleAction(index, e) {
        var cb = this.__callback;
        this.__close();
        cb && cb(index);
    }

    __handleClose() {
        this.__close();
    }

    __handleDialogClose() {
        this.setState({ 
            __dialog_show: false , 
            __dialog_title:null, 
            __dialog_component: null
        });
    }

    __close() {
        this.__callback = null;
        this.setState({
            __alert_show: false , 
            __alert_title: null, 
            __alert_text: null, 
            __alert_actions: null
        });
    }

}
