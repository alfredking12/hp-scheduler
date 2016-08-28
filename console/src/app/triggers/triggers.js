import React from 'react';
import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import ActionEdit from 'material-ui/svg-icons/editor/mode-edit';
import DeleteEdit from 'material-ui/svg-icons/action/delete';

import request from 'superagent/lib/client';
//import moment from 'moment';

import BaseComponent from '../libs/BaseComponent';

import TriggerDetail from './trigger_detail';

import config from '../config/config';

const styles = {
    smallIcon: {
        width: 18,
        height: 18,
    },
    small: {
        float: 'right',
        marginRight: 0,
        width: 24,
        height: 24,
        padding: 0,
    },
}

const TriggerOpts = {
    None: -1,
    Create: 0,
    Edit: 1,
    View: 2
}

export default class Triggers extends BaseComponent {

    constructor(props, context) {
        super(props, context);

        Object.assign(this.state, {
            fixedHeader: true,
            fixedFooter: true,
            stripedRows: true,
            showRowHover: false,
            height: (window.innerHeight - 130) + 'px',

            triggerOpt: TriggerOpts.None,

            data: []
        });

        this.handleCreate = this.handleCreate.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleResize(e) {
        super.handleResize(e);
        this.setState({height: (window.innerHeight - 130) + 'px'});
    }

    componentDidMount() {
        super.componentDidMount();
        this.load();
    }

    _render() {

        var _this = this;

        const getTable = () => {
            if (this.state.data.length == 0)
                return null;
            return (
                <div>
                    <div style={{ overflow: 'hidden' }}>
                        <FlatButton
                            label="新建触发器"
                            primary={true}
                            style={{marginLeft: 10}}
                            onTouchTap={this.handleCreate} 
                            />
                    </div>
                    <Table
                        height={this.state.height}
                        fixedHeader={this.state.fixedHeader}
                        fixedFooter={this.state.fixedFooter}
                        selectable={false}
                        >
                        <TableHeader
                            displaySelectAll={false}
                            adjustForCheckbox={false}
                            >
                            <TableRow displayBorder={true}>
                                <TableHeaderColumn tooltip="序号" style={{width: '20px'}}>#</TableHeaderColumn>
                                <TableHeaderColumn>触发器名称</TableHeaderColumn>
                                <TableHeaderColumn>触发器标识</TableHeaderColumn>
                                <TableHeaderColumn>触发器规则</TableHeaderColumn>
                                <TableHeaderColumn style={{textAlign: 'right', paddingRight: '48px'}}>操作</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody
                            displayRowCheckbox={false}
                            showRowHover={this.state.showRowHover}
                            stripedRows={this.state.stripedRows}
                            >
                            {this.state.data.map((row, index) => (
                                <TableRow
                                    key={index}
                                    style={{height: '28px'}}
                                    >
                                    <TableRowColumn style={{height: '28px', width: '20px'}}>{index + 1}</TableRowColumn>
                                    <TableRowColumn style={{height: '28px'}}>{row.name}</TableRowColumn>
                                    <TableRowColumn style={{height: '28px'}}>{row.code}</TableRowColumn>
                                    <TableRowColumn style={{height: '28px'}}>{row.type == 0 ? ('间隔: ' + row.value + 's') : ('cron: ' + row.value)}</TableRowColumn>
                                    <TableRowColumn style={{height: '28px'}}>
                                        <IconButton
                                            iconStyle={styles.smallIcon}
                                            style={styles.small}
                                            onTouchTap={_this.handleEdit.bind(_this, row)} 
                                            >
                                            <ActionEdit />
                                        </IconButton>
                                        <IconButton
                                            iconStyle={styles.smallIcon}
                                            style={styles.small}
                                            onTouchTap={_this.handleDelete.bind(_this, row)} 
                                            >
                                            <DeleteEdit />
                                        </IconButton>
                                    </TableRowColumn>
                                </TableRow>
                            )) }
                        </TableBody>
                    </Table>
                </div>
            );
        }

        const getTriggerTitle = () => {
            if (this.state.triggerOpt === TriggerOpts.None) {
                return ' ';
            } else if (this.state.triggerOpt === TriggerOpts.View) {
                return '触发器详情';
            } else if (this.state.triggerOpt === TriggerOpts.Edit) {
                return '修改触发器';
            } else if (this.state.triggerOpt === TriggerOpts.Create) {
                return '新建触发器';
            }
        }

        const getTriggerComponent = () => {
            if (this.state.triggerOpt === TriggerOpts.None) {
                return null;
            } else if (this.state.triggerOpt === TriggerOpts.View) {
                return <TriggerDetail.View id={this.state.triggerId} />;
            } else if (this.state.triggerOpt === TriggerOpts.Edit) {
                return <TriggerDetail.Edit id={this.state.triggerId} onUpdated={this.handleUpdated} />;
            } else if (this.state.triggerOpt === TriggerOpts.Create) {
                return <TriggerDetail.Create  onCreated={this.handleCreated} />;
            }
        }

        return (
            <div>
                <Dialog
                    title={getTriggerTitle()}
                    modal={false}
                    open={this.state.triggerOpt != TriggerOpts.None}
                    onRequestClose={this.handleClose}
                    autoScrollBodyContent={true}
                    >
                    {getTriggerComponent()}
                </Dialog>

                {getTable() }

            </div>
        );
    }
    
    handleCreate() {
        this.setState({triggerOpt: TriggerOpts.Create, triggerId: null});
    }

    handleEdit = (item, e) => {
        this.setState({triggerOpt: TriggerOpts.Edit, triggerId: item.id});
    }

    handleDelete(item) {
        var _this = this;
        
        this.showAlert('操作提示', '确认是否要删除触发器吗?', ['取消', '删除'], function(index){
            if (index == 1) {
                request
                    .delete(config.api_server + '/triggers/' + item.id)
                    .set('Accept', 'application/json')
                    .end(function (err, res) {
                        if (err || res.body.ret) {
                            _this.showAlert('错误提示', '删除触发器失败', '知道了');
                        } else {
                            _this.load();
                            _this.showSnack('触发器删除成功');
                        }
                    });
            }
        })
    }

    handleUpdated = () => {
        this.handleClose();
        this.load();
        this.showSnack('触发器更新成功');
    }
    
    handleCreated = () => {
        this.handleClose();
        this.load();
        this.showSnack('触发器创建成功');
    }

    handleClose() {
        this.setState({ triggerOpt: TriggerOpts.None, triggerId: null });
    }

    _load(cb) {
        // setTimeout(function () {
        //     cb(null, tableData)
        // }, 1000);
        // return;
        //调用接口获取数据
        return request
            .get(config.api_server + '/triggers')
            .set('Accept', 'application/json')
            .end(function (err, res) {
                if (err) {
                    cb(err);
                } else {
                    cb(null, res.body);
                }
            });
    }

    load(cb) {
        var _this = this;

        _this.showLoading();

        this._load(function (err, data) {

            _this.hideLoading();

            if (err || data.ret != 0) {
                _this.showAlert('提示', '加载触发器列表失败', '重新加载', function() {
                    setTimeout(function(){
                        _this.load(cb);
                    }, 0);
                });
            } else {
                _this.setState({
                    data: data.data
                });
            }
        });
    }
}
