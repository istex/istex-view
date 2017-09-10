import    React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import 'pdfjs-dist/build/pdf.js';
import 'pdfjs-dist/build/pdf.worker.js';
import 'pdfjs-dist/web/pdf_viewer.js';

class PDF extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      pdf: null,
      scale: 1.2,
      message: 'Chargement du PDF en cours...'
    }
  }
  getChildContext () {
    return {
      pdf: this.state.pdf,
      scale: this.state.scale
    }
  }
  componentDidMount () {
    this.forceUpdate();
  }

  componentDidUpdate () {
    window.PDFJS.getDocument({
      url: this.props.src,
      httpHeaders: {
        Authorization: 'Bearer ' + this.props.jwtToken
      }
    }).then((pdf) => {
      this.setState({ pdf, message: '' })
    }).catch((err) => {
      console.error('IGNORED ERROR', err);
    })
  }

  render () {
    return (<div className='pdf-context'>{this.state.message ? this.state.message : this.props.children}</div>) 
  }
}

PDF.propTypes = {
  src: PropTypes.string.isRequired,
  jwtToken: PropTypes.string
}

PDF.childContextTypes = {
  pdf: PropTypes.object,
  scale: PropTypes.number
}

class Page extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      status: 'N/A',
      page: null,
      width: 0,
      height: 0
    }
  }
  shouldComponentUpdate (nextProps, nextState, nextContext) {
    return this.context.pdf != nextContext.pdf || this.state.status !== nextState.status
  }
  componentDidUpdate (nextProps, nextState, nextContext) {
    this._update(nextContext.pdf) 
  }
  componentDidMount () {
    this._update(this.context.pdf) 
  }
  _update (pdf) {
    if (pdf) {
      this._loadPage(pdf)
    } else {
      this.setState({ status: 'loading' }) 
    }
  }
  _loadPage (pdf) {
    if (this.state.status === 'rendering' || this.state.page != null) return; 
    pdf.getPage(this.props.index).then(this._renderPage.bind(this));
    this.setState({ status: 'rendering' })
  } 
  _renderPage (page) {
    var self = this;

    let { scale } = this.context 
//    let viewport = page.getViewport(scale)
    let canvas = this.refs.canvas
    let viewport = page.getViewport((ReactDOM.findDOMNode(this).parentNode.clientWidth-82) / page.getViewport(1.0).width);
    let { width, height } = viewport
    let context = canvas.getContext('2d')
    canvas.width = width
    canvas.height = height
    
    page.render({
      canvasContext: context,
      viewport
    }).then(function () {
      // requests the PDF text content
      return page.getTextContent();
    }).then(function (textContent) {
      // creates the text layer over the image layer on the HTMLized PDF
      var textLayer = new window.PDFJS.TextLayerBuilder({
        textLayerDiv: self.refs.textLayer,
        pageIndex: page.pageIndex + 1,
        viewport: viewport
      });
      textLayer.setTextContent(textContent);
      textLayer.render();
    });

    this.setState({ status: 'rendered', page, width, height })
  }
  render () {
    let { width, height, status } = this.state
    return (
      <div className={`pdf-page {status}`} style={{width, height, position:'relative'}}>
        <canvas ref='canvas' />
        <div className="textLayer" ref="textLayer"></div>
      </div>
    )
  }
}

Page.propTypes = {
  index: PropTypes.number.isRequired
}
Page.contextTypes = PDF.childContextTypes

class PDFViewer extends React.Component {
  render () {
    let { pdf } = this.context
    let numPages = pdf ? pdf.pdfInfo.numPages : 0
    let fingerprint = pdf ? pdf.pdfInfo.fingerprint : 'none'
    let pages = Array.apply(null, { length: numPages })
      .map((v, i) => (<Page index={i + 1} key={`${fingerprint}-${i}`}/>))
    
    return (
      <div className='pdf-viewer'>
        {pages}
      </div>
    )
  }
}
PDFViewer.contextTypes = PDF.childContextTypes

export { PDF, PDFViewer }
