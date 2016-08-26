import React from 'react';
import Slider from 'material-ui/Slider';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import ActionRefresh from 'material-ui/svg-icons/navigation/refresh';

const styles = {
    smallIcon: {
        width: 18,
        height: 18,
    },
    small: {
        float: 'right',
        marginRight: 0,
        width: 24,
        height: 24,
        padding: 0,
    },
    slider: {
        paddingLeft: 20,
        minWidth: 100
    }
}

export default class PageToolbar extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            page: 0,
            per_page: props.pages[0][0]
        }
    }

    render() {

        if (Math.ceil(this.props.count / this.state.per_page) < 2) return null;
        
        return (
            <div>
            
                <Slider
                    min={0}
                    max={Math.ceil(this.props.count / this.state.per_page) - 1}
                    step={1}
                    value={this.state.page}
                    onChange={this.handleSliderChange.bind(this)}
                    onDragStart={this.handleDragStart.bind(this)}
                    onDragStop={this.handleDragStop.bind(this)}
                    style={styles.slider}
                    />
                <IconButton
                    iconStyle={styles.smallIcon}
                    style={styles.small}
                    onTouchTap={this.handleRefresh.bind(this)} 
                    >
                    <ActionRefresh />
                </IconButton>
                <div>第{this.state.page + 1}/{Math.ceil(this.props.count / this.state.per_page)}页</div>
                <SelectField
                    value={this.state.per_page}
                    onChange={this.handleSelectChange}
                    >
                    {
                        this.props.pages.map(function(page, index){
                            return <MenuItem key={index} value={page[0]} primaryText={page[1]} />
                        })
                    }
                </SelectField>

            </div>
        );
    }

    handleRefresh() {
        this.load();
    }
    
    handleSliderChange(event, value) {
        this.setState({
            page: value
        });
    }
    
    handleDragStart(event) {
        console.log('handleDragStart');
    }
    
    handleDragStop(event) {
        console.log('handleDragStop');

        this.load();
    }

    handleSelectChange = (event, index, value) => {
        this.setState({
            per_page: value,
            page: 0,
        });

        var _this = this;
        setTimeout(function(){
            _this.load();
        }, 0);
    }

    load() {
        this.props.onRefresh();
    }
}

PageToolbar.defaultProps = {
    pages: [
        [25, '每页25条'],
        [50, '每页50条'],
        [100, '每页100条'],
        [200, '每页200条'],
        [500, '每页500条']
    ],
    count: 0
}