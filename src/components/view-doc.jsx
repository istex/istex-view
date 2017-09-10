import    React from 'react';
import    Footer         from './footer.jsx';
import {PDF, PDFViewer} from './react-pdf.jsx';
import IstexApiStatus from './istex-api-status.jsx';

class ViewDoc extends React.Component {

  constructor(props) {
    super(props);
    let jwtToken = localStorage.getItem('istexToken') ? localStorage.getItem('istexToken') : '';
    this.state = {
      currentPage: 1,
      pages: 0,
      istexId: '',
      istexToken: jwtToken 
    };
  }

  componentDidMount() {
    let self = this;
    console.log(self.props)
    self.setState({istexId: self.props.match.params[0]});
  }

  prevPage(ev) {
    ev.preventDefault();
    this.setState({
      currentPage: this.state.currentPage > 1 ? this.state.currentPage - 1 : 1
    });
  }

  nextPage(ev) {
    ev.preventDefault();
    this.setState({ currentPage: this.state.currentPage < this.state.pages ? this.state.currentPage + 1 : this.state.pages });
  }

  handleIstexTokenChange(event) {
    this.setState({istexToken: event.target.value});
    localStorage.setItem('istexToken', event.target.value);
  }

  handleIstexIdChange(event) {
    this.setState({istexId: event.target.value});
  }

  render() {
    let self = this;

    var pdfUrl = self.state.istexId ? self.props.config.istexApiUrl + '/document/' + this.state.istexId + '/fulltext/pdf?sid=istex-view' : '';

    var ReactPdf2 = pdfUrl ? (
      <PDF src={pdfUrl} jwtToken={this.state.istexToken}>
        <PDFViewer />
      </PDF>
    ) : null;

    return (
      <div className="iv-doc-container">
        
        {ReactPdf2}

        <IstexApiStatus config={self.props.config} />

        <hr/>
        <small>Cette partie temporaire permet de récupérer le PDF en s'authentifiant manuellement par <a href="https://api.istex.fr/token/">token JWT</a> le temps de l'implémentation d'un système de redirection automatique par fédération d'identités.</small>
        <input type="text" placeholder="ISTEX JWT token" style={{width:'100%'}}
               value={this.state.istexToken} onChange={this.handleIstexTokenChange.bind(this)} />

        <Footer />
      </div>
    );
  }

  _onDocumentComplete(pages) {
    this.setState({pages: pages});
  }

}


export default ViewDoc;