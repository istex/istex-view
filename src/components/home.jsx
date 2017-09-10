import $ from 'jquery';
import    React from 'react';
import    Footer         from './footer.jsx';
import    IstexApiStatus from './istex-api-status.jsx';
import    IstexApiDocButton from './istex-api-doc-button.jsx';

class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      demoDocs: [],
      nbIstexDoc: null,
    };
  }

  render() {
    let self = this;
    var demoDocs = self.state.demoDocs;

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
        ISTEX VIEW couvre les <strong>{self.state.nbIstexDoc}</strong> documents présents dans la plateforme ISTEX. A titre d'exemple, vous trouverez ci-dessous 15 documents de la plateforme ISTEX tirés au hasard.
      </p>
    </div>

    <IstexApiStatus config={self.props.config} />

    <div className="iv-demo-doc-container">
      {demoDocs.map((doc) =>
        <IstexApiDocButton doc={doc} key={doc.id} />
      )}
      {demoDocs.length == 0 ? <img src="/images/loader.gif" alt="Documents exemple en cours de chargement" /> : ''}
    </div>

  </div>
  <Footer />
</div>

    );
  }

  // fetch the first 10 istex documents and
  // extract the ARKs and the istexIds
  requestDemoDocsFromTheApi() {
    let self = this;


    if (!self.props.config.istexApiProtocol || !self.props.config.istexApiDomain) return;

    let theUrl = self.props.config.istexApiProtocol + '://' + self.props.config.istexApiDomain;
    theUrl += '/document/?q=*&output=id,ark,title,genre&sid=istex-view&size=15&rankBy=random';
    $.get(theUrl).done(function (apiSample) {
      // var arks = apiSample.hits.map(function (hit) {
      //   return hit.ark;
      // });
      // var istexIds = apiSample.hits.map(function (hit) {
      //   return hit.id;
      // });
      self.setState({nbIstexDoc: apiSample.total, demoDocs: apiSample.hits});
    }).fail(function (err) {
      self.setState({demoDocs: []});
    });

  }

  componentDidMount() {
    let self = this;

    // // to have tooltips cf http://getbootstrap.com/javascript/#tooltips-examples
    // $(function () {
    //   $('[data-toggle="tooltip"]').tooltip()
    //   $('.container').popover()
    // });


    self.requestDemoDocsFromTheApi();
  }

}

export default Home;