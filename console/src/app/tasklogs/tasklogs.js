import React from 'react';

import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Dialog from 'material-ui/Dialog';

import request from 'superagent/lib/client';

import BaseComponent from '../libs/BaseComponent';

import config from '../config/config';

require('rc-pagination/assets/index.css');
require('rc-select/assets/index.css');
import Pagination from 'rc-pagination';
import Select from 'rc-select';

//TODO: 支持时间范围查询和关键字查询

export default class TaskLogs extends BaseComponent {

    constructor(props, context) {
        super(props, context);

        Object.assign(this.state, {
            fixedHeader: true,
            fixedFooter: true,
            stripedRows: true,
            showRowHover: false,
            height: (window.innerHeight - 300) + 'px',

            pageSize: 30,
            page: 0,
            count: 0,
            data: []
        });

        this.handleClose = this.handleClose.bind(this);
    }

    handleResize = (e) => {
        this.setState({height: (window.innerHeight - 300) + 'px'});
    }

    componentDidMount() {
        this.load();
        window.addEventListener('resize', this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
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

    render() {
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
                                <TableHeaderColumn>任务ID</TableHeaderColumn>
                                <TableHeaderColumn>日志信息</TableHeaderColumn>
                                <TableHeaderColumn>时间</TableHeaderColumn>
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
                                    <TableRowColumn style={{height: '28px'}}>{row.taskrecord_id}</TableRowColumn>
                                    <TableRowColumn style={{height: '28px'}}>{_this.status(row)}</TableRowColumn>
                                    <TableRowColumn style={{height: '28px'}}>{row.time}</TableRowColumn>
                                </TableRow>
                            )) }
                        </TableBody>
                    </Table>
                    {pager({paddingBottom: '10px', paddingRight: '10px', float:'right'})}
                </div>
            );
        }

        return (
            <div>
                
                {super.render()}

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
    
    _load(cb) {

        var page = this.state.page;
        var per_page = this.state.pageSize;

        request
            .get(config.api_server + '/tasklogs?page=' + page + '&per_page=' + per_page)
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
}
