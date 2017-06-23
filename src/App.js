//Simple React app to time contractions
import React, { Component } from 'react';
import moment from 'moment';
import ReactTable from 'react-table';
import './App.css';
import 'react-table/react-table.css';

const classNames = require('classnames');
const columns = [
  {
    Header: 'Started At',
    id: 'start',
    accessor: d => d.start.format("LLLL"),
    Cell: ({value}) => <span className="App-started">{value}</span>
  },
  {
    Header: 'Time',
    id: 'elapsedTime',
    accessor: d => {
      const elapsed = d.elapsed;
      const mins = Math.floor(elapsed/(1000*60));
      const secs = (elapsed - mins*1000*60) / 1000;
      return {'strValue' : mins + ' minutes, ' + secs + ' seconds', 'millisec': elapsed};
    },
    Cell: ({value}) =>
    <span className={classNames({
      'App-started-valid': (value.millisec > 60000),
      'App-started-invalid': (value.millisec < 60000)
    })}>
      {value.strValue}
    </span>
  }
];

const Recording = ({start, elapsed}) => (
  <div>
    <div className="App-current">
      <p className="App-started">
        {start.format("LLLL")}
      </p>
      <p className={classNames({
          'App-elapsed' : true,
          'App-started-valid': (elapsed > 60000),
          'App-started-invalid': (elapsed < 60000)
        })}>
        {elapsed / 1000 } sec
      </p>
    </div>
  </div>
);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
    this.toggleMeasure = this.toggleMeasure.bind(this);
  }

  getInitialState() {
    return {
      loggedContractions: [],
      contraction: {
        elapsed: 0,
        active: false
      }
    }
  }

  toggleMeasure(e) {
    if (!this.state.contraction.active) {
      this.timer = setInterval(() => {
        this.setState((prevState, props) => ({
            contraction: {
              ...prevState,
              start: (prevState.contraction.start === undefined ? moment() : prevState.contraction.start),
              elapsed: prevState.contraction.elapsed + 1000,
              active: true
            }
          })
        );
      }, 1000);
    } else {
      clearInterval(this.timer);
      this.setState((prevState, props) => ({
          contraction: this.getInitialState().contraction,
          loggedContractions: [...prevState.loggedContractions, prevState.contraction]
        })
      );
    }
  }

  render() {
    const {elapsed, start, active} = this.state.contraction;
    const {loggedContractions} = this.state;
    return (
      <div className="App">
        <div className="App-buttonwrap">
          {active && (
            <Recording
              elapsed={elapsed}
              start={start}
              />
          )}
          {!active && (
            <p className="App-intro">
              Click to start recording
            </p>
          )}
          <button
            onClick={this.toggleMeasure}
            className={classNames({'App-startbutton': !active, 'App-stopbutton': active, 'App-button' : true})} name="start" >
            {active ? 'Stop' : 'Record'}
          </button>
        </div>
        {loggedContractions.length > 0 &&
          (
            <div className="App-tablewrap">
              <h3>
                Recorded data
              </h3>
              <ReactTable
               data={loggedContractions}
               columns={columns}
               showPagination={false}
               showPageSizeOptions={false}
               loading={false}
               minRows={1}
              />
            </div>
          )
        }
      </div>
    );
  }
};

export default App;
