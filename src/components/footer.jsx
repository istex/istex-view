import React from 'react';

class IstexViewFooter extends React.Component {
  render() {
    return (
      <footer className="iv-footer">
        <hr />
        <div className="col-lg-12">
          <p className="muted pull-right">
            <a href="/">ISTEX VIEW</a> version 2.4.11
            <a href="https://github.com/istex/istex-view" className="iv-github-link"><img src="/images/github-16x16.png" alt="Code source d'ISTEX VIEW" /></a>
          </p>
        </div>
      </footer>
    );
  }
}

export default IstexViewFooter;