import $ from 'jquery';
import    React from 'react';
import    Footer         from './footer.jsx';
import    IstexApiStatus from './istex-api-status.jsx';
import    IstexApiDocButton from './istex-api-doc-button.jsx';

import * as Actions from '../actions.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class Home extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    return (

<div>
  <div className="container" role="main">

    <div className="jumbotron">
      <h1>ISTEX VIEW - Visualisation interactive des ressources ISTEX</h1>

      <p className="lead">
        <img src="/images/beta.png" alt="" className="pull-right" />
        ISTEX VIEW propose une visualisation HTML5 des objets documentaires exposés par l'<a href="https://api.istex.fr">API ISTEX</a>. Chaque page HTML5 visualise un document PDF augmenté d'interactivités contextuelles de type survol de la souris.
      </p>
      <ul style={{paddingLeft: "20px"}}>
        <li>Exemple d'une page HTML5 d'un PDF ISTEX : <a href="/document/EB32C24EA4F9C2BDA742530690915BF9A5599422">https://view.istex.fr/document/EB32C24EA4F9C2BDA742530690915BF9A5599422</a></li>
      </ul>
      
      <p className="lead">
        ISTEX VIEW propose aussi une interface HTML5 au dessus de l'<a href="https://api.istex.fr/documentation/openurl/">OpenURL de l'API ISTEX</a> permettant d'informer et d'aiguiller avec convivialité l'utilisateur.
      </p>
      <ul style={{paddingLeft: "20px"}}>
        <li>OpenURL d'un document ISTEX : <a href="/document/openurl?rft_id=info:doi/10.1136/acupmed-2012-010183&amp;noredirect">https://view.istex.fr/document/openurl?rft_id=info:doi/10.1136/acupmed-2012-010183&amp;noredirect</a></li>
        <li>OpenURL d'un document non présent dans ISTEX : <a href="/document/openurl?rft_id=info:doi/10.1007/s00701-016-2835-z&amp;noredirect">https://view.istex.fr/document/openurl?rft_id=info:doi/10.1007/s00701-016-2835-z&amp;noredirect</a></li>
      </ul>

      <p>
        ISTEX VIEW couvre les <strong>{this.props.demoDocs.nbIstexDoc}</strong> documents présents dans la plateforme ISTEX. A titre d'exemple, vous trouverez ci-dessous 15 documents de la plateforme ISTEX tirés au hasard.
      </p>
    </div>

    <IstexApiStatus />

    <div className="iv-demo-doc-container">
      {this.props.demoDocs.hits && this.props.demoDocs.hits.map((doc) =>
        <IstexApiDocButton doc={doc} key={doc.id} />
      )}
      {!this.props.demoDocs.hits ? <img src="/images/loader.gif" alt="Documents exemple en cours de chargement" /> : ''}
    </div>

  </div>
  <Footer />
</div>

    );
  }

  componentDidMount() {

    // this.props.fetchConfig(); // call the action FETCH_CONFIG          
    //this.props.fetchDemoDocsFromTheApi();      

    // // to have tooltips cf http://getbootstrap.com/javascript/#tooltips-examples
    // $(function () {
    //   $('[data-toggle="tooltip"]').tooltip()
    //   $('.container').popover()
    // });

  }

}


const mapStateToProps = (state, ownProps) => {
  return { demoDocs: state.demoDocs };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(Actions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);


