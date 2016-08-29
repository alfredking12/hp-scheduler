import React from 'react';

import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

require('rc-pagination/assets/index.css');
import Pagination from 'rc-pagination';

import request from 'superagent/lib/client';

import config from '../config/config';
import BaseComponent from '../libs/BaseComponent';

export default class TaskRecordLogs extends BaseComponent {

    constructor(props, context) {
        super(props, context);

        Object.assign(this.state, {
            fixedHeader: true,
            fixedFooter: true,
            stripedRows: false,
            showRowHover: false,
            height: '300px',
            tableStyle: null,

            pageSize: 30,
            page: 0,
            count: 0,
            data: [],

            expand_index: -1,
            expand_text: ''
        });
    }

    componentDidMount() {
        super.componentDidMount();
        this.load();
    }

    _render() {
        var _this = this;
        var page = this.state.page;
        var per_page = this.state.pageSize;

        const getTable = () => {
            
            var rows = [];

            for (var index = 0;index< _this.state.data.length;index++) {
                var row = _this.state.data[index];
                var item = (
                    <TableRow
                        key={index}
                        style={{height: '28px'}}
                        onTouchTap={_this.handleRowClick.bind(_this, {item: row, index: index})}
                        >
                        <TableRowColumn style={{height: '28px', width: '8px'}}>{index + 1 + page * per_page}</TableRowColumn>
                        <TableRowColumn style={{height: '28px'}}>{_this.status(row)}</TableRowColumn>
                        <TableRowColumn style={{height: '28px', width: '150px'}}>{row.time}</TableRowColumn>
                    </TableRow>
                );

                rows.push(item);

                if (index == _this.state.expand_index) {
                    item = (
                        <TableRow key={'expand_' + index}
                            style={{background: 'rgba(120, 120, 120, 0.1)'}}>
                            <TableRowColumn colSpan="3" style={{
                                wordWrap: 'break-all',
                                wordBreak: 'normal',
                                whiteSpace: 'break-all'
                            }}>
                                {_this.state.expand_text}
                            </TableRowColumn>
                        </TableRow>
                    );
                    rows.push(item);
                }
            }

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
                                <TableHeaderColumn tooltip="序号" style={{width: '8px'}}>#</TableHeaderColumn>
                                <TableHeaderColumn>日志信息</TableHeaderColumn>
                                <TableHeaderColumn style={{width: '150px'}}>时间</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody
                            displayRowCheckbox={false}
                            showRowHover={this.state.showRowHover}
                            stripedRows={this.state.stripedRows}
                            >
                            {rows}
                        </TableBody>
                    </Table>
                </div>
            );
        }

        const pager = (style) => {
            return (
                <div style={{overflow: 'hidden'}}>
                    <div style={style}>
                        <Pagination 
                            className="ant-pagination"
                            current={this.state.page + 1}
                            defaultCurrent={1}
                            total={this.state.count}
                            pageSize={50}
                            onChange={this.handlePageChange.bind(this)} />
                    </div>
                </div>
            );
        }

        return (
            <div>
                {getTable()}
                {pager({paddingBottom: '10px', paddingRight: '10px', float:'right'})}
            </div>
        );
    }

    handleRowClick(data) {
        if (this.state.expand_index == data.index) {
            this.setState({
                expand_text: null,
                expand_index: -1
            })
        } else {
            this.setState({
                expand_text: this.status(data.item),
                expand_index: data.index
            })
        }
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
    
    _load(cb) {

        var page = this.state.page;
        var per_page = this.state.pageSize;

        request
            .get(config.api_server + '/tasklogs?page=' + page + '&per_page=' + per_page + '&recordid=' + this.props.id)
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
                _this.showAlert('提示', '加载任务日志列表失败', '重新加载', function() {
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
}

TaskRecordLogs.defaultProps = {
    id: null
};