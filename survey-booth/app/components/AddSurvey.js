import React from 'react';
import ReactDOM from 'react-dom';

class AddSurvey extends React.Component {
  state = {
    surveyOptions : 3,
    errMessage    : '',
  };
  renderOptions = () => {
    let options = [];
    for (let i = 0; i < this.state.surveyOptions; i++) {
      options.push(
        <div key={i} className="input-group surveyOption">
          <span className="input-group-addon">Option</span>
          <input type="text" ref={`surveyOption${i}`} className="form-control" placeholder={`Survey option...`}/>
        </div>
      );
    }
    return options;
  };
  handleAddOption = () => {
    this.setState({
      surveyOptions: this.state.surveyOptions + 1,
    });
  };
  handleRemoveOption = () => {
    if(this.state.surveyOptions > 2) {
      this.setState({
        surveyOptions: this.state.surveyOptions - 1,
      });
    }
  };
  handleSurveySubmit = (evt) => {
    let options = [];
    for (let i = 0; i < this.state.surveyOptions; i++) {
      let option = ReactDOM.findDOMNode(this.refs[`surveyOption${i}`]).value;
      options.push(option);
    }
    let sT  = ReactDOM.findDOMNode(this.refs.surveyTitle).value;
    options = options.filter((elem) => elem.length > 0);
    options = options.map((elem) => elem.trim());
    let multipleTimes = false;
    let pseudoOptions = options.map((elem) => elem.toLowerCase());
    pseudoOptions.map((elem) => {
      if (pseudoOptions.indexOf(elem) !== pseudoOptions.lastIndexOf(elem)) {
        multipleTimes = true;
      }
    });
    options = options.map((elem) => {
      return {optionTitle: elem}
    });
    if (sT.length !== 0) {
      if (options.length > 1) {
        if (!multipleTimes) {
          this.props.appProps.handleSurveySubmit({
            title   : sT,
            options : options,
          });
          this.setState({errMessage: 'Survey Added'});
          setTimeout(() => {
            this.setState({errMessage: ''});
          }, 1500);
        } else {
          this.setState({errMessage: 'Multiple instances of same option(s) are found'});
        }
      } else {
        this.setState({errMessage: 'At least two(2) options are needed'})
      }
    } else {
      this.setState({errMessage: 'Title is needed'});
    }
  };
  render() {
    return (
      <div className="container">
        <div className="input-group input-group-lg">
          <span className="input-group-addon">Title</span>
          <input type="text" ref="surveyTitle" className="form-control" placeholder="Title of the Survey"/>
        </div>
        {
          this.renderOptions()
        }
        <div className="btn-group surveyOptionControl" role="group">
          <button onClick={this.handleAddOption} type="button" className="btn btn-default">
            Add Option
          </button>
          <button onClick={this.handleRemoveOption} type="button" className="btn btn-default">
            Remove Option
          </button>
        </div>
        <br/>
        <div className="btn btn-primary" onClick={this.handleSurveySubmit.bind(this, this.props)}>
          Submit Survey
        </div>
        <br/>
        {this.state.errMessage}
      </div>
    );
  }
}

export default AddSurvey;
