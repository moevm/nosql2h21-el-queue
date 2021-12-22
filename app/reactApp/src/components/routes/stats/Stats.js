import React, {Component} from "react";
import {Container} from "react-bootstrap";
import headersDefault from "../../../fetchDefault";
import QueuesFilterContainer from "../../containers/QueuesFilterContainer";

class Stats extends Component {
    constructor(props) {
        super(props);
        this.updateStats = this.updateStats.bind(this)
        this.formatSeconds = this.formatSeconds.bind(this)
        this.state = {
            statsInfo: {
                avgQueueTime: '',
                avgRecords: '',
                avgRecordTime: '',
                error: false
            },
            filterConfig: {
                discipline: '',
                teacher: ''
            }
        }
    }

    updateStats(data) {
        this.setState({
            filterConfig: data
        })
        fetch('/stats', {
            method: 'POST',
            headers: headersDefault(),
            body: JSON.stringify({
                ...data
            })
        })
            .then(data => data.json())
            .then(data => {
                let stats = {...data};
                stats.avgQueueTime = this.formatSeconds(data.avgQueueTime)
                stats.avgRecordTime = this.formatSeconds(data.avgRecordTime)
                stats.avgRecords = Math.round(data.avgRecords)
                this.setState({ ...this.state, statsInfo: stats})
            })
    }

    formatSeconds(timestamp) {
        timestamp = Math.round(timestamp)
        let hours = Math.floor(timestamp / 60 / 60);
        let minutes = Math.floor(timestamp / 60) - (hours * 60);
        let seconds = timestamp % 60;
        return [
            hours.toString().padStart(2, '0'),
            minutes.toString().padStart(2, '0'),
            seconds.toString().padStart(2, '0')
        ].join(':');
    }

    componentDidMount() {
        this.updateStats(this.state.filterConfig)
    }

    render() {
        return (
            <Container className="p-3 col-12">
                <QueuesFilterContainer
                    discipline={true}
                    teacher={true}
                    sendConfig={this.updateStats}
                />
                {this.state.statsInfo.error === true &&
                <div className="p-3 col-12 mt-3">
                    <div className="h4"> Данных для данного запроса не найдено </div>
                </div>}
                <div className="p-3 col-12 mt-3 custom-paper">
                    <div className="h5">
                        <b>Средняя продолжительность очередей:</b> {this.state.statsInfo.avgQueueTime}
                    </div>
                    <div className="h5">
                        <b>Среднее количество закрытых записей:</b> {this.state.statsInfo.avgRecords}
                    </div>
                    <div className="h5">
                        <b>Средняя продолжительность сдачи:</b> {this.state.statsInfo.avgRecordTime}
                    </div>
                </div>
            </Container>
        );
    }
}

export default Stats;
