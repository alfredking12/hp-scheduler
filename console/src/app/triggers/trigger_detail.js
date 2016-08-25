import React from 'react';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';

import RaisedButton from 'material-ui/RaisedButton';

import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';

import request from 'superagent/lib/client';

import BaseComponent from '../libs/BaseComponent';
import validate from '../libs/validate';


const styles = {
    TextField: {
        marginTop: 12
    },

    Button: {
        margin: 12,
        marginLeft: 0
    },

    time: {
        display:'inline-block',
        textAlign: 'center'
    }
};

const Limit = {
    name: {
        Max: 100
    },
    code: {
        Max: 8
    },
    value: {
        Max: 50
    }
}



class TriggerDetail extends BaseComponent {

    constructor(props, context) {
        super(props, context);

        Object.assign(this.state, {
            nameEditable: true,
            codeEditable: true,
            stimeEditable: true,
            etimeEditable: true,
            typeEditable: true,
            valueEditable: true,

            name_error: null,
            code_error: null,
            value_error: null,

            data: {
                type: '0',
                code: ' ',
            }
        });

        this.handleChange = this.handleChange.bind(this);
    }

    checkInput() {

        var name = this.state.data.name || "";
        var code = this.state.data.code || "";
        var value = this.state.data.value || "";

        if (name.trim().length == 0) {
            this.error('name', '触发器名称不能为空');
            return false;
        }

        if (code.trim().length == 0) {
            this.error('code', '触发器标识不能为空');
            return false;
        }

        if (code.length != Limit.code.Max) {
            this.error('code', '输入的内容长度必须为 ' + Limit.code.Max + ' 个字符');
        }

        if (value.trim().length == 0) {
            this.error('value', '触发器规则不能为空');
            return false;
        }

        if (0 + !!this.state.data.start_date + !!this.state.data.start_time === 1) {
            this.showAlert("开始时间设置不完整，你可以设置完整或清除");
            return false;
        }
        
        if (0 + !!this.state.data.end_date + !!this.state.data.end_time === 1) {
            this.showAlert("结束时间设置不完整，你可以设置完整或清除");
            return false;
        }

        return true;
    }

    /*
"name": "轮询间隔5分钟触发",
    "code": "AXV0B1A5",
    "stime": 1422342342343,
    "etime": 1422348342343,
    //TODO: v0.0.2 重复次数
    //"repeat": 0,
    "type": 0,
    "value": "300"
*/

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

        if (limit && limit.Max < val.length)
            return;

        this.error(name, null);

        if (name == 'name') {
            data.name = val;
        } else if (name == 'code') {
            data.code = val;
        } else if (name == 'value') {
            data.value = val;
        }

