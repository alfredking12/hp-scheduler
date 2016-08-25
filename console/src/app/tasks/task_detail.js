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
            descError: null
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
                    <MenuItem value={0} primaryText="MQ类型" />
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
                name: 'View: 任务名称',
                detail: 'View: 任务描述',
                trigger_code: 'View: 触发器标识',
                param: 'View: 任务参数',
                type: '0',
                target: 'View: 任务目标',
            }
        });
    }
}

class TaskEdit extends TaskDetail {

    constructor(props, context) {
        super(props, context);

        this.handleUpdate = this.handleUpdate.bind(this);
        
        Object.assign(this.state, {
            nameEditable: false,
            descEditable: true,
            triggerCodeEditable: true,
            paramEditable: true,
            typeEditable: true,
            targetEditable: true,
            data: {
                name: 'Edit: 任务名称',
                detail: 'Edit: 任务描述',
                trigger_code: 'Edit: 触发器标识',
                param: 'Edit: 任务参数',
                type: '0',
                target: 'Edit: 任务目标',
            }
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

        if (!super.checkInput())
            return;

        //TODO:
        alert('save');
    }
}

class TaskCreate extends TaskDetail {

    constructor(props, context) {
        super(props, context);

        this.handleCreate = this.handleCreate.bind(this);

        Object.assign(this.state, {
            nameEditable: true,
            descEditable: true,
            triggerCodeEditable: true,
            paramEditable: true,
            typeEditable: true,
            targetEditable: true,

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

        //TODO:
        alert('save');
    }
}

exports.View = TaskView;
exports.Edit = TaskEdit;
exports.Create = TaskCreate;
