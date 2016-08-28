import React from 'react';

require('rc-pagination/assets/index.css');
import Pagination from 'rc-pagination';

import request from 'superagent/lib/client';

import TaskLogList from '../tasklogs/tasklog_list';

import config from '../config/config';

export default class TaskRecordLogs extends TaskLogList {

    constructor(props, context) {
        super(props, context);

        Object.assign(this.state, {
            height: '300px'
        });
    }

    _render() {
        var _this = this;

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
                {super._render()}
                {pager({paddingBottom: '10px', paddingRight: '10px', float:'right'})}
            </div>
        );
    }

    handlePageChange(page) {

        this.close();
        return;
        
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
