import React from 'react';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';

import RaisedButton from 'material-ui/RaisedButton';

import BaseComponent from '../libs/BaseComponent';

import request from 'superagent/lib/client';

import config from '../config/config';

const styles = {
    TextField: {
        marginTop: 12
    },

    Button: {
        margin: 12,
        marginLeft: 0
    }
};

const Limit = {
    name: {
        Title: '任务名称',
        Max: 100,
        Required: true
    },
    detail: {
        Max: 500
    },
    trigger_code: {
        Title: '触发器标识',
        Max: 8,
        Min: 8,
        Required: true
    },
    param: {
        Max: 500
    },
    target: {
        Title: 'MQ标识',
        Max: 50,
        Required: true
    }
}

class TaskDetail extends BaseComponent {

    constructor(props, context) {
        super(props, context);

        Object.assign(this.state, {
            nameEditable: true,
            descEditable: true,
            triggerCodeEditable: true,
            paramEditable: true,
            typeEditable: true,
            targetEditable: true,

            nameError: null,
            targetError: null,
            triggerCodeError: null,
            paramError: null,
            descError: null,
            
            data: {
                name: '',
                detail: '',
                trigger_code: '',
                param: '',
                type: '0',
                target: '',
            }
        });

        this.handleChange = this.handleChange.bind(this);
    }

    checkInput() {
        
        var attrs = ['name', 'detail', 'trigger_code', 'param', 'target'];

        for (var i=0;i<attrs.length;i++) {
            var attr = attrs[i];
            var val = this.state.data[attr];
            var v = Limit[attrs[i]];
            if (v.Required && (!val || val.trim().length == 0)) {
                this.error(attr, v.Title + '不能为空');
                return false;
            }
            val = val || "";
            v.Min = v.Min || 0;
            if (v.Min > 0 && v.Min > val.trim().length) {
                if (v.Min == v.Max) {
                    this.error(attr, '输入的内容长度必须为 ' + v.Min + ' 个字符');
                    return false;
                } else {
                    this.error(attr, '输入的内容长度必须大于等于 ' + v.Min + ' 个字符');
                    return false;
                }
            }
        }

        return true;
    }

    error(attr, msg) {
        var opt = {};
        opt[attr + "_error"] = msg;
        this.setState(opt);
    }

    handleChange(event) {
        let data = this.state.data;
        let val = event.target.value;
        let name = event.target.name;

        var limit = Limit[name];

        if (limit.Max < val.length)
            return;

        this.error(name, null);

        if (name == 'name') {
            data.name = val;
        } else if (name == 'detail') {
            data.detail = val;
        } else if (name == 'trigger_code') {
            data.trigger_code = val;
        } else if (name == 'param') {
            data.param = val;
        } else if (name == 'target') {
            data.target = val;
        }

        this.setState({ data: data });
    };

    render() {

        return (
            <div>
            
                {super.render()}

                <TextField
                    style={styles.TextField}
                    name={"name"}
                    onChange={this.handleChange}
                    value={this.state.data.name}
                    disabled={!this.state.nameEditable}
                    hintText="请输入任务名称"
                    floatingLabelText="* 任务名称"
                    floatingLabelFixed={true}
                    fullWidth={true}
                    errorText={this.state.name_error}
                    />

                <TextField
                    style={styles.TextField}
                    name={"detail"}
                    onChange={this.handleChange}
                    value={this.state.data.detail}
                    disabled={!this.state.descEditable}
                    floatingLabelText="任务描述"
                    floatingLabelFixed={true}
                    hintText="请输入任务描述"
                    multiLine={true}
                    rows={2}
                    rowsMax={4}
                    fullWidth={true}
                    errorText={this.state.detail_error}
                    />

                <TextField
                    style={styles.TextField}
                    name={"trigger_code"}
                    onChange={this.handleChange}
                    value={this.state.data.trigger_code}
                    disabled={!this.state.triggerCodeEditable}
                    hintText="请输入触发器标识"
                    floatingLabelText="* 触发器标识"
                    floatingLabelFixed={true}
                    fullWidth={true}
                    errorText={this.state.trigger_code_error}
                    />

                <TextField
                    style={styles.TextField}
                    name={"param"}
                    onChange={this.handleChange}
                    value={this.state.data.param}
                    disabled={!this.state.paramEditable}
                    floatingLabelText="任务参数"
                    floatingLabelFixed={true}
                    hintText="请输入任务参数"
                    multiLine={true}
                    rows={2}
                    rowsMax={4}
                    fullWidth={true}
                    errorText={this.state.param_error}
                    />

                <SelectField
                    value={this.state.data.type}
                    disabled={!this.state.typeEditable}
                    floatingLabelText="* 任务类型"
                    floatingLabelFixed={true}
                    fullWidth={true}
                    >
                    <MenuItem value={'0'} primaryText="MQ类型" />
                </SelectField>

                <TextField
                    style={styles.TextField}
                    name={"target"}
                    onChange={this.handleChange}
                    value={this.state.data.target}
                    disabled={!this.state.targetEditable}
                    hintText="请输入MQ标识"
                    floatingLabelText="* MQ标识"
                    floatingLabelFixed={true}
                    fullWidth={true}
                    errorText={this.state.target_error}
                    />
            </div>
        );
    }
}

