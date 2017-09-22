import $ from 'jquery';
import    React from 'react';

import * as Actions from '../actions.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class IstexApiStatus extends React.Component {

  constructor(props) {
    super(props);
    // this.state = {
    //   // do not show warning as long as the ajax
    //   // request is not finished
    //   isAvailable: true,

    //   // if not available we could have an error Msg to show
    //   errorCode: null,
    //   errorMsg: '',
    // };
  }

  componentDidMount() {
    // setTimeout(function () {
    //   this.props.fetchConfig(); // call the action FETCH_CONFIG
    // }.bind(this), 1000);
    //this.props.fetchApiStatus();

  }

  render() {

    if (this.props.isAvailable || this.props.isAvailable === undefined) return null;
  
    return (
      <div className="alert alert-danger" role="alert">
        L'API ISTEX est temporairement indisponible. Veuillez réessayer plus tard.
        <br/><small><span className="glyphicon glyphicon-cog" title="Détail technique de l'erreur rencontrée"></span> {this.props.errorMsg} {this.props.errorCode > 0 ? '[' + this.props.errorCode + ']' : ''}</small>
      </div>
    );
  
  }

}


const mapStateToProps = (state, ownProps) => {
  return { ...state.apiStatus };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(Actions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(IstexApiStatus);