        this.setState({ data: data });
    };

    handleClear(index, e) {
        var data = this.state.data;

        if (index == 0) {
            data.start_date = null;
            data.start_time = null;
        } else {
            data.end_date = null;
            data.end_time = null;
        }

        this.setState(data);
    }

    handleChangeStartDate = (event, date) => {
        var data = this.state.data;
        data.start_date = date;
        this.setState({data: data});
    }

    handleChangeEndDate = (event, date) => {
        var data = this.state.data;
        data.end_date = date;
        this.setState({data: data});
    }

    handleChangeStartTime = (event, date) => {
        var data = this.state.data;
        data.start_time = date;
        this.setState({data: data});
    }

    handleChangeEndTime = (event, date) => {
        var data = this.state.data;
        data.end_time = date;
        this.setState({data: data});
    }

    handleSelectChange = (event, index, value) => {
        var data = this.state.data;
        data.type = value;
        this.setState({data: data});
    }

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
                    hintText="请输入触发器名称"
                    floatingLabelText="* 触发器名称"
                    floatingLabelFixed={true}
                    fullWidth={true}
                    errorText={this.state.name_error}
                    />

                <TextField
                    style={styles.TextField}
                    name={"code"}
                    onChange={this.handleChange}
                    value={this.state.data.code}
                    disabled={!this.state.codeEditable}
                    floatingLabelText="触发器标识"
                    floatingLabelFixed={true}
                    hintText="请输入触发器标识"
                    fullWidth={true}
                    errorText={this.state.code_error}
                    />
                
                <div>
                    <DatePicker onChange={this.handleChangeStartDate} value={this.state.data.start_date} style={styles.time} hintText="开始日期" mode="landscape" autoOk={true} cancelLabel={'取消'} okLabel={'选择'}/>&nbsp;
                    <TimePicker onChange={this.handleChangeStartTime} value={this.state.data.start_time} style={styles.time} format="24hr" hintText="开始时间" cancelLabel={'取消'} okLabel={'选择'}/>&nbsp;
                    <RaisedButton label="清除" primary={true} style={styles.Button} onTouchTap={this.handleClear.bind(this, 0)} />
                </div>
                
                <div>
                    <DatePicker onChange={this.handleChangeEndDate} value={this.state.data.end_date} style={styles.time} hintText="结束日期" mode="landscape" autoOk={true} cancelLabel={'取消'} okLabel={'选择'}/>&nbsp;
                    <TimePicker onChange={this.handleChangeEndTime} value={this.state.data.end_time} style={styles.time} format="24hr" hintText="结束时间" cancelLabel={'取消'} okLabel={'选择'}/>&nbsp;
                    <RaisedButton label="清除" primary={true} style={styles.Button} onTouchTap={this.handleClear.bind(this, 1)} />
                </div>

                <SelectField
                    onChange={this.handleSelectChange}
                    value={this.state.data.type}
                    disabled={!this.state.typeEditable}
                    floatingLabelText="* 触发器类型"
                    floatingLabelFixed={true}
                    fullWidth={true}
                    >
                    <MenuItem value={'0'} primaryText="普通触发器" />
                    <MenuItem value={'1'} primaryText="Cron触发器" />
                </SelectField>

                <TextField
                    style={styles.TextField}
                    name={"value"}
                    onChange={this.handleChange}
                    value={this.state.data.value}
                    disabled={!this.state.valueEditable}
                    hintText={this.state.data.type === '0' ? "请输入间隔时间，单位秒" : "请输入Cron表达式"}
                    floatingLabelText={this.state.data.type === '0' ? "* 间隔时间(秒)" : "* Cron表达式"}
                    floatingLabelFixed={true}
                    fullWidth={true}
                    errorText={this.state.value_error}
                    />
            </div>
        );
    }
}

class TriggerView extends TriggerDetail {

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
                name: 'View: 触发器名称',
                code: 'ASDFRRRR',
                type: '0',
                value: '1800'
            }
        });
    }
}

TriggerView.defaultProps = {
    id: null
}

class TriggerEdit extends TriggerDetail {

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
                name: 'Edit: 触发器名称',
                code: 'ASDFRRRR',
                type: '0',
                value: '1800'
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

TriggerEdit.defaultProps = {
    id: null,
    onUpdated: null
}

class TriggerCreate extends TriggerDetail {

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
                name: ' ',
                code: ' ',
                type: '0',
                value: ' '
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

    merge(date, time) {

        if (!date || !time) return null;

        var ret = new Date();
        
        ret.setFullYear(date.getFullYear());
        ret.setMonth(date.getMonth());
        ret.getDate(date.getDate());
        
        ret.setHours(time.getHours());
        ret.setMinutes(time.getMinutes());
        ret.setSeconds(time.getSeconds());

        return ret;
    }

    handleCreate() {
        
        if (!super.checkInput())
            return;

        var start = this.merge(this.state.data.start_date, this.state.data.start_time);
        var end = this.merge(this.state.data.end_date, this.state.data.end_time);

        if (!end) {

            if (end.getTime() <= new Date().getTime()) {
                this.showAlert('错误提示', '结束时间必须大于当前时间');
                return;
            }

            if (!start && start.getTime() >= end.getTime()) {
                this.showAlert('错误提示', '结束时间必须大于开始时间');
                return;
            }
        }

        var data = {
            name: this.state.data.name,
            code: this.state.data.code,
            stime: start ? start.getTime() : null,
            etime: end ? end.getTime() : null,
            value: this.state.data.value
        };

        this._submit(data);
    }

    _submit(data) {
        var _this = this;

        request
            .post('http://localhost:9001/triggers')
            .set('Accept', 'application/json')
            .send(data)
            .end(function (err, res) {
                if (err) {
                    _this.showAlert('提示', '创建触发器失败', '重试', function() {
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

TriggerCreate.defaultProps = {
    onCreated: null
}

exports.View = TriggerView;
exports.Edit = TriggerEdit;
exports.Create = TriggerCreate;
