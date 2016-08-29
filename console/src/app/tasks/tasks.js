import React from 'react';
import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import BaseComponent from '../libs/BaseComponent';
import IconButton from 'material-ui/IconButton';
import ActionEdit from 'material-ui/svg-icons/editor/mode-edit';
import DeleteEdit from 'material-ui/svg-icons/action/delete';

import request from 'superagent/lib/client';

import TaskDetail from './task_detail';

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

export default class Tasks extends BaseComponent {

    constructor(props, context) {
        super(props, context);

        Object.assign(this.state, {
            fixedHeader: true,
            fixedFooter: true,
            stripedRows: true,
            showRowHover: false,
            height: (window.innerHeight - 126) + 'px',

            data: []
        });
    }

    handleResize(e) {
        super.handleResize(e);
        this.setState({height: (window.innerHeight - 126) + 'px'});
    }

    componentDidMount() {
        super.componentDidMount();
        this.load();
    }

    _render() {
        var _this = this;

        return (
            <div>
                <div style={{ overflow: 'hidden' }}>
                    <FlatButton
                        label="新建任务"
                        primary={true}
                        style={{marginLeft: 10}}
                        onTouchTap={this.handleCreate.bind(this)} 
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
                            <TableHeaderColumn>任务名称</TableHeaderColumn>
                            <TableHeaderColumn>任务类型</TableHeaderColumn>
                            <TableHeaderColumn>触发器标识</TableHeaderColumn>
                            <TableHeaderColumn style={{textAlign: 'right', paddingRight: '48px'}}>操作</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody
                        displayRowCheckbox={false}
                        showRowHover={this.state.showRowHover}
                        stripedRows={this.state.stripedRows}
                        >
                        {this.state.data.map((row, index) => (
                            <TableRow key={index}
                                style={{height: '28px'}}>
                                <TableRowColumn style={{height: '28px', width: '20px'}}>{index + 1}</TableRowColumn>
                                <TableRowColumn style={{height: '28px'}}>{row.name}</TableRowColumn>
                                <TableRowColumn style={{height: '28px'}}>{'MQ类型'}</TableRowColumn>
                                <TableRowColumn style={{height: '28px'}}>{row.trigger_code}</TableRowColumn>
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
    
    handleCreate() {
        var _this = this;
        this.showDialog({
            title: '新建任务',
            type: TaskDetail.Create,
            callback: function() {
                _this.load();
                _this.showSnack('任务创建成功');
            }
        });
    }

    handleEdit(item) {
        var _this = this;
        this.showDialog({
            title: '修改任务',
            type: TaskDetail.Edit,
            props: {
                id: item.id
            },
            callback: function() {
                _this.load();
                _this.showSnack('任务更新成功');
            }
        });
    }

    handleDelete(item) {
        var _this = this;
        
        this.showAlert('操作提示', '确认是否要删除任务吗?', ['取消', '删除'], function(index){
            if (index == 1) {
                request
                    .delete(config.api_server + '/tasks/' + item.id)
                    .set('Accept', 'application/json')
                    .end(function (err, res) {
                        if (err || res.body.ret) {
                            _this.showAlert('错误提示', '删除任务失败', '知道了');
                        } else {
                            _this.load();
                            _this.showSnack('任务删除成功');
                        }
                    });
            }
        })
    }

    _load(cb) {
        request
            .get(config.api_server + '/tasks')
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

            if (err) {
                _this.showAlert('提示', '加载任务列表失败', '重新加载', function() {
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
