import React from 'react';
import ChartJS from 'chart.js';
import {Link} from 'react-router';
import ReactDOM from 'react-dom';

class CJ extends React.Component {
  state = {
    data: {},
  };
  data = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [{
      label: "My First dataset",
      fillColor: "rgba(220,220,220,0.5)",
      strokeColor: "rgba(220,220,220,0.8)",
      highlightFill: "rgba(220,220,220,0.75)",
      highlightStroke: "rgba(220,220,220,1)",
      data: [65, 592, 80, 81, 56, 55, 40]
    }]
  };
  options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: true,
    animationSteps: 60,
    animationEasing: "easeOutQuart",
    scaleBeginAtZero : true,
    scaleShowGridLines : true,
    scaleGridLineColor : "rgba(0,0,0,.05)",
    scaleGridLineWidth : 1,
    scaleShowHorizontalLines: true,
    scaleShowVerticalLines: false,
    barShowStroke : true,
    barStrokeWidth : 2,
    barValueSpacing : 5,
    barDatasetSpacing : 1,
    legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].fillColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>",
  };
  componentWillMount() {
    let labels = this.props.survey.options ? this.props.survey.options.map(option => option.optionTitle) : [];
    let data = {
      labels: labels,
      datasets: [{
        lebel: this.props.survey.title,
        fillColor: "rgba(220,220,220,0.5)",
        strokeColor: "rgba(220,220,220,0.8)",
        highlightFill: "rgba(220,220,220,0.75)",
        highlightStroke: "rgba(220,220,220,1)",
        data: this.props.survey.options ? this.props.survey.options.map(option => option.optionVotes) : [],
      }],
    };
    this.setState({data: data})
  };
  componentDidMount() {
    let id = "chartJSChart" + this.props.survey.id;
    var ctx = document.getElementById(id).getContext("2d");
    var myNewChart = new ChartJS(ctx).Bar(this.state.data, {
      ...this.options,
    });
  };
  idJoiner = (id) => {
    return id.toLowerCase().split(' ').join('-');
  };
  handleVoteEnter = () => {
    // console.log(this)
    let canvasHTML = '',
        finalHTML = '';
    let domRef = ReactDOM.findDOMNode(this.refs.graphHolder);
    if (domRef.className === "panel-body graphHolder") {
      canvasHTML = domRef.innerHTML;
      domRef.className = "panel-body voteHolder";
      let voteHTMLs = this.props.survey.options.map(option => {
        let txt = "<div className='radio'><label><input type='radio' name='optionsRadios' id=" + this.idJoiner(option.optionTitle) + " ref='" + option.optionTitle + "' value='"+ option.optionTitle +" '/>"+ option.optionTitle +"</label></div>";
        return txt;
      }).join('');
      finalHTML = ("<div className='text-left'>"+ voteHTMLs +"</div>");
      domRef.innerHTML = finalHTML;
    } else {
      this.voteHandler();
    }
  };
  voteHandler = () => {
    // console.log(this)
    let votedOption = this.props.survey.options.filter(option => {
      return document.getElementById(this.idJoiner(option.optionTitle)).checked;
    });
    // console.log(votedOption)
    let voted = false;
    this.props.survey.allVoters.map(voter => {
      if (this.props.username === voter.username) {
        voted = true;
      } else {
        voted = false
      }
    });
    // make it !voted after testing
    if (!voted) {
      this.props.handleVote({id: this.props.survey.id, optionTitle: votedOption[0].optionTitle})
      setTimeout(() => {
        location.reload()
      },1500);
    } else {
      console.log('voted')
    }
  };
  handleShare = () => {
    this.props.handleShare({id: this.props.survey.id});
    // setTimeout(() => {
    //   location.reload()
    // },1500);
  };
  render() {
    let {survey} = this.props;
    // console.log(this)
    return (
      <div className="graphContainer">
        <div className="panel panel-default">
          <div className="panel-heading">
            <Link to={`survey/${survey.id}`}>{survey.title}</Link>
          </div>
          <div className="panel-body graphHolder" ref="graphHolder">
            <canvas id={`chartJSChart${survey.id}`} title={`Chart of ${survey.title}`}></canvas>
          </div>
          <div className="panel-footer graphFooter">
            {/*make isAuthor from !isAuthor*/
              this.props.isNotAuthor ?
              <div>
                <div className="btn btn-primary btn-block" onClick={this.handleVoteEnter}>
                  Vote
                </div>
                <div className="btn btn-info btn-block" onClick={this.handleShare}>
                  Share
                  <span className="badge">{survey.shares}</span>
                </div>
              </div>
              : null
            }
          </div>
        </div>
      </div>
    );
  }
}

export default CJ;
