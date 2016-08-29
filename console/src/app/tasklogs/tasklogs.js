import React from 'react';

require('rc-pagination/assets/index.css');
require('rc-select/assets/index.css');
import Pagination from 'rc-pagination';
import Select from 'rc-select';
import ActionRefresh from 'material-ui/svg-icons/action/search';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';


import 'react-date-picker/index.css';
import { DateField } from 'react-date-picker';

import moment from 'moment';
import request from 'superagent/lib/client';

import config from '../config/config';
import BaseComponent from '../libs/BaseComponent';

const styles = {
    middle: {
        marginTop: 8
    },

    middleIcon: {
        width: 28,
        height: 28,
    },
}


export default class TaskLogs extends BaseComponent {

    constructor(props, context) {
        super(props, context);

        Object.assign(this.state, {
            fixedHeader: true,
            fixedFooter: true,
            stripedRows: false,
            showRowHover: false,
            height: (window.innerHeight - 344) + 'px',
            tableStyle: null,

            start: null,
            end: null,
            key: '',

            pageSize: 30,
            page: 0,
            count: 0,
            data: [],

            expand_index: -1,
            expand_text: ''
        });
    }

    handleResize(e) {
        super.handleResize(e);
        this.setState({height: (window.innerHeight - 344) + 'px'});
    }

    componentDidMount() {
        super.componentDidMount();
        this.load();
    }

    handleChangeStart(dateString) {
        this.setState({
            start: dateString
        });
    }

    handleChangeEnd(dateString) {
        this.setState({
            end: dateString
        });
    }

    handleSearch() {
        this.load();
    }

    handleChangeKey(e) {
        this.setState({
            key: e.target.value
        });
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
                        <TableRowColumn style={{height: '28px', width: '30px'}}>{index + 1 + page * per_page}</TableRowColumn>
                        <TableRowColumn style={{height: '28px',width: '200px'}}>{row.name}</TableRowColumn>
                        <TableRowColumn style={{height: '28px', width: '30px'}}>{row.taskrecord_id}</TableRowColumn>
                        <TableRowColumn style={{height: '28px'}}>{_this.status(row)}</TableRowColumn>
                        <TableRowColumn style={{height: '28px', width: '150px'}}>{row.time}</TableRowColumn>
                    </TableRow>
                );

                rows.push(item);

                if (index == _this.state.expand_index) {
                    item = (
                        <TableRow key={'expand_' + index}
                            style={{background: 'rgba(120, 120, 120, 0.1)'}}
                            >
                            <TableRowColumn colSpan="5" style={{
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

        return (
            <div>
                <div style={{paddingLeft: '20px', paddingRight: '20px'}}>
                    
                    <DateField 
                        style={{marginRight: '20px'}}
                        value={this.state.start} 
                        placeholder={'开始时间'}
                        dateFormat="YYYY-MM-DD HH:mm:ss"
                        onChange={this.handleChangeStart.bind(this)} 
                        />
                    <DateField 
                        style={{marginRight: '20px'}}
                        value={this.state.end} 
                        placeholder={'结束时间'}
                        dateFormat="YYYY-MM-DD HH:mm:ss" 
                        onChange={this.handleChangeEnd.bind(this)} 
                        />

                    <TextField
                        style={{marginRight: '20px', paddingTop: 0, marginTop: 0}}
                        value={this.state.key}
                        onChange={this.handleChangeKey.bind(this)}
                        floatingLabelText="输入关键字搜索"
                        />

                    <IconButton
                        iconStyle={styles.middleIcon}
                        style={styles.middle}
                        onTouchTap={this.handleSearch.bind(this)} 
                        >
                        <ActionRefresh />
                    </IconButton>
                </div>

                {pager({paddingRight: '10px', float:'right'})}
                {getTable()}
                {pager({paddingBottom: '10px', paddingRight: '10px', float:'right'})}
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

        var stime = this.state.start ? moment(this.state.start).valueOf() : '';
        var etime = this.state.end ? moment(this.state.end).valueOf() : '';
        var key = this.state.key;

        request
            .get(config.api_server + '/tasklogs?page=' + page + '&per_page=' + per_page + '&stime=' + stime + '&etime=' + etime + '&key=' + key)
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

        this.setState({
            expand_index: -1,
            expand_text: null
        });

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
