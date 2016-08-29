import React from 'react';

import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

import BaseComponent from '../libs/BaseComponent';

export default class TaskLogList extends BaseComponent {

    constructor(props, context) {
        super(props, context);

        Object.assign(this.state, {
            fixedHeader: true,
            fixedFooter: true,
            stripedRows: true,
            showRowHover: false,
            height: '300px',
            tableStyle: null,

            pageSize: 30,
            page: 0,
            count: 0,
            data: []
        });
    }

    componentDidMount() {
        super.componentDidMount();
        this.load();
    }

    status(item) {
        if (item.progress !== undefined && item.progress !== null) {
            if(item.progress < 0) {
                return '[失败] ' + item.message;
            } else {
                return '[进度 ' + item.progress + '%] ' + item.message;
            }
        }
        return item.message;
    }

    load() {}

    _render() {
        var _this = this;
        var page = this.state.page;
        var per_page = this.state.pageSize;

        return (
            <div>
                <Table
                    height={this.state.height}
                    fixedHeader={this.state.fixedHeader}
                    fixedFooter={this.state.fixedFooter}
                    selectable={false}
                    style={this.state.tableStyle}
                    >
                    <TableHeader
                        displaySelectAll={false}
                        adjustForCheckbox={false}
                        >
                        <TableRow displayBorder={true}>
                            <TableHeaderColumn tooltip="序号" style={{width: '30px'}}>#</TableHeaderColumn>
                            <TableHeaderColumn style={{width: '200px'}}>任务名称</TableHeaderColumn>
                            <TableHeaderColumn style={{width: '30px'}}>任务ID</TableHeaderColumn>
                            <TableHeaderColumn>日志信息</TableHeaderColumn>
                            <TableHeaderColumn style={{width: '150px'}}>时间</TableHeaderColumn>
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
                                <TableRowColumn style={{height: '28px', width: '30px'}}>{index + 1 + page * per_page}</TableRowColumn>
                                <TableRowColumn style={{height: '28px',width: '200px'}}>{row.name}</TableRowColumn>
                                <TableRowColumn style={{height: '28px', width: '30px'}}>{row.taskrecord_id}</TableRowColumn>
                                <TableRowColumn style={{height: '28px'}}>{_this.status(row)}</TableRowColumn>
                                <TableRowColumn style={{height: '28px', width: '150px'}}>{row.time}</TableRowColumn>
                            </TableRow>
                        )) }
                    </TableBody>
                </Table>
            </div>
        );
    }
}
