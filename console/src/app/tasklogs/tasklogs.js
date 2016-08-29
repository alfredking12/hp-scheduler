import React from 'react';

require('rc-pagination/assets/index.css');
require('rc-select/assets/index.css');
import Pagination from 'rc-pagination';
import Select from 'rc-select';
import ActionRefresh from 'material-ui/svg-icons/action/search';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';

import 'react-date-picker/index.css';
import { DateField } from 'react-date-picker';

import moment from 'moment';
import request from 'superagent/lib/client';

import TaskLogList from './tasklog_list';
import config from '../config/config';

const styles = {
    middle: {
        marginTop: 8
    },

    middleIcon: {
        width: 28,
        height: 28,
    },
}

//TODO: 支持时间范围查询和关键字查询

export default class TaskLogs extends TaskLogList {

    constructor(props, context) {
        super(props, context);

        Object.assign(this.state, {
            height: (window.innerHeight - 300) + 'px',

            start: null,
            end: null,
            key: '',
        });
    }

    handleResize(e) {
        super.handleResize(e);
        this.setState({height: (window.innerHeight - 300) + 'px'});
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
                {super._render()}
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
