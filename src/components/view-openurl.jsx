import $ from 'jquery';
import    React from 'react';
import qs       from 'querystring';
import Footer from './footer.jsx';
import IstexApiDocRecord from './istex-api-doc-record.jsx';

class ViewOpenUrl extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      istexId: null,
      resourceUrl: null,
      loading: true,

      errorCode: null,
      errorMsg: '',
    };
  }

  // ask istex api about the requested document
  // ex: https://api.istex.fr/document/openurl?rft_id=info:doi/10.1136/acupmed-2012-010183&noredirect
  requestDocumentFromOpenUrlIstexApi(locationObj) {
    let self = this;

    if (!self.props.config.istexApiProtocol || !self.props.config.istexApiDomain) return;
    
    locationObj.query = qs.parse(locationObj.search.slice(1));
    if (locationObj.query.sid) {
      locationObj.query.sid += ',istex-view'
    } else {
      locationObj.query.sid = 'istex-view'
    }
    let theOpenUrl = self.props.config.istexApiProtocol + '://' + self.props.config.istexApiDomain;
    theOpenUrl += '/document/openurl?' + qs.stringify(Object.assign({}, locationObj.query, { noredirect: true }));
    $.get(theOpenUrl).done(function (openUrlRes) {
      // that's ok: something to show
      if (locationObj.query.noredirect !== undefined) {
        self.setState({
          resourceUrl: self.mapApiUrlToViewUrl(openUrlRes.resourceUrl).url,
          istexId: self.mapApiUrlToViewUrl(openUrlRes.resourceUrl).istexId,
          loading: false
        });
      } else {
        self.setState({
          loading: false,
        });
        window.location = self.mapApiUrlToViewUrl(openUrlRes.resourceUrl).url;
      }
    }).fail(function (openUrlRes) {
      // grave error at the ISTEX API side 
      if (openUrlRes && openUrlRes.status == 500) {
        self.setState({
          errorCode: openUrlRes.status,
          errorMsg: openUrlRes._message,
          loading: false,
        });
        return;
      }

      // 404 document not found: just display an HTML message telling the
      // doc is not in the ISTEX platform
      if (openUrlRes && openUrlRes.status == 404) {
        self.setState({
          loading: false,
          resourceUrl: '',
        });
        return;
      }

      self.setState({
        loading: false,
        errorCode: 0,
        errorMsg: '' + openUrlRes.statusText,
      });
    });
  }

  componentDidMount() {
    let self = this;

    self.requestDocumentFromOpenUrlIstexApi(self.props.location);
  }

  render() {
    let self = this;

    var docRecord = self.state.istexId ? <IstexApiDocRecord config={self.props.config} istexId={self.state.istexId} /> : null;

    return (
<div>
  <div className="container">

    <div className="iv-loading-openurl" style={{display: self.state.loading ? 'block' : 'none'}}>
      <p>
      <img src="/images/loader.gif" alt="Chargement en cours" /><br/>
      Nous recherchons votre document dans la plateforme ISTEX.<br/>
      Veuillez patienter.
      </p>
    </div>
    
    {docRecord}

    <div style={{display: self.state.resourceUrl === null ? 'none' : 'block'}}>
      <a className="iv-openurl-fulltext-btn btn btn-primary" style={{display: self.state.resourceUrl ? 'block' : 'none', width: '14em'}} href={self.state.resourceUrl}>
          <div className="iv-istex-icon"></div> Accéder au document
      </a>
      <div className="iv-openurl-failed" style={{display: self.state.resourceUrl ? 'none' : 'block'}}>
        <div className="alert alert-warning" role="alert">
          <div className="iv-istex-icon"></div> Le document que vous souhaitez consulter n'est pas disponible dans la plateforme ISTEX
        </div>
      </div>
    </div>

    <div className="iv-openurl-error" style={{display: self.state.errorCode ? 'block' : 'none'}}>
      <div className="alert alert-warning" role="alert">
        <div className="iv-istex-icon"></div> Le document que vous souhaitez consulter est temporairement indisponible à cause d'une erreur interne au niveau de la plateforme ISTEX. [<small><span className="glyphicon glyphicon-cog" title="Détail technique de l'erreur rencontrée"></span> {self.state.errorMsg} (erreur {self.state.errorCode})</small>]
      </div>
    </div>

    <div className="iv-openurl-error" style={{display: self.state.errorCode === 0 ? 'block' : 'none'}}>
      <div className="alert alert-warning" role="alert">
        <div className="iv-istex-icon"></div> Le document que vous souhaitez consulter est temporairement indisponible à cause d'une erreur réseau. Veuillez vérifier votre connexion Internet et <a href="">recharger cette page</a>. [<small><span className="glyphicon glyphicon-cog" title="Détail technique de l'erreur rencontrée"></span> {self.state.errorMsg} (erreur {self.state.errorCode})</small>]
      </div>
    </div>


  </div>
  <Footer />
</div>
    );
  }

  mapApiUrlToViewUrl(apiUrl) {
    let self = this;

    var matches = apiUrl && apiUrl.match(new RegExp('api\.istex\.fr\/document\/([A-Z0-9]{40})\/'));
    if (matches) {
      if (self.props.config.openUrlFTRedirectTo == 'api-with-ezproxy-auth') {
        // When view.istex.fr is access behind the an ezproxy, 
        // istexApiUrl will contains the ezproxified base URL of the ISTEX API
        // and istexApiProtocol://istexApiDomain will contains the none ezproxified
        // base URL of the ISTEX API.
        // So we can easily switch to the ezproxified URL when accessing the ISTEX API ressource
        apiUrl = apiUrl.replace(
          self.props.config.istexApiProtocol + '://' + self.props.config.istexApiDomain,
          self.props.config.istexApiUrl
        );
        return { url: apiUrl, istexId: matches[1] };
      } else if (self.props.config.openUrlFTRedirectTo == 'api') {
        return { url: apiUrl, istexId: matches[1] };
      } else {
        return { url: '/' + matches[1], istexId: matches[1] };
      }
    } else {
      return { url: '', istexId: '' };
    }
  }

}

export default ViewOpenUrl;

