import $ from 'jquery';
import        React from 'react';
import TextTruncate from 'react-text-truncate';

class IstexApiDocRecord extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      abstractNbLineView: 4
    };
  }

  componentDidMount() {
    let self = this;

    if (!self.props.config.istexApiProtocol || !self.props.config.istexApiDomain) return;

    let theUrl = self.props.config.istexApiProtocol + '://' + self.props.config.istexApiDomain;
    theUrl += '/document/' + self.props.istexId + '/?sid=istex-view';
    $.get(theUrl).done(function (docRecord) {
      self.setState({
        loaded: true,
        atitle: docRecord.title,
        aauthor: docRecord.author,
        doi: docRecord.doi ? docRecord.doi[0] : null,
        publicationDate: docRecord.publicationDate,
        abstract: docRecord.abstract,

        title: docRecord.host.title,
        issn: docRecord.host.issn ? docRecord.host.issn[0] : null,
        eissn: docRecord.host.eissn ? docRecord.host.eissn[0] : null,
        vol: docRecord.host.volume,
        issue: docRecord.host.issue,
        pageFirst: docRecord.host.pages.first,
        pageLast: docRecord.host.pages.last,

        url: theUrl
      });
    }).fail(function (response) {
      self.setState({
        title: 'not found'
      });
    });


  }

  render() {
    let self = this;

    
    let authors = [];
    self.state.aauthor && self.state.aauthor.forEach(function (author, idX) {
      let affiliations = [];
      author.affiliations && author.affiliations.forEach(function (affi, idX2) {
        affiliations.push(<span className="iv-author-affi glyphicon glyphicon-eye-open" title={affi} key={idX2}></span>)
      });
      authors.push(<span className="iv-author-block" key={idX}><span className="iv-author-name" title={author.affiliations[0]}><a>{author.name}</a></span> {affiliations}{idX < affiliations.length ? ',' : ''}</span>);
    });
    return (
<div>
  <div className="iv-loading-openurl" style={{display: self.state.loaded ? 'none' : 'block'}}>
    <p>
    <img src="/images/loader.gif" alt="Chargement en cours" /><br/>
    Nous recherchons la notice de votre document dans la plateforme ISTEX.<br/>
    Veuillez patienter.
    <br/>
    </p>
  </div>
  <div className="iv-doc-record well" style={{display: self.state.loaded ? 'block' : 'none'}}>
    <h3>{self.state.atitle}</h3>
    <p>
      <span className="glyphicon glyphicon-barcode"></span> Article publié dans <a href="#">{self.state.title}</a> <span className="iv-doc-record-ref">[ <span className="">{self.state.publicationDate}</span>, Volume <span className="">{self.state.vol}</span>, Issue <span className="">{self.state.issue}</span>, Pages <span className="">{self.state.pageFirst}{self.state.pageLast}</span>, ISSN : {self.state.issn}, eISSN : {self.state.eissn}, DOI : {self.state.doi} ]</span></p>
    <p><span className="glyphicon glyphicon-user"></span> Article écrit par {authors}</p>
    <div>
      <TextTruncate
        line={self.state.abstractNbLineView}
        truncateText="…"
        text={self.state.abstract}
        textTruncateChild={<button className="btn btn-default btn-xs" onClick={() => { self.setState({ abstractNbLineView: self.state.abstractNbLineView + 10 }) }}><span className="glyphicon glyphicon-plus"></span></button>}
      />
    </div>
  </div>
</div>
    );
  }



}

export default IstexApiDocRecord;
