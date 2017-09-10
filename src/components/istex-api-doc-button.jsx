import        React from 'react';
import TextTruncate from 'react-text-truncate';

class IstexApiDocButton extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      atitle: '',
      genre: '',
      istexId: '',
      abstractNbLineView: 2,
    };
  }

  componentDidMount() {
    let self = this;

    self.setState({
      atitle: self.props.doc.title,
      genre: self.props.doc.genre[0],
      istexId: self.props.doc.id
    });
  }

  render() {
    let self = this;

    return (
      <a href={'/' + self.state.istexId}  className="btn btn-default btn-lg iv-doc-button" role="button" key={self.state.istexId} title={self.state.atitle}>
        <div className="iv-istex-icon" data-article-type={self.state.genre} title={self.state.genre}></div>
        <span className="iv-istexid">{self.state.istexId}</span>
      </a>
    );
  }



}

export default IstexApiDocButton;
