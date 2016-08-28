import React from 'react';
import BaseComponent from '../libs/BaseComponent';
import TaskDetail from '../tasks/task_detail';

export default class TaskRecordDetail extends TaskDetail.View {
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
    
    load() {
        var data = this.props.data;

        var item = {
            name: data.name,
            detail: data.detail,
            trigger_code: data.trigger_code,
            param: data.param,
            type: data.type + '',
            target: data.target
        }
        this.setState({
            data: item
        });
    }
}

TaskRecordDetail.defaultProps = {
    data: null
}