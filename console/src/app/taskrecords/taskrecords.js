import React from 'react';

import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Dialog from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import ActionView from 'material-ui/svg-icons/action/visibility';
import ActionLog from 'material-ui/svg-icons/action/schedule';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import ActionRefresh from 'material-ui/svg-icons/action/search';
import TextField from 'material-ui/TextField';

import 'rc-pagination/assets/index.css';
import 'rc-select/assets/index.css';
import Pagination from 'rc-pagination';
import Select from 'rc-select';

import 'react-date-picker/index.css';
import { DateField } from 'react-date-picker';

import moment from 'moment';
import request from 'superagent/lib/client';

import BaseComponent from '../libs/BaseComponent';
import TaskRecordDetail from './taskrecord_detail';
import TaskRecordLogs from './taskrecord_logs';

import config from '../config/config';

const styles = {
    smallIcon: {
        width: 18,
        height: 18,
    },
    small: {
        marginRight: 0,
        width: 24,
        height: 24
    },

    middle: {
        marginTop: 8
    },

    middleIcon: {
        width: 28,
        height: 28,
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
            height: (window.innerHeight - 344) + 'px',

            start: null,
            end: null,
            key: '',

            pageSize: 30,
            page: 0,
            count: 0,
            data: []
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
                            <TableHeaderColumn>任务标识</TableHeaderColumn>
                            <TableHeaderColumn>创建时间</TableHeaderColumn>
                            <TableHeaderColumn>开始时间</TableHeaderColumn>
                            <TableHeaderColumn>结束时间</TableHeaderColumn>
                            <TableHeaderColumn style={{width: '80px', textAlign:'center'}}>耗时</TableHeaderColumn>
                            <TableHeaderColumn style={{width: '80px', textAlign:'center'}}>执行结果</TableHeaderColumn>
                            <TableHeaderColumn style={{textAlign: 'right', width: '80px'}}>操作</TableHeaderColumn>
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
                                <TableRowColumn style={{width: '80px', height: '28px'}}>
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
                                    <IconButton
                                        iconStyle={styles.smallIcon}
                                        style={styles.small}
                                        onTouchTap={_this.handleDelete.bind(_this, row)} 
                                        >
                                        <ActionDelete />
                                    </IconButton>
                                </TableRowColumn>
                            </TableRow>
                        )) }
                    </TableBody>
                </Table>
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
    
    handleView(item) {
        this.showDialog({
            title: '任务记录信息',
            type: TaskRecordDetail,
            props: {
                data: item
            }
        })
    }

    handleLog(item) {
        this.showDialog({
            title: "任务日志", 
            type: TaskRecordLogs,
            props: {
                id: item.id
            }
        });
    }

    handleDelete(item) {
        var _this = this;
        
        this.showAlert('操作提示', '确认是否要删除任务该记录吗?', ['取消', '删除'], function(index){
            if (index == 1) {
                request
                    .delete(config.api_server + '/taskrecords/' + item.id)
                    .set('Accept', 'application/json')
                    .end(function (err, res) {
                        if (err || res.body.ret) {
                            _this.showAlert('错误提示', '删除任务该记录失败', '知道了');
                        } else {
                            _this.load();
                            _this.showSnack('任务该记录删除成功');
                        }
                    });
            }
        })
    }

    _load(cb) {
        
        var page = this.state.page;
        var per_page = this.state.pageSize;

        var stime = this.state.start ? moment(this.state.start).valueOf() : '';
        var etime = this.state.end ? moment(this.state.end).valueOf() : '';
        var key = this.state.key;

        request
            .get(config.api_server + '/taskrecords?page=' + page + '&per_page=' + per_page + '&stime=' + stime + '&etime=' + etime + '&key=' + key)
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
