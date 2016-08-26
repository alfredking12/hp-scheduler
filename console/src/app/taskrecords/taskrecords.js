import React from 'react';

import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Dialog from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import ActionView from 'material-ui/svg-icons/action/visibility';
import ActionLog from 'material-ui/svg-icons/action/schedule';

import request from 'superagent/lib/client';

import BaseComponent from '../libs/BaseComponent';

import TaskRecordDetail from './taskrecord_detail';

import config from '../config/config';

const TaskRecordOpts = {
    None: -1,
    View: 2
}

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

export default class TaskRecords extends BaseComponent {

    constructor(props, context) {
        super(props, context);

        Object.assign(this.state, {
            fixedHeader: true,
            fixedFooter: true,
            stripedRows: true,
            showRowHover: false,
            height: (window.innerHeight - 142) + 'px',

            taskRecordOpt: TaskRecordOpts.None,

            data: []
        });

        this.handleClose = this.handleClose.bind(this);
    }

    handleResize = (e) => {
        this.setState({height: (window.innerHeight - 142) + 'px'});
    }

    componentDidMount() {
        this.load();
        window.addEventListener('resize', this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    status(item) {
        if (item.status == 2) {
            return '成功';
        } else if (item.status == 0) {
            return '未开始';
        } else if (item.status == 1) {
            return '执行中:' + item.progress + "%";
        } else if (item.status == 3) {
            return '执行超时';
        } else {
            return '未知';
        }
    }

    render() {
        var _this = this;

        const getTable = () => {
            return (
                <div>
                    <Table
                        height={this.state.height}
                        fixedHeader={this.state.fixedHeader}
                        fixedFooter={this.state.fixedFooter}
                        >
                        <TableHeader
                            displaySelectAll={false}
                            adjustForCheckbox={false}
                            >
                            <TableRow displayBorder={true}>
                                <TableHeaderColumn tooltip="序号" style={{width: '20px'}}>#</TableHeaderColumn>
                                <TableHeaderColumn>任务名称</TableHeaderColumn>
                                <TableHeaderColumn>任务标识</TableHeaderColumn>
                                <TableHeaderColumn>创建时间</TableHeaderColumn>
                                <TableHeaderColumn>开始时间</TableHeaderColumn>
                                <TableHeaderColumn>结束时间</TableHeaderColumn>
                                <TableHeaderColumn style={{width: '20px', textAlign:'center'}}>耗时</TableHeaderColumn>
                                <TableHeaderColumn style={{width: '80px', textAlign:'center'}}>执行结果</TableHeaderColumn>
                                <TableHeaderColumn style={{textAlign: 'right', width: '50px'}}>操作</TableHeaderColumn>
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
                                    <TableRowColumn style={{height: '28px'}}>{row.id}</TableRowColumn>
                                    <TableRowColumn style={{height: '28px'}}>{row.updatedAt}</TableRowColumn>
                                    <TableRowColumn style={{height: '28px'}}>{row.stime}</TableRowColumn>
                                    <TableRowColumn style={{height: '28px'}}>{row.etime}</TableRowColumn>
                                    <TableRowColumn style={{height: '28px', width: '20px', textAlign:'center'}}>{row.etime ? ((row.etime - row.stime) + 'ms') : '-'}</TableRowColumn>
                                    <TableRowColumn style={{height: '28px', width: '80px', textAlign:'center'}}>{_this.status(row)}</TableRowColumn>
                                    <TableRowColumn style={{width: '50px', height: '28px'}}>
                                        <IconButton
                                            iconStyle={styles.smallIcon}
                                            style={styles.small}
                                            onTouchTap={_this.handleView.bind(_this, row)} 
                                            >
                                            <ActionView />
                                        </IconButton>
                                        <IconButton
                                            iconStyle={styles.smallIcon}
                                            style={styles.small}
                                            onTouchTap={_this.handleLog.bind(_this, row)} 
                                            >
                                            <ActionLog />
                                        </IconButton>
                                    </TableRowColumn>
                                </TableRow>
                            )) }
                        </TableBody>
                        <TableFooter adjustForCheckbox={false} >
                            <TableRow>
                                <TableRowColumn colSpan="8" style={{textAlign: 'center'}}>
                                    Super Footer
                                </TableRowColumn>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </div>
            );
        }

        const getTaskRecordComponent = () => {
            if (this.state.taskRecordOpt === TaskRecordOpts.None) {
                return null;
            } else if (this.state.taskRecordOpt === TaskRecordOpts.View) {
                return <TaskRecordDetail data={this.state.taskRecord} />;
            }
        }

        return (
            <div>
                
                {super.render()}

                <Dialog
                    title={'任务记录信息'}
                    modal={false}
                    open={this.state.taskRecordOpt != TaskRecordOpts.None}
                    onRequestClose={this.handleClose}
                    >
                    {getTaskRecordComponent()}
                </Dialog>

                {getTable() }

            </div>
        );
    }
    
    handleView(item) {
        this.setState({taskRecordOpt: TaskRecordOpts.View, taskRecord: item});
    }

    handleLog(item) {
        alert('log');
    }

    handleClose() {
        this.setState({ taskRecordOpt: TaskRecordOpts.None, taskRecord: null });
    }

    _load(cb) {
        request
            .get(config.api_server + '/taskrecords')
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
                _this.showAlert('提示', '加载任务记录列表失败', '重新加载', function() {
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
