import React from 'react';
import { initializeApp, fromAuthURI} from 'safe-app';
import {shell} from 'electron';


export default class App extends React.Component {

  constructor() {
    super();
    this.state = {
      'loading': true,
      'error': false
    };
  }

  componentWillMount() {
  	if (document.location.hash.length > 1) {
      let uri = document.location.hash.slice(1);
      fromAuthURI(this.props.info, uri)
        .then((app) => {
          this.setState({app: app, loading: false, error: null});
        }).catch((err) => {
          this.setState({error: err});
        });
  	} else {
      initializeApp(this.props.info)
        .then((app) => app.auth.genAuthUri({'_public': ['Read']}))
        .then(authUri => {
          console.log('got auth uri', authUri.uri);
          shell.openExternal(authUri.uri);
          this.setState({authUri: authUri.uri, loading: 'openingUrl'})
        })
  	}
  }
  
  render() {

    if (this.state.error)
      return (<div><h1>Error</h1><p>{this.state.error}</p></div>)

    if (this.state.loading) {
      if (this.state.loading === 'openingUrl')
        return (<div><p>Opened Authenticator. Please authenticate us. Uri:</p><pre>{this.state.authUri}</pre></div>)
      return (<div><p>loading</p></div>)
    }

    if (this.state.app)
      return (<div><h1>🎉Successfully authenticated app🎉</h1></div>)

    return (<div>
      <h2>Welcome to SAFEApp</h2>
    </div>);
  }
}