class TaskView extends TaskDetail {

    constructor(props, context) {
        super(props, context);

        Object.assign(this.state, {
            nameEditable: false,
            descEditable: false,
            triggerCodeEditable: false,
            paramEditable: false,
            typeEditable: false,
            targetEditable: false,
            data: {
                name: '',
                detail: '',
                trigger_code: '',
                param: '',
                type: '0',
                target: '',
            }
        });
    }

    
    componentDidMount() {
        this.load();
    }
    
    _load(cb) {
        //调用接口获取数据
        return request
            .get(config.api_server + '/tasks/' + this.props.id)
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

        if (this.props.id == null) {
            alert('id不能为空');
            return;
        }

        var _this = this;

        _this.showLoading();

        this._load(function (err, data) {

            _this.hideLoading();

            if (err || data.ret != 0) {
                _this.showAlert('提示', '获取任务数据失败', '重试', function() {
                    setTimeout(function(){
                        _this.load(cb);
                    }, 0);
                });
            } else {
                var item = {
                    name: data.data.name,
                    detail: data.data.detail,
                    trigger_code: data.data.trigger_code,
                    param: data.data.param,
                    type: data.data.type + '',
                    target: data.data.target
                }
                _this.setState({
                    data: item
                });
            }
        });
    }
}

TaskView.defaultProps = {
    id: null
}

class TaskEdit extends TaskView {

    constructor(props, context) {
        super(props, context);

        this.handleUpdate = this.handleUpdate.bind(this);
        
        Object.assign(this.state, {
            nameEditable: false,
            descEditable: true,
            triggerCodeEditable: true,
            paramEditable: true,
            typeEditable: true,
            targetEditable: true
        });
    }

    render() {
        return (
            <div>
                {super.render() }

                <div style={{overflow: 'hidden'}}>
                    <RaisedButton 
                        label="更新" 
                        primary={true} 
                        style={styles.Button}
                        onTouchTap={this.handleUpdate} 
                    />
                </div>

            </div>
        );
    }

    
    handleUpdate() {

        if (!this.checkInput())
            return;

        var data = {
            trigger_code: this.state.data.trigger_code,
            detail: this.state.data.detail || '',
            param: this.state.data.param || '',
            type: parseInt(this.state.data.type || 0) + '',
            target: this.state.data.target,
        };

        this._submit(data);
    }

    _submit(data) {
        var _this = this;

        request
            .put(config.api_server + '/tasks/' + this.props.id)
            .set('Accept', 'application/json')
            .send(data)
            .end(function (err, res) {
                if (err) {
                    _this.showAlert('提示', '修改任务失败', '重试', function() {
                        setTimeout(function(){
                            _this.submit(data);
                        }, 0);
                    });
                } else if (res.body.ret) {
                    _this.showAlert('提示', res.body.msg, '知道了');
                    
                } else {
                    _this.props.onUpdated && _this.props.onUpdated();
                }
            });
    }
}

TaskEdit.defaultProps = {
    id: null,
    onUpdated: null
}

class TaskCreate extends TaskDetail {

    constructor(props, context) {
        super(props, context);

        this.handleCreate = this.handleCreate.bind(this);
    }

    render() {
        return (
            <div>
                {super.render() }

                <div style={{overflow: 'hidden'}}>
                    <RaisedButton 
                        label="保存" 
                        primary={true} 
                        style={styles.Button}
                        onTouchTap={this.handleCreate} 
                    />
                </div>
            </div>
        );
    }

    handleCreate() {
        
        if (!super.checkInput())
            return;

        var data = {
            name:this.state.data.name,
            trigger_code: this.state.data.trigger_code,
            detail: this.state.data.detail || '',
            param: this.state.data.param || '',
            type: parseInt(this.state.data.type || 0) + '',
            target: this.state.data.target,
        };

        this._submit(data);
    }

    _submit(data) {
        var _this = this;

        request
            .post(config.api_server + '/tasks')
            .set('Accept', 'application/json')
            .send(data)
            .end(function (err, res) {
                if (err) {
                    _this.showAlert('提示', '创建任务失败', '重试', function() {
                        setTimeout(function(){
                            _this.submit(data);
                        }, 0);
                    });
                } else {
                    _this.props.onCreated && _this.props.onCreated();
                }
            });
    }
}

TaskCreate.defaultProps = {
    onCreated: null
}

exports.View = TaskView;
exports.Edit = TaskEdit;
exports.Create = TaskCreate;
