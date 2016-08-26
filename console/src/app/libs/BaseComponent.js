import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import Dialog from 'material-ui/Dialog';

const styles = {

    container: {
        position: 'relative',
    },

    refresh: {
        display: 'inline-block',
        position: 'relative',
    }
};

export default class BaseComponent extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            alertTitle: ' ',
            alertText: ' ',
            actionTitle: ' ',
            showAlert: false,
            showLoading: false
        };

        this.handleClose = this.handleClose.bind(this);
    }

    showAlert(title, text, actions, callback) {
        
        //解决重入问题
        if (this.callback) return;


        if (!actions) {
            alert("actions不能为空");
            return;
        }
        
        if (!Array.isArray(actions)) actions = [actions];

        if (actions.length > 1 && callback == null) {
            alert("传入多个action，没有传入callback进行处理");
            return;
        }

        this.callback = callback;

        this.setState({
            showAlert: true, 
            alertTitle: title, 
            alertText: text,
            actions: actions
        });
    }

    showLoading() {
        this.setState({
            showLoading: true
        });
    }

    hideLoading() {
        this.setState({
            showLoading: false
        });
    }

    render() {

        let size = 50;
        let left = (window.innerWidth - size) / 2;
        let top = (window.innerHeight - size) / 3;

        var _this = this;

        const actions = this.state.actions
            ? this.state.actions.map(function(action, index){
                return <FlatButton
                label={action}
                primary={true}
                onTouchTap={_this.handleAction.bind(_this, index)}
                />;
            }) 
            : [];

        return (
            <div>

                <Dialog
                    title={this.state.alertTitle}
                    actions={actions}
                    modal={true}
                    open={this.state.showAlert && actions.length > 0}
                    onRequestClose={this.handleClose}
                    >
                    {this.state.alertText}
                </Dialog>

                {
                    this.state.loading ?
                        <div style={styles.container}>
                            <RefreshIndicator
                                size={size}
                                left={left}
                                top={top}
                                loadingColor={"#FF9800"}
                                status={this.state.loading ? "loading" : "hide"}
                                style={styles.refresh}
                                />
                        </div> : null
                        
                }

            </div>
        );
    }

    handleAction(index, e) {
        var cb = this.callback;
        this._close();
        cb && cb(index);
    }

    handleClose() {
        this._close();
    }

    _close() {
        this.callback = null;
        this.setState({ showAlert: false , alertTitle:null, alertText: null, actions: null});
    }

}
