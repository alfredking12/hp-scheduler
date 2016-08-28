import React from 'react';

import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Dialog from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import ActionView from 'material-ui/svg-icons/action/visibility';
import ActionLog from 'material-ui/svg-icons/action/schedule';

import request from 'superagent/lib/client';

import BaseComponent from '../libs/BaseComponent';

import TaskRecordDetail from './taskrecord_detail';
import TaskRecordLogs from './taskrecord_logs';

import config from '../config/config';

require('rc-pagination/assets/index.css');
require('rc-select/assets/index.css');
import Pagination from 'rc-pagination';
import Select from 'rc-select';

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

//TODO: 支持时间范围查询和关键字查询

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


            pageSize: 30,
            page: 0,
            count: 0,
            data: []
        });

        this.handleClose = this.handleClose.bind(this);
    }

    handleResize(e) {
        super.handleResize(e);
        this.setState({height: (window.innerHeight - 142) + 'px'});
    }

    componentDidMount() {
        super.componentDidMount();
        this.load();
    }

    status(item) {
        if (item.status == 2) {
            return '成功';
        } else if (item.status == 0) {
            return '未开始';
        } else if (item.status == 1) {
            return '执行中:' + (item.progress || 0) + "%";
        } else if (item.status == 3) {
            return '失败' + (item.progress || 0) + "%";
        } else if (item.status == 4) {
            return '执行超时';
        } else {
            return '未知';
        }
    }

    _render() {
        var _this = this;

        var page = this.state.page;
        var per_page = this.state.pageSize;


        const pager = (style) => {
            return (
                <div style={{overflow: 'hidden'}}>
                    <div style={style}>
                        <Pagination 
                            showSizeChanger
                            className="ant-pagination"
                            current={this.state.page + 1}
                            defaultCurrent={1}
                            total={this.state.count}
                            pageSize={this.state.pageSize}
                            onChange={this.handlePageChange.bind(this)} 
                            pageSizeOptions={['30', '50', '100', '200']} 
                            selectComponentClass={Select} 
                            onShowSizeChange={this.handleSizeChange.bind(this)} />
                    </div>
                </div>
            );
        }

        const getTable = () => {
            return (
                <div>
                    {pager({paddingRight: '10px', float:'right'})}
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
                                <TableHeaderColumn style={{width: '80px', textAlign:'center'}}>耗时</TableHeaderColumn>
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
                                    <TableRowColumn style={{height: '28px', width: '20px'}}>{index + 1 + page * per_page}</TableRowColumn>
                                    <TableRowColumn style={{height: '28px'}}>{row.name}</TableRowColumn>
                                    <TableRowColumn style={{height: '28px'}}>{row.id}</TableRowColumn>
                                    <TableRowColumn style={{height: '28px'}}>{row.updatedAt}</TableRowColumn>
                                    <TableRowColumn style={{height: '28px'}}>{row.stime}</TableRowColumn>
                                    <TableRowColumn style={{height: '28px'}}>{row.etime}</TableRowColumn>
                                    <TableRowColumn style={{height: '28px', width: '80px', textAlign:'center'}}>{row.spent}</TableRowColumn>
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
                        {pager({paddingBottom: '10px', paddingRight: '10px', float:'right'})}
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
    
    handlePageChange(page) {
        this.setState({
            page: page - 1
        });

        var _this = this;
        setTimeout(function() {
            _this.load();
        }, 0);
    }
    
    handleSizeChange(current, pageSize) {
        this.setState({
            pageSize: pageSize,
            page: 0
        });

        var _this = this;
        setTimeout(function() {
            _this.load();
        }, 0);
    }
    
    handleView(item) {
        this.setState({taskRecordOpt: TaskRecordOpts.View, taskRecord: item});
    }

    handleLog(item) {
        this.showDialog({
            title: "任务日志", 
            type: TaskRecordLogs
        });
    }

    handleClose() {
        this.setState({ taskRecordOpt: TaskRecordOpts.None, taskRecord: null });
    }

    _load(cb) {
        
        var page = this.state.page;
        var per_page = this.state.pageSize;

        request
            .get(config.api_server + '/taskrecords?page=' + page + '&per_page=' + per_page)
            .set('Accept', 'application/json')
            .end(function (err, res) {
                if (err) {
                    cb(err);
                } else {
                    cb(null, res.body);
                }
            });
    }

    load() {
        var _this = this;

        _this.showLoading();

        this._load(function (err, data) {

            _this.hideLoading();

            if (err) {
                _this.showAlert('提示', '加载任务记录列表失败', '重新加载', function() {
                    setTimeout(function(){
                        _this.load();
                    }, 0);
                });
            } else {
                _this.setState({
                    data: data.data.data,
                    count: data.data.count
                });
            }
        });
    }
}
