import React from 'react';
import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import BaseComponent from '../libs/BaseComponent';

import request from 'superagent/lib/client';

import TaskDetail from './task_detail';

const TaskOpts = {
    None: -1,
    Create: 0,
    Edit: 1,
    View: 2
}

const tableData = [
    {
        index: 0,
        name: '订单5分钟未付款自动取消',
        status: 'Employed',
    },
    {
        index: 1,
        name: 'Randal White',
        status: 'Unemployed',
    },
    {
        index: 2,
        name: 'Stephanie Sanders',
        status: 'Employed',
        selected: true,
    },
    {
        index: 3,
        name: 'Steve Brown',
        status: 'Employed',
    },
    {
        index: 4,
        name: 'Joyce Whitten',
        status: 'Employed',
    },
    {
        index: 5,
        name: 'Samuel Roberts',
        status: 'Employed',
    },
    {
        index: 6,
        name: 'Adam Moore',
        status: 'Employed',
    },
    {
        index: 1,
        name: 'Randal White',
        status: 'Unemployed',
    },
    {
        index: 2,
        name: 'Stephanie Sanders',
        status: 'Employed',
        selected: true,
    },
    {
        index: 3,
        name: 'Steve Brown',
        status: 'Employed',
    },
    {
        index: 4,
        name: 'Joyce Whitten',
        status: 'Employed',
    },
    {
        index: 5,
        name: 'Samuel Roberts',
        status: 'Employed',
    },
    {
        index: 6,
        name: 'Adam Moore',
        status: 'Employed',
    },
    {
        index: 1,
        name: 'Randal White',
        status: 'Unemployed',
    },
    {
        index: 2,
        name: 'Stephanie Sanders',
        status: 'Employed',
        selected: true,
    },
    {
        index: 3,
        name: 'Steve Brown',
        status: 'Employed',
    },
    {
        index: 4,
        name: 'Joyce Whitten',
        status: 'Employed',
    },
    {
        index: 5,
        name: 'Samuel Roberts',
        status: 'Employed',
    },
    {
        index: 6,
        name: 'Adam Moore',
        status: 'Employed',
    },
    {
        index: 1,
        name: 'Randal White',
        status: 'Unemployed',
    },
    {
        index: 2,
        name: 'Stephanie Sanders',
        status: 'Employed',
    },
    {
        index: 3,
        name: 'Steve Brown',
        status: 'Employed',
    },
    {
        index: 4,
        name: 'Joyce Whitten',
        status: 'Employed',
    },
    {
        index: 5,
        name: 'Samuel Roberts',
        status: 'Employed',
    },
    {
        index: 6,
        name: 'Adam Moore',
        status: 'Employed',
    },
];

export default class Tasks extends BaseComponent {

    constructor(props, context) {
        super(props, context);

        Object.assign(this.state, {
            fixedHeader: true,
            fixedFooter: true,
            stripedRows: true,
            showRowHover: false,
            height: '400px',

            taskOpt: TaskOpts.None,

            data: []
        });

        this.handleCreate = this.handleCreate.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    componentDidMount() {
        this.load();
    }

    render() {

        const getTable = () => {
            if (this.state.data.length == 0)
                return null;
            return (
                <div>
                    <div style={{ overflow: 'hidden' }}>
                        <FlatButton
                            label="新建任务"
                            primary={true}
                            style={{marginLeft: 10}}
                            onTouchTap={this.handleCreate} 
                            />
                    </div>
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
                                <TableHeaderColumn tooltip="序号">#</TableHeaderColumn>
                                <TableHeaderColumn>任务名称</TableHeaderColumn>
                                <TableHeaderColumn>任务类型</TableHeaderColumn>
                                <TableHeaderColumn>触发器标识</TableHeaderColumn>
                                <TableHeaderColumn>操作</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody
                            displayRowCheckbox={false}
                            showRowHover={this.state.showRowHover}
                            stripedRows={this.state.stripedRows}
                            >
                            {this.state.data.map((row, index) => (
                                <TableRow key={index}>
                                    <TableRowColumn>{row.index}</TableRowColumn>
                                    <TableRowColumn>{row.name}</TableRowColumn>
                                    <TableRowColumn>{row.status}</TableRowColumn>
                                    <TableRowColumn>{row.status}</TableRowColumn>
                                    <TableRowColumn>

                                    </TableRowColumn>
                                </TableRow>
                            )) }
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableRowColumn colSpan="5" style={{ textAlign: 'center' }}>
                                    分页区域
                                </TableRowColumn>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </div>
            );
        }

        const getTaskTitle = () => {
            if (this.state.taskOpt === TaskOpts.None) {
                return ' ';
            } else if (this.state.taskOpt === TaskOpts.View) {
                return '任务详情';
            } else if (this.state.taskOpt === TaskOpts.Edit) {
                return '修改任务';
            } else if (this.state.taskOpt === TaskOpts.Create) {
                return '新建任务';
            }
        }

        const getTaskComponent = () => {
            if (this.state.taskOpt === TaskOpts.None) {
                return null;
            } else if (this.state.taskOpt === TaskOpts.View) {
                return <TaskDetail.View />;
            } else if (this.state.taskOpt === TaskOpts.Edit) {
                return <TaskDetail.Edit />;
            } else if (this.state.taskOpt === TaskOpts.Create) {
                return <TaskDetail.Create />;
            }
        }

        return (
            <div>
                
                {super.render()}

                <Dialog
                    title={getTaskTitle()}
                    modal={false}
                    open={this.state.taskOpt != TaskOpts.None}
                    onRequestClose={this.handleClose}
                    ref="task"
                    >
                    {getTaskComponent()}
                </Dialog>

                {getTable() }

            </div>
        );
    }
    
    handleCreate() {
        this.setState({taskOpt: TaskOpts.Create, taskId: null});
    }

    handleEdit(item) {
        this.setState({taskOpt: TaskOpts.Create, taskId: item.id});
    }

    handleEnable() {

    }

    handleClose() {
        this.setState({ taskOpt: TaskOpts.None, taskId: null });
    }

    _load(cb) {
        setTimeout(function () {
            cb(null, tableData)
        }, 1000);
        return;
        //TODO: 调用接口获取数据
        return request
            .get('http://localhost:9001/tasks')
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
                    data: tableData
                });
            }
        });
    }
}
